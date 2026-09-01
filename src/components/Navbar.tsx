import React, { useState, useRef, useEffect } from 'react';
import { NavItem } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { smoothScrollToElement } from '../utils/smoothScroll';

interface NavbarProps {
  navItems: NavItem[];
  isDark: boolean;
  onToggleTheme: (event?: React.MouseEvent) => void;
  onOpenMobileMenu: () => void;
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  navItems,
  isDark,
  onToggleTheme,
  onOpenMobileMenu,
  githubUrl,
  linkedinUrl,
  cvUrl,
}) => {
  const [navHighlight, setNavHighlight] = useState<{ left: number; width: number } | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navWrapRef = useRef<HTMLDivElement | null>(null);

  // A borda inferior só aparece depois que a página sai do topo, para a nav
  // não desenhar uma linha sobre o hero sem necessidade.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navWrapRef.current) return;
    const wrapRect = navWrapRef.current.getBoundingClientRect();
    const linkRect = e.currentTarget.getBoundingClientRect();
    setNavHighlight({
      left: linkRect.left - wrapRect.left,
      width: linkRect.width,
    });
  };

  const handleNavLeave = () => {
    setNavHighlight(null);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      smoothScrollToElement(targetId, -24, 700);
    }
  };

  return (
    <nav
      id="site-nav"
      data-scrolled={isScrolled}
      aria-label="Navegação principal"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        rowGap: '8px',
        gap: '12px',
        padding: '14px 24px',
      }}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={onOpenMobileMenu}
        id="mobile-menu-btn"
        aria-label="Abrir menu"
        style={{
          display: 'none',
          width: '32px',
          height: '32px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          cursor: 'pointer',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          flex: 'none',
        }}
      >
        <span style={{ width: '16px', height: '1.5px', background: 'var(--fg)' }} />
        <span style={{ width: '16px', height: '1.5px', background: 'var(--fg)' }} />
        <span style={{ width: '16px', height: '1.5px', background: 'var(--fg)' }} />
      </button>

      {/* Desktop Logo Mark */}
      <div
        id="logo-mark"
        style={{
          width: '36px',
          height: '36px',
          flex: 'none',
          border: '1px solid var(--fg)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: '12px',
          userSelect: 'none',
          cursor: 'pointer',
        }}
        onClick={() => smoothScrollToElement('hero-grid', 0, 700)}
      >
        DH
      </div>

      {/* Mobile Center Logo */}
      <div
        id="logo-circle"
        onClick={() => smoothScrollToElement('hero-grid', 0, 700)}
        style={{
          display: 'none',
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'var(--fg)',
          color: 'var(--bg)',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Newsreader', serif",
          fontWeight: 600,
          fontSize: '16px',
          userSelect: 'none',
          cursor: 'pointer',
        }}
      >
        D
      </div>

      {/* Desktop Navigation Links */}
      <div
        ref={navWrapRef}
        id="nav-links-desktop"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '26px',
          position: 'relative',
        }}
        onMouseLeave={handleNavLeave}
      >
        {/* Sliding Underline Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            height: '2px',
            background: 'var(--accent)',
            left: `${navHighlight ? navHighlight.left : 0}px`,
            width: `${navHighlight ? navHighlight.width : 0}px`,
            opacity: navHighlight ? 1 : 0,
            transition: 'left 0.25s ease, width 0.25s ease, opacity 0.15s ease',
            pointerEvents: 'none',
          }}
        />

        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleLinkClick(e, item.href)}
            onMouseEnter={handleNavEnter}
            className="link-u"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              paddingBottom: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Right Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 'none',
        }}
      >
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

        <a
          id="gh-link"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          aria-label="GitHub"
          onMouseEnter={() => setHoveredLink('gh')}
          onMouseLeave={() => setHoveredLink(null)}
          style={{
            width: '32px',
            height: '32px',
            border: `1px solid ${hoveredLink === 'gh' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hoveredLink === 'gh' ? 'var(--accent)' : 'var(--muted)',
            transition: 'border-color 0.15s ease, color 0.15s ease',
          }}
        >
          <FaGithub size={14} />
        </a>

        <a
          id="in-link"
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
          aria-label="LinkedIn"
          onMouseEnter={() => setHoveredLink('in')}
          onMouseLeave={() => setHoveredLink(null)}
          style={{
            width: '32px',
            height: '32px',
            border: `1px solid ${hoveredLink === 'in' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hoveredLink === 'in' ? 'var(--accent)' : 'var(--muted)',
            transition: 'border-color 0.15s ease, color 0.15s ease',
          }}
        >
          <FaLinkedin size={14} />
        </a>

        <a
          id="cv-nav-btn"
          href={cvUrl}
          download
          style={{
            background: 'var(--accent-solid)',
            color: 'var(--accent-contrast)',
            padding: '7px 15px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            marginLeft: '4px',
            transition: 'filter 0.2s ease, transform 0.15s ease',
          }}
        >
          Currículo
        </a>
      </div>
    </nav>
  );
};
