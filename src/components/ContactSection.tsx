import React, { useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import { SiGmail } from 'react-icons/si';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { TbCopy, TbCheck } from 'react-icons/tb';

export const ContactSection: React.FC = () => {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bloqueado (contexto inseguro ou permissão negada):
      // o botão de e-mail ao lado continua funcionando.
    }
  };

  // Botões secundários (LinkedIn, GitHub, copiar) compartilham a mesma base.
  const secondaryStyle = (key: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    border: `1px solid ${hoveredBtn === key ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: '8px',
    padding: '14px 22px',
    fontSize: '15px',
    fontWeight: 500,
    color: hoveredBtn === key ? 'var(--accent)' : 'inherit',
    background: 'var(--bg2)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
    transform: hoveredBtn === key ? 'translateY(-2px)' : 'translateY(0)',
  });

  return (
    <section
      id="contato"
      aria-labelledby="contato-heading"
      style={{
        borderTop: '1px solid var(--border)',
        /* Seção de fechamento ocupa a tela inteira: é a última coisa que a
           pessoa vê e o único lugar do site que pede uma ação. */
        minHeight: `calc(100svh - var(--nav-h))`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '28px',
        padding: '96px 24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '2px',
          color: 'var(--muted)',
        }}
      >
        Contato
      </div>

      <h2
        id="contato-heading"
        style={{
          fontFamily: "'Newsreader', serif",
          fontWeight: 500,
          /* Escala com a viewport: ganha presença no desktop sem estourar no mobile */
          fontSize: 'clamp(38px, 7vw, 76px)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          margin: 0,
          maxWidth: '14ch',
        }}
      >
        Vamos conversar
      </h2>

      <p
        style={{
          fontSize: '17px',
          lineHeight: 1.6,
          color: 'var(--muted)',
          maxWidth: '46ch',
          margin: 0,
        }}
      >
        Aberto a conversas sobre oportunidades, projetos ou só trocar uma ideia.
      </p>

      {/* CTA principal + copiar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '4px',
        }}
      >
        <a
          href={`mailto:${personalInfo.email}`}
          onMouseEnter={() => setHoveredBtn('email')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--accent-solid)',
            color: 'var(--accent-contrast)',
            border: '1px solid var(--accent-solid)',
            borderRadius: '8px',
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: 600,
            transition: 'transform 0.15s ease, filter 0.15s ease',
            transform: hoveredBtn === 'email' ? 'translateY(-2px)' : 'translateY(0)',
          }}
        >
          <SiGmail size={16} />
          <span>{personalInfo.email}</span>
        </a>

        <button
          type="button"
          onClick={handleCopyEmail}
          onMouseEnter={() => setHoveredBtn('copy')}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label="Copiar endereço de e-mail"
          style={secondaryStyle('copy')}
        >
          {copied ? <TbCheck size={16} color="var(--ok)" /> : <TbCopy size={16} />}
          <span>{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>

      {/* Redes */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        <a
          href={personalInfo.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredBtn('in')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={secondaryStyle('in')}
        >
          <FaLinkedin size={16} color="#0A66C2" />
          <span>LinkedIn ↗</span>
        </a>

        <a
          href={personalInfo.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredBtn('gh')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={secondaryStyle('gh')}
        >
          <FaGithub size={16} />
          <span>GitHub ↗</span>
        </a>
      </div>

      {/* Região viva: anuncia a cópia para leitores de tela */}
      <span
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        {copied ? 'E-mail copiado para a área de transferência' : ''}
      </span>
    </section>
  );
};
