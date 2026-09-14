import type { EducationItem } from '../../types';
import { Section } from '../ui/Section';
import styles from './education.module.css';

interface EducationSectionProps {
  education: EducationItem[];
  practices: string[];
}

export function EducationSection({ education, practices }: EducationSectionProps) {
  return (
    <Section
      id="formacao"
      title="Formação"
      intro="Graduação em curso e a base que veio da engenharia — junto com as práticas de engenharia de software que aplico no dia a dia."
    >
      <div className={styles.entries}>
        {education.map((item) => (
          <article key={item.course} className={styles.entry}>
            <div className={styles.schoolSide}>
              <h3 className={styles.school}>{item.school}</h3>
              <span className={styles.period}>{item.period}</span>
              <span
                className={`${styles.status} ${
                  item.statusKind === 'active' ? styles.statusActive : ''
                }`}
              >
                <span className={styles.statusDot} aria-hidden="true" />
                {item.status}
              </span>
            </div>

            <div className={styles.body}>
              <p className={styles.course}>{item.course}</p>
              <p className={styles.desc}>{item.desc}</p>

              <div className={styles.subjectsBlock}>
                <span className={styles.subjectsLabel}>Disciplinas e fundamentos</span>
                <ul className={styles.subjects}>
                  {item.subjects.map((subject) => (
                    <li key={subject} className={styles.subject}>
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.practices}>
        <div className={styles.practicesHead}>
          <h3 className={styles.practicesTitle}>Práticas de engenharia</h3>
          <p className={styles.practicesNote}>O como, separado do com o quê.</p>
        </div>

        <ul className={styles.practiceList}>
          {practices.map((practice) => (
            <li key={practice} className={styles.practice}>
              {practice}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
