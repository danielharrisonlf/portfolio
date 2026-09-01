import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { TechIcon } from './TechIcon';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [sectionRef, isRevealed] = useIntersectionReveal<HTMLDivElement>(0.12);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div
      id="projetos"
      ref={sectionRef}
      style={{
        borderTop: '1px solid var(--border)',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '64px 56px 80px',
        opacity: isRevealed ? 1 : 0,
        transform: `translateY(${isRevealed ? 0 : 24}px)`,
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h2
        style={{
          fontFamily: "'Newsreader', serif",
          fontWeight: 500,
          fontSize: '32px',
          margin: '0 0 32px',
        }}
      >
        Projetos
      </h2>

      <div
        id="projects-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
      >
        {projects.map((proj, idx) => {
          const isCardHovered = hoveredCard === idx;
          const stackTokens = proj.stack.split('·').map((t) => t.trim());

          return (
            <div
              key={proj.name}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                border: `1px solid ${isCardHovered ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'var(--bg2)',
                transform: isCardHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: isCardHovered
                  ? '0 10px 24px -12px color-mix(in oklch, var(--accent) 50%, transparent)'
                  : 'none',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image banner / slot */}
              <div
                style={{
                  width: '100%',
                  height: '160px',
                  background: 'var(--bg)',
                  borderBottom: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {proj.image ? (
                  <img
                    src={proj.image}
                    alt={proj.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.05)',
                      transition: 'transform 0.3s ease',
                      transform: isCardHovered ? 'scale(1.03)' : 'scale(1)',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color: 'var(--muted)',
                      fontSize: '13px',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    Imagem do projeto
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.15) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    marginBottom: '10px',
                  }}
                >
                  {proj.name}
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--muted)',
                    lineHeight: 1.65,
                    marginBottom: '16px',
                    flex: 1,
                  }}
                >
                  {proj.desc}
                </div>

                {/* Tech Badges with Brand Icons */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: 'auto',
                  }}
                >
                  {stackTokens.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '11.5px',
                        color: 'var(--accent)',
                        letterSpacing: '0.2px',
                        border: '1px solid color-mix(in oklch, var(--accent) 30%, transparent)',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        background: 'color-mix(in oklch, var(--accent) 8%, transparent)',
                      }}
                    >
                      <TechIcon name={tech} size={12} />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
