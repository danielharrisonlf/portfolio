import type { ReactNode } from 'react';
import styles from './section.module.css';

interface SectionProps {
  id: string;
  /** Índice exibido acima do título (01, 02…). */
  index: string;
  title: string;
  /** Uma linha explicando o que a seção responde. Opcional. */
  intro?: string;
  children: ReactNode;
}

/**
 * Bloco de seção com cabeçalho próprio.
 *
 * O cabeçalho fica em cima do conteúdo, alinhado à esquerda. A alternativa
 * era uma coluna fixa à esquerda com cabeçalho e conteúdo ao lado — layout
 * bonito, mas que gasta ~170px de largura em todas as seções só para
 * repetir uma palavra. Em 1200px de container, isso é 14% da tela.
 */
export function Section({ id, index, title, intro, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      data-section
      aria-labelledby={headingId}
      className={`container ${styles.section}`}
    >
      <header className={styles.header}>
        <span className={styles.index}>{index}</span>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </header>

      {children}
    </section>
  );
}
