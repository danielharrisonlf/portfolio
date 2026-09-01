import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const ScrollProgressBar: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'var(--accent)',
        zIndex: 100,
        width: `${progress}%`,
        transition: 'width 0.1s linear',
      }}
      aria-hidden="true"
    />
  );
};
