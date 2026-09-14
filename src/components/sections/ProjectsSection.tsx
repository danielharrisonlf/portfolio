import type { ProjectItem } from '../../types';
import { personalInfo } from '../../data/portfolioData';
import { Section } from '../ui/Section';
import { Icon } from '../ui/Icon';
import styles from './projects.module.css';

/**
 * Placeholder para projeto sem captura de tela.
 *
 * Desenha um diagrama de nós — o mesmo vocabulário do painel de stack — em
 * vez de um retângulo com a inicial do projeto. O retângulo com letra lia
 * como imagem quebrada; um diagrama lê como decisão.
 */
function DiagramPlaceholder() {
  const nodes = [16, 40, 64, 88, 112, 136, 160, 184, 208];

  return (
    <div className={styles.placeholder} aria-hidden="true">
      <svg viewBox="0 0 240 120" fill="none">
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          {nodes.map((x, i) => (
            <line key={x} x1={x} y1={78 - (i % 4) * 9} x2={x} y2={96} opacity={0.45} />
          ))}
          <line x1="16" y1="96" x2="224" y2="96" opacity={0.3} />
        </g>

        <g fill="currentColor">
          {nodes.map((x) => (
            <circle key={x} cx={x} cy={96} r="2.4" opacity={0.7} />
          ))}
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <rect x="14" y="30" width="52" height="20" rx="5" />
          <rect x="94" y="18" width="52" height="20" rx="5" />
          <rect x="174" y="34" width="52" height="20" rx="5" />
          <path d="M66 40h28M146 28h28" opacity="0.6" />
          <path d="M120 38v22M40 50v28M200 54v24" opacity="0.35" strokeDasharray="3 4" />
        </g>
      </svg>
    </div>
  );
}

function ProjectMedia({ project }: { project: ProjectItem }) {
  if (!project.image) return <DiagramPlaceholder />;

  return (
    <div className={styles.media}>
      <img
        src={project.image}
        alt={project.imageAlt ?? `Captura de tela do projeto ${project.name}`}
        loading="lazy"
        decoding="async"
        width={1600}
        height={1000}
      />
    </div>
  );
}

export function ProjectsSection({ projects }: { projects: ProjectItem[] }) {
  const hasAnyLink = projects.some((project) => project.repoUrl || project.demoUrl);

  return (
    <Section
      id="projetos"
      index="02"
      title="Projetos"
      intro="Trabalho pessoal, feito fora do horário de expediente — onde testo decisões de arquitetura e produto sem a restrição de um cliente."
    >
      {projects.map((project, index) => (
        <article
          key={project.id}
          className={`${styles.entry} ${
            index === 0 ? styles.entryLead : styles.entrySecondary
          }`}
        >
          <div className={styles.head}>
            <span className={styles.index}>{project.index}</span>
            <span className={styles.rule} aria-hidden="true" />
          </div>

          <div className={styles.mediaSlot}>
            <ProjectMedia project={project} />
          </div>

          <div className={styles.body}>
            <h3 className={styles.title}>{project.name}</h3>
            <p className={styles.pitch}>{project.pitch}</p>
            <p className={styles.desc}>{project.desc}</p>

            <ul className={styles.highlights}>
              {project.highlights.map((highlight) => (
                <li key={highlight} className={styles.highlight}>
                  {highlight}
                </li>
              ))}
            </ul>

            <div className={styles.foot}>
              <div className={styles.stack}>
                {project.stack.map((tech) => (
                  <span key={tech} className={styles.stackItem}>
                    {tech}
                  </span>
                ))}
              </div>

              {(project.repoUrl || project.demoUrl) && (
                <div className={styles.links}>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="github" size={15} />
                      Código
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="arrowUpRight" size={15} />
                      Ver online
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>
      ))}

      {!hasAnyLink && (
        <p className={styles.note}>
          Nenhum dos dois tem repositório público — são projetos com dados e
          integrações reais de terceiros. Se quiser ver o código ou uma
          demonstração ao vivo, me chama por{' '}
          <a href={`mailto:${personalInfo.email}`}>e-mail</a> que eu mostro.
        </p>
      )}
    </Section>
  );
}
