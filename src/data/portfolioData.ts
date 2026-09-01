import {
  NavItem,
  StackItem,
  ExperienceItem,
  ProjectItem,
  EducationItem,
} from '../types';

/**
 * Fonte única da navegação. A navbar, o menu mobile e o dock flutuante
 * consomem esta mesma lista para não divergirem entre si.
 * (O dock adiciona "Início" na frente, já que é um atalho de rolagem.)
 */
export const navItems: NavItem[] = [
  { label: 'Experiência', href: '#experiencia', delayMs: 0, num: '01' },
  { label: 'Projetos', href: '#projetos', delayMs: 60, num: '02' },
  { label: 'Formação', href: '#sobre', delayMs: 120, num: '03' },
  { label: 'Contato', href: '#contato', delayMs: 180, num: '04' },
];

export const stackItems: StackItem[] = [
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'Node.js', color: '#3C873A' },
  { label: 'NestJS', color: '#E0234E' },
  { label: 'React', color: '#61DAFB' },
  { label: 'React Native', color: '#61DAFB' },
  { label: 'AWS', color: '#FF9900' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Redis', color: '#DC382D' },
  { label: 'Docker', color: '#2496ED' },
];

/**
 * Competências e integrações — não produtos que eu uso.
 * Nomes de ferramentas de IA (Claude, OpenAI, Codex, etc.) foram removidos
 * de propósito: listar produto como se fosse skill dilui os itens que são
 * competência de verdade. A ferramenta aparece no contexto do projeto.
 */
export const practices: string[] = [
  'Arquitetura',
  'System Design',
  'DDD',
  'Design Patterns',
  'Microsserviços',
  'Webhooks',
  'Websockets',
  'Integrações',
  'Agentes de IA',
  'MCPs',
  'Subagentes',
  'Skills & Tools',
  'SDD',
  'WhatsApp API',
  'Telegram API',
  'Mapbox',
];

export const experiences: ExperienceItem[] = [
  {
    role: 'Full Stack Developer',
    company: 'Encibra',
    period: 'jun. 2025 — atual',
    context:
      'Encibra é uma consultoria de engenharia com mais de 55 anos de atuação, com projetos em saneamento, transporte, energia e edificações. Desenvolvemos soluções de software para esse ramo.',
    bullets: [
      'Arquitetei um microserviço de notificações multicanal (WhatsApp, Telegram, e-mail, Discord) via AWS SQS, reduzindo em mais de 90% as falhas de entrega e eliminando duplicidade de disparos mesmo em picos de reprocessamento.',
      'Projetei um fluxo de upload global direto ao S3 via URLs pré-assinadas, adotado por mais de 10 módulos do sistema.',
      'Integrei câmeras de monitoramento de obras via protocolo RTSP, estruturando o streaming de vídeo para acompanhamento remoto dos canteiros.',
    ],
    techs: ['NestJS', 'AWS SQS', 'Redis', 'Amazon S3', 'RTSP'],
  },
  {
    role: 'Full Stack Developer',
    company: 'Siscontroler',
    period: 'dez. 2024 — maio 2025',
    context:
      'Siscontroler desenvolve plataformas de controle de acesso para escolas, hospitais e empresas.',
    bullets: [
      'APIs REST com Node.js, TypeScript e Express para a plataforma de controle de acesso.',
      'Integração com catracas, leitores faciais e dispositivos biométricos.',
    ],
    techs: ['Node.js', 'Express', 'PostgreSQL'],
  },
  {
    role: 'Full Stack Developer',
    company: 'PrinterStore',
    period: 'dez. 2023 — nov. 2024',
    context:
      'PrinterStore atua na locação de impressoras e equipamentos de TI para empresas.',
    bullets: [
      'Plataforma fullstack (Node.js + React) de gestão de ativos vinculados a contratos de locação.',
      'Módulo de chamados técnicos com priorização, atribuição automática e monitoramento de SLA.',
    ],
    techs: ['Node.js', 'React', 'MySQL'],
  },
];

/**
 * TODO (Daniel): preencher `repoUrl` e/ou `demoUrl` nos dois projetos.
 * Projeto sem link é alegação, não prova — é a primeira coisa que um
 * recrutador técnico tenta clicar. Os campos já são renderizados quando
 * preenchidos; deixei vazios porque não invento URL.
 *
 * TODO (Daniel): `proj-0` estava usando um print DESTE portfólio como
 * imagem do projeto. Removi. Coloque um screenshot real da conversa no
 * Telegram (é o que vende o produto) em /uploads e aponte `image` aqui.
 */
export const projects: ProjectItem[] = [
  {
    id: 'proj-0',
    name: 'Gestor financeiro pessoal com IA',
    desc: 'Controle de gastos integrado ao Telegram: um agente de IA registra e categoriza transações a partir de mensagens de texto, sem exigir que o usuário abra um app. Prioriza fricção baixa sobre relatórios completos.',
    stack: 'NestJS · Telegram Bot API · PostgreSQL · Claude',
    repoUrl: '',
    demoUrl: '',
  },
  {
    id: 'proj-1',
    name: 'Observabilidade para agentes de IA',
    desc: 'Dashboard de custo, latência e tracing de chamadas MCP, pensado para times que rodam agentes em produção e precisam justificar gasto de token e diagnosticar falhas rapidamente.',
    stack: 'Node.js · OpenTelemetry · Grafana',
    image: '/uploads/observabilidade.webp',
    repoUrl: '',
    demoUrl: '',
  },
];

export const education: EducationItem[] = [
  {
    course: 'Ciência da Computação',
    school: 'Universidade da Amazônia (UNAMA)',
    status: 'EM ANDAMENTO',
    statusKind: 'active',
    period: '2025 — atual · 4º Semestre',
    desc: 'Foco no desenvolvimento de software, arquitetura de sistemas, algoritmos e engenharia de dados.',
    subjects: [
      'Programação Orientada a Objetos (POO)',
      'Banco de Dados',
      'Engenharia de Software',
      'Redes de Computadores',
      'Sistemas Operacionais',
      'C++',
      'Java',
    ],
  },
  {
    course: 'Engenharia da Computação',
    school: 'Universidade Federal do Pará (UFPA)',
    status: 'TRANSFERIDO',
    statusKind: 'past',
    period: '2023.2 — 2025 · Transferência para UNAMA',
    desc: 'Formação com base rigorosa em ciências exatas, eletrônica, métodos quantitativos e projetos de engenharia.',
    subjects: [
      'Cálculo',
      'Física',
      'Eletrônica',
      'Projetos de Engenharia',
      'Visão Computacional',
      'C',
      'Python',
    ],
  },
];

export const personalInfo = {
  name: 'Daniel Harrison',
  role: 'Software Developer — Applied Engineer',
  shortBio:
    'Desenvolvedor Full Stack com 3 anos de experiência, focado em arquitetura, infraestrutura e produtos com IA (agentes, MCP, SDD).',
  fullBio:
    'Desenvolvedor Full Stack com 3 anos de experiência. Gosto de construir coisas e atuar de forma ativa na criação do produto, não só entregar tarefas. Tenho experiência em todo o ciclo de desenvolvimento: arquitetura, infraestrutura, desenvolvimento e manutenção. Estou imerso em desenvolvimento com IA: agentes, subagentes, criação de skills, MCP e SDD (spec-driven development).',
  photoUrl: '/uploads/backback.webp',
  // Fallback real para navegadores sem WebP (antes apontava para um
  // arquivo byte a byte idêntico ao principal, então nunca serviu de nada).
  fallbackPhotoUrl: '/uploads/backback.png',
  cvUrl: '/cv/Daniel-Harrison-CV.pdf',
  email: 'daniel.harrisonlf@gmail.com',
  githubUrl: 'https://github.com/danielharrison-l',
  linkedinUrl: 'https://www.linkedin.com/in/danielharrison-/',
};
