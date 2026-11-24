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
  'Assistentes de IA',
  'Agentes de IA',
  'MCPs',
  'OAuth 2.1',
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
      'Atuei no desenvolvimento do OIA (Organismo de Inspeção Acreditada): plataforma para gestão de contratos, fases, inspeções, emissão versionada de certificados com validação pública por QR Code e fluxo multi-etapas de não conformidades (RNCs) com matriz granular de permissões por perfil e contrato, trilha de auditoria, anexos no Amazon S3 e filas AWS SQS (Fastify, Prisma, Better Auth, Flyway, React 19 e TanStack).',
      'Criei a Central de Suporte Vision 360 (Support App): portal para clientes abrirem e acompanharem chamados por projeto, com fila global de atendimento, controle de prazos/SLA, indicadores operacionais e escalonamento integrado ao Jira, estruturado em monorepo pnpm + Turborepo com NestJS, React 19, contratos Zod e client HTTP tipado via Orval.',
      'Atuei no microsserviço de notificações multicanal (WhatsApp, Telegram, e-mail e Discord) sobre AWS SQS, responsável pelas integrações de WhatsApp e Telegram: entrega confiável, tratamento de falhas e prevenção de duplicidade de disparos em picos de reprocessamento.',
      'Projetei um fluxo de upload global direto ao Amazon S3 via URLs pré-assinadas, adotado por mais de 10 módulos da plataforma.',
      'Integrei câmeras de monitoramento de obras via protocolo RTSP, estruturando a orquestração e o streaming de vídeo para acompanhamento remoto dos canteiros.',
    ],
    techs: [
      'NestJS',
      'Fastify',
      'React',
      'Prisma',
      'PostgreSQL',
      'Better Auth',
      'AWS SQS',
      'Amazon S3',
      'Redis',
      'Flyway',
      'RTSP',
    ],
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

/** Projetos reais conferidos nos repositórios locais e no GitHub. Fontes: docs/portfolio-sources.md. */
export const projects: ProjectItem[] = [
  {
    id: 'gestao-operacional-mcp',
    image: '/uploads/projects/gestao-operacional-mcp.webp',
    imageWidth: 1440,
    imageHeight: 960,
    imageAlt:
      'Console de integração MCP da plataforma de gestão operacional: catálogo de ferramentas de leitura e escrita com permissões RBAC exigidas e parâmetros tipados, em ambiente de demonstração.',
    name: 'Plataforma de Gestão Operacional com Assistente de IA via MCP',
    desc: 'Plataforma corporativa multi-tenant de gestão de projetos, equipes e sprints projetada para que assistentes de IA (Claude, ChatGPT e Cursor) consultem e executem ações por meio de um servidor MCP (49 ferramentas) autenticado via OAuth 2.1 — respeitando estritamente o RBAC e a organização do usuário logado. Construída em microsserviços NestJS atrás de gateway, com PostgreSQL, Redis/BullMQ, outbox transacional, WebSocket em tempo real e trilha de auditoria imutável.',
    stack: 'NestJS · React · MCP · OAuth 2.1 · PostgreSQL · Redis · BullMQ · WebSocket',
  },
  {
    id: 'omni-crm-ai',
    image: '/uploads/projects/omni-crm-inbox.webp',
    imageWidth: 1440,
    imageHeight: 960,
    imageAlt:
      'Caixa de entrada do Omni CRM AI em tema escuro: fila de conversas, histórico do atendimento, contexto do contato com oportunidades vinculadas e painel lateral de assistência de IA, com dados fictícios.',
    name: 'Omni CRM AI — Atendimento Omnichannel e Pipeline com IA',
    desc: 'Solução B2B para equipes comerciais e de atendimento conduzirem conversas do primeiro contato ao fechamento em um único espaço multi-organização. Integra caixa de entrada omnichannel (WhatsApp e chat web incorporável), pipeline de oportunidades, base de conhecimento vetorial com pgvector e assistência de IA sob demanda para resumo de conversas e sugestão de respostas, com autenticação Better Auth e filas em Redis/BullMQ.',
    stack: 'NestJS · React · PostgreSQL · pgvector · Better Auth · Redis · BullMQ · Zod',
  },
  {
    id: 'clinicflow',
    image: '/uploads/projects/clinicflow-painel.webp',
    imageWidth: 1440,
    imageHeight: 1000,
    imageAlt:
      'Painel do dia do ClinicFlow: consultas com estado e próximo passo, contadores de aguardando e atrasadas, sala de espera e retornos, com dados de demonstração.',
    name: 'ClinicFlow — Gestão Operacional de Clínicas',
    desc: 'Solução ponta a ponta para eliminar o desalinhamento entre recepção, agenda e consultório: centraliza a operação diária com agenda multiprofissional livre de conflitos de horário, ciclo da consulta governado por máquina de estados testável, sala de espera ativa com eventos em tempo real (SSE), documentos clínicos em armazenamento compatível com S3 e funil automático para resgate de faltas e retornos.',
    stack: 'React · NestJS · Prisma · PostgreSQL · Redis · Amazon S3 · Turborepo',
    repoUrl: 'https://github.com/danielharrisonlf/clinicflow',
  },
  {
    id: 'finflow',
    image: '/uploads/projects/finflow-painel.webp',
    imageWidth: 1440,
    imageHeight: 960,
    imageAlt:
      'Painel financeiro do FinFlow em tema escuro: saldo geral, receitas, despesas, próximos vencimentos, fluxo de caixa mensal e distribuição por categoria, com dados de demonstração.',
    name: 'FinFlow — Plataforma Financeira Multi-Interface com MCP',
    desc: 'Plataforma de gestão financeira orientada a domínio (valores em centavos inteiros, faturas, parcelamentos, orçamentos e metas) onde uma única API NestJS com contratos Zod compartilhados alimenta quatro interfaces: painel web React, CLI, servidor MCP com 19 ferramentas para assistentes de IA e bot do Telegram com lançamentos rápidos, alertas de limite de orçamento e exportação CSV/OFX.',
    stack: 'NestJS · React · MCP · Telegram API · Prisma · PostgreSQL · Zod · Turborepo',
  },
  {
    id: 'whatsapp-control-center',
    image: '/uploads/projects/whatsapp-control-center.jpg',
    imageWidth: 1440,
    imageHeight: 960,
    imageAlt:
      'Editor de templates do WhatsApp Control Center com formulário e prévia da mensagem, em ambiente de demonstração.',
    name: 'WhatsApp Control Center — Operação na API Oficial da Meta',
    desc: 'Central operacional sobre a WhatsApp Cloud API oficial para empresas conduzirem atendimento e disparos em volume sem depender de intervenção técnica. Reúne contas, números, editor de templates com prévia fiel no celular, diagnóstico claro de falhas de envio, webhooks em tempo real, credenciais criptografadas e controle de acesso por organização e perfil.',
    stack: 'React · NestJS · WhatsApp API · PostgreSQL · Prisma · TanStack Query',
    repoUrl: 'https://github.com/danielharrisonlf/whatsapp-control-center',
  },
  {
    id: 'mapbox-vision',
    image: '/uploads/projects/mapbox-vision.webp',
    imageWidth: 1440,
    imageHeight: 900,
    imageAlt:
      'Mapbox Vision: mapa do Brasil em tema escuro com agrupamentos de estações meteorológicas e inventário lateral de ativos com filtros, em base de demonstração.',
    name: 'Mapbox Vision — Inteligência Geoespacial com PostGIS',
    desc: 'Plataforma de análise territorial e cobertura de ativos: combina mapa interativo em Mapbox GL com consultas espaciais nativas no PostgreSQL/PostGIS (ST_Covers, ST_Intersects, ST_Intersection), contrato GeoJSON e cruzamento automatizado com setores censitários e dados socioeconômicos do IBGE para apoiar decisões de cobertura.',
    stack: 'React · Mapbox GL · NestJS · PostGIS · TypeORM',
    repoUrl: 'https://github.com/danielharrisonlf/mapbox',
  },
  {
    id: 'pc-remote-android',
    image: '/uploads/projects/pc-remote-deck.webp',
    imageType: 'mobile',
    imageWidth: 720,
    imageHeight: 1600,
    imageAlt:
      'PC Remote Kotlin: painel de controles com atalhos de janelas, captura de tela, calculadora e bloqueio do computador.',
    name: 'PC Remote — Android Nativo e Companion Desktop',
    desc: 'Ecossistema de controle remoto local sem dependência de nuvem: aplicativo Android nativo em Kotlin conectado pela LAN com TLS fixado ao companion desktop em Rust e Tauri, oferecendo comandos de mídia e janelas, transferência de arquivos e sincronização de área de transferência.',
    stack: 'Kotlin · Android Views · TLS · Rust · Tauri',
    repoUrl: 'https://github.com/danielharrisonlf/pc-remote-android',
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
    'Desenvolvedor Full Stack com 3 anos de experiência. Gosto de construir e participar das decisões de produto, atuando em arquitetura, infraestrutura e desenvolvimento. Hoje construo assistentes, agentes de IA e servidores MCP que rodam em produção.',
  fullBio:
    'Desenvolvedor Full Stack com 3 anos de experiência. Gosto de construir e de entrar na decisão do produto. Atuo em todas as fases do ciclo: arquitetura, infraestrutura e desenvolvimento. Hoje trabalho com engenharia de IA aplicada, entregando assistentes de IA, agentes e integrações MCP conectados a sistemas reais em produção.',
  photoUrl: '/uploads/backback.webp',
  // Fallback real para navegadores sem WebP (antes apontava para um
  // arquivo byte a byte idêntico ao principal, então nunca serviu de nada).
  fallbackPhotoUrl: '/uploads/backback.png',
  cvUrl: '/cv/Daniel-Harrison-CV.pdf',
  email: 'daniel.harrisonlf@gmail.com',
  githubUrl: 'https://github.com/danielharrisonlf',
  linkedinUrl: 'https://www.linkedin.com/in/danielharrison-/',
};
