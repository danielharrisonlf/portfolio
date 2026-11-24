# Fontes da atualização do portfólio

Workspace: `C:/Users/daniellima/Documents/port`.
Verificado em 20/10/2026 por leitura dos repositórios via GitHub e GitHub CLI.

- [WhatsApp Control Center](https://github.com/danielharrisonlf/whatsapp-control-center/blob/main/README.md): contas, números, templates com prévia, mensagens, webhooks, RBAC por organização, contratos tipados e criptografia de credenciais.
- [PC Remote Android](https://github.com/danielharrisonlf/pc-remote-android/blob/main/README.md): cliente Kotlin com Android Views; touchpad, teclado, apresentações, mídia, arquivos, clipboard, múltiplos PCs e atualizações. Companion desktop em Rust/Tauri e conexão pela LAN com TLS. A apresentação descreve o conjunto Android + desktop; Rust/Tauri pertencem ao companion.
- [Fio / Linkanban](https://github.com/danielharrisonlf/linkanban/blob/main/README.md): Kanban de candidaturas, empresas, vagas, follow-ups, resumo, API ASP.NET Core com Dapper/PostgreSQL e CLI em Go.
- Encibra: `encibralabs/suporte-platform`, README e árvore de código da branch `main`, incluindo domínio de chamados, schema Prisma e migrações de prazos e Jira. Confirmam o portal do cliente, gestão de chamados por projeto, fila, prazos, indicadores e escalonamento para Jira. A autoria foi informada pelo usuário. O repositório é privado; seu código e credenciais não foram incorporados ao site.
- Perfil correto confirmado na conta autenticada e nos repositórios: [danielharrisonlf](https://github.com/danielharrisonlf).

Os projetos fictícios foram substituídos pelos três repositórios verificados. As novas descrições não acrescentam métricas de uso, disponibilidade pública de demos ou alegações de implantação em produção.

## Direção visual aceita

O usuário pediu a manutenção do visual da captura fornecida: painéis escuros, acentos roxos, conexões entre os blocos, nome em Newsreader, ícones de marca e esteira de práticas. A implementação original foi identificada no commit `58cb1d3` (`revisao-portfolio`) e restaurada como conjunto, incluindo o schema original dos dados e a dependência `react-icons`. As descrições dos projetos e a contribuição na Encibra foram adaptadas a esse schema.

A reformulação com fonte Geist, entradas numeradas e colunas de arquitetura foi descartada. Arquivos foram preservados em backup local dentro de `tmp/` antes da restauração.

Semantica não estava disponível nesta sessão. As referências foram registradas neste arquivo; não houve gravação de memória nesse serviço.

## Validação da reformulação descartada (histórico)

- `pnpm build`: TypeScript e build de produção aprovados.
- Contraste: aprovado nos dois temas. O script agora aceita arquivos CRLF do Windows.
- Responsividade: 13 larguras nos dois temas aprovadas.
- Sobreposição: 19 larguras × 2 temas × 25 posições de rolagem aprovadas.
- Interações: menu, Escape, tema, navegação e feedback de cópia aprovados. O Chrome headless negou a área de transferência; foi validado o aviso de falha, não a cópia no sistema operacional.
- Checagem adicional via CDP: projetos em uma coluna a 320, 390 e 900 px, três URLs de repositório corretas, contribuição Vision 360 presente e marcador de seção correto em desktop e mobile.
- Revisão independente do código e inspeção visual das capturas em ambos os temas sem problemas materiais.

Evidências locais: `output/portfolio-reviewed/` e `output/portfolio-validation.md`.
Essas evidências descrevem a reformulação descartada; não validam a implementação original restaurada. A nova verificação será registrada em `output/portfolio-restored-validation.md` e as capturas em `output/portfolio-restored/`. Alterações preparadas no workspace; nenhuma publicação externa foi feita.

## Validação da versão original restaurada

- Build de produção e TypeScript aprovados após restaurar o código e adaptar os dados.
- CSS, fontes, circuitos, cálculo da geometria e composição dos projetos conferidos diretamente com `58cb1d3`. O desenho original foi preservado.
- Inspeção independente no navegador em 320, 390, 768, 1440 e 1872 px, nos dois temas: sem transbordo horizontal ou controles fora da tela. O dock não cobriu controles nas posições verificadas.
- Três repositórios corretos na interface e texto da Central de Suporte Vision 360 confirmado na experiência.
- Menu, Escape, navegação e persistência de tema verificados. A cópia de e-mail confirmou sucesso com permissão concedida e feedback de falha com permissão negada.
- Correções discretas: respeito a movimento reduzido, offset da navbar, cancelamento de rolagens concorrentes, Ctrl/Cmd + clique, fallback da foto, armazenamento de tema bloqueado e retorno da cópia.
- O teste encontrou menu e rolagem travados ao passar de mobile para desktop com o menu aberto. Foi adicionada a escuta do breakpoint para fechar o menu e liberar a rolagem. A repetição no build final confirmou diálogo removido, rolagem liberada e navegação desktop visível.

Relatório atual: `output/portfolio-restored-validation.md`. Capturas: `output/portfolio-restored/`. A revisão independente do código aceitou a restauração e a correção do menu.

## Atualização de 30/10/2026 — ClinicFlow e Mapbox Vision

Dois projetos reais adicionados, conferidos por leitura dos repositórios públicos:

- [ClinicFlow](https://github.com/danielharrisonlf/clinicflow/blob/main/README.md): agenda com verificação de disponibilidade, ciclo da consulta com máquina de estados isolada, sala de espera, documentos com adapter de armazenamento (disco/S3) e tarefas de retorno. Monorepo pnpm + Turborepo com NestJS 11, Prisma 6, React 19 e Tailwind.
- [Mapbox Vision](https://github.com/danielharrisonlf/mapbox/blob/main/README.md): mapa React + Mapbox GL, consultas espaciais em PostGIS (`ST_Covers`, `ST_Intersects`, `ST_Intersection`), GeoJSON como contrato, cliente HTTP do IBGE e seed de demonstração com 90 estações.

Imagens reais, não geradas por IA:

- `clinicflow-painel.webp`: captura de marketing existente do frontend real, copiada de `C:/Users/daniellima/Documents/backend/apps/web/public/marketing/painel.webp` (clone local do clinicflow). Pacientes e clínica exibidos são dados de demonstração do próprio projeto.
- `mapbox-vision.webp`: captura feita nesta sessão com o app rodando localmente (`docker compose` + seed `db:seed:geo` + `pnpm dev`), viewport 1600×1000, redimensionada a 1440 px. A base exibida é a massa de demonstração do seed. Original em `output/mapbox-capture/mapbox-raw.png`.

Ícones adicionados ao TechIcon para as novas stacks: PostGIS, Prisma, TanStack Query, Tailwind, Turborepo e TypeORM.

## Imagens dos projetos

Capturas reais da interface, adicionadas em `public/uploads/projects/`, mantendo o layout original dos cards. As imagens podem ser abertas em tamanho maior.

- `whatsapp-control-center.jpg`: captura do frontend real existente em `C:/Users/daniellima/Downloads/whatsapp api/apps/www/dist`, página do editor de templates, com prévia WhatsApp. Os GETs foram reproduzidos a partir das respostas sanitizadas da suíte E2E local (`output/pdf/get-endpoints-test-evidence.json` desse projeto); organização e usuário de demonstração. Nenhum envio à Meta foi feito. A captura é reproduzível pelo helper local `tmp/capture-whatsapp-project.mjs`.
- `fio-quadro.png`: captura existente do quadro real em `C:/Users/daniellima/code/projetos/linkanban/.agent/shots/desktop-quadro.png`. Os nomes de empresas exibidos fazem parte dos dados de teste em `tests/data/seed-data.ts` do projeto.
- `pc-remote-touchpad.webp`: captura real do Android Kotlin 0.6.6, copiada de `pc-remote-landing-v2/public/screenshots/`. A proveniência e dimensões estão no `sources.json` e no script `prepare-screenshots.mjs` desse repositório. As capturas adicionais de mídia e deck foram retiradas a pedido do usuário; ficou uma única tela do app.

As imagens não foram geradas por IA nem reconstruídas como interfaces fictícias.

Validação inicial: build aprovado; cinco imagens decodificadas com HTTP 200, textos alternativos e abertura em tamanho maior confirmados. Sem transbordo a 320, 390 e 1440 px nos dois temas; banners de 180 px e hero original preservados. Evidências dessa versão inicial em `output/project-images-validation.md` e `output/project-images-validation/`.

## Visualizador de imagens

A abertura em nova aba foi substituída por um diálogo que cobre a viewport. A imagem mantém a proporção e fica inteiramente visível. Há botão Fechar, fechamento por Esc ou clique no fundo, contenção nativa do foco, retorno do foco ao gatilho e restauração da rolagem. O PC Remote agora mostra uma única captura.

O usuário autorizou o redeploy na Vercel. O projeto vinculado é `danielharrison`, ID `prj_yZpsdHmSZ5QZuzKkUcOWYbK7H4aN`. `vercel.json` explicita o build Vite e a saída `dist`; `.vercelignore` exclui backups, evidências, documentos, builds locais e arquivos de ambiente do envio.

Validação do visualizador: 54 ciclos de abertura e fechamento em três tamanhos de viewport, nos dois temas, aprovados. Fechar, Esc e clique no fundo funcionam, com foco e rolagem restaurados. Evidências: `output/image-viewer-validation.md`.

Redeploy em produção concluído: [danielharrisonlf.vercel.app](https://danielharrisonlf.vercel.app), deployment `dpl_ChRjUXfbGccYdBLUHToFy3Wy414Q`, estado READY. O build na Vercel passou. Verificação independente no domínio público retornou HTTP 200, três projetos com uma imagem cada, três diálogos cobrindo 1440 × 900 px com imagens carregadas, fechamento funcionando e console sem erros. Evidências locais: `output/production/verification.json` e `output/production/pc-remote-viewer.png`.

## Apresentação das demonstrações

Após o feedback de que a apresentação das imagens ainda estava ruim, os banners de 180 px foram substituídos por três linhas largas de projeto. Em desktop, captura e descrição dividem a linha; em mobile, ficam empilhadas. As capturas web usam a largura disponível e sua proporção original. A área de imagem tem ação visível de ampliar, sem deslocar ou ampliar o card inteiro no hover.

O PC Remote continua com um único aparelho, agora usando a captura real do deck de controles (`pc-remote-landing-v2/public/screenshots/deck.webp`), em moldura discreta com largura de 210 px e área de 500 px. A tela mostra ações concretas do app, em vez da área vazia do touchpad. O visualizador em tela cheia, seu fechamento e as outras seções do portfólio foram preservados. Capturas de inspeção: `output/project-presentation-after/`.

Build e revisão independente aprovados. A checagem no navegador passou em 320, 390, 768, 900 e 1440 px, nos dois temas, sem transbordo ou recorte das capturas. Abertura por clique e teclado, fechamento e restauração de foco e rolagem passaram. Relatório: `output/project-presentation-validation.md`.

Nova apresentação publicada em [danielharrisonlf.vercel.app](https://danielharrisonlf.vercel.app), deployment `dpl_FofymBEyaPw7tPGXn9to7roj4sGC`, estado READY. A verificação no domínio público confirmou HTTP 200, três linhas de projetos, capturas web com 560 px de largura, um único aparelho exibindo `pc-remote-deck.webp`, três diálogos cobrindo a viewport, fechamento funcional e nenhum erro de console. Evidência atual: `output/production/verification.json`.

## Atualização de 24/11/2026 — Encibra (OIA + Support App), Applied AI/MCP e Deploy no Dokploy

### Fontes inspecionadas
- **Encibra — OIA** (`C:/Users/daniellima/code/encibra/oia`: `oia-backend`, `oia-frontend`, `oia-flyway`, `OIA - Visao geral do projeto.pdf`, `auditoria-perfis-oia15.md`, `auditoria-2026-11-20/RELATORIO.md`): sistema do Organismo de Inspeção Acreditada (ISO/IEC 17020 / INMETRO) em Fastify 5, TypeScript, Zod 4, Prisma 6, Better Auth 1.7.6, PostgreSQL/Flyway, AWS S3, AWS SQS e React 19 + TanStack Router/Query/Table + Tailwind 4 + `@react-pdf/renderer`, cobrindo contratos, fases, inspeções, emissão versionada de certificados com validação por QR Code, fluxo multi-etapas de não conformidades (RNCs) com matriz de permissões por perfil e contrato e trilha de auditoria. Nenhum segredo ou URL interna foi exposto.
- **Encibra — Central de Suporte Vision 360 (Support App)** (`C:/Users/daniellima/code/encibra/plataforma de suporte/fullstack-monorepo-template` / `encibralabs/suporte-platform`): monorepo pnpm + Turborepo com NestJS + Prisma + PostgreSQL, React 19 + Tailwind v4 + shadcn/ui, `@repo/contracts` (Zod) e `@repo/api-client` gerado pelo Orval; portal do cliente, fila global, SLA/prazos, indicadores e escalonamento para Jira.
- **Plataforma de Gestão Operacional com Assistente de IA via MCP** (`C:/Users/daniellima/code/projetos/axial`, `apps/mcp-server/README.md`, `apps/web/src/pages/Mcp.tsx`): plataforma multi-tenant em microsserviços NestJS (projects, identity, notifications, realtime, audit, gateway e mcp-server com `@nestjs/mcp` + 49 ferramentas e OAuth 2.1 RFC 9728/8707/7591), PostgreSQL, Redis/BullMQ, outbox transacional, WebSocket e auditoria append-only. Posicionada no portfólio pelo foco em solução de cliente, omitindo o nome comercial interno no título e sem link de repositório público.
- **Omni CRM AI** (`C:/Users/daniellima/code/projetos/omni-crm-ai`, repositório privado): CRM omnichannel B2B multi-organização em NestJS + React, Better Auth, PostgreSQL/pgvector, Redis/BullMQ, Zod, caixa de entrada (WhatsApp e chat web incorporável), pipeline comercial, base de conhecimento e assistência de IA para resumo e sugestão de respostas.
- **FinFlow** (`C:/Users/daniellima/code/projetos/finflow`, repositório privado): monorepo pnpm + Turborepo com API NestJS + Prisma + PostgreSQL + contratos Zod alimentando quatro interfaces — painel web React 19, CLI, servidor MCP (`@modelcontextprotocol/sdk`, 19 ferramentas) e bot do Telegram com alertas de orçamento e exportação CSV/OFX.
- **ClinicFlow**, **WhatsApp Control Center**, **Mapbox Vision** e **PC Remote**: mantidos com textos revisados para enfatizar problema de negócio, operação real e arquitetura entregue; o projeto pessoal Fio foi retirado da vitrine para priorizar soluções de impacto operacional e IA aplicada/MCP.

### Novas capturas reais (nenhuma imagem gerada por IA)
- `public/uploads/projects/gestao-operacional-mcp.webp` (1440×960, WebP): captura real do frontend compilado `C:/Users/daniellima/code/projetos/axial/apps/web/dist` na rota `#/mcp` (catálogo de ferramentas MCP e permissões RBAC), com dados de demonstração do próprio app.
- `public/uploads/projects/omni-crm-inbox.webp` (1440×960, WebP): convertida diretamente da captura real do produto `C:/Users/daniellima/code/projetos/omni-crm-ai/docs/design/product-inbox-dark.png` (regerada pela suíte E2E do repositório com dados fictícios).
- `public/uploads/projects/finflow-painel.webp` (1440×960, WebP): captura real do frontend compilado `C:/Users/daniellima/code/projetos/finflow/apps/web/dist` em tema escuro, servindo as fixtures determinísticas da suíte E2E (`apps/web/e2e/mocks.ts`).

### Ícones e infraestrutura
- `TechIcon.tsx`: adicionados ícones dedicados para Fastify, Zod, Better Auth, OAuth 2.1, Flyway, pgvector, BullMQ, Assistentes de IA, Kotlin, Android, Rust, Tauri e TLS.
- Containerização e deploy self-hosted no Dokploy (`oO-xn7s9yfM1PpbkCMUbO` / `portfolio-fvufvc`, domínio `https://danielharrison.noxlabs.tech/`) via `Dockerfile` multi-stage (`node:24-alpine` + `nginx:1.27-alpine`) e `.dockerignore` ampliado para excluir `output`, `tmp`, `.vercel` e `.env*`.

