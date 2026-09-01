import { useState, useCallback, useEffect, RefObject } from 'react';
import { GraphData, SparkPosition } from '../types';

interface UseHeroGraphProps {
  containerRef: RefObject<HTMLElement | null>;
  badgeRef: RefObject<HTMLElement | null>;
  bioRef: RefObject<HTMLElement | null>;
  stackRef: RefObject<HTMLElement | null>;
  practicesRef: RefObject<HTMLElement | null>;
}

export function useHeroGraph({
  containerRef,
  badgeRef,
  bioRef,
  stackRef,
  practicesRef,
}: UseHeroGraphProps) {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [spark, setSpark] = useState<SparkPosition | null>(null);

  const measureGraph = useCallback(() => {
    const c = containerRef.current;
    const b = badgeRef.current;
    const bio = bioRef.current;
    const st = stackRef.current;
    const pr = practicesRef.current;

    if (!c || !b || !bio || !st || !pr) return;

    // If container or screen is hidden or mobile, graph can be hidden
    if (window.innerWidth <= 900) {
      setGraph(null);
      return;
    }

    const cr = c.getBoundingClientRect();
    const rel = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left - cr.left,
        right: r.right - cr.left,
        top: r.top - cr.top,
        bottom: r.bottom - cr.top,
        cx: r.left - cr.left + r.width / 2,
        cy: r.top - cr.top + r.height / 2,
      };
    };

    const zigzag = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      segments: number,
      amp: number
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      segments = Math.max(2, Math.min(segments, Math.round(len / 12)));
      amp = Math.min(amp, len / 6);
      const pts: string[] = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const bx = x1 + dx * t;
        const by = y1 + dy * t;
        let off = 0;
        if (i > 0 && i < segments) {
          const sign = i % 2 === 0 ? 1 : -1;
          off = sign * amp * (1 - Math.abs(t - 0.5) * 1.3);
        }
        pts.push(`${(bx + nx * off).toFixed(1)},${(by + ny * off).toFixed(1)}`);
      }
      return pts.join(' ');
    };

    const bd = rel(b);
    const bo = rel(bio);
    const sk = rel(st);
    const pc = rel(pr);

    const p = {
      badgeBottom: { x: bd.cx, y: bd.bottom },
      bioTop: { x: bo.cx, y: bo.top },
      bioRight: { x: bo.right, y: bo.cy },
      stackLeft: { x: sk.left, y: sk.cy },
      badgeRight: { x: bd.right, y: bd.cy },
      stackTop: { x: sk.cx, y: sk.top },
      stackRightMid: { x: sk.right, y: sk.cy },
      practicesRightMid: { x: pc.right, y: pc.cy },
    };

    const railX = Math.max(sk.right, pc.right) + 18;

    setGraph({
      w: cr.width,
      h: cr.height,
      viewBox: `0 0 ${cr.width} ${cr.height}`,
      edges: [
        { points: zigzag(p.badgeBottom.x, p.badgeBottom.y, p.bioTop.x, p.bioTop.y, 6, 4) },
        { points: zigzag(p.bioRight.x, p.bioRight.y, p.stackLeft.x, p.stackLeft.y, 6, 4) },
        { points: zigzag(p.badgeRight.x, p.badgeRight.y, p.stackTop.x, p.stackTop.y, 7, 5) },
        {
          points: `${p.stackRightMid.x},${p.stackRightMid.y} ${railX},${p.stackRightMid.y} ${railX},${p.practicesRightMid.y} ${p.practicesRightMid.x},${p.practicesRightMid.y}`,
        },
      ],
      nodes: [
        p.badgeBottom,
        p.bioTop,
        p.bioRight,
        p.stackLeft,
        p.badgeRight,
        p.stackTop,
        p.stackRightMid,
        p.practicesRightMid,
      ].map((pt) => ({ cx: pt.x, cy: pt.y })),
    });
  }, [containerRef, badgeRef, bioRef, stackRef, practicesRef]);

  useEffect(() => {
    measureGraph();

    const handleResize = () => {
      measureGraph();
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        measureGraph();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    // Small delay to ensure all layout elements and fonts are fully settled
    const timer = setTimeout(measureGraph, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [measureGraph, containerRef]);

  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setSpark({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      });
    },
    [containerRef]
  );

  const handleHeroMouseLeave = useCallback(() => {
    setSpark(null);
  }, []);

  return {
    graph,
    spark,
    measureGraph,
    handleHeroMouseMove,
    handleHeroMouseLeave,
  };
}
