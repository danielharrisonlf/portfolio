import type { PersonalInfo, StackLayer } from '../../types';
import { Button } from '../ui/Button';
import styles from './hero.module.css';

interface HeroProps {
  info: PersonalInfo;
  layers: StackLayer[];
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

/**
 * Topo do site.
 *
 * A composição é assimétrica de propósito: o nome ocupa a coluna larga e a
 * grade de stack fica num painel à direita. A pergunta que o painel
 * responde não é "quais ferramentas você conhece" — é "onde cada peça
 * encaixa", que é o que separa uma lista de logos de um desenho de sistema.
 */
export function Hero({ info, layers, onNavigate }: HeroProps) {
  return (
    <section
      id="inicio"
      data-section
      aria-labelledby="hero-name"
      /* `on-canvas` move o anel de foco para a cor do canvas: o accent do
         tema claro tem ~2.4:1 sobre este fundo, abaixo do mínimo de 3:1
         para elemento gráfico. */
      className={`${styles.hero} on-canvas`}
    >
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glowA} />
        <div className={styles.glowB} />
      </div>

      <div className={styles.inner}>
        {/* --- Coluna de identidade e posicionamento ---------------------- */}
        <div className={styles.intro}>
          <div className={styles.identity}>
            <div className={styles.avatar}>
              <img
                src={info.photoUrl}
                alt={`Retrato de ${info.name}`}
                width={360}
                height={360}
                /* A foto é o elemento que mais empurra o LCP: precisa vir
                   antes de qualquer outra coisa e sem lazy. */
                fetchPriority="high"
                decoding="async"
                onError={(event) => {
                  const img = event.currentTarget;
                  if (!img.src.endsWith('backback.png')) {
                    img.src = info.fallbackPhotoUrl;
                  }
                }}
              />
            </div>

            <div className={styles.nameBlock}>
              <h1 id="hero-name" className={styles.name}>
                {info.name}
              </h1>
              <p className={styles.role}>
                {info.roles.map((role, index) => (
                  <span key={role} className={index > 0 ? styles.roleItem : undefined}>
                    {role}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <p className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {info.availability}
            <span className={styles.statusMeta}>· {info.location}</span>
          </p>

          <h2 className={styles.headline}>
            Construo sistemas que rodam em produção — do desenho da arquitetura ao deploy.
          </h2>

          <p className={styles.bio}>{info.bio}</p>

          <div className={styles.actions}>
            <Button
              as="a"
              href="#projetos"
              variant="primary"
              icon="arrowDown"
              iconDir="up"
              onCanvas
              onClick={(event) => onNavigate(event, 'projetos')}
            >
              Ver projetos
            </Button>
            <Button
              as="a"
              href={info.cvUrl}
              icon="download"
              onCanvas
              download
            >
              Currículo
            </Button>
          </div>
        </div>

        {/* --- Painel de stack ------------------------------------------- */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Stack por camada</h2>
            <p className={styles.panelNote}>
              {layers.reduce((total, layer) => total + layer.items.length, 0)} tecnologias
            </p>
          </div>

          <div className={styles.panelDivider} aria-hidden="true" />

          <dl className={styles.layers}>
            {layers.map((layer) => (
              <div key={layer.id} className={styles.layer}>
                <dt className={styles.layerLabel}>
                  <span className={styles.layerName}>{layer.label}</span>
                  <span className={styles.layerNote}>{layer.note}</span>
                </dt>
                <dd>
                  <ul className={styles.layerItems}>
                    {layer.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
