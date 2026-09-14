/**
 * Rolagem para uma seção, com dois cuidados que o `scrollIntoView` não tem:
 *
 * 1. Respeita `prefers-reduced-motion`. Quem pediu menos movimento recebe
 *    um salto direto, não uma animação de meio segundo pela página inteira.
 * 2. Compensa a altura real do header, lida de `--header-h` — que é medida
 *    em runtime. Um número fixo aqui erra assim que o header muda de altura.
 */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // `id` da primeira seção é o topo absoluto da página.
  const isTop = target.getBoundingClientRect().top + window.scrollY < 120;

  const headerHeight =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      10
    ) || 60;

  const top = isTop ? 0 : target.getBoundingClientRect().top + window.scrollY - headerHeight;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReduced ? 'auto' : 'smooth',
  });
}

/**
 * Atualiza o hash da URL sem disparar o salto nativo do navegador.
 *
 * Sem isto, o clique numa âncora pularia para a seção antes de a rolagem
 * suave começar — e ainda deixaria o hash dessincronizado da posição real.
 */
export function setHash(id: string): void {
  if (window.location.hash === `#${id}`) return;
  window.history.pushState(null, '', `#${id}`);
}
