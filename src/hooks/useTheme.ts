import { useCallback, useEffect, useState } from 'react';
import type { Theme } from '../types';

/** Chave de persistência. Mantida igual à versão anterior para não perder
 *  a preferência de quem já visitou o site. */
const STORAGE_KEY = 'dh_theme';

/**
 * Fator entre o raio necessário para cobrir a tela e o tamanho da caixa da
 * máscara. A máscara é um radial-gradient `closest-side` sólido até 88% do
 * raio, ou seja, a parte opaca chega a 0.44 do lado da caixa.
 * 2.8 => raio sólido de ~1.23x o necessário: cobre o canto mais distante
 * com margem e ainda deixa a borda esfumaçada aparecer.
 */
const MASK_SCALE = 2.8;

type ViewTransition = { ready: Promise<void>; finished: Promise<void> };
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition;
};

function readInitialTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;

  // Fallback: só acontece se o script inline do index.html não rodou.
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* localStorage bloqueado — segue para a preferência do sistema. */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  /*
   * O tema inicial é LIDO do DOM, não recalculado. O script inline no
   * index.html já resolveu isso antes da primeira pintura; recalcular aqui
   * abriria uma janela para os dois discordarem.
   */
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* Modo privado: a preferência vale só para esta sessão. */
    }
  }, [theme]);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      const next: Theme = theme === 'light' ? 'dark' : 'light';
      const root = document.documentElement;

      /*
       * O atributo é trocado de forma síncrona aqui dentro, e não só via
       * setState: o React agrupa atualizações, então o snapshot "depois" da
       * View Transition podia ser capturado ainda com o tema antigo.
       */
      const apply = () => {
        root.setAttribute('data-theme', next);
        setTheme(next);
      };

      const doc = document as ViewTransitionDocument;
      if (typeof doc.startViewTransition !== 'function') {
        apply();
        return;
      }

      /*
       * Origem da revelação: o centro do próprio botão, não o ponteiro.
       * Ativação por teclado dispara um clique com clientX/clientY = 0, o
       * que faria o círculo nascer no canto superior esquerdo.
       */
      const rect = event?.currentTarget?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
      const y = rect ? rect.top + rect.height / 2 : 32;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      root.style.setProperty('--tt-x', `${x}px`);
      root.style.setProperty('--tt-y', `${y}px`);
      root.style.setProperty('--tt-size', `${Math.ceil(endRadius * MASK_SCALE)}px`);

      const transition = doc.startViewTransition(apply);

      /*
       * A troca de tema nunca depende da animação: o callback roda mesmo
       * quando a transição é abortada. Mas `ready`/`finished` rejeitam
       * nesses casos (aba em segundo plano, dois cliques rápidos) e, sem
       * catch, viram "Uncaught (in promise)" no console.
       */
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
    },
    [theme]
  );

  return { theme, isDark: theme === 'dark', toggleTheme };
}
