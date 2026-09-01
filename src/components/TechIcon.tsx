import React from 'react';
import {
  SiTypescript,
  SiNodedotjs,
  SiNestjs,
  SiReact,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiExpress,
  SiMysql,
  SiTelegram,
  SiOpentelemetry,
  SiGrafana,
  SiAnthropic,
  SiCplusplus,
  SiC,
  SiPython,
  SiGmail,
  SiWhatsapp,
  SiMapbox,
  SiOpencode,
} from 'react-icons/si';
import {
  FaAws,
  FaGithub,
  FaLinkedin,
  FaJava,
} from 'react-icons/fa6';
import {
  TbBroadcast,
  TbHierarchy2,
  TbLayersIntersect,
  TbCpu,
  TbPlugConnected,
  TbWebhook,
  TbArrowsExchange,
  TbBoxMultiple,
  TbDatabase,
  TbCodeDots,
  TbNetwork,
  TbTerminal2,
  TbMathFunction,
  TbAtom,
  TbCircuitResistor,
  TbCompass,
  TbEye,
  TbCode,
  TbPuzzle,
  TbBrandReactNative,
  TbRobot,
  TbHierarchy3,
  TbWand,
  TbBrain,
  TbSparkles,
} from 'react-icons/tb';

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Vector SVG OpenAI Flower
const OpenAILogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 15, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ color: '#10A37F', flexShrink: 0, ...style }}
  >
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l2.02-1.163a.08.08 0 0 1 .073 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667z" />
  </svg>
);

export const TechIcon: React.FC<TechIconProps> = ({ name, size = 15, className, style }) => {
  const norm = name.trim().toLowerCase();

  // flexShrink: 0 e obrigatorio — sem ele o icone e esmagado a 0px dentro
  // dos chips (o texto e nowrap, entao so o SVG cede).
  const iconStyle: React.CSSProperties = { flexShrink: 0, ...style };

  // TypeScript
  if (norm.includes('typescript') || norm === 'ts') {
    return <SiTypescript size={size} color="#3178C6" className={className} style={iconStyle} />;
  }
  // React Native
  if (norm.includes('native')) {
    return <TbBrandReactNative size={size + 1} className={className} style={iconStyle} />;
  }
  // React
  if (norm.includes('react')) {
    return <SiReact size={size} color="var(--brand-react)" className={className} style={iconStyle} />;
  }
  // Node
  if (norm.includes('node') || norm === 'node js' || norm === 'node.js') {
    return <SiNodedotjs size={size} color="var(--brand-node)" className={className} style={iconStyle} />;
  }
  // NestJS
  if (norm.includes('nest') || norm === 'nestjs') {
    return <SiNestjs size={size} color="#E0234E" className={className} style={iconStyle} />;
  }
  // AWS / Amazon Web Services / SQS / S3
  if (norm.includes('aws') || norm.includes('amazon')) {
    return <FaAws size={size + 1} color="var(--brand-aws)" className={className} style={iconStyle} />;
  }
  // PostgreSQL
  if (norm.includes('postgres') || norm.includes('postgresql')) {
    return <SiPostgresql size={size} color="#4169E1" className={className} style={iconStyle} />;
  }
  // Redis
  if (norm.includes('redis')) {
    return <SiRedis size={size} color="#DC382D" className={className} style={iconStyle} />;
  }
  // Docker
  if (norm.includes('docker')) {
    return <SiDocker size={size} color="var(--brand-docker)" className={className} style={iconStyle} />;
  }
  // Express
  if (norm.includes('express')) {
    return <SiExpress size={size} className={className} style={iconStyle} />;
  }
  // MySQL
  if (norm.includes('mysql')) {
    return <SiMysql size={size} color="#4479A1" className={className} style={iconStyle} />;
  }

  // --- AI, AGENTS & ECOSYSTEM ---
  // MCP / MCPs
  if (norm.includes('mcp')) {
    return <TbCpu size={size} className={className} style={iconStyle} />;
  }
  // Subagentes
  if (norm.includes('subagente')) {
    return <TbHierarchy3 size={size} className={className} style={iconStyle} />;
  }
  // Hermes Agente
  if (norm.includes('hermes')) {
    return <TbRobot size={size} className={className} style={iconStyle} />;
  }
  // Agentes / Agente
  if (norm.includes('agente')) {
    return <TbRobot size={size} className={className} style={iconStyle} />;
  }
  // Skills / Tools
  if (norm.includes('skill')) {
    return <TbWand size={size} className={className} style={iconStyle} />;
  }
  // Claude / Anthropic
  if (norm.includes('claude') || norm.includes('anthropic')) {
    return <SiAnthropic size={size} color="var(--brand-claude)" className={className} style={iconStyle} />;
  }
  // OpenAI
  if (norm.includes('openai') || norm.includes('chatgpt')) {
    return <OpenAILogo size={size} style={iconStyle} />;
  }
  // Codex
  if (norm.includes('codex')) {
    return <TbCode size={size} className={className} style={iconStyle} />;
  }
  // Kimi K3 / Kimi
  if (norm.includes('kimi')) {
    return <TbBrain size={size} className={className} style={iconStyle} />;
  }
  // OpenCode
  if (norm.includes('opencode')) {
    return <SiOpencode size={size} color="var(--brand-opencode)" className={className} style={iconStyle} />;
  }
  // Orca IA / Orca
  if (norm.includes('orca')) {
    return <TbSparkles size={size} className={className} style={iconStyle} />;
  }

  // --- MESSAGING & MAPS APIS ---
  // WhatsApp / WhatsApp API
  if (norm.includes('whatsapp')) {
    return <SiWhatsapp size={size} color="var(--brand-whatsapp)" className={className} style={iconStyle} />;
  }
  // Telegram / Telegram API
  if (norm.includes('telegram')) {
    return <SiTelegram size={size} color="var(--brand-telegram)" className={className} style={iconStyle} />;
  }
  // Mapbox
  if (norm.includes('mapbox')) {
    return <SiMapbox size={size} color="#3178C6" className={className} style={iconStyle} />;
  }

  // OpenTelemetry
  if (norm.includes('opentelemetry') || norm.includes('otel')) {
    return <SiOpentelemetry size={size} color="#4958CA" className={className} style={iconStyle} />;
  }
  // Grafana
  if (norm.includes('grafana')) {
    return <SiGrafana size={size} color="var(--brand-grafana)" className={className} style={iconStyle} />;
  }
  // RTSP / Streaming
  if (norm.includes('rtsp') || norm.includes('stream') || norm.includes('vídeo')) {
    return <TbBroadcast size={size} className={className} style={iconStyle} />;
  }
  // C++
  if (norm === 'c++' || norm.includes('c++')) {
    return <SiCplusplus size={size} color="var(--brand-cpp)" className={className} style={iconStyle} />;
  }
  // Java
  if (norm === 'java' || norm.includes('java')) {
    return <FaJava size={size} color="#EA2D2E" className={className} style={iconStyle} />;
  }
  // C
  if (norm === 'c') {
    return <SiC size={size} className={className} style={iconStyle} />;
  }
  // Python
  if (norm.includes('python')) {
    return <SiPython size={size} color="#3776AB" className={className} style={iconStyle} />;
  }
  // GitHub
  if (norm.includes('github')) {
    return <FaGithub size={size} className={className} style={iconStyle} />;
  }
  // LinkedIn
  if (norm.includes('linkedin')) {
    return <FaLinkedin size={size} color="#0A66C2" className={className} style={iconStyle} />;
  }
  // Gmail / Email
  if (norm.includes('gmail') || norm.includes('email') || norm.includes('mail')) {
    return <SiGmail size={size} color="#EA4335" className={className} style={iconStyle} />;
  }

  // --- ARCHITECTURE & FOUNDATIONS ---
  // Arquitetura
  if (norm.includes('arquitetura') || norm.includes('architecture')) {
    return <TbHierarchy2 size={size} className={className} style={iconStyle} />;
  }
  // DDD
  if (norm.includes('ddd') || norm.includes('domain')) {
    return <TbLayersIntersect size={size} className={className} style={iconStyle} />;
  }
  // Design Patterns
  if (norm.includes('pattern') || norm.includes('design pattern')) {
    return <TbPuzzle size={size} className={className} style={iconStyle} />;
  }
  // POO / OOP
  if (norm.includes('poo') || norm.includes('orientada a objetos')) {
    return <TbCode size={size} className={className} style={iconStyle} />;
  }
  // System Design
  if (norm.includes('system design')) {
    return <TbCpu size={size} className={className} style={iconStyle} />;
  }
  // Integrações
  if (norm.includes('integraç') || norm.includes('integrac')) {
    return <TbPlugConnected size={size} className={className} style={iconStyle} />;
  }
  // Webhooks
  if (norm.includes('webhook')) {
    return <TbWebhook size={size} className={className} style={iconStyle} />;
  }
  // Websockets
  if (norm.includes('websocket')) {
    return <TbArrowsExchange size={size} className={className} style={iconStyle} />;
  }
  // Microsserviços
  if (norm.includes('microsservi') || norm.includes('microservice')) {
    return <TbBoxMultiple size={size} className={className} style={iconStyle} />;
  }
  // Banco de Dados
  if (norm.includes('banco de dados') || norm.includes('database')) {
    return <TbDatabase size={size} className={className} style={iconStyle} />;
  }
  // Engenharia de Software
  if (norm.includes('engenharia de software')) {
    return <TbCodeDots size={size} className={className} style={iconStyle} />;
  }
  // Redes
  if (norm.includes('redes')) {
    return <TbNetwork size={size} className={className} style={iconStyle} />;
  }
  // Sistemas Operacionais
  if (norm.includes('sistemas operacionais') || norm === 'so') {
    return <TbTerminal2 size={size} className={className} style={iconStyle} />;
  }
  // Cálculo
  if (norm.includes('cálculo') || norm.includes('calculo')) {
    return <TbMathFunction size={size} className={className} style={iconStyle} />;
  }
  // Física
  if (norm.includes('física') || norm.includes('fisica')) {
    return <TbAtom size={size} className={className} style={iconStyle} />;
  }
  // Eletrônica
  if (norm.includes('eletrônica') || norm.includes('eletronica')) {
    return <TbCircuitResistor size={size} className={className} style={iconStyle} />;
  }
  // Projetos de Engenharia
  if (norm.includes('projetos de engenharia')) {
    return <TbCompass size={size} className={className} style={iconStyle} />;
  }
  // Visão Computacional
  if (norm.includes('visão') || norm.includes('visao')) {
    return <TbEye size={size} className={className} style={iconStyle} />;
  }

  // SDD / spec-driven development
  if (norm === 'sdd' || norm.includes('spec-driven')) {
    return <TbCodeDots size={size} className={className} style={iconStyle} />;
  }

  // Default — herda a cor do chip, como os demais ícones genéricos
  return <TbCode size={size} className={className} style={iconStyle} />;
};
