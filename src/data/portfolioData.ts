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
      "Criei a Central de Suporte Vision 360: portal para clientes abrirem e acompanharem chamados por projeto, com fila de atendimento, controle de prazos, indicadores e escalonamento para o Jira.",
      'Atuei em um microserviço de notificações multicanal (WhatsApp, Telegram, e-mail, Discord) sobre AWS SQS, responsável pelas integrações de WhatsApp e Telegram: entrega confiável, tratamento de falhas e sem duplicidade de disparos em picos de reprocessamento.',
      'Projetei um fluxo de upload global direto ao S3 via URLs pré-assinadas, adotado por mais de 10 módulos do sistema.',
      'Integrei câmeras de monitoramento de obras via protocolo RTSP, estruturando o streaming de vídeo para acompanhamento remoto dos canteiros.',
    ],
    techs: ['NestJS', 'React', 'Prisma', 'PostgreSQL', 'AWS SQS', 'Redis', 'Amazon S3', 'RTSP'],
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

/** Projetos reais conferidos no GitHub. Fontes: docs/portfolio-sources.md. */
export const projects: ProjectItem[] = [
  {
    id: 'whatsapp-control-center',
    image: '/uploads/projects/whatsapp-control-center.jpg',
    imageWidth: 1440,
    imageHeight: 960,
    imageAlt: 'Editor de templates do WhatsApp Control Center com formulário e prévia da mensagem, em ambiente de demonstração.',
    name: 'WhatsApp Control Center',
    desc: 'Painel integrado à API oficial da Meta para gerenciar contas, números, templates, mensagens e webhooks. Reúne a operação e o diagnóstico das integrações, com acesso por organização e perfil de usuário.',
    stack: 'React · NestJS · PostgreSQL · Prisma · TanStack Query',
    repoUrl: 'https://github.com/danielharrisonlf/whatsapp-control-center',
  },
  {
    id: 'clinicflow',
    image: '/uploads/projects/clinicflow-painel.webp',
    imageWidth: 1440,
    imageHeight: 1000,
    imageAlt:
      'Painel do dia do ClinicFlow: consultas com estado e próximo passo, contadores de aguardando e atrasadas, sala de espera e retornos, com dados de demonstração.',
    name: 'ClinicFlow — gestão de clínicas',
    desc: 'Operação de clínica da agenda ao retorno: ciclo da consulta com máquina de estados testável, verificação de disponibilidade por profissional, sala de espera, documentos e tarefas de acompanhamento. Monorepo com API NestJS e frontend React.',
    stack: 'React · NestJS · Prisma · PostgreSQL · Tailwind · Turborepo',
    repoUrl: 'https://github.com/danielharrisonlf/clinicflow',
  },
  {
    id: 'mapbox-vision',
    image: '/uploads/projects/mapbox-vision.webp',
    imageWidth: 1440,
    imageHeight: 900,
    imageAlt:
      'Mapbox Vision: mapa do Brasil em tema escuro com agrupamentos de estações meteorológicas e inventário lateral de ativos com filtros, em base de demonstração.',
    name: 'Mapbox Vision — análise geoespacial',
    desc: 'Prova de conceito geoespacial: mapa interativo com inventário de estações e áreas de cobertura, consultas espaciais executadas no banco (ST_Covers, ST_Intersects) e cruzamento com setores censitários e dados socioeconômicos do IBGE.',
    stack: 'React · Mapbox GL · NestJS · PostGIS · TypeORM',
    repoUrl: 'https://github.com/danielharrisonlf/mapbox',
  },
  {
    id: 'pc-remote-android',
    image: '/uploads/projects/pc-remote-deck.webp',
    imageType: 'mobile',
    imageWidth: 720,
    imageHeight: 1600,
    imageAlt: 'PC Remote Kotlin: painel de controles com atalhos de janelas, captura de tela, calculadora e bloqueio do computador.',
    name: 'PC Remote — Android nativo',
    desc: 'Aplicativo Android nativo em Kotlin que se conecta ao companion desktop em Rust e Tauri pela rede local. Permite controlar o computador, transferir arquivos e sincronizar a área de transferência.',
    stack: 'Kotlin · Android Views · TLS · Rust · Tauri',
    repoUrl: 'https://github.com/danielharrisonlf/pc-remote-android',
  },
  {
    id: 'fio',
    image: '/uploads/projects/fio-quadro.png',
    imageWidth: 1440,
    imageHeight: 950,
    imageAlt: 'Quadro Kanban do Fio com candidaturas de demonstração distribuídas por etapa do processo seletivo.',
    name: 'Fio — acompanhamento de candidaturas',
    desc: 'Organizador de processos seletivos com quadro Kanban, cadastro de empresas e vagas, follow-ups e visão de resumo. A interface web e a CLI em Go consultam os mesmos recursos de uma API em ASP.NET Core.',
    stack: 'React · TypeScript · C# · ASP.NET Core · PostgreSQL · Go',
    repoUrl: 'https://github.com/danielharrisonlf/linkanban',
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
  role: 'Software Developer — Applied AI Engineer',
  /** Chips exibidos sob o nome no hero. Antes eram markup duplicado no Hero. */
  roleChips: ['Software Developer', 'Applied AI Engineer'],
  /*
   * Duas versões da bio: a curta aparece no mobile, a longa no desktop.
   * As duas precisam carregar a mesma ideia — antes a curta era só uma lista
   * de áreas e perdia o "gosto de construir", que é o que diferencia.
   */
  shortBio:
    'Desenvolvedor Full Stack com 3 anos de experiência. Gosto de construir e de entrar na decisão do produto, atuando em arquitetura, infraestrutura e desenvolvimento. Hoje construo agentes de IA que rodam em produção.',
  fullBio:
    'Desenvolvedor Full Stack com 3 anos de experiência. Gosto de construir e de entrar na decisão do produto. Atuo em todas as fases do ciclo: arquitetura, infraestrutura e desenvolvimento. Hoje trabalho com engenharia de IA aplicada, construindo agentes que rodam em produção.',
  photoUrl: '/uploads/backback.webp',
  // Fallback real para navegadores sem WebP (antes apontava para um
  // arquivo byte a byte idêntico ao principal, então nunca serviu de nada).
  fallbackPhotoUrl: '/uploads/backback.png',
  cvUrl: '/cv/Daniel-Harrison-CV.pdf',
  email: 'daniel.harrisonlf@gmail.com',
  githubUrl: 'https://github.com/danielharrisonlf',
  linkedinUrl: 'https://www.linkedin.com/in/danielharrison-/',
};
