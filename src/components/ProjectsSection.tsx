import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { useIntersectionReveal } from '../hooks/useIntersectionReveal';
import { TechIcon } from './TechIcon';
import { FaGithub } from 'react-icons/fa6';
import { TbExternalLink } from 'react-icons/tb';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

/**
 * Placeholder desenhado para projeto sem screenshot.
 * Antes o slot vazio mostrava só o texto "Imagem do projeto", que lia
 * como card quebrado. Aqui vira um bloco intencional com a inicial.
 */
const ImagePlaceholder: React.FC<{ name: string }> = ({ name }) => (
  <div
    aria-hidden="true"
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'radial-gradient(120% 120% at 20% 0%, color-mix(in oklch, var(--accent) 22%, transparent) 0%, transparent 60%), var(--bg)',
    }}
  >
    <span
      style={{
        fontFamily: "'Newsreader', serif",
        fontSize: '52px',
        lineHeight: 1,
        color: 'color-mix(in oklch, var(--accent) 55%, transparent)',
        userSelect: 'none',
      }}
    >
      {name.charAt(0)}
    </span>
  </div>
);

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [sectionRef, isRevealed] = useIntersectionReveal<HTMLElement>(0.12);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--accent)',
    border: '1px solid color-mix(in oklch, var(--accent) 40%, transparent)',
    borderRadius: '4px',
    padding: '6px 12px',
    transition: 'background 0.15s ease',
  };

  return (
    <section
      id="projetos"
      ref={sectionRef}
      aria-labelledby="proj-heading"
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
        id="proj-heading"
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
          const hasLinks = Boolean(proj.repoUrl || proj.demoUrl);

          return (
            <article
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
                transition:
                  'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image banner / slot */}
              <div
                style={{
                  width: '100%',
                  height: '180px',
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
                    alt={`Captura de tela do projeto ${proj.name}`}
                    loading="lazy"
                    decoding="async"
                    width={1600}
                    height={900}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top',
                      transition: 'transform 0.3s ease',
                      transform: isCardHovered ? 'scale(1.03)' : 'scale(1)',
                    }}
                  />
                ) : (
                  <ImagePlaceholder name={proj.name} />
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  padding: '24px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    margin: '0 0 10px',
                  }}
                >
                  {proj.name}
                </h3>

                <p
                  className="measure"
                  style={{
                    fontSize: '14px',
                    color: 'var(--muted)',
                    lineHeight: 1.65,
                    margin: '0 0 16px',
                    flex: 1,
                  }}
                >
                  {proj.desc}
                </p>

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
                        border:
                          '1px solid color-mix(in oklch, var(--accent) 30%, transparent)',
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

                {/* Links — só renderizam quando preenchidos em portfolioData */}
                {hasLinks && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '16px',
                    }}
                  >
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                        aria-label={`Ver código de ${proj.name} no GitHub`}
                      >
                        <FaGithub size={13} />
                        <span>Código</span>
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                        aria-label={`Abrir demo de ${proj.name}`}
                      >
                        <TbExternalLink size={13} />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
