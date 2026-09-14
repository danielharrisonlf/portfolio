# Portfólio — Daniel Harrison

Site pessoal em **React 19**, **Vite** e **TypeScript**, com **pnpm**.
Sem framework de UI, sem Tailwind, sem biblioteca de componentes: o design
system é próprio e mora em `src/styles/` + CSS Modules.

## Como rodar

```bash
pnpm install
pnpm dev                # servidor de desenvolvimento
pnpm build              # tsc + vite build
pnpm serve:dist         # serve o dist/ sem watcher
```

## Verificações automatizadas

Três scripts que rodam contra o build e medem o que o `tsc` não vê.
Precisam de `pnpm build` antes (o de responsividade também precisa do
`serve:dist` no ar).

```bash
pnpm check:contrast     # contraste WCAG de todos os pares de cor, nos 2 temas
pnpm check:responsive   # 13 viewports × 2 temas: transbordo, alvos de toque,
                        # hierarquia de títulos, estrutura
node scripts/screenshot.mjs [url] [pasta]   # capturas em viewport exata via CDP
```

`check:responsive` e `screenshot.mjs` falam com o Chrome pelo **DevTools
Protocol** em vez de usar `--window-size`. Isso não é preferência: o headless
não abre janela com menos de ~500px, então um teste "a 320px" por
`--window-size` mede 882px e passa sem ter testado nada. A viewport real vem
de `Emulation.setDeviceMetricsOverride`.

## Arquitetura

```
src/
  styles/                 design system
    tokens.css            cor, tipografia, espaço, raio, movimento
    reset.css             reset + foco + prefers-reduced-motion
    base.css              .container, .prose, .srOnly, .skipLink
    theme-transition.css  revelação circular na troca de tema
    index.css             entrada única
  components/
    ui/                   primitivos: Button, Icon, Section
    layout/               Header, MobileMenu, Footer
    sections/             Hero, Experience, Projects, Education, Contact
  hooks/                  useTheme, useActiveSection, useMediaQuery, …
  data/portfolioData.ts   FONTE ÚNICA de todo o conteúdo do site
  types/index.ts          contratos dos dados
  utils/                  clipboard, scroll
```

### Regras que o código segue

1. **Nada de texto hardcoded em componente.** Todo conteúdo vem de
   `portfolioData.ts`. Editar o portfólio é editar esse arquivo.
2. **Componente nunca referencia token primitivo.** Só a camada semântica
   (`--bg`, `--fg`, `--line`, `--accent`, `--canvas-*`). Trocar a identidade
   é mexer só em `tokens.css`.
3. **Estilo em CSS Module, não inline.** Foi o que eliminou os ~60
   `!important` que a versão anterior precisava para desfazer estilos inline
   no mobile.
4. **Ordem de import importa.** `main.tsx` importa os estilos globais antes
   do `App`, então regra de componente vence na cascata sem `!important`.
5. **Cor de ícone vem do texto.** Nenhum ícone tem cor fixa própria — cor
   arbitrária por ícone foi o que transformou a versão anterior num
   arco-íris sem significado.

### Ordem de camadas do CSS

```
tokens.css → reset.css → base.css → *.module.css
```

### Dois temas, um conjunto de tokens

Claro e escuro definem exatamente os mesmos tokens semânticos. O tema é
aplicado antes da primeira pintura por um script inline no `index.html`, e a
chave de `localStorage` (`dh_theme`) é a mesma usada por `useTheme`.

## Acessibilidade

- Contraste WCAG AA verificado por script nos dois temas (`check:contrast`).
- Anel de foco único, com cor alternativa dentro do canvas escuro.
- `prefers-reduced-motion` respeitado em todas as animações, inclusive o
  wipe de troca de tema.
- Menu mobile é um diálogo modal real: ESC, focus trap, rolagem travada,
  foco devolvido ao gatilho.
- Hierarquia de títulos sem saltos, verificada por script.
- Alvos de toque ≥ 30px medidos em 13 viewports.

## Pendências de conteúdo

Dependem de informação que só o Daniel tem — não foram inventadas:

1. **Screenshot do gestor financeiro.** O card usa um diagrama placeholder.
   Um print da conversa no Telegram vende melhor esse projeto.
2. **Links de repositório/demo.** `repoUrl` e `demoUrl` existem em
   `portfolioData.ts` e são renderizados quando preenchidos. Hoje estão
   vazios, e a seção diz isso explicitamente em vez de mostrar botão morto.
3. **Métricas em Siscontroler e PrinterStore.** Só a Encibra tem número
   comprovado (+90%).
4. **`og:image` dedicado.** Hoje reaproveita a foto quadrada; o ideal é um
   card 1200×630.
