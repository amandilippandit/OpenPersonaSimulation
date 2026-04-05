"use client";

import { useEffect, useState } from "react";

// Persona nodes arranged in a ring around the center stimulus
const PERSONAS = [
  { id: "p1", name: "Diane, 44", role: "skeptical parent",     angle: 0,   color: "#f59e0b", reaction: "$899 is steep..." },
  { id: "p2", name: "Jordan, 29", role: "young professional",  angle: 60,  color: "#34d399", reaction: "love the trial period" },
  { id: "p3", name: "Tyler, 27",  role: "impulse shopper",     angle: 120, color: "#818cf8", reaction: "buying this tonight" },
  { id: "p4", name: "Charles, 52", role: "luxury consumer",    angle: 180, color: "#a78bfa", reaction: "feels too loud" },
  { id: "p5", name: "Riley, 22",  role: "gen z creator",       angle: 240, color: "#f472b6", reaction: "where's the proof?" },
  { id: "p6", name: "Morgan, 38", role: "knowledge worker",    angle: 300, color: "#60a5fa", reaction: "show me reviews" },
];

const RADIUS = 180;
const CENTER = { x: 350, y: 280 };

// Convert polar to cartesian coordinates
function polar(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CENTER.x + radius * Math.cos(rad),
    y: CENTER.y + radius * Math.sin(rad),
  };
}

export default function AnimatedGraph() {
  const [pulseKey, setPulseKey] = useState(0);
  const [activePersona, setActivePersona] = useState<number>(-1);

  // Re-trigger pulse wave every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through active personas for reaction highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePersona((p) => (p + 1) % PERSONAS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[7/5]">
      <svg
        viewBox="0 0 700 560"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Gradient for central node */}
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          {/* Edge gradient */}
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Inter-persona dashed line pattern */}
          <pattern id="dashedPattern" patternUnits="userSpaceOnUse" width="8" height="8">
            <circle cx="4" cy="4" r="0.5" fill="#4a4a66" />
          </pattern>
        </defs>

        {/* Background orbit rings */}
        <g opacity="0.15">
          <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} fill="none" stroke="#4a4a66" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS + 60} fill="none" stroke="#4a4a66" strokeWidth="0.5" strokeDasharray="2 8" />
          <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS - 60} fill="none" stroke="#4a4a66" strokeWidth="0.3" strokeDasharray="1 4" />
        </g>

        {/* Pulse waves from center (re-mounts on each pulseKey change) */}
        <g key={pulseKey}>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={CENTER.x}
              cy={CENTER.y}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              style={{
                animation: `ripple 3s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.6}s forwards`,
              }}
            />
          ))}
        </g>

        {/* Edges: center -> each persona */}
        {PERSONAS.map((p, i) => {
          const pos = polar(p.angle, RADIUS);
          return (
            <g key={`edge-${p.id}`}>
              <line
                x1={CENTER.x}
                y1={CENTER.y}
                x2={pos.x}
                y2={pos.y}
                stroke="url(#edgeGrad)"
                strokeWidth="1.2"
                opacity="0.5"
              />
              {/* Animated particle traveling along edge */}
              <circle r="3" fill="#a78bfa" filter="url(#softGlow)">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                  path={`M ${CENTER.x} ${CENTER.y} L ${pos.x} ${pos.y}`}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* Inter-persona edges (subtle, dotted, discussion lines) */}
        {PERSONAS.map((p, i) => {
          const nextIdx = (i + 1) % PERSONAS.length;
          const p1 = polar(p.angle, RADIUS);
          const p2 = polar(PERSONAS[nextIdx].angle, RADIUS);
          return (
            <line
              key={`inter-${p.id}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#35354f"
              strokeWidth="0.5"
              strokeDasharray="2 4"
              opacity={activePersona === i || activePersona === nextIdx ? 0.8 : 0.2}
              style={{ transition: "opacity 400ms ease" }}
            />
          );
        })}

        {/* Central stimulus node */}
        <g>
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r="40"
            fill="url(#centerGrad)"
            style={{ animation: "glowPulse 3s ease-in-out infinite" }}
          />
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r="28"
            fill="#1a1a2e"
            stroke="#818cf8"
            strokeWidth="1.5"
          />
          <text
            x={CENTER.x}
            y={CENTER.y - 4}
            textAnchor="middle"
            fill="#e5e5f0"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            AD COPY
          </text>
          <text
            x={CENTER.x}
            y={CENTER.y + 8}
            textAnchor="middle"
            fill="#818cf8"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
          >
            stimulus
          </text>
        </g>

        {/* Persona nodes */}
        {PERSONAS.map((p, i) => {
          const pos = polar(p.angle, RADIUS);
          const isActive = activePersona === i;
          const labelOffset = pos.x > CENTER.x ? 38 : -38;
          const textAnchor = pos.x > CENTER.x ? "start" : "end";

          return (
            <g key={p.id}>
              {/* Active ring */}
              {isActive && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="26"
                  fill="none"
                  stroke={p.color}
                  strokeWidth="1.5"
                  opacity="0.5"
                  style={{ animation: "pulseDot 1.8s ease-in-out infinite" }}
                />
              )}
              {/* Persona node */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill="#0f0f1e"
                stroke={p.color}
                strokeWidth="2"
                filter={isActive ? "url(#softGlow)" : undefined}
                style={{
                  transition: "all 400ms ease",
                  animation: `float 4s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
              {/* Initial letter */}
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill={p.color}
                fontSize="14"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
                style={{ pointerEvents: "none" }}
              >
                {p.name[0]}
              </text>

              {/* Labels */}
              <text
                x={pos.x + labelOffset}
                y={pos.y - 2}
                textAnchor={textAnchor}
                fill="#e5e5f0"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="500"
              >
                {p.name}
              </text>
              <text
                x={pos.x + labelOffset}
                y={pos.y + 10}
                textAnchor={textAnchor}
                fill="#6b6b85"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                {p.role}
              </text>

              {/* Reaction badge (only shows when active) */}
              {isActive && (
                <g style={{ animation: "reactionIn 300ms cubic-bezier(0.16, 1, 0.3, 1) both" }}>
                  <rect
                    x={pos.x + labelOffset - (textAnchor === "end" ? 110 : 0)}
                    y={pos.y + 18}
                    width="110"
                    height="18"
                    rx="4"
                    fill="#050510"
                    stroke={p.color}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x={pos.x + labelOffset + (textAnchor === "end" ? -55 : 55)}
                    y={pos.y + 30}
                    textAnchor="middle"
                    fill={p.color}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {p.reaction}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Output insights drifting out */}
        <g opacity="0.7">
          <g style={{ animation: "fadeIn 1s ease-out 1s both" }}>
            <text x="80" y="40" fill="#34d399" fontSize="9" fontFamily="JetBrains Mono, monospace">
              → intent: 6.2/10
            </text>
            <text x="80" y="56" fill="#6b6b85" fontSize="8" fontFamily="JetBrains Mono, monospace">
              (weighted average)
            </text>
          </g>
          <g style={{ animation: "fadeIn 1s ease-out 1.3s both" }}>
            <text x="540" y="40" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono, monospace">
              ⚠ top concern
            </text>
            <text x="540" y="56" fill="#6b6b85" fontSize="8" fontFamily="JetBrains Mono, monospace">
              price/trust ratio
            </text>
          </g>
          <g style={{ animation: "fadeIn 1s ease-out 1.6s both" }}>
            <text x="80" y="520" fill="#818cf8" fontSize="9" fontFamily="JetBrains Mono, monospace">
              ◈ segment split
            </text>
            <text x="80" y="536" fill="#6b6b85" fontSize="8" fontFamily="JetBrains Mono, monospace">
              4 buyers / 2 skeptics
            </text>
          </g>
          <g style={{ animation: "fadeIn 1s ease-out 1.9s both" }}>
            <text x="540" y="520" fill="#f472b6" fontSize="9" fontFamily="JetBrains Mono, monospace">
              ∿ sentiment
            </text>
            <text x="540" y="536" fill="#6b6b85" fontSize="8" fontFamily="JetBrains Mono, monospace">
              mixed, actionable
            </text>
          </g>
        </g>
      </svg>

      {/* Legend strip below */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[10px] font-mono text-ink-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse-dot" />
          <span>content broadcast</span>
        </div>
        <span className="text-ink-700">·</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full border border-ink-500" />
          <span>persona reactions</span>
        </div>
        <span className="text-ink-700">·</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>extracted insights</span>
        </div>
      </div>
    </div>
  );
}
