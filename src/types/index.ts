export type Theme = 'light' | 'dark';

export interface NavItem {
  label: string;
  href: string;
  delayMs: number;
  num: string;
}

export interface StackItem {
  label: string;
  color: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  context: string;
  bullets: string[];
  techs: string[];
}

export interface ProjectItem {
  id?: string;
  name: string;
  desc: string;
  stack: string;
  image?: string;
  link?: string;
  /** Link do repositório. Vazio/ausente = botão não é renderizado. */
  repoUrl?: string;
  /** Link da demo ao vivo. Vazio/ausente = botão não é renderizado. */
  demoUrl?: string;
}

/**
 * `active` = em curso (verde), `past` = encerrado/transferido (neutro).
 * Sem isso, "EM ANDAMENTO" e "TRANSFERIDO" saíam no mesmo verde, dando
 * o mesmo peso visual a significados opostos.
 */
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

export interface GraphEdge {
  points: string;
}

export interface GraphNode {
  cx: number;
  cy: number;
}

export interface GraphData {
  w: number;
  h: number;
  viewBox: string;
  edges: GraphEdge[];
  nodes: GraphNode[];
}

export interface SparkPosition {
  x: number;
  y: number;
}
