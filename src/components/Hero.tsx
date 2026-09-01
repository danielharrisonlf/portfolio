import React, { useRef, useState } from 'react';
import { StackItem } from '../types';
import { personalInfo } from '../data/portfolioData';
import { useHeroGraph } from '../hooks/useHeroGraph';
import { CircuitGraph } from './CircuitGraph';
import { TechIcon } from './TechIcon';
import { smoothScrollToElement } from '../utils/smoothScroll';

interface HeroProps {
  stack: StackItem[];
  practices: string[];
  isDark: boolean;
}

export const Hero: React.FC<HeroProps> = ({ stack, practices, isDark }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const bioRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const practicesRef = useRef<HTMLDivElement | null>(null);

  const [hoveredStack, setHoveredStack] = useState<string | null>(null);

  const { graph, spark, handleHeroMouseMove, handleHeroMouseLeave } = useHeroGraph({
    containerRef,
    badgeRef,
    bioRef,
    stackRef,
    practicesRef,
  });

  const photoWrapperStyle: React.CSSProperties = isDark
    ? {
        position: 'relative',
        width: '90px',
        height: '90px',
        borderRadius: '10px',
        overflow: 'hidden',
        flex: 'none',
      }
    : {
        position: 'relative',
        width: '90px',
        height: '90px',
        borderRadius: '10px',
        overflow: 'hidden',
        flex: 'none',
        boxShadow:
          '0 0 0 1px color-mix(in oklch, var(--accent) 55%, transparent), 0 0 18px -4px color-mix(in oklch, var(--accent) 60%, transparent)',
      };

  const photoFilterStyle: React.CSSProperties = isDark
    ? {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'brightness(0.86) contrast(1.08) saturate(0.95)',
      }
    : {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'grayscale(0.5) contrast(1.3) brightness(0.78)',
      };

  const photoOverlayGradient = isDark
    ? 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)'
    : 'linear-gradient(155deg, color-mix(in oklch, var(--accent) 35%, transparent) 0%, transparent 55%, rgba(0,0,0,0.4) 100%)';

  // A duplicata existe só para o loop da esteira parecer contínuo.
  // `isDuplicate` marca a segunda metade: ela é aria-hidden (o leitor de
  // tela lia a lista inteira duas vezes) e some sob prefers-reduced-motion.
  const practicesMarquee = [
    ...practices.map((label) => ({ label, isDuplicate: false })),
    ...practices.map((label) => ({ label, isDuplicate: true })),
  ];

  return (
    <div
      id="hero-grid"
      ref={containerRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1.35fr 1fr',
        gap: '64px',
        maxWidth: '1440px',
        width: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
        padding: '56px 64px 88px',
        /*
         * Sem min-height de viewport: o conteúdo ocupava ~500px dentro de um
         * bloco de ~1100px, deixando uma faixa morta embaixo que lia como
         * conteúdo faltando. A altura agora acompanha o conteúdo.
         */
        alignItems: 'center',
        minWidth: 0,
      }}
    >
      {/* Circuit Lightning SVG Overlay */}
      <CircuitGraph graph={graph} spark={spark} />

      {/* Left Column: Badge and Bio */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '640px',
          width: '100%',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        {/* Profile Badge */}
        <div
          ref={badgeRef}
          id="badge-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '22px 24px',
            background: 'var(--bg2)',
            marginBottom: '26px',
            width: 'fit-content',
            maxWidth: '100%',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 1,
            animation: 'heroIn 0.6s ease-out both',
            minWidth: 0,
          }}
        >
          <div style={photoWrapperStyle} id="photo-box">
            <img
              id="hero-photo"
              src={personalInfo.photoUrl}
              alt={`Foto de ${personalInfo.name}`}
              width={360}
              height={360}
              decoding="async"
              style={photoFilterStyle}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== personalInfo.fallbackPhotoUrl) {
                  target.src = personalInfo.fallbackPhotoUrl;
                }
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: photoOverlayGradient,
                pointerEvents: 'none',
              }}
            />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h1
              id="hero-name"
              style={{
                fontFamily: "'Newsreader', serif",
                fontWeight: 500,
                fontSize: '34px',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                margin: '0 0 10px',
                wordBreak: 'break-word',
              }}
            >
              {personalInfo.name}
            </h1>

            {/* Chips de Cargo com alto contraste e fonte clara */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'flex-start',
              }}
            >
              <div
                className="role-chip"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: "'IBM Plex Mono', monospace",
                  textTransform: 'uppercase',
                  fontSize: '11.5px',
                  letterSpacing: '0.75px',
                  color: 'var(--fg)',
                  fontWeight: 600,
                  background: 'color-mix(in oklch, var(--accent) 18%, transparent)',
                  border: '1px solid color-mix(in oklch, var(--accent) 45%, transparent)',
                  borderRadius: '5px',
                  padding: '4px 11px',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}
              >
                Software Developer
              </div>

              <div
                className="role-chip"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: "'IBM Plex Mono', monospace",
                  textTransform: 'uppercase',
                  fontSize: '11.5px',
                  letterSpacing: '0.75px',
                  color: 'var(--fg)',
                  fontWeight: 600,
                  background: 'color-mix(in oklch, var(--accent) 18%, transparent)',
                  border: '1px solid color-mix(in oklch, var(--accent) 45%, transparent)',
                  borderRadius: '5px',
                  padding: '4px 11px',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}
              >
                Applied Engineer
              </div>
            </div>
          </div>
        </div>

        {/* Bio Card */}
        <div
          ref={bioRef}
          style={{
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '26px 28px',
            background: 'var(--bg2)',
            position: 'relative',
            zIndex: 1,
            animation: 'heroIn 0.6s ease-out both',
            animationDelay: '0.1s',
            boxSizing: 'border-box',
            maxWidth: '100%',
            minWidth: 0,
          }}
        >
          <p
            id="bio-full"
            className="measure"
            style={{
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--muted)',
              margin: '0 0 24px',
              wordBreak: 'break-word',
            }}
          >
            {personalInfo.fullBio}
          </p>

          <p
            id="bio-short"
            className="measure"
            style={{
              display: 'none',
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'var(--muted)',
              margin: '0 0 24px',
              wordBreak: 'break-word',
            }}
          >
            {personalInfo.shortBio}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '28px',
            }}
          >
            <a
              href="#experiencia"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToElement('experiencia', -24, 700);
              }}
              className="link-u"
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                paddingBottom: '3px',
                cursor: 'pointer',
              }}
            >
              Ver Experiência
            </a>
            <a
              href="#projetos"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToElement('projetos', -24, 700);
              }}
              className="link-u"
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                paddingBottom: '3px',
                cursor: 'pointer',
              }}
            >
              Ver Projetos
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Stack (Grade 3x3) & Arquitetura (Esteira Contínua Abaixo) */}
      <div
        id="hero-right-col"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        {/* Stack Card (Grade 3x3) */}
        <div
          ref={stackRef}
          id="hero-stack-card"
          style={{
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '24px 26px',
            background: 'var(--bg2)',
            animation: 'heroIn 0.6s ease-out both',
            animationDelay: '0.15s',
            boxSizing: 'border-box',
            maxWidth: '100%',
            minWidth: 0,
          }}
        >
          <div
            id="stack-chips-grid"
            style={{
              display: 'grid',
              /*
               * 3 colunas fixas eram estreitas demais no mobile: rótulos como
               * "React Native" e "PostgreSQL" transbordavam o chip. auto-fit dá
               * 3 colunas no desktop e cai para 2 (ou 1) quando não cabe.
               */
              gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
              gap: '10px',
            }}
          >
            {stack.map((item) => {
              const isHovered = hoveredStack === item.label;
              return (
                <span
                  key={item.label}
                  onMouseEnter={() => setHoveredStack(item.label)}
                  onMouseLeave={() => setHoveredStack(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '8px',
                    padding: '9px 12px',
                    border: `1px solid ${isHovered ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    background: 'var(--bg)',
                    color: isHovered ? 'var(--accent)' : 'inherit',
                    transition:
                      'border-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                    cursor: 'default',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.label}
                >
                  <TechIcon name={item.label} size={15} />
                  <span>{item.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Practices Card (Esteira / Marquee Contínuo sempre visível abaixo da Stack) */}
        <div
          ref={practicesRef}
          id="hero-practices-card"
          style={{
            marginTop: '24px',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '22px 26px',
            background: 'var(--bg2)',
            animation: 'heroIn 0.6s ease-out both',
            animationDelay: '0.22s',
            boxSizing: 'border-box',
            maxWidth: '100%',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                textTransform: 'uppercase',
                fontSize: '11px',
                letterSpacing: '1.5px',
                color: 'var(--muted)',
              }}
            >
              Arquitetura &amp; Práticas
            </span>
          </div>

          {/* Esteira contínua com fade lateral */}
          <div
            className="marquee-viewport"
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
          >
            <div className="marquee-track">
              {practicesMarquee.map((item, idx) => (
                <span
                  key={`${item.label}-${idx}`}
                  className={item.isDuplicate ? 'marquee-dup' : undefined}
                  aria-hidden={item.isDuplicate || undefined}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    background: 'var(--bg)',
                    color: 'var(--fg)',
                    whiteSpace: 'nowrap',
                    cursor: 'default',
                    transition:
                      'border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--fg)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <TechIcon name={item.label} size={15} />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
