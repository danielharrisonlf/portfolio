import React, { useState } from 'react';
import { LuSunMedium, LuMoonStar } from 'react-icons/lu';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isDark ? 'Mudar para tema claro (Light)' : 'Mudar para tema escuro (Dark)'}
      aria-label="Trocar tema claro/escuro"
      style={{
        position: 'relative',
        width: '34px',
        height: '34px',
        color: isDark ? '#a78bfa' : '#f59e0b',
        background: isHovered ? 'var(--bg2)' : 'transparent',
        border: `1px solid ${isHovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition:
          'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered
          ? '0 0 14px -2px color-mix(in oklch, var(--accent) 40%, transparent)'
          : 'none',
        padding: 0,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Sun Icon (Light Mode) */}
      <span
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isDark ? 'rotate(90deg) scale(0)' : 'rotate(0deg) scale(1)',
          opacity: isDark ? 0 : 1,
          transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
        }}
      >
        <LuSunMedium size={17} />
      </span>

      {/* Moon Icon (Dark Mode) */}
      <span
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
          opacity: isDark ? 1 : 0,
          transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
        }}
      >
        <LuMoonStar size={16} />
      </span>
    </button>
  );
};
