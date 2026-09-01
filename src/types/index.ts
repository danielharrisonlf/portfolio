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
}

export interface EducationItem {
  course: string;
  school: string;
  status: string;
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
