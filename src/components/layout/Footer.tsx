import { useEffect, useState } from 'react';
import type { PersonalInfo } from '../../types';
import { Icon } from '../ui/Icon';
import { scrollToSection } from '../../utils/scroll';
import styles from './footer.module.css';

export function Footer({ info, topId }: { info: PersonalInfo; topId: string }) {
  const [showTop, setShowTop] = useState(false);

  // O botão só aparece depois que a pessoa sai do hero — antes disso ele
  // não teria função e competiria com o conteúdo.
  useEffect(() => {
    const threshold = () => window.innerHeight * 0.9;

    const onScroll = () => setShowTop(window.scrollY > threshold());
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.signature}>
          <span className={styles.name}>{info.name}</span>
          <span className={styles.meta}>
            {info.role} · {info.location}
          </span>
        </div>

        <nav className={styles.nav} aria-label="Links do rodapé">
          <a
            href={`mailto:${info.email}`}
            className={styles.link}
          >
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
        </nav>
      </div>

      <button
        type="button"
        className={styles.toTop}
        data-visible={showTop}
        onClick={() => scrollToSection(topId)}
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        <Icon name="arrowUp" size={18} />
      </button>
    </footer>
  );
}
