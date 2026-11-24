import { useCallback, useEffect, useRef, useState } from 'react';
import { TbChevronLeft, TbChevronRight, TbX } from 'react-icons/tb';

export interface ViewerSlide {
  src: string;
  alt: string;
  caption?: string;
}

interface ProjectImageViewerProps {
  gallery: {
    title: string;
    images: ViewerSlide[];
    initialIndex: number;
  };
  onClose: () => void;
}

export function ProjectImageViewer({ gallery, onClose }: ProjectImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(gallery.initialIndex);

  const total = gallery.images.length;
  const current = gallery.images[index] ?? gallery.images[0];

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    dialog.showModal();
    closeRef.current?.focus();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [total, goPrev, goNext]);

  if (!current) return null;

  return (
    <dialog
      ref={dialogRef}
      className="project-image-viewer"
      aria-label={`Imagem ampliada de ${gallery.title}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-image-toolbar">
        <div className="project-image-toolbar-meta">
          <span className="project-image-toolbar-title">{gallery.title}</span>
          {(total > 1 || current.caption) && (
            <span className="project-image-toolbar-sub">
              {total > 1 ? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}` : ''}
              {total > 1 && current.caption ? ' · ' : ''}
              {current.caption ?? ''}
            </span>
          )}
        </div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar imagem">
          <TbX size={22} aria-hidden="true" />
          Fechar
        </button>
      </div>
      <div
        className="project-image-stage"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {total > 1 && (
          <button
            type="button"
            className="project-viewer-nav project-viewer-nav-prev"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Imagem anterior"
          >
            <TbChevronLeft size={24} aria-hidden="true" />
          </button>
        )}
        <img key={current.src} src={current.src} alt={current.alt} decoding="async" />
        {total > 1 && (
          <button
            type="button"
            className="project-viewer-nav project-viewer-nav-next"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Próxima imagem"
          >
            <TbChevronRight size={24} aria-hidden="true" />
          </button>
        )}
      </div>
    </dialog>
  );
}
