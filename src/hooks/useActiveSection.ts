import { useEffect, useState } from 'react';

/**
 * Observa as seções do site e devolve qual está ativa.
 *
 * Usa IntersectionObserver em vez de comparar `offsetTop` no scroll: o
 * cálculo por offset quebra quando o layout muda de altura entre breakpoints
 * e dispara leitura de layout a cada evento de scroll.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    /*
     * A faixa de detecção é uma linha horizontal a 38% da viewport. O
     * `rootMargin` recorta a janela de observação para essa faixa: a seção
     * que a cruza é a ativa. Um único valor para topo e base evita a
     * ambiguidade de duas seções visíveis ao mesmo tempo.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-38% 0px -62% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  useEffect(() => {
    /*
     * Casos de borda que o observer não cobre: no topo absoluto a primeira
     * seção pode nunca cruzar a faixa, e no fim da página a última também
     * não. Sem isto, a nav fica marcando a seção errada nas duas pontas.
     */
    const handleEdge = () => {
      if (window.scrollY < 80) {
        setActive(ids[0] ?? '');
        return;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActive(ids[ids.length - 1] ?? '');
    };

    window.addEventListener('scroll', handleEdge, { passive: true });
    handleEdge();
    return () => window.removeEventListener('scroll', handleEdge);
  }, [ids]);

  return active;
}
