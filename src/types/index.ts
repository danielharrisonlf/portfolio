export type Theme = 'light' | 'dark';

export type SectionId = 'inicio' | 'experiencia' | 'projetos' | 'formacao' | 'contato';

/** Item de navegação. `id` é o alvo de âncora; o href é derivado dele. */
export interface NavItem {
  id: SectionId;
  /** Rótulo curto usado no header. */
  label: string;
  /** Rótulo curto usado no menu mobile, onde cabe mais texto. */
  menuLabel: string;
  /** Índice exibido no menu mobile (01…05). */
  index: string;
}

/**
 * Texto com trecho destacado. Existe para o dado carregar a intenção de
 * ênfase em vez de o componente adivinhar com regex sobre a frase.
 */
export interface RichText {
  text: string;
  /** Substring de `text` renderizada como <strong>. */
  strong?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  /** Período curto para a trilha temporal em telas estreitas. */
  shortPeriod: string;
  /** O que a empresa faz — uma frase, para dar contexto ao recrutador. */
  context: string;
  /** Uma linha que resume a contribuição. É o que se lê se nada mais for lido. */
  summary: string;
  bullets: RichText[];
  /**
   * Entrega principal, destacada fora da lista de bullets. Existe porque
   * três bullets com o mesmo peso visual escondem qual deles foi o trabalho
   * de maior impacto — e é esse que o recrutador precisa ler primeiro.
   */
  featured?: { title: string; desc: string };
  /** Número que comprova o destaque. Sem número, o bloco não é renderizado. */
  metric?: { value: string; label: string };
  stack: string[];
  current?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  /** O problema que o projeto resolve, em uma frase. */
  pitch: string;
  desc: string;
  /** Decisões técnicas que valem destaque. */
  highlights: string[];
  stack: string[];
  image?: string;
  imageAlt?: string;
  repoUrl?: string;
  demoUrl?: string;
}

export type EducationStatusKind = 'active' | 'past';

export interface EducationItem {
  course: string;
  school: string;
  status: string;
  statusKind: EducationStatusKind;
  period: string;
  desc: string;
  subjects: string[];
}

/** Uma camada da grade de stack exibida no hero. */
export interface StackLayer {
  id: string;
  label: string;
  /** O que a camada resolve. Curto: uma linha. */
  note: string;
  items: string[];
}

export interface PersonalInfo {
  name: string;
  /** Papel principal, usado no <title> e no hero. */
  role: string;
  /** Dois papéis curtos para o hero — mesma informação, escaneável. */
  roles: string[];
  location: string;
  availability: string;
  bio: string;
  photoUrl: string;
  fallbackPhotoUrl: string;
  cvUrl: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}
