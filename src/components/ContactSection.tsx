import React, { useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import { SiGmail } from 'react-icons/si';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';

export const ContactSection: React.FC = () => {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(personalInfo.email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <section
      id="contato"
      aria-labelledby="contato-heading"
      style={{
        borderTop: '1px solid var(--border)',
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '72px 56px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h2
        id="contato-heading"
        style={{
          fontFamily: "'Newsreader', serif",
          fontWeight: 500,
          fontSize: '32px',
          margin: 0,
        }}
      >
        Vamos conversar
      </h2>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--muted)',
          maxWidth: '480px',
          margin: 0,
        }}
      >
        Aberto a conversas sobre oportunidades, projetos ou só trocar uma ideia.
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <a
          href={`mailto:${personalInfo.email}`}
          onClick={handleCopyEmail}
          onMouseEnter={() => setHoveredBtn('email')}
          onMouseLeave={() => setHoveredBtn(null)}
          title="Clique para enviar e-mail (copiado para a área de transferência)"
          style={{
            border: `1px solid ${hoveredBtn === 'email' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '14px',
            color: hoveredBtn === 'email' ? 'var(--accent)' : 'inherit',
            background: 'var(--bg)',
            transition: 'border-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <SiGmail size={15} color="#EA4335" />
          <span>{personalInfo.email}</span>
          {copied && (
            <span
              style={{
                fontSize: '11px',
                fontFamily: "'IBM Plex Mono', monospace",
                color: 'var(--ok)',
              }}
            >
              (Copiado!)
            </span>
          )}
        </a>

        <a
          href={personalInfo.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredBtn('in')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            border: `1px solid ${hoveredBtn === 'in' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '14px',
            color: hoveredBtn === 'in' ? 'var(--accent)' : 'inherit',
            background: 'var(--bg)',
            transition: 'border-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FaLinkedin size={15} color="#0A66C2" />
          <span>LinkedIn ↗</span>
        </a>

        <a
          href={personalInfo.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredBtn('gh')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            border: `1px solid ${hoveredBtn === 'gh' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '14px',
            color: hoveredBtn === 'gh' ? 'var(--accent)' : 'inherit',
            background: 'var(--bg)',
            transition: 'border-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FaGithub size={15} />
          <span>GitHub ↗</span>
        </a>
      </div>
    </section>
  );
};
