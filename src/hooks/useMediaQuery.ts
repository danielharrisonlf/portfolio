import { useEffect, useState } from 'react';

/**
 * Assina uma media query e devolve o estado atual.
 *
 * Usado para condicionar o *render*, não o estilo: um painel escondido por
 * CSS continua no DOM — recebendo foco, prendendo a rolagem do body e sendo
 * lido por leitor de tela. Este hook resolve isso na raiz.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
