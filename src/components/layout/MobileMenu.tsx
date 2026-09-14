import { useRef } from 'react';
import type { NavItem, PersonalInfo } from '../../types';
import { Icon } from '../ui/Icon';
import { useModalDialog } from '../../hooks/useModalDialog';
import styles from './mobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  info: PersonalInfo;
  /** Recebe o evento para poder cancelar o salto nativo da âncora. */
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export function MobileMenu({ isOpen, onClose, navItems, info, onNavigate }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { handleKeyDown } = useModalDialog({ isOpen, onClose, panelRef });

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={styles.sheet}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.top}>
          <span className={styles.topLabel}>Navegação</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className={styles.list} aria-label="Seções do site">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={styles.item}
              /*
               * O evento vai junto: sem `preventDefault`, o salto nativo da
               * âncora competiria com a rolagem suave do JS — dois scrolls
               * com offsets diferentes na mesma ação.
               */
              onClick={(event) => onNavigate(event, item.id)}
            >
              <span className={styles.index} aria-hidden="true">
                {item.index}
              </span>
              <span className={styles.label}>{item.menuLabel}</span>
              <Icon name="arrowRight" size={17} className={styles.chevron} />
            </a>
          ))}
        </nav>

        <div className={styles.footer}>
          <a href={`mailto:${info.email}`} className={styles.email}>
            {info.email}
          </a>

          <div className={styles.links}>
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
          </div>

          <a href={info.cvUrl} className={styles.cv} download>
            <Icon name="download" size={16} />
            Baixar currículo
          </a>
        </div>
      </div>
    </>
  );
}
