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

### A esteira: não sumiu, está desligada pelo seu Windows

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

## Débito técnico que ficou

Não mexi por ser refatoração grande e fora do escopo de uma revisão visual:

**Tudo é estilo inline.** Por isso o `index.css` precisa de ~60 `!important` para
desfazer estilos inline no mobile. Funciona hoje, mas a próxima mudança de layout
vai doer. Se um dia for reescrever a camada de estilo, CSS Modules ou Tailwind
(que já estava no `package.json`, sem nunca ter sido usado) resolveria — e a maior
parte do `!important` sumiria junto.
