# Portfólio — Daniel Harrison

**Uma apresentação profissional com atenção a acessibilidade, responsividade e interação.**

Site pessoal que organiza projetos, experiência, formação e formas de contato. Desenvolvido com **React 19**, **Vite** e **TypeScript**, com **pnpm**.
Sem framework de UI, sem Tailwind, sem biblioteca de componentes: o design
system é próprio e mora em `src/styles/` + CSS Modules.

## O que explorar

- Seções de projetos, experiência, formação e contato, com conteúdo centralizado em [portfolioData.ts](src/data/portfolioData.ts).
- Temas claro e escuro com preferência persistida e aplicação antes da primeira pintura.
- Menu mobile com comportamento de diálogo e suporte a teclado.
- CSS Modules e tokens semânticos para cores, tipografia, espaçamento e movimento.
- Verificações próprias de contraste, responsividade, sobreposição de controles e interações.

## Decisões técnicas

| Decisão | Por que ela importa | Código |
|---|---|---|
| Dados separados dos componentes | Atualiza a apresentação sem espalhar conteúdo pela interface | [Conteúdo](src/data/portfolioData.ts) |
| Tokens e CSS Modules | Centraliza decisões visuais e mantém estilos de componente com escopo próprio | [Tokens](src/styles/tokens.css) e [componentes](src/components) |
| Tema resolvido antes da pintura | Reduz a divergência entre a preferência salva e o primeiro render | [index.html](index.html) e [useTheme](src/hooks/useTheme.ts) |
| Movimento condicionado à preferência do usuário | A troca de tema e as animações respeitam `prefers-reduced-motion` | [Estilos base](src/styles/reset.css) e [transição](src/styles/theme-transition.css) |
| Checks além do build | Procura defeitos visuais e de interação que a checagem de tipos não detecta | [Scripts](scripts) |

## Como rodar

Requisitos: Node.js 24 e pnpm 10.11.1. Os checks que abrem navegador precisam de Chrome ou Edge em um dos caminhos reconhecidos pelos scripts.

```bash
git clone https://github.com/danielharrisonlf/portfolio.git
cd portfolio
pnpm install
pnpm dev                # servidor de desenvolvimento
pnpm build              # tsc + vite build
pnpm serve:dist         # serve o dist/ sem watcher
```

O Vite inicia o ambiente de desenvolvimento normalmente em `http://localhost:5173`. O servidor do build usa `http://localhost:4180`.

**Roteiro de demonstração:** explore o site em desktop e mobile, navegue pelo teclado, abra e feche o menu, alterne o tema e use as ações de contato. Depois, execute os checks abaixo para observar como essas interações são verificadas.

## Verificações automatizadas

Os scripts medem comportamento e apresentação que o `tsc` não verifica. O check
de contraste lê os tokens diretamente. Os checks que abrem o navegador precisam
de `pnpm build` antes e de `pnpm serve:dist` no ar.

```bash
pnpm build
pnpm serve:dist          # em outro terminal, sobe o dist/ na 4180

pnpm check               # roda as quatro verificações em sequência
pnpm check:contrast      # contraste WCAG de todos os pares de cor, nos 2 temas
pnpm check:responsive    # 13 viewports × 2 temas: transbordo, alvos de toque,
                         # hierarquia de títulos, estrutura
pnpm check:overlap       # 19 viewports × 2 temas × 25 posições de rolagem:
                         # algum controle fixo cobrindo outro controle?
pnpm check:interactions  # abre menu, troca tema, navega, dá ESC, copia
pnpm shots               # capturas em viewport exata
```

Cada um existe por causa de um defeito concreto que os outros não pegavam:

- **`check:overlap`** nasceu de um botão "voltar ao topo" que cobria o link
  "Currículo" do rodapé e engolia o clique em 9 larguras. Transbordo era
  zero, o layout estava correto, e o culpado estava *por cima*. A única
  verificação que pega isso é `elementFromPoint` no centro do alvo.
- **`check:interactions`** existe porque clique que não faz nada, estado
  que trava e erro de console não aparecem em captura de tela nem em
  medição de layout.
- **`check:responsive`** e **`shots`** falam com o Chrome pelo **DevTools
  Protocol**, não por `--window-size`. Isso não é preferência: o headless
  não abre janela com menos de ~500px, então um teste "a 320px" por
  `--window-size` mede 882px e passa sem ter testado nada.

O `try-palette.mjs` compara variantes de accent (veja `VARIANTS`) servindo
cópias do `dist/` com um bloco `:root` sobrescrito no fim do CSS. Foi assim
que a paleta âmbar foi escolhida em cima da página real, não numa amostra
de cor solta.

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

- Script para verificar pares de contraste nos dois temas (`check:contrast`). Essas medições apoiam a revisão de acessibilidade; não substituem uma auditoria completa.
- Anel de foco único, com cor alternativa dentro do canvas escuro.
- `prefers-reduced-motion` respeitado em todas as animações, inclusive o
  wipe de troca de tema.
- Menu mobile é um diálogo modal real: ESC, focus trap, rolagem travada,
  foco devolvido ao gatilho.
- Hierarquia de títulos sem saltos, verificada por script.
- Alvos de toque ≥ 30px medidos em 13 viewports.

## Próximos passos

A implementação também registra oportunidades de melhorar a apresentação:

1. **Screenshot do gestor financeiro.** O card usa um diagrama placeholder.
   Um print da conversa no Telegram vende melhor esse projeto.
2. **Links de repositório/demo.** `repoUrl` e `demoUrl` existem em
   `portfolioData.ts` e são renderizados quando preenchidos. Hoje estão
   vazios, e a seção diz isso explicitamente em vez de mostrar botão morto.
3. **Métricas em Siscontroler e PrinterStore.** Só a Encibra tem número
   comprovado (+90%).
4. **`og:image` dedicado.** Hoje reaproveita a foto quadrada; o ideal é um
   card 1200×630.
