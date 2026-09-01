import React, { useEffect, useState } from 'react';
import {
  TbHome,
  TbBriefcase,
  TbFolderCode,
  TbSchool,
  TbMail,
} from 'react-icons/tb';
import { smoothScrollToElement } from '../utils/smoothScroll';

interface NavItemDef {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItemDef[] = [
  { id: 'hero-grid', label: 'Início', icon: <TbHome size={15} /> },
  { id: 'experiencia', label: 'Experiência', icon: <TbBriefcase size={15} /> },
  { id: 'projetos', label: 'Projetos', icon: <TbFolderCode size={15} /> },
  { id: 'sobre', label: 'Formação', icon: <TbSchool size={15} /> },
  { id: 'contato', label: 'Contato', icon: <TbMail size={15} /> },
];

export const FloatingNav: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('hero-grid');
  const [isHovered, setIsHovered] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }
      if (window.scrollY < 180) {
        setActiveId('hero-grid');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (id: string) => {
    setActiveId(id);
    smoothScrollToElement(id, -24, 700);
  };

  return (
    <div
      id="floating-nav-dock"
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
      {navItems.map((item) => {
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
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '9999px',
              border: 'none',
              background: isActive
                ? 'var(--accent)'
                : isHover
                ? 'color-mix(in oklch, var(--fg) 8%, transparent)'
                : 'transparent',
              color: isActive
                ? '#ffffff'
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
              {item.icon}
            </span>
            <span className="dock-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
