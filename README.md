# Portfólio — Daniel Harrison

**Uma apresentação profissional com atenção a acessibilidade, responsividade e interação.**

Site pessoal que organiza projetos, experiência, formação e formas de contato. Desenvolvido com **React 19**, **Vite** e **TypeScript**, com **pnpm**. Sem framework de UI e sem biblioteca de componentes: os tokens de tema vivem em `src/index.css` e os componentes carregam seus próprios estilos.

O visual é o original do projeto: painéis sobre fundo neutro, circuitos roxos ligando os blocos do hero, nome em Newsreader, stack com ícones de marca e esteira contínua de práticas.

## O que explorar

- Cinco projetos reais — WhatsApp Control Center, ClinicFlow, Mapbox Vision, PC Remote (Android nativo) e Fio — com capturas reais da interface, visualizador em tela cheia e links para os repositórios públicos.
- Temas claro e escuro com preferência persistida, revelação circular a partir do ponto clicado e respeito a `prefers-reduced-motion`.
- Menu mobile com comportamento de diálogo real: ESC, focus trap, rolagem travada e foco devolvido ao gatilho.
- Conteúdo centralizado em [portfolioData.ts](src/data/portfolioData.ts), separado dos componentes.
- Verificações próprias de contraste, responsividade, sobreposição de controles e interações.

## Decisões técnicas

| Decisão | Por que ela importa | Código |
|---|---|---|
| Dados separados dos componentes | Atualiza a apresentação sem espalhar conteúdo pela interface | [Conteúdo](src/data/portfolioData.ts) |
| Tokens por tema em um único CSS | Claro e escuro definem os mesmos tokens semânticos; a troca é um atributo no `<html>` | [index.css](src/index.css) e [useTheme](src/hooks/useTheme.ts) |
| Tema resolvido antes da pintura | Reduz a divergência entre a preferência salva e o primeiro render | [index.html](index.html) |
| Capturas reais nos projetos | Cada card mostra a interface verdadeira do repositório, não um mockup | [Fontes e proveniência](docs/portfolio-sources.md) |
| Checks além do build | Procuram defeitos visuais e de interação que a checagem de tipos não detecta | [Scripts](scripts) |

## Como rodar

Requisitos: Node.js 22+ e pnpm 10.11.1. Os checks que abrem navegador precisam de Chrome ou Edge em um dos caminhos reconhecidos pelos scripts.

```bash
git clone https://github.com/danielharrisonlf/portfolio.git
cd portfolio
pnpm install
pnpm dev                # servidor de desenvolvimento
pnpm build              # tsc + vite build
pnpm serve:dist         # serve o dist/ em http://127.0.0.1:4180
```

**Roteiro de demonstração:** explore o site em desktop e mobile, navegue pelo teclado, abra e feche o menu, alterne o tema, amplie as capturas dos projetos e use as ações de contato. Depois, execute os checks abaixo para observar como essas interações são verificadas.

## Verificações automatizadas

Os scripts medem comportamento e apresentação que o `tsc` não verifica. O check de contraste lê os tokens diretamente; os demais precisam de `pnpm build` antes e de `pnpm serve:dist` no ar.

```bash
pnpm build
pnpm serve:dist          # em outro terminal, sobe o dist/ na 4180

pnpm check               # roda as quatro verificações em sequência
pnpm check:contrast      # contraste WCAG dos pares de cor de src/index.css, nos 2 temas
pnpm check:responsive    # 13 viewports × 2 temas: transbordo, alvos de toque e estrutura
pnpm check:overlap       # viewports × temas × posições de rolagem: controle fixo cobrindo outro?
pnpm check:interactions  # âncoras, tema e persistência, visualizador (Esc e retorno de foco),
                         # menu mobile (trava de rolagem, Esc, breakpoint) e cópia de e-mail
pnpm shots               # capturas em todas as larguras para inspeção visual
```

## Estrutura

- `src/components/`: hero, circuitos, navegação, seções e visualizador de imagem.
- `src/index.css`: tokens por tema, estilos responsivos e animações.
- `src/hooks/`: tema, revelação de seções, progresso de rolagem e geometria dos circuitos.
- `src/utils/smoothScroll.ts`: navegação com compensação da navbar e movimento reduzido.
- `docs/portfolio-sources.md`: fontes verificadas dos projetos e proveniência das capturas.

## Acessibilidade

- Pares de contraste medidos nos dois temas (`pnpm check:contrast`); as medições apoiam a revisão, não substituem uma auditoria completa.
- Anel de foco visível e consistente para navegação por teclado.
- `prefers-reduced-motion` respeitado nas animações.
- Menu mobile e visualizador de imagem devolvem o foco ao elemento que os abriu.
- Alvos de toque com no mínimo ~44px de área efetiva, medidos em 13 viewports.
- Hierarquia de títulos sem saltos, verificada por script.
