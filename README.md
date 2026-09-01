# Portfolio — Daniel Harrison

Recriação fiel em **React 19**, **Vite**, **TypeScript**, **Lucide Icons** e **pnpm**, seguindo padrões modernos e componentização limpa.

## 🚀 Tecnologias e Recursos

- **Vite + React 19 + TypeScript**: Setup moderno, rápido e com tipagem estrita.
- **Gerenciador de Pacotes**: **pnpm**.
- **Identidade Visual Fiel**:
  - Paleta de cores em **OKLCH** com temas Claro (*Light*) e Escuro (*Dark*).
  - Transição de tema suave com suporte à **View Transitions API**.
  - Tipografia: *Newsreader* (serif), *Archivo* (sans-serif) e *IBM Plex Mono* (monospace).
  - Textura sutil de ruído fractal via SVG.
- **Gráfico de Circuitos Interativo (Hero Section)**:
  - Traçado de linhas em zigzag com efeito *glow* e animação *bolt flicker*.
  - Rastreamento do cursor com partícula de faísca interativa (*spark*).
  - Cálculo dinâmico das conexões baseado em `ResizeObserver` e coordenadas dos cards.
- **Animações e Efeitos**:
  - Barra de progresso de scroll fixa no topo.
  - Indicador deslizante sob os links do menu (*sliding nav highlight*).
  - Efeito de sublinhado animado (`.link-u`).
  - Efeitos de elevação (*lift*), sombra brilhante e borda em destaque ao passar o mouse.
  - Animação de revelação de seções conforme o scroll (*IntersectionObserver*).
  - Marquee contínuo com scroll infinito para a Stack em telas móveis.
  - Menu Drawer mobile com animação escalonada (*staggered delay*).
- **Acessibilidade e Boas Práticas**:
  - Componentes modulares e desacoplados (`src/components/`).
  - Custom hooks dedicados (`useTheme`, `useScrollProgress`, `useIntersectionReveal`, `useHeroGraph`).
  - Dados e constantes organizados em `src/data/portfolioData.ts` e tipos em `src/types/index.ts`.

## 📦 Como Rodar o Projeto com PNPM

```bash
# Instalar dependências
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm dev

# Gerar build de produção
pnpm build

# Visualizar o build de produção
pnpm preview
```
