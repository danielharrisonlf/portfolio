import React, { useState } from 'react';
import { ExperienceItem } from '../types';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { TechIcon } from './TechIcon';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [sectionRef, isRevealed] = useIntersectionReveal<HTMLElement>(0.12);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      aria-labelledby="exp-heading"
      style={{
        borderTop: '1px solid var(--border)',
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '72px 56px',
        opacity: isRevealed ? 1 : 0,
        transform: `translateY(${isRevealed ? 0 : 24}px)`,
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h2
        id="exp-heading"
        style={{
          fontFamily: "'Newsreader', serif",
          fontWeight: 500,
          fontSize: '32px',
          margin: '0 0 32px',
        }}
      >
        Experiência
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {experiences.map((job, idx) => {
          const isCardHovered = hoveredCard === idx;

          return (
            <article
              key={`${job.company}-${idx}`}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className="split-card"
              style={{
                border: `1px solid ${isCardHovered ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '24px',
                background: 'var(--bg2)',
                transform: isCardHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: isCardHovered
                  ? '0 10px 24px -12px color-mix(in oklch, var(--accent) 50%, transparent)'
                  : 'none',
                transition:
                  'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Coluna de metadados */}
              <div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px',
                    color: 'var(--muted)',
                  }}
                >
                  {job.period}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--accent)',
                    fontFamily: "'IBM Plex Mono', monospace",
                    letterSpacing: '0.5px',
                    marginTop: '6px',
                    fontWeight: 600,
                  }}
                >
                  {job.company}
                </div>
              </div>

              {/* Coluna de conteúdo */}
              <div>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    margin: '0 0 10px',
                  }}
                >
                  {job.role}
                </h3>

                <p
                  className="measure"
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--muted)',
                    fontStyle: 'italic',
                    margin: '0 0 14px',
                    lineHeight: 1.55,
                  }}
                >
                  {job.context}
                </p>

                <ul
                  className="measure"
                  style={{
                    margin: 0,
                    paddingLeft: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {job.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.65,
                        color: 'var(--muted)',
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '16px',
                  }}
                >
                  {job.techs.map((tech) => {
                    const techKey = `${idx}-${tech}`;
                    const isTechHovered = hoveredTech === techKey;

                    return (
                      <span
                        key={tech}
                        onMouseEnter={() => setHoveredTech(techKey)}
                        onMouseLeave={() => setHoveredTech(null)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '11px',
                          letterSpacing: '0.3px',
                          color: isTechHovered ? 'var(--accent)' : 'var(--muted)',
                          border: `1px solid ${
                            isTechHovered ? 'var(--accent)' : 'var(--border)'
                          }`,
                          borderRadius: '4px',
                          padding: '4px 10px',
                          background: 'var(--bg)',
                          transition: 'border-color 0.15s ease, color 0.15s ease',
                        }}
                      >
                        <TechIcon name={tech} size={13} />
                        <span>{tech}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
