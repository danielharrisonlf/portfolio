import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

/**
 * Fator entre o raio necessário para cobrir a tela e o tamanho da caixa da
 * máscara. A máscara é um radial-gradient `closest-side` opaco até 80% do
 * raio, ou seja, a parte sólida chega a 0.4 do lado da caixa.
 * 2.8 => raio sólido de 1.12x o necessário: cobre o canto mais distante com
 * margem e ainda deixa a borda esfumaçada aparecendo.
 */
const MASK_SCALE = 2.8;

type ViewTransition = { ready: Promise<void>; finished: Promise<void> };

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition;
};

export function useTheme(defaultTheme: Theme = 'light') {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dh_theme') as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dh_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent) => {
      const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
      const root = document.documentElement;

      /*
       * O atributo é trocado de forma síncrona aqui dentro, e não só via
       * setState. O React agrupa atualizações, então o snapshot "depois" da
       * View Transition podia ser capturado ainda com o tema antigo.
       */
      const applyTheme = () => {
        root.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
      };

      const doc = document as ViewTransitionDocument;
      if (typeof doc.startViewTransition !== 'function') {
        applyTheme();
        return;
      }

      /*
       * Origem da revelação: o centro do próprio botão, não o ponteiro.
       * Ativação por teclado (Enter/Espaço) dispara um clique com
       * clientX/clientY = 0, o que faria o círculo nascer no canto superior
       * esquerdo. O retângulo do botão vale para mouse, toque e teclado.
       */
      const trigger = event?.currentTarget as HTMLElement | undefined;
      const rect = trigger?.getBoundingClientRect();

      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
      const y = rect ? rect.top + rect.height / 2 : 30;

      // Distância até o canto mais distante — o círculo precisa alcançá-lo.
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      root.style.setProperty('--tt-x', `${x}px`);
      root.style.setProperty('--tt-y', `${y}px`);
      root.style.setProperty('--tt-size', `${Math.ceil(endRadius * MASK_SCALE)}px`);

      const transition = doc.startViewTransition(applyTheme);

      /*
       * A troca de tema em si nunca depende da animação: o callback roda mesmo
       * quando a transição é abortada. Mas `ready`/`finished` rejeitam nesses
       * casos (aba em segundo plano, ou dois cliques rápidos abortando a
       * anterior) e, sem catch, viram "Uncaught (in promise)" no console.
       */
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
    },
    [theme]
  );

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
