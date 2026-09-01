# Relatório de revisão — Portfólio Daniel Harrison

**Branch:** `revisao-portfolio` (base preservada em `main`, commit `da3d2ee`)
**Data:** 01/09/2026

Revisão feita rodando o projeto de verdade (Vite + Chrome), em tema claro e escuro,
nos viewports 390px (mobile), 1440px e 1920px (desktop), com medições de contraste
WCAG e de geometria via DOM.

**Nota antes: 6.5/10 → nota depois: 8.5/10.**
O que ainda separa de 9+ depende de conteúdo que só você tem (screenshots reais,
links de repositório, métricas dos dois empregos anteriores) — está listado no
final, em *Pendências*.

---

## 1. Navegação

### Três listas que discordavam entre si
A navbar e o menu mobile tinham `Experiência, Projetos, Formação, Blog`; o dock
flutuante tinha `Início, Experiência, Projetos, Formação, Contato`. E **Blog era
um link morto** (`href: '#'`) para uma seção que não existe.

Agora `navItems` em `portfolioData.ts` é a **fonte única**: navbar, menu mobile e
dock consomem a mesma lista (o dock só acrescenta "Início" na frente). Blog saiu,
Contato entrou. Zero links mortos na página — verificado no DOM.

### Desktop ficava sem navegação nenhuma
`<nav>` era `position: relative` e o dock é escondido acima de 900px. Passado o
hero, não havia como navegar.

A navbar virou `position: sticky; top: 0`, com fundo translúcido, `backdrop-filter`
e uma borda inferior que só aparece depois que a página sai do topo
(`data-scrolled`). Confirmado: após rolar 1500px, a nav continua em `top: 0`.

> Detalhe técnico: `position: sticky` não funciona dentro de um container de
> rolagem, e `html/body/#root` tinham `overflow-x: hidden`, que cria um. Troquei
> por `overflow-x: clip`, que corta o transbordo horizontal sem criar scroll.

### Âncoras paravam embaixo da navbar
Adicionado `scroll-margin-top: calc(var(--nav-h) + 16px)` nas cinco seções e os
offsets de rolagem programática passaram de `-24` para `-80`.

---

## 2. Menu mobile (a "sidebar")

A forma estava boa — drawer superior, itens em serif numerados 01–04. A execução
tinha quatro furos, todos corrigidos:

| Problema | Correção |
|---|---|
| Dock (`z-index: 900`) ficava **aceso por cima** do menu (`200`) e do overlay (`199`) | Menu foi para `1100`/`1099` **e** o dock é desmontado enquanto o menu está aberto |
| Fundo rolava atrás do overlay | Trava de `overflow` no `body`, com compensação da largura da scrollbar para o layout não pular |
| Sem ESC e sem focus trap, apesar de `role="dialog" aria-modal="true"` | ESC fecha, Tab circula dentro do painel, foco vai para o botão de fechar ao abrir e volta ao gatilho ao sair |
| CTA "Currículo" era uma barra branca (`var(--fg)`) — o elemento mais gritante da tela não usava a cor da marca | Passou a usar `var(--accent-solid)` |

Validado no navegador: `body.style.overflow === 'hidden'` com o menu aberto, dock
ausente do DOM, foco no botão de fechar, ESC fechando e restaurando a rolagem.

---

## 3. Paleta

### O accent reprovava em acessibilidade
`--accent: #5b3a8a` estava definido em `:root` — **o mesmo valor nos dois temas**.
Sobre o card escuro, o nome da empresa media **2.04:1**. WCAG AA pede 4.5:1.

O accent agora é definido **por tema**, com três tokens:

```css
/* claro */  --accent: #5b3a8a;              --accent-solid: #5b3a8a;              --accent-contrast: #fff;
/* escuro */ --accent: oklch(80% 0.11 305);  --accent-solid: oklch(80% 0.11 305);  --accent-contrast: oklch(15% ...);
```

Preenchimento sólido leva texto branco no claro e texto escuro no lavanda do
escuro — os dois com folga.

**Contrastes medidos depois:**

| Elemento | Antes | Depois (escuro) | Depois (claro) |
|---|---|---|---|
| Nome da empresa | **2.04** ❌ | **9.17** ✅ | **7.04** ✅ |
| Bullets de experiência | 5.49 ✅ | 5.49 ✅ | 4.85 ✅ |
| Cargo (h3) | — | 15.30 ✅ | — |
| Botão "Currículo" | — | 10.18 ✅ | 8.69 ✅ |
| Badge "EM ANDAMENTO" | — | 10.07 ✅ | 4.95 ✅ |

### O arco-íris de ícones
Havia ~50 ícones com cor fixa. Os de marca (React, AWS, Docker…) fazem sentido —
são reconhecíveis. Mas os **ícones genéricos do Tabler** (conceitos como
"Arquitetura", "Webhooks", "Cálculo") tinham cores arbitrárias — rosa, ciano,
âmbar — que brigavam com o roxo da identidade sem significar nada.

**30 ícones** passaram a herdar `currentColor` (a cor do chip). Cor de marca ficou
só onde existe marca. De quebra resolveu dois sumiços no tema claro: `Express`
(`#9CA3AF`) e `C` (`#A8B9CC`), que eram quase invisíveis sobre fundo claro.

### Badges com o mesmo verde para significados opostos
"EM ANDAMENTO" e "TRANSFERIDO" saíam idênticos. Adicionei `statusKind`
(`'active' | 'past'`) ao tipo: verde só para em curso, neutro para encerrado.

O token `--ok` foi calibrado: no claro, `oklch(52%…)` media **3.66:1** (reprovava
para texto de 10px). Ajustado para `oklch(44%…)` → **4.95:1**.

---

## 4. Tipografia e layout

### Linhas de ~190 caracteres no desktop
Era o pior problema de leitura. Bullets ocupavam **1220px com fonte de 14px**.

Duas mudanças:
1. Token `--measure: 68ch` e classe `.measure` nos blocos de texto corrido.
2. Cards de experiência viraram **grid de duas colunas** (`.split-card`): período
   e empresa à esquerda (180px), conteúdo à direita. Aproveita a largura sem
   esticar a linha, e no mobile colapsa para uma coluna.
3. `max-width` das seções de leitura: 1400px → 1080px.

**Resultado medido: 1220px → 587px, de ~190 para 73 caracteres por linha** — dentro
da faixa confortável de 65–75.

### Hero com 40% de vazio
`minHeight: calc(100vh - 80px)` com conteúdo de ~500px deixava uma faixa morta que
lia como conteúdo faltando. Removido o min-height de viewport; a altura acompanha
o conteúdo. **Altura do hero no desktop: ~1100px → 460px.**

Também alinhei o `h2` de "Formação Acadêmica" (era 38px/600 enquanto os outros
eram 32px/500).

---

## 5. Conteúdo e escrita

### O bloco "Arquitetura & Práticas" estava se diluindo
Misturava três categorias sob um título só: competências (`DDD`, `System Design`),
**produtos que você usa** (`Claude`, `OpenAI`, `Codex`, `OpenCode`, `Orca IA`,
`Hermes Agente`, `Kimi K3`) e integrações (`Telegram API`, `Mapbox`).

Listar produto como se fosse skill lê como name-dropping e derruba a credibilidade
dos itens que são competência de verdade. **Os 7 nomes de produto saíram.** Ficaram
competências e integrações, e entrou `SDD`, que já aparecia na sua bio.

> Nota: `Kimi K3` também não existe publicamente — o modelo é o **K2**. Erro desse
> tipo é exatamente o que um entrevistador técnico nota.

### O print do projeto era do próprio portfólio
`proj-0` ("Gestor financeiro pessoal com IA") usava um screenshot **deste site** em
tema claro como imagem do projeto. Removido.

Para o card não ficar quebrado (o estado vazio antes mostrava só o texto "Imagem do
projeto"), criei um **placeholder desenhado**: gradiente radial na cor da marca com
a inicial do projeto em serif. Lê como intencional.

### Estrutura semântica
- Cargos, nomes de projeto e cursos viraram `<h3>` (eram `<div>`). Hierarquia agora
  é H1 → H2 → H3 corretamente aninhada.
- Seções viraram `<section aria-labelledby>`; cards viraram `<article>`.
- Contato passou para dentro do `<main>` (é alvo de navegação).
- **Rodapé criado** — a página terminava seca depois de "Vamos conversar". Agora
  tem © com ano dinâmico, stack e um "Voltar ao topo".

---

## 6. Acessibilidade e movimento

- **`prefers-reduced-motion` respeitado.** Antes só o toggle de tema respeitava; a
  esteira de 45s, o `circuit-breathe` e o `node-breathe` rodavam infinitamente sem
  saída. Agora a esteira vira uma **faixa de rolagem manual** (não empilha os 16
  chips nem estica o hero) e as animações do circuito param.
- **A esteira era lida duas vezes por leitores de tela.** A segunda metade existe
  só para o loop parecer contínuo — agora é `aria-hidden` e some sob reduced-motion.
- **Foco visível** padronizado (`:focus-visible` com outline no accent).
- `aria-current` no item ativo do dock, `aria-label` na navbar e no dock.
- Alt text da foto melhorado ("Foto de Daniel Harrison") e dos prints de projeto.

### Bug de scroll-spy
O dock marcava a seção **anterior** quando você chegava no fim da página, porque a
última seção nunca cruzava o limiar de 35% da viewport. Adicionada detecção de fim
de página. Verificado: no fim, "Contato" fica ativo.

### Bug latente no TechIcon
`norm.includes('so')` (para "Sistemas Operacionais") casa com qualquer rótulo que
contenha "so" — inclusive "websockets". Só não quebrou porque as checagens
anteriores pegavam antes. Trocado por comparação exata.

---

## 7. Peso e higiene do código

| Item | Antes | Depois |
|---|---|---|
| **`dist/`** | 2.1 MB | **608 KB** |
| Foto de perfil | 379 KB PNG (1254×1254, exibida a 90px) | **14 KB WebP** (360×360) + PNG 162KB de fallback |
| Print do projeto | 84 KB PNG | **22 KB WebP** |
| PNGs não usados | 9 arquivos (~470 KB) | removidos |
| `backback.png` duplicado | 2 cópias byte a byte idênticas | 1 |
| `Daniel Harrison.pdf` | duplicava o CV | removido |
| `icons.svg` | não referenciado | removido |
| `src/style.css` | 296 linhas, **nunca importado** | removido |
| Dependências | `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`, `lucide-react` — nenhuma usada, sem config | removidas |

> O `fallbackPhotoUrl` apontava para um arquivo **byte a byte idêntico** ao
> principal — o `onError` nunca serviria de nada. Agora o principal é WebP e o
> fallback é o PNG de verdade, para navegadores sem suporte.

### Tema definido em dois lugares
`useTheme` escrevia `data-theme` no `<html>` e o `App.tsx` repetia numa `div` — o
de dentro vencia a cascata. Ficou só no `<html>`.

Adicionado no `index.html` um script inline que aplica o tema **antes da primeira
pintura**, eliminando o flash de tema errado no carregamento.

---

## 8. SEO e compartilhamento

Não havia `meta description` nem nenhuma tag Open Graph — compartilhar o link no
LinkedIn ou WhatsApp gerava preview vazio.

Adicionados: `description`, `author`, `theme-color` (claro/escuro), 7 tags
Open Graph e 4 do Twitter Card.

---

## Verificação final

```
tsc --noEmit          sem erros
npm run build         ok, 43 módulos, 608 KB
console do navegador  sem erros
links mortos          0
imagens quebradas     0
contraste WCAG AA     todos os textos medidos passam nos dois temas
```

---

## Pendências — dependem de você

Isto eu não podia fazer sem inventar informação:

1. **Screenshot real do gestor financeiro.** O card usa placeholder. Coloque um
   print da conversa no Telegram em `/public/uploads` e aponte `image` em
   `portfolioData.ts` — é o print que vende esse produto.

2. **Links dos projetos.** Os campos `repoUrl` e `demoUrl` já existem e já são
   renderizados como botões quando preenchidos; deixei vazios porque não invento
   URL. Projeto sem link é alegação, não prova — é a primeira coisa que um
   recrutador técnico tenta clicar.

3. **Métricas em Siscontroler e PrinterStore.** A Encibra tem três bullets com
   número ("mais de 90%", "mais de 10 módulos"); as outras duas não têm nenhum.
   Dá a impressão de que você só teve resultado no emprego atual. Vale garimpar ao
   menos um número em cada.

4. **O print da observabilidade** é uma captura escura de terminal, pouco legível
   no card. Um dashboard real renderiza muito melhor.

5. **Só dois projetos.** Três ou quatro dariam mais lastro à seção.

6. **`og:image` com URL absoluta.** Ao publicar, troque os caminhos relativos no
   `index.html` pelo domínio completo e adicione `<meta property="og:url">` —
   LinkedIn e X exigem URL absoluta. Há um TODO no arquivo marcando isso. Vale
   também gerar um card 1200×630 dedicado, em vez de reaproveitar a foto quadrada.

7. **Confira o e-mail.** O portfólio usa `daniel.harrisonlf@gmail.com`. Não mexi,
   só sinalizo para você confirmar que é o endereço certo.

---

## Rodada 2 — correções após seu retorno

### Ícones da stack sumindo — era bug, você estava certo

Minha verificação na primeira rodada foi furada: contei os `<svg>` do grid
inteiro em vez de contar por chip, e concluí que estava tudo certo. Não estava.

**Causa raiz:** os SVGs do `react-icons` não trazem `flex-shrink: 0`. Dentro de um
chip flex cujo texto é `nowrap`, o ícone é o único item que pode ceder — e era
esmagado até **largura 0** nos três rótulos mais longos:

| Chip | Largura do ícone antes | Depois |
|---|---|---|
| TypeScript | **0px** | 15px |
| React Native | **0px** | 16px |
| PostgreSQL | **0px** | 15px |
| Node.js | 9.9px | 15px |
| NestJS | 11.6px | 15px |
| Docker | 13.1px | 15px |

Corrigido com um `iconStyle` base no `TechIcon` (`flexShrink: 0`), aplicado aos
**55 ícones** de uma vez.

**Problema real por trás disso:** o ícone estava servindo de válvula de escape
para um layout que não cabia. Com o ícone fixo, o *texto* passou a transbordar
("PostgreSQL", "React Native"). O grid de 3 colunas fixas é estreito demais no
mobile. Trocado por `repeat(auto-fit, minmax(128px, 1fr))`.

Verificado em 4 larguras:

| Viewport | Colunas | Texto transbordando | Ícones esmagados |
|---|---|---|---|
| 320px | 1 | nenhum | nenhum |
| 390px | 2 | nenhum | nenhum |
| 768px | 3 | nenhum | nenhum |
| 1440px | 3 | nenhum | nenhum |

### Ícones lavados no tema claro

Aproveitei para fechar o mesmo defeito que eu tinha deixado pela metade. As cores
oficiais das marcas são calibradas para fundo escuro; sobre o fundo claro várias
reprovavam o mínimo de **3:1** do WCAG 1.4.11 para elementos gráficos:

| Marca | Antes (claro) | Depois |
|---|---|---|
| React | **1.53** ❌ | 3.32 ✅ |
| WhatsApp | **1.87** ❌ | 3.37 ✅ |
| AWS | **2.02** ❌ | 3.23 ✅ |
| OpenCode | **2.39** ❌ | 3.38 ✅ |
| Telegram | **2.61** ❌ | 3.29 ✅ |
| Grafana | 2.90 ❌ | 3.25 ✅ |
| Claude | 2.95 ❌ | 3.30 ✅ |
| Docker | 2.98 ❌ | 3.33 ✅ |
| Node.js | 2.99 ❌ | 3.35 ✅ |
| C++ (no **escuro**) | **2.73** ❌ | 3.31 ✅ |

Viraram tokens `--brand-*` definidos por tema: mesmo matiz, luminosidade ajustada.
As marcas que já passavam nos dois temas (TypeScript, PostgreSQL, Redis, NestJS,
Java, Gmail, LinkedIn, MySQL, OpenTelemetry, Python) mantiveram o hex oficial.

**Resultado final: 25 ícones medidos, zero abaixo de 3:1 nos dois temas.**
Pior caso: AWS 3.23 no claro, PostgreSQL 4.06 no escuro.

### A esteira (situação revertida na rodada 3 — ver abaixo)

`prefers-reduced-motion: reduce` está **ligado no seu sistema** — confirmei no seu
próprio Chrome. A regra de acessibilidade que adicionei na rodada 1 desliga a
animação para quem tem essa preferência, então você nunca vê a esteira rodando.
Para todo mundo sem essa configuração, ela continua girando normalmente.

O que estava ruim era o *fallback*: uma faixa de rolagem horizontal cortada, que
lia como bug. Agora, sem animação, o bloco vira uma **grade completa com os 16
itens visíveis de uma vez** — sem rolagem, sem corte.

Como mudar, se quiser:
- **Ver a esteira animada na sua máquina:** desligue "reduzir movimento" no
  Windows (Configurações → Acessibilidade → Efeitos visuais → Efeitos de animação).
- **Animar para todo mundo, ignorando a preferência:** remova o bloco
  `.marquee-track { animation: none !important; ... }` de dentro do
  `@media (prefers-reduced-motion: reduce)` no `src/index.css`. Recomendo não
  fazer isso — respeitar a preferência é o comportamento correto, e a grade
  estática mostra mais informação de uma vez do que a esteira.

### "Vamos conversar" em tela cheia

A seção virou o fechamento que ela deveria ser:

- `min-height: calc(100svh - var(--nav-h))` com conteúdo centralizado — ocupa a
  tela inteira (medido: 575px de seção em viewport de 639px, exatamente o alvo).
- Título em `clamp(38px, 7vw, 76px)`: ganha presença no desktop sem estourar no
  mobile.
- Eyebrow "CONTATO" em mono, para ancorar a seção.
- **Hierarquia de ação clara:** o e-mail virou CTA sólido na cor da marca;
  LinkedIn e GitHub viraram secundários.
- O clique no e-mail fazia duas coisas ao mesmo tempo (abria o mailto *e*
  copiava). Separado: o botão principal abre o e-mail, um botão "Copiar" ao lado
  copia, com feedback de estado e anúncio via `aria-live` para leitores de tela.
- O `navigator.clipboard` agora tem tratamento de erro (falhava silencioso em
  contexto inseguro).

---

## Rodada 3 — esteira sempre ativa e dock redesenhado

### Esteira roda sempre, por decisão sua

Removida a exceção de `prefers-reduced-motion` **apenas para a esteira**. Ela agora
anima para todo mundo, inclusive para quem tem "reduzir movimento" ligado no
sistema.

Implementação: a regra global que congela animações passou a ser
`*:not(.marquee-track)`, e a esteira tem a animação reafirmada logo em seguida.
Sem o `:not()`, o `animation-duration: 0.01ms !important` a congelaria mesmo com
a regra específica depois.

```css
@media (prefers-reduced-motion: reduce) {
  *:not(.marquee-track), *::before, *::after { animation-duration: 0.01ms !important; ... }
  .marquee-track { animation: marqueeScroll 45s linear infinite !important; }
}
```

Verificado com `getAnimations()`: a animação existe como `CSSAnimation`, estado
`running`, **duração efetiva de 45000ms** — ou seja, não foi congelada. (O
`currentTime` não avança durante o teste porque a aba automatizada fica
`visibilityState: "hidden"`; animações não rodam em aba oculta.)

**O que continua respeitando `prefers-reduced-motion`:** as animações do circuito
no hero (`circuit-breathe`, `node-breathe`), as transições gerais e o scroll
suave. Só a esteira foi liberada. Se quiser liberar essas também, é remover o
resto do bloco.

### Dock redesenhado no estilo da referência

O dock inferior passou de pílulas horizontais (ícone + texto lado a lado) para o
formato da imagem que você mandou: **ícone em cima, rótulo em maiúsculas embaixo**.

| | Antes | Depois |
|---|---|---|
| Layout do item | ícone e texto lado a lado | ícone sobre o rótulo |
| Item ativo | pílula preenchida | ícone e texto na cor de destaque, sem preenchimento |
| Rótulo | 12px, escondido abaixo de 480px | mono 8.5px maiúsculo, **sempre visível** |
| Barra | pílula justa ao conteúdo | barra de largura fluida, cantos 14px, máx. 520px |
| Distribuição | conforme o texto | `flex: 1` — os 5 itens ocupam faixas iguais |

O rótulo deixou de ser escondido em telas pequenas porque agora ele faz parte do
desenho. Para caber, o tamanho cai em dois degraus (8px abaixo de 480px, 7px
abaixo de 360px).

Verificado em 5 larguras — nenhum rótulo cortado, nenhum overflow horizontal:

| Viewport | 320 | 360 | 390 | 480 | 768 |
|---|---|---|---|---|---|
| Largura da barra | 289 | 329 | 359 | 441 | 520 |
| Rótulos cortados | 0 | 0 | 0 | 0 | 0 |

Confirmado também que o conteúdo do rodapé não fica coberto pela barra (a folga
de 96px no `padding-bottom` do rodapé no mobile é maior que os 72px que a barra
ocupa) e que o item ativo no fim da página é "CONTATO".

**Duas coisas que mantive de propósito** — diga se prefere diferente:

1. **Os rótulos.** Sua referência dizia `HOME` e `SOBRE`; mantive `INÍCIO` e
   `FORMAÇÃO` para não divergirem da navbar e do título da seção
   ("Formação Acadêmica"). Trocar é editar `navItems` em `portfolioData.ts` —
   mas aí o menu e a navbar mudam junto, que é justamente o ponto da fonte única.
2. **A barra continua só no mobile/tablet** (até 900px). No desktop a navbar é
   fixa desde a rodada 1, então mostrar a barra também ali seriam duas navegações
   permanentes na tela ao mesmo tempo.

---

## Rodada 4 — stack em 3 colunas no mobile

O dock estava cobrindo o card "Arquitetura & Práticas" no mobile. Causa: o grid da
stack tinha caído para 2 colunas (5 linhas), empurrando a esteira para debaixo da
barra.

Voltou para **3 colunas fixas em todas as larguras**. O motivo de eu ter mudado
para 2 na rodada 2 era transbordo de texto — resolvido agora medindo os rótulos
reais e dimensionando o chip, em vez de reduzir as colunas.

**Larguras reais (canvas `measureText`, fonte Archivo 500):**

| Rótulo | 12.5px | 10.5px |
|---|---|---|
| React Native | 71.9px | **60.4px** |
| PostgreSQL | 69.2px | 58.2px |
| TypeScript | 61.2px | 51.4px |

Abaixo de 480px o chip encolhe (fonte 10.5px, padding 7/8px, ícone 13px, gap 5px)
e o card passa a ter 14px de padding lateral com gap de 8px no grid. Sobram ~68px
de texto por chip a 390px, contra os 60.4px necessários — cabe com folga.

Abaixo de 370px não existe largura física para três colunas legíveis, e aí sim o
grid cai para 2.

**Efeito medido a 390px:**

| | Antes | Depois |
|---|---|---|
| Colunas × linhas | 2 × 5 | **3 × 3** |
| Altura do card da stack | 209px | **135px** |
| Base do card de práticas | — | 706px |
| Topo do dock | 772px | 772px |
| Sobreposição | **o dock cobria a esteira** | **66px de folga** |

Verificado em 320 / 360 / 375 / 390 / 414 / 480px: nenhum rótulo cortado, nenhum
overflow horizontal. Adicionei também 96px de `padding-bottom` no hero em mobile,
para a barra não encostar no card mesmo em telas mais baixas.

---

## Rodada 5 — transição de tema

### Referências consultadas

- [theme-toggle.rdsx.dev](https://theme-toggle.rdsx.dev/) — galeria de variantes
  (círculo simples, círculo desfocado, pivô no canto, clip-path, gradiente SVG)
- [Full-page theme toggle animation with View Transitions API](https://akashhamirwasia.com/blog/full-page-theme-toggle-animation-with-view-transitions-api/)
- [Animated Dark Mode Toggle with View Transitions API in React](https://www.notanumber.in/blog/animated-dark-mode-toggle-with-view-transitions-api-in-react)
- [ViewTransition: ready — MDN](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/ready)

O ponto principal das referências: **`clip-path` corta em aresta viva e não
aceita gradiente nem blur**; para uma borda suave é preciso usar máscara.

### O que já existia e por que você não via

Já havia uma revelação circular com View Transitions, mas com dois problemas:

1. **Estava desligada para você.** O `useTheme` só usava View Transitions se
   `prefers-reduced-motion` estivesse desligado — e no seu Windows está ligado.
   Mesmo caso da esteira. O gate foi removido.
2. **O snapshot podia sair errado.** A troca era feita só via `setState`. O React
   agrupa atualizações, então a View Transition podia capturar o estado "depois"
   ainda com o tema antigo. Agora o atributo `data-theme` é trocado de forma
   síncrona dentro do callback.

### O efeito novo

`clip-path` saiu, entrou máscara com gradiente radial:

```css
::view-transition-new(root) {
  mask-image: radial-gradient(circle closest-side, #000 0 88%, transparent 100%);
  animation: themeReveal 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```

O `mask-size` e o `mask-position` são animados **juntos**: a posição recua metade
do tamanho a cada quadro, o que mantém o centro do círculo cravado no botão
enquanto ele cresce (a máscara é ancorada pelo canto, não pelo centro).

Geometria conferida na tela, com o estado de 50% aplicado estaticamente:

| | Valor |
|---|---|
| Raio até o canto mais distante | 1459px |
| Caixa da máscara (`--tt-size`) | 4087px (raio × 2.8) |
| Centro em 50% da animação | (1300, 32) — exatamente o ponto de origem |
| Raio sólido no fim | 1798px, contra 1459px necessários |
| Largura do degradê | 245px |

O primeiro valor testado (sólido até 80%) dava um degradê de 410px — 26% da
largura da tela, tão suave que o círculo perdia a forma. 88% dá 245px: ainda
macio, mas lê como círculo.

### Dois defeitos encontrados durante o teste

1. **Origem errada no teclado.** O código usava `event.clientX/clientY`. Ativação
   por teclado (Enter/Espaço) dispara um clique com coordenadas **zero**, então o
   círculo nasceria no canto superior esquerdo em vez do botão. Passou a usar o
   retângulo do próprio botão (`currentTarget`), que vale para mouse, toque e
   teclado.
2. **Promise rejeitada sem tratamento.** Quando a transição é abortada — aba em
   segundo plano, ou dois cliques rápidos — `ready` e `finished` rejeitam com
   `InvalidStateError` e viravam `Uncaught (in promise)` no console. Ambas
   ganharam `catch`. A troca de tema em si nunca dependeu disso: o callback roda
   mesmo com a transição abortada (verificado).

### Limite da verificação

Não consegui assistir à animação rodando: a aba controlada por automação fica
sempre com `visibilityState: "hidden"`, e a View Transitions API se recusa a
animar nesse estado (`InvalidStateError`). Verifiquei o que dava para verificar
sem isso — regras e keyframes presentes no CSS, geometria da máscara renderizada
na tela, origem correta, e console limpo depois de trocas simples e de cliques
duplos. **Os quadros em movimento, só você vendo no navegador.**

### Nota sobre `prefers-reduced-motion`

Assim como a esteira, essa animação roda mesmo para quem pediu menos movimento
(há uma regra explícita no bloco `@media`). Um wipe de tela inteira é
justamente o tipo de efeito que incomoda quem tem sensibilidade a movimento —
se um dia quiser respeitar a preferência, basta remover essa regra do bloco:
o tema continua trocando, só sem animação.

---

## Débito técnico que ficou

Não mexi por ser refatoração grande e fora do escopo de uma revisão visual:

**Tudo é estilo inline.** Por isso o `index.css` precisa de ~60 `!important` para
desfazer estilos inline no mobile. Funciona hoje, mas a próxima mudança de layout
vai doer. Se um dia for reescrever a camada de estilo, CSS Modules ou Tailwind
(que já estava no `package.json`, sem nunca ter sido usado) resolveria — e a maior
parte do `!important` sumiria junto.
