/**
 * Smoothly scrolls the window to a target element using cubic-bezier easing
 * Works consistently across all browsers, operating systems, and embedded webviews.
 */
let pendingFrame = 0;

export function smoothScrollToElement(
  targetId: string,
  offset: number = -24,
  duration: number = 650
): void {
  let targetY = 0;

  if (targetId && targetId !== 'hero-grid' && targetId !== 'top') {
    const el = document.getElementById(targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      const navHeight = document.getElementById('site-nav')?.getBoundingClientRect().height ?? 64;
      targetY = rect.top + window.pageYOffset + Math.min(offset, -navHeight - 16);
    } else {
      return;
    }
  }

  cancelAnimationFrame(pendingFrame);
  targetY = Math.max(0, Math.min(targetY, document.documentElement.scrollHeight - window.innerHeight));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || duration <= 0) {
    window.scrollTo({ top: targetY, behavior: 'instant' });
    return;
  }

  const startY = window.pageYOffset;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) return;

  const startTime =
    typeof performance !== 'undefined' && 'now' in performance
      ? performance.now()
      : Date.now();

  // Smooth ease-in-out cubic curve
  const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo({ top: startY + distance * ease, behavior: 'instant' });

    if (progress < 1) {
      pendingFrame = requestAnimationFrame(animateScroll);
    }
  };

  pendingFrame = requestAnimationFrame(animateScroll);
}
