import React from 'react';
import { personalInfo } from '../data/portfolioData';
import { smoothScrollToElement } from '../utils/smoothScroll';

/**
 * A página terminava seca logo após "Vamos conversar".
 * O rodapé fecha a leitura e dá um caminho de volta ao topo.
 */
export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      style={{
        borderTop: '1px solid var(--border)',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '28px 56px 40px',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '12px',
        color: 'var(--muted)',
      }}
    >
      <span>
        © {year} {personalInfo.name}
      </span>

      <span>Feito com React, TypeScript e Vite.</span>

      <button
        onClick={() => smoothScrollToElement('hero-grid', 0, 700)}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          color: 'var(--muted)',
          fontFamily: 'inherit',
          fontSize: '12px',
          padding: '6px 12px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease, color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--accent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--muted)';
        }}
      >
        Voltar ao topo ↑
      </button>
    </footer>
  );
};
