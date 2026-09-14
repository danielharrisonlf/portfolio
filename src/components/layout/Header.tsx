import { Icon } from '../ui/Icon';
import styles from './header.module.css';

interface HeaderProps {
  /** Seção visível no momento, para o marcador de item ativo. */
  activeId: string;
  navItems: { id: string; label: string }[];
  isDark: boolean;
  isScrolled: boolean;
  progress: number;
  onToggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenMenu: () => void;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
}

export function Header({
  activeId,
  navItems,
  isDark,
  isScrolled,
  progress,
  onToggleTheme,
  onOpenMenu,
  onNavigate,
  githubUrl,
  linkedinUrl,
  cvUrl,
}: HeaderProps) {
  return (
    <header className={styles.header} data-scrolled={isScrolled}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.burger}
          onClick={onOpenMenu}
          aria-label="Abrir menu de navegação"
          aria-haspopup="dialog"
        >
          <Icon name="menu" size={19} />
        </button>

        <a
          href="#inicio"
          className={styles.brand}
          onClick={(e) => onNavigate(e, 'inicio')}
          aria-label="Daniel Harrison — ir para o início"
        >
          <span className={styles.mark} aria-hidden="true">
            DH
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Daniel Harrison</span>
            <span className={styles.brandRole}>Software Developer</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Seções do site">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={styles.link}
              aria-current={activeId === item.id ? 'true' : undefined}
              onClick={(e) => onNavigate(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconAction}
            onClick={onToggleTheme}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
          >
            {/* O ícone é o oposto do tema atual: mostra o que o clique faz. */}
            <Icon name={isDark ? 'sun' : 'moon'} size={16} />
          </button>

          <a
            href={githubUrl}
            className={styles.iconAction}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil no GitHub"
            title="GitHub"
          >
            <Icon name="github" size={16} />
          </a>

          <a
            href={linkedinUrl}
            className={styles.iconAction}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil no LinkedIn"
            title="LinkedIn"
          >
            <Icon name="linkedin" size={16} />
          </a>

          <a
            href={cvUrl}
            className={styles.cta}
            download
            aria-label="Baixar currículo em PDF"
          >
            <Icon name="download" size={15} />
            <span className={styles.ctaLabel}>Currículo</span>
          </a>
        </div>
      </div>

      {/* Progresso de leitura: 1,5px, discreto, mas dá noção de tamanho. */}
      <div
        className={styles.progress}
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </header>
  );
}
