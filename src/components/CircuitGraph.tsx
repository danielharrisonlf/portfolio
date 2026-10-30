import React from 'react';
import { GraphData, SparkPosition } from '../types';

interface CircuitGraphProps {
  graph: GraphData | null;
  spark: SparkPosition | null;
}

export const CircuitGraph: React.FC<CircuitGraphProps> = ({ graph, spark }) => {
  if (!graph) return null;

  return (
    <svg
      id="hero-graph-svg"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 0,
      }}
      viewBox={graph.viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft atmospheric ambient glow */}
        <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ambient Gradient for smooth light wash */}
        <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Solid Continuous Circuit Lines with Organic Breathing Glow (NO dashes / NO crawling dots) */}
      {graph.edges.map((edge, i) => (
        <g key={`edge-${i}`} className="circuit-trace-group">
          {/* Ambient Glow halo */}
          <polyline
            points={edge.points}
            fill="none"
            stroke="url(#circuitGrad)"
            strokeWidth="3.5"
            strokeOpacity="0.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#circuitGlow)"
            className="circuit-breathe"
            style={{ animationDelay: `${(i * 0.6).toFixed(1)}s` }}
          />

          {/* Clean Solid Vector Line */}
          <polyline
            points={edge.points}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeOpacity="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="circuit-line-solid"
            style={{ animationDelay: `${(i * 0.6).toFixed(1)}s` }}
          />
        </g>
      ))}

      {/* Solid Precise Nodes */}
      {graph.nodes.map((node, i) => (
        <g key={`node-${i}`} className="circuit-node-group">
          {/* Subtle Outer Halo */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r="6"
            fill="var(--accent)"
            fillOpacity="0.15"
            className="node-breathe"
            style={{ animationDelay: `${(i * 0.3).toFixed(1)}s` }}
          />
          {/* Center Point */}
          <circle
            cx={node.cx}
            cy={node.cy}
            r="3"
            fill="var(--accent)"
            fillOpacity="0.9"
            stroke="var(--bg)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Cursor Light Focus */}
      {spark && (
        <g style={{ transition: 'opacity 0.2s ease' }}>
          <circle
            cx={spark.x}
            cy={spark.y}
            r="16"
            fill="var(--accent)"
            fillOpacity="0.12"
            filter="url(#circuitGlow)"
          />
          <circle
            cx={spark.x}
            cy={spark.y}
            r="3"
            fill="var(--accent)"
            fillOpacity="0.7"
          />
        </g>
      )}
    </svg>
  );
};
