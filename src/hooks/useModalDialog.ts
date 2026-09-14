import { useEffect, useRef } from 'react';

/** Elementos que podem receber foco dentro do painel. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface Options {
  isOpen: boolean;
  onClose: () => void;
  panelRef: React.RefObject<HTMLElement | null>;
}

/**
 * Comportamento de diálogo modal: trava a rolagem do fundo, fecha no ESC,
 * circula o Tab dentro do painel e devolve o foco ao gatilho ao fechar.
 *
 * Está num hook porque são efeitos que precisam ser lidos juntos —
 * espalhados no componente, é fácil esquecer um ao adicionar uma variante.
 */
export function useModalDialog({ isOpen, onClose, panelRef }: Options) {
  const triggerRef = useRef<HTMLElement | null>(null);

  // Trava a rolagem do fundo, compensando a scrollbar para o layout não pular.
  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [isOpen]);

  // Foco: guarda quem abriu, move para dentro do painel, devolve ao fechar.
  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    return () => {
      triggerRef.current?.focus?.();
    };
  }, [isOpen, panelRef]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !panelRef.current) return;

    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    ).filter((el) => el.offsetParent !== null);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return { handleKeyDown };
}
