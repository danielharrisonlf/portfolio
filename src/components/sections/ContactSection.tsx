import { useEffect, useRef, useState } from 'react';
import type { PersonalInfo } from '../../types';
import { Section } from '../ui/Section';
import { Icon } from '../ui/Icon';
import { copyText } from '../../utils/clipboard';
import styles from './contact.module.css';

type CopyState = 'idle' | 'copied' | 'failed';

export function ContactSection({ info }: { info: PersonalInfo }) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const timerRef = useRef<number | null>(null);

  // O timeout do "Copiado" precisa morrer com o componente; sem isso, um
  // unmount durante a espera deixa um setState em componente desmontado.
  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  const handleCopy = async () => {
    const ok = await copyText(info.email);
    setCopyState(ok ? 'copied' : 'failed');

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopyState('idle'), 2400);
  };

  const copyLabel =
    copyState === 'copied'
      ? 'Copiado'
      : copyState === 'failed'
        ? 'Não deu — selecione acima'
        : 'Copiar';

  return (
    <Section id="contato" index="04" title="Contato">
      <div className={styles.head}>
        <p className={styles.title}>Vamos conversar</p>
        <p className="prose">
          Estou aberto a oportunidades em backend, engenharia de IA aplicada e
          infraestrutura — e a trocar ideia sobre projeto, arquitetura ou agente
          rodando em produção.
        </p>
      </div>

      <div className={styles.emailRow}>
        <a href={`mailto:${info.email}`} className={styles.email}>
          <Icon name="mail" size={18} />
          {info.email}
        </a>

        <button
          type="button"
          className={styles.copy}
          onClick={handleCopy}
          data-copied={copyState === 'copied'}
          aria-label={`Copiar o endereço ${info.email} para a área de transferência`}
        >
          <Icon name={copyState === 'copied' ? 'check' : 'copy'} size={17} />
          {copyLabel}
        </button>
      </div>

      {/* O estado da cópia é anunciado sem depender do rótulo do botão. */}
      <p role="status" aria-live="polite" className="srOnly">
        {copyState === 'copied' ? 'Endereço de e-mail copiado.' : ''}
        {copyState === 'failed'
          ? 'Não foi possível copiar. Selecione o endereço manualmente.'
          : ''}
      </p>

      <div className={styles.socials}>
        <a
          href={info.linkedinUrl}
          className={styles.social}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="linkedin" size={17} />
          LinkedIn
          <Icon name="arrowUpRight" size={14} />
        </a>

        <a
          href={info.githubUrl}
          className={styles.social}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="github" size={17} />
          GitHub
          <Icon name="arrowUpRight" size={14} />
        </a>

        <a href={info.cvUrl} className={styles.social} download>
          <Icon name="download" size={17} />
          Currículo em PDF
        </a>
      </div>

      <p className={styles.availability}>
        <span className={styles.dot} aria-hidden="true" />
        {info.availability} · {info.location}
      </p>
    </Section>
  );
}
