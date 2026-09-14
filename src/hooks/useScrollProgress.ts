import { useEffect, useState } from 'react';

/**
 * Progresso de leitura da página, de 0 a 100.
 *
 * O cálculo lê `scrollHeight`/`clientHeight`, que forçam recálculo de layout.
 * Fazer isso a cada evento de `scroll` dispara dezenas de leituras por
 * segundo durante a rolagem. Aqui o cálculo é agendado num quadro
 * (`requestAnimationFrame`), então roda no máximo uma vez por frame — e
 * nunca duas vezes para o mesmo quadro.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;

      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = (window.scrollY / scrollable) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    measure();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}
