import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

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

      // Check for View Transitions API support and reduced motion preference
      const isViewTransitionSupported =
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        typeof (document as unknown as { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition === 'function' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isViewTransitionSupported) {
        const x = event ? event.clientX : window.innerWidth - 40;
        const y = event ? event.clientY : 30;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = (document as unknown as {
          startViewTransition: (cb: () => void) => { ready: Promise<void> };
        }).startViewTransition(() => {
          setTheme(nextTheme);
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 550,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        });
      } else {
        setTheme(nextTheme);
      }
    },
    [theme]
  );

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
