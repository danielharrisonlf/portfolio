/**
 * Smoothly scrolls the window to a target element using cubic-bezier easing
 * Works consistently across all browsers, operating systems, and embedded webviews.
 */
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
      targetY = rect.top + window.pageYOffset + offset;
    } else {
      return;
    }
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

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
}
