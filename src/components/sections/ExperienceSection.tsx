import type { ExperienceItem, RichText } from '../../types';
import { Section } from '../ui/Section';
import styles from './experience.module.css';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

/**
 * Destaca um trecho da frase sem quebrar a string em pedaços no arquivo de
 * dados. Se o trecho não existir no texto, o parágrafo é renderizado
 * inteiro — nunca desaparece.
 */
function RichParagraph({ text, strong }: RichText) {
  if (!strong || !text.includes(strong)) {
    return <>{text}</>;
  }

  const at = text.indexOf(strong);
  return (
    <>
      {text.slice(0, at)}
      <strong>{strong}</strong>
      {text.slice(at + strong.length)}
    </>
  );
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <Section
      id="experiencia"
      index="01"
      title="Experiência"
      intro="Três anos construindo backend, integrações e produto — em consultoria de engenharia, controle de acesso e gestão de ativos."
    >
      <ol className={styles.list}>
        {experiences.map((job) => (
          <li key={job.company} className={styles.item}>
            <div className={styles.meta}>
              {/*
                Duas versões do período, trocadas por CSS. Em telas estreitas
                "dez. 2024 — maio 2025" ocupa a linha inteira e empurra o
                resto para baixo; a forma curta mantém a trilha legível.
              */}
              <span className={styles.period}>
                <span
                  className={`${styles.marker} ${job.current ? styles.markerCurrent : ''}`}
                  aria-hidden="true"
                />
                <span className={styles.periodLong}>{job.period}</span>
                <span className={styles.periodShort}>{job.shortPeriod}</span>
              </span>
            </div>

            <div className={styles.body}>
              <div className={styles.heading}>
                <h3 className={styles.company}>{job.company}</h3>
                <span className={styles.role}>{job.role}</span>
              </div>

              <p className={styles.context}>{job.context}</p>
              <p className={styles.summary}>{job.summary}</p>

              {job.featured && (
                <div className={styles.featured}>
                  <div className={styles.featuredBody}>
                    {/* <p> e não <h4>: o bloco já está dentro do nível do
                        cargo (h3), e um h4 aqui acrescentaria um degrau que
                        não corresponde a nada na estrutura do documento. */}
                    <p className={styles.featuredTitle}>{job.featured.title}</p>
                    <p className={styles.featuredDesc}>{job.featured.desc}</p>
                  </div>

                  {job.metric && (
                    <p className={styles.metric}>
                      <span className={styles.metricValue}>{job.metric.value}</span>
                      <span className={styles.metricLabel}>{job.metric.label}</span>
                    </p>
                  )}
                </div>
              )}

              <ul className={styles.bullets}>
                {job.bullets.map((bullet) => (
                  <li key={bullet.text} className={styles.bullet}>
                    <RichParagraph {...bullet} />
                  </li>
                ))}
              </ul>

              <p className={styles.stack}>
                <span className={styles.stackLabel}>Stack</span>
                {job.stack.map((tech) => (
                  <span key={tech} className={styles.stackItem}>
                    {tech}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
