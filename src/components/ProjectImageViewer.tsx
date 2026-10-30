import { useEffect, useRef } from 'react';
import { TbX } from 'react-icons/tb';

interface ProjectImageViewerProps {
  image: { src: string; alt: string; title: string };
  onClose: () => void;
}

export function ProjectImageViewer({ image, onClose }: ProjectImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  return (
    <dialog
      ref={dialogRef}
      className="project-image-viewer"
      aria-label={`Imagem ampliada de ${image.title}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-image-toolbar">
        <span>{image.title}</span>
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
        <img src={image.src} alt={image.alt} decoding="async" />
      </div>
    </dialog>
  );
}
