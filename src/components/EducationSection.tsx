import React, { useState } from 'react';
import { EducationItem } from '../types';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { TechIcon } from './TechIcon';

interface EducationSectionProps {
  education: EducationItem[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const [sectionRef, isRevealed] = useIntersectionReveal<HTMLElement>(0.12);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      aria-labelledby="edu-heading"
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
        id="edu-heading"
        style={{
          fontFamily: "'Newsreader', serif",
          fontWeight: 500,
          fontSize: '32px',
          margin: '0 0 32px',
        }}
      >
        Formação Acadêmica
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {education.map((edu, idx) => {
          const isCardHovered = hoveredCard === idx;

          return (
            <article
              key={`${edu.school}-${idx}`}
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
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '6px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: '20px',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {edu.course}
                </h3>

                <div style={{ fontSize: '13px', color: 'var(--accent)' }}>
                  @ {edu.school}
                </div>

                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.5px',
                    color: edu.statusKind === 'active' ? 'var(--ok)' : 'var(--muted)',
                    border: `1px solid ${
                      edu.statusKind === 'active'
                        ? 'color-mix(in oklch, var(--ok) 45%, transparent)'
                        : 'var(--border)'
                    }`,
                    background:
                      edu.statusKind === 'active'
                        ? 'color-mix(in oklch, var(--ok) 10%, transparent)'
                        : 'transparent',
                    borderRadius: '4px',
                    padding: '3px 8px',
                  }}
                >
                  {edu.status}
                </span>
              </div>

              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  color: 'var(--muted)',
                  marginBottom: '12px',
                }}
              >
                {edu.period}
              </div>

              <p
                className="measure"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--muted)',
                  margin: '0 0 16px',
                }}
              >
                {edu.desc}
              </p>

              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  textTransform: 'uppercase',
                  fontSize: '10.5px',
                  letterSpacing: '1px',
                  color: 'var(--muted)',
                  marginBottom: '10px',
                }}
              >
                Disciplinas &amp; Fundamentos
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {edu.subjects.map((subject) => {
                  const subKey = `${idx}-${subject}`;
                  const isSubHovered = hoveredSubject === subKey;

                  return (
                    <span
                      key={subject}
                      onMouseEnter={() => setHoveredSubject(subKey)}
                      onMouseLeave={() => setHoveredSubject(null)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        border: `1px solid ${isSubHovered ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '6px',
                        padding: '6px 12px',
                        background: 'var(--bg)',
                        color: isSubHovered ? 'var(--accent)' : 'inherit',
                        transition: 'border-color 0.15s ease, color 0.15s ease',
                        cursor: 'default',
                      }}
                    >
                      <TechIcon name={subject} size={14} />
                      <span>{subject}</span>
                    </span>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
