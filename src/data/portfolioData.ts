import type {
  EducationItem,
  ExperienceItem,
  NavItem,
  PersonalInfo,
  ProjectItem,
  StackLayer,
} from '../types';

/**
 * Fonte única do site. Todo texto que aparece na tela mora aqui — nenhum
 * componente escreve copy própria. Editar o portfólio é editar este arquivo.
 *
 * Regra que vale para tudo abaixo: nada de experiência, tecnologia ou número
 * que não esteja comprovado no currículo. Onde não havia dado, ficou de fora.
 */

export const navItems: NavItem[] = [
  { id: 'experiencia', label: 'Experiência', menuLabel: 'Experiência', index: '01' },
  { id: 'projetos', label: 'Projetos', menuLabel: 'Projetos', index: '02' },
  { id: 'formacao', label: 'Formação', menuLabel: 'Formação', index: '03' },
  { id: 'contato', label: 'Contato', menuLabel: 'Contato', index: '04' },
];

export const personalInfo: PersonalInfo = {
  name: 'Daniel Harrison',
  role: 'Software Developer — Applied AI Engineer',
  roles: ['Software Developer', 'Applied AI Engineer'],
  location: 'Belém, PA',
  availability: 'Aberto a novas oportunidades',
  bio: 'Desenvolvedor Full Stack com 3 anos de experiência. Gosto de construir e de entrar na decisão do produto. Atuo em todas as fases do ciclo: arquitetura, infraestrutura e desenvolvimento. Hoje trabalho com engenharia de IA aplicada, construindo agentes que rodam em produção.',
  photoUrl: '/uploads/backback.webp',
  /** WebP não é universal; o PNG é o fallback real do onError. */
  fallbackPhotoUrl: '/uploads/backback.png',
  cvUrl: '/cv/Daniel-Harrison-CV.pdf',
  email: 'daniel.harrisonlf@gmail.com',
  githubUrl: 'https://github.com/danielharrison-l',
  linkedinUrl: 'https://www.linkedin.com/in/danielharrison-/',
};

/**
 * A grade de stack do hero. Está agrupada por camada porque a pergunta que
 * ela precisa responder não é "quais ferramentas você conhece", e sim
 * "onde cada peça encaixa". Lista plana de logos não responde isso.
 *
 * Os grupos são o repertório real do currículo, não a arquitetura de um
 * sistema específico — o rótulo da seção deixa isso explícito.
 */
export const stackLayers: StackLayer[] = [
  {
    id: 'interface',
    label: 'Interface',
    note: 'Web e mobile',
    items: ['React', 'React Native', 'TypeScript'],
  },
  {
    id: 'servicos',
    label: 'Serviços',
    note: 'APIs e regras de negócio',
    items: ['Node.js', 'NestJS', 'Express'],
  },
  {
    id: 'dados',
    label: 'Dados',
    note: 'Persistência e cache',
    items: ['PostgreSQL', 'Redis', 'MySQL'],
  },
  {
    id: 'infra',
    label: 'Infraestrutura',
    note: 'Cloud e entrega',
    items: ['AWS', 'Docker'],
  },
  {
    id: 'integracoes',
    label: 'Integrações',
    note: 'Canais, hardware e observabilidade',
    items: ['WhatsApp API', 'Telegram API', 'RTSP', 'Mapbox', 'OpenTelemetry', 'Grafana'],
  },
];

/** Práticas de engenharia — o "como", separado do "com o quê". */
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
];

export const experiences: ExperienceItem[] = [
  {
    company: 'Encibra',
    role: 'Full Stack Developer',
    period: 'jun. 2025 — atual',
    shortPeriod: '2025 —',
    context:
      'Consultoria de engenharia com mais de 55 anos de atuação, com projetos em saneamento, transporte, energia e edificações.',
    summary:
      'Desenvolvimento de software para o setor de engenharia, com foco em serviços de backend sobre AWS.',
    // O primeiro bullet é a contribuição de maior peso — sai da lista e vira
    // o bloco de destaque, com o número que o comprova.
    bullets: [
      {
        text: 'Projetei um fluxo de upload global direto ao S3 via URLs pré-assinadas, adotado por mais de 10 módulos do sistema.',
      },
      {
        text: 'Integrei câmeras de monitoramento de obras via protocolo RTSP, estruturando o streaming de vídeo para acompanhamento remoto dos canteiros.',
      },
    ],
    metric: {
      value: '+90%',
      label:
        'de confiabilidade na entrega de notificações, com tratamento de falhas e sem disparos duplicados em picos de reprocessamento',
    },
    featured: {
      title: 'Microserviço de notificações multicanal',
      desc: 'Serviço sobre AWS SQS com WhatsApp, Telegram, e-mail e Discord. Fiquei responsável pelas integrações de WhatsApp e Telegram.',
    },
    stack: ['NestJS', 'AWS SQS', 'Amazon S3', 'Redis', 'RTSP'],
    current: true,
  },
  {
    company: 'Siscontroler',
    role: 'Full Stack Developer',
    period: 'dez. 2024 — maio 2025',
    shortPeriod: '2024 — 2025',
    context:
      'Plataformas de controle de acesso para escolas, hospitais e empresas.',
    summary:
      'APIs de controle de acesso e integração com equipamentos físicos de identificação.',
    bullets: [
      {
        text: 'APIs REST com Node.js, TypeScript e Express para a plataforma de controle de acesso.',
      },
      {
        text: 'Integração com catracas, leitores faciais e dispositivos biométricos.',
      },
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL'],
  },
  {
    company: 'PrinterStore',
    role: 'Full Stack Developer',
    period: 'dez. 2023 — nov. 2024',
    shortPeriod: '2023 — 2024',
    context: 'Locação de impressoras e equipamentos de TI para empresas.',
    summary:
      'Plataforma de gestão de ativos de locação, do cadastro ao chamado técnico.',
    bullets: [
      {
        text: 'Plataforma fullstack (Node.js + React) de gestão de ativos vinculados a contratos de locação.',
      },
      {
        text: 'Módulo de chamados técnicos com priorização, atribuição automática e monitoramento de SLA.',
      },
    ],
    stack: ['Node.js', 'React', 'MySQL'],
  },
];

/**
 * `repoUrl` e `demoUrl` continuam vazios de propósito: sem link público,
 * o botão não é renderizado. Um botão que não leva a lugar nenhum é pior
 * do que botão nenhum.
 */
export const projects: ProjectItem[] = [
  {
    id: 'gestor-financeiro',
    index: '01',
    name: 'Gestor financeiro pessoal com IA',
    pitch: 'Registrar um gasto deveria custar uma mensagem, não um formulário.',
    desc: 'Controle de gastos integrado ao Telegram: um agente de IA registra e categoriza transações a partir de mensagens de texto, sem exigir que o usuário abra um app. A prioridade é fricção baixa, não relatório completo.',
    highlights: [
      'Agente interpreta texto livre e extrai valor, categoria e data',
      'Sem interface própria: o Telegram é o cliente',
      'Decisão de produto: menos campos, mais uso recorrente',
    ],
    stack: ['NestJS', 'Telegram Bot API', 'PostgreSQL'],
  },
  {
    id: 'observabilidade-agentes',
    index: '02',
    name: 'Observabilidade para agentes de IA',
    pitch: 'Agente em produção sem métrica é conta que chega sem aviso.',
    desc: 'Dashboard de custo, latência e tracing de chamadas MCP, pensado para times que rodam agentes em produção e precisam justificar gasto de token e diagnosticar falhas rápido.',
    highlights: [
      'Tracing de chamadas MCP ponta a ponta',
      'Custo por token e latência por execução',
      'Painéis no Grafana sobre dados do OpenTelemetry',
    ],
    stack: ['Node.js', 'OpenTelemetry', 'Grafana'],
    image: '/uploads/observabilidade.webp',
    imageAlt:
      'Captura de tela do dashboard de observabilidade, com painéis de custo e latência de chamadas',
  },
];

export const education: EducationItem[] = [
  {
    course: 'Ciência da Computação',
    school: 'Universidade da Amazônia (UNAMA)',
    status: 'Em andamento',
    statusKind: 'active',
    period: '2025 — atual · 4º semestre',
    desc: 'Base em desenvolvimento de software, arquitetura de sistemas, algoritmos e engenharia de dados.',
    subjects: [
      'Programação Orientada a Objetos',
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
    status: 'Transferido',
    statusKind: 'past',
    period: '2023.2 — 2025',
    desc: 'Formação com base em ciências exatas, eletrônica, métodos quantitativos e projetos de engenharia.',
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
