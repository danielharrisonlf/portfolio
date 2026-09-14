import { useEffect, useRef } from 'react';
import type { PersonalInfo } from '../../types';
import { Icon } from '../ui/Icon';
import { scrollToSection } from '../../utils/scroll';
import styles from './footer.module.css';

export function Footer({ info, topId }: { info: PersonalInfo; topId: string }) {
  const footerRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const button = buttonRef.current;
    if (!footer || !button) return;

    // Passado o hero, o botão tem função.
    let pastHero = false;
    // Com o rodapé à vista ele não tem: o rodapé já tem "Voltar ao topo".
    let footerInView = false;

    const apply = () => {
      const visible = pastHero && !footerInView;
      button.dataset.visible = String(visible);
      /*
       * Esconder não basta: com `visibility: hidden` o botão já sai da
       * árvore de cliques, mas o `pointer-events: none` explícito garante
       * isso mesmo se a transição de visibilidade for interrompida no meio.
       * Era exatamente este o defeito — um botão flutuante comendo o clique
       * do link "Currículo".
       */
      button.style.pointerEvents = visible ? 'auto' : 'none';
    };

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.9;
      apply();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (typeof IntersectionObserver === 'undefined') {
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        footerInView = entry.isIntersecting;
        apply();
      },
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(footer);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.signature}>
          <span className={styles.name}>{info.name}</span>
          <span className={styles.meta}>
            {info.role} · {info.location}
          </span>
        </div>

        <nav className={styles.nav} aria-label="Links do rodapé">
          <a href={`mailto:${info.email}`} className={styles.link}>
            <Icon name="mail" size={15} />
            E-mail
          </a>
          <a
            href={info.githubUrl}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="github" size={15} />
            GitHub
          </a>
          <a
            href={info.linkedinUrl}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="linkedin" size={15} />
            LinkedIn
          </a>
          <a href={info.cvUrl} className={styles.link} download>
            <Icon name="download" size={15} />
            Currículo
          </a>

          {/*
            O caminho de volta ao topo mora AQUI, dentro do fluxo do rodapé,
            e não num botão flutuante. A versão anterior tinha os dois: um
            botão fixo que cobria justamente este link em 9 larguras.
          */}
          <button
            type="button"
            className={styles.toTopLink}
            onClick={() => scrollToSection(topId)}
          >
            <Icon name="arrowUp" size={15} />
            Voltar ao topo
          </button>        </nav>
      </div>

      {/*
        Botão flutuante: atalho para quem está no meio da página. Desaparece
        quando o rodapé entra na tela, porque aí ele fica sobre conteúdo
        interativo e o atalho do rodapé assume.
      */}
      <button
        ref={buttonRef}
        type="button"
        className={styles.toTop}
        data-visible="false"
        onClick={() => scrollToSection(topId)}
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        <Icon name="arrowUp" size={18} />
      </button>
    </footer>
  );
}
