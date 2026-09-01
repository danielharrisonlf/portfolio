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
  'hero-grid': <TbHome size={19} />,
  experiencia: <TbBriefcase size={19} />,
  projetos: <TbFolderCode size={19} />,
  sobre: <TbSchool size={19} />,
  contato: <TbMail size={19} />,
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
        bottom: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'stretch',
        width: 'calc(100% - 24px)',
        maxWidth: '520px',
        padding: '4px',
        background: 'color-mix(in oklch, var(--bg2) 88%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        boxShadow: '0 10px 34px -8px rgba(0, 0, 0, 0.45)',
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
              /* flex:1 com minWidth:0 distribui os 5 itens igualmente e
                 permite encolher em telas estreitas sem estourar a barra */
              flex: '1 1 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '9px 2px 7px',
              borderRadius: '10px',
              border: 'none',
              background: isHover && !isActive
                ? 'color-mix(in oklch, var(--fg) 7%, transparent)'
                : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'color 0.2s ease, background 0.2s ease',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}>
              {ICON_BY_ID[item.id] ?? <TbFolderCode size={19} />}
            </span>
            <span
              className="dock-label"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '8.5px',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                lineHeight: 1,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
