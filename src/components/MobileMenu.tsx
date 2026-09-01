import React from 'react';
import { NavItem } from '../types';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  githubUrl,
  linkedinUrl,
  cvUrl,
}) => {
  if (!isOpen) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -24;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
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
          zIndex: 199,
          animation: 'menuOverlayIn 0.2s ease-out both',
        }}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de Navegação"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'var(--bg2)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          animation: 'menuPanelIn 0.28s ease-out both',
          boxShadow: '0 20px 40px -20px rgba(0,0,0,0.4)',
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

        <a
          href={cvUrl}
          download
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--fg)',
            color: 'var(--bg)',
            padding: '20px 24px',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          <span>Currículo</span>
          <span>↓</span>
        </a>
      </div>
    </>
  );
};
