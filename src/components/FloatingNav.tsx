import React, { useEffect, useState } from 'react';
import {
  TbHome,
  TbBriefcase,
  TbFolderCode,
  TbSchool,
  TbMail,
} from 'react-icons/tb';
import { NavItem } from '../types';
import { smoothScrollToElement } from '../utils/smoothScroll';

interface FloatingNavProps {
  /** Mesma lista da navbar/menu — o dock só acrescenta "Início" na frente. */
  navItems: NavItem[];
  /** Some quando o menu mobile está aberto, para não haver duas navegações na tela. */
  isMenuOpen: boolean;
}

/** Ícone por âncora. Se um item novo aparecer sem ícone, cai no TbFolderCode. */
const ICON_BY_ID: Record<string, React.ReactNode> = {
  'hero-grid': <TbHome size={15} />,
  experiencia: <TbBriefcase size={15} />,
  projetos: <TbFolderCode size={15} />,
  sobre: <TbSchool size={15} />,
  contato: <TbMail size={15} />,
};

export const FloatingNav: React.FC<FloatingNavProps> = ({ navItems, isMenuOpen }) => {
  const [activeId, setActiveId] = useState<string>('hero-grid');
  const [isHovered, setIsHovered] = useState<string | null>(null);

  // Derivado da mesma fonte da navbar, com "Início" na frente.
  const items = [
    { id: 'hero-grid', label: 'Início' },
    ...navItems
      .filter((item) => item.href.startsWith('#') && item.href.length > 1)
      .map((item) => ({ id: item.href.substring(1), label: item.label })),
  ];

  useEffect(() => {
    const handleScroll = () => {
      // No fim da página, a última seção é a ativa. Sem isto a seção
      // anterior ficava marcada porque a última nunca cruzava o limiar.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
      if (atBottom) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      if (window.scrollY < 180) {
        setActiveId('hero-grid');
        return;
      }

      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveId(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navItems]);

  const handleClick = (id: string) => {
    setActiveId(id);
    smoothScrollToElement(id, -80, 700);
  };

  if (isMenuOpen) return null;

  return (
    <nav
      id="floating-nav-dock"
      aria-label="Navegação rápida"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 6px',
        background: 'color-mix(in oklch, var(--bg2) 75%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid color-mix(in oklch, var(--border) 80%, transparent)',
        borderRadius: '9999px',
        boxShadow:
          '0 8px 32px -4px rgba(0, 0, 0, 0.25), 0 0 0 1px color-mix(in oklch, var(--accent) 15%, transparent)',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        const isHover = isHovered === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            onMouseEnter={() => setIsHovered(item.id)}
            onMouseLeave={() => setIsHovered(null)}
            title={item.label}
            aria-label={item.label}
            aria-current={isActive ? 'true' : undefined}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '9999px',
              border: 'none',
              background: isActive
                ? 'var(--accent-solid)'
                : isHover
                ? 'color-mix(in oklch, var(--fg) 8%, transparent)'
                : 'transparent',
              color: isActive
                ? 'var(--accent-contrast)'
                : isHover
                ? 'var(--fg)'
                : 'var(--muted)',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 500,
              fontFamily: "'IBM Plex Mono', monospace",
              cursor: 'pointer',
              transition:
                'background 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease, transform 0.15s ease, box-shadow 0.25s ease',
              transform: isHover ? 'scale(1.04)' : 'scale(1)',
              boxShadow: isActive
                ? '0 2px 10px -1px color-mix(in oklch, var(--accent) 50%, transparent)'
                : 'none',
              outline: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {ICON_BY_ID[item.id] ?? <TbFolderCode size={15} />}
            </span>
            <span className="dock-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
