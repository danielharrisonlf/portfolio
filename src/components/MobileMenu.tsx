import React, { useEffect, useRef } from 'react';
import { NavItem } from '../types';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { smoothScrollToElement } from '../utils/smoothScroll';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
}

/** Seletor dos elementos que podem receber foco dentro do painel. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  githubUrl,
  linkedinUrl,
  cvUrl,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  // Guarda quem tinha o foco antes de abrir, para devolver ao fechar.
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Trava a rolagem do fundo enquanto o menu está aberto.
  // Sem isso a página rolava atrás do overlay.
  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    // Compensa o sumiço da scrollbar para o layout não "pular".
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  // ESC fecha, Tab circula dentro do painel (focus trap) e o foco
  // volta para o botão que abriu o menu. O componente declara
  // role="dialog" aria-modal="true" — precisa se comportar como um.
  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      lastFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    if (href.startsWith('#')) {
      // Espera o menu desmontar e a trava de rolagem sair antes de rolar.
      requestAnimationFrame(() => {
        smoothScrollToElement(href.substring(1), -80, 700);
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 1099,
          animation: 'menuOverlayIn 0.2s ease-out both',
        }}
        aria-hidden="true"
      />

      {/* Menu Panel — acima do dock flutuante (z-index 900) */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de Navegação"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'var(--bg2)',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          animation: 'menuPanelIn 0.28s ease-out both',
          boxShadow: '0 20px 40px -20px rgba(0,0,0,0.4)',
          maxHeight: '100dvh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              letterSpacing: '2px',
              color: 'var(--muted)',
            }}
          >
            MENU
          </span>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Fechar menu"
            style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--fg)',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: "'Newsreader', serif",
                fontSize: '24px',
                fontWeight: 500,
                color: 'var(--fg)',
                padding: '16px 0',
                borderBottom: '1px solid var(--border)',
                animation: 'menuItemIn 0.4s ease-out both',
                animationDelay: `${item.delayMs}ms`,
              }}
            >
              <span>{item.label}</span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  color: 'var(--muted)',
                }}
              >
                {item.num}
              </span>
            </a>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderTop: '1px solid var(--border)',
            marginTop: '24px',
          }}
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '18px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--muted)',
              borderRight: '1px solid var(--border)',
            }}
          >
            <FaGithub size={14} />
            <span>GitHub</span>
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '18px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--muted)',
            }}
          >
            <FaLinkedin size={14} />
            <span>LinkedIn</span>
          </a>
        </div>

        {/* CTA principal — usa a cor da marca, não o inverso neutro */}
        <a
          href={cvUrl}
          download
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--accent-solid)',
            color: 'var(--accent-contrast)',
            padding: '20px 24px',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          <span>Baixar currículo</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </>
  );
};
