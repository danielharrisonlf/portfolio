import React, { useState } from 'react';
import { ExperienceItem } from '../types';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { TechIcon } from './TechIcon';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [sectionRef, isRevealed] = useIntersectionReveal<HTMLDivElement>(0.12);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <div
      id="experiencia"
      ref={sectionRef}
      style={{
        borderTop: '1px solid var(--border)',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '64px 56px',
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
        Experiência
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {experiences.map((job, idx) => {
          const isCardHovered = hoveredCard === idx;

          return (
            <div
              key={`${job.company}-${idx}`}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                border: `1px solid ${isCardHovered ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '24px',
                background: 'var(--bg2)',
                transform: isCardHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: isCardHovered
                  ? '0 10px 24px -12px color-mix(in oklch, var(--accent) 50%, transparent)'
                  : 'none',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '16px',
                  flexWrap: 'wrap',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 600 }}>{job.role}</div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--accent)',
                      fontFamily: "'IBM Plex Mono', monospace",
                      letterSpacing: '0.5px',
                      marginTop: '4px',
                    }}
                  >
                    {job.company}
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px',
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {job.period}
                </div>
              </div>

              <p
                style={{
                  fontSize: '13.5px',
                  color: 'var(--muted)',
                  fontStyle: 'italic',
                  margin: '0 0 12px',
                  lineHeight: 1.5,
                }}
              >
                {job.context}
              </p>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {job.bullets.map((bullet, bIdx) => (
                  <li
                    key={bIdx}
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.6,
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
                  marginTop: '14px',
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
                        border: `1px solid ${isTechHovered ? 'var(--accent)' : 'var(--border)'}`,
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
          );
        })}
      </div>
    </div>
  );
};
