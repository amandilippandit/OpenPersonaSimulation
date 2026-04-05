"use client";

import { useEffect, useMemo, useState } from "react";

// ---------- Seeded PRNG for deterministic layout (SSR-safe) ----------
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Layout dimensions ----------
const VIEW_W = 900;
const VIEW_H = 640;
const CENTER = { x: 420, y: 320 };
const NODE_COUNT = 68;

// ---------- Generate node positions in an organic blob ----------
interface Node {
  id: number;
  x: number;
  y: number;
  r: number;
  shade: "dark" | "mid" | "light" | "white";
}

function generateNodes(): Node[] {
  const rng = mulberry32(11);
  const nodes: Node[] = [];
  // Use rejection sampling to create a blob with minimum node spacing
  const MIN_DIST = 24;
  const MAX_RADIUS = 260;
  let attempts = 0;
  while (nodes.length < NODE_COUNT && attempts < 2000) {
    const angle = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * MAX_RADIUS;
    const x = CENTER.x + Math.cos(angle) * r;
    const y = CENTER.y + Math.sin(angle) * r * 0.85; // slightly squished
    // Check min distance
    let ok = true;
    for (const n of nodes) {
      const dx = n.x - x;
      const dy = n.y - y;
      if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) {
        ok = false;
        break;
      }
    }
    if (ok) {
      const sizeRoll = rng();
      const nodeR = sizeRoll < 0.15 ? 11 : sizeRoll < 0.4 ? 9 : sizeRoll < 0.75 ? 7 : 5.5;
      const shadeRoll = rng();
      const shade: Node["shade"] =
        shadeRoll < 0.35
          ? "dark"
          : shadeRoll < 0.65
          ? "mid"
          : shadeRoll < 0.88
          ? "light"
          : "white";
      nodes.push({ id: nodes.length, x, y, r: nodeR, shade });
    }
    attempts++;
  }
  return nodes;
}

// ---------- Compute edges (each node to its 2-3 nearest neighbors) ----------
interface Edge {
  a: number;
  b: number;
}

function computeEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    // Find distances to all other nodes
    const distances = nodes
      .map((n, j) => ({
        j,
        d: Math.hypot(nodes[i].x - n.x, nodes[i].y - n.y),
      }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d);
    // Connect to ~3 nearest
    const connectCount = 2 + (i % 3 === 0 ? 1 : 0);
    for (let k = 0; k < connectCount && k < distances.length; k++) {
      const a = Math.min(i, distances[k].j);
      const b = Math.max(i, distances[k].j);
      const key = `${a}-${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ a, b });
      }
    }
  }
  return edges;
}

// ---------- Persona cards to show on highlighted nodes ----------
interface PersonaCard {
  nodeIdx: number; // which node to attach to
  initials: string;
  name: string;
  title: string;
  company: string;
  description: string;
  tags: { icon: string; label: string }[];
}

const PERSONA_CARDS: PersonaCard[] = [
  {
    nodeIdx: 6,
    initials: "SC",
    name: "Sarah Chen",
    title: "Product Manager",
    company: "TechFlow Inc.",
    description: "Evaluates products through a lens of user impact and scalability.",
    tags: [
      { icon: "⊙", label: "San Francisco" },
      { icon: "◐", label: "Female" },
      { icon: "◈", label: "Millennial" },
      { icon: "▣", label: "Technology" },
    ],
  },
  {
    nodeIdx: 22,
    initials: "MJ",
    name: "Marcus Johnson",
    title: "Sales Director",
    company: "Apex Consulting",
    description: "Values in-person collaboration and measurable business outcomes.",
    tags: [
      { icon: "⊙", label: "London" },
      { icon: "◐", label: "Male" },
      { icon: "◈", label: "Gen X" },
      { icon: "▣", label: "Services" },
    ],
  },
  {
    nodeIdx: 38,
    initials: "ER",
    name: "Elena Rodriguez",
    title: "CMO",
    company: "Meridian Brands",
    description: "Data-driven creative leader focused on brand authenticity.",
    tags: [
      { icon: "⊙", label: "Barcelona" },
      { icon: "◐", label: "Female" },
      { icon: "◈", label: "Millennial" },
      { icon: "▣", label: "Retail" },
    ],
  },
  {
    nodeIdx: 51,
    initials: "DP",
    name: "David Park",
    title: "Engineering Lead",
    company: "CloudForge Systems",
    description: "Pragmatic technologist who weighs complexity against impact.",
    tags: [
      { icon: "⊙", label: "Seoul" },
      { icon: "◐", label: "Male" },
      { icon: "◈", label: "Gen X" },
      { icon: "▣", label: "Technology" },
    ],
  },
  {
    nodeIdx: 15,
    initials: "RP",
    name: "Riley Patel",
    title: "Content Strategist",
    company: "Independent",
    description: "Skeptical of conventional ads, values authenticity and proof.",
    tags: [
      { icon: "⊙", label: "Los Angeles" },
      { icon: "◐", label: "Non-binary" },
      { icon: "◈", label: "Gen Z" },
      { icon: "▣", label: "Media" },
    ],
  },
];

// ---------- Shade color mapping ----------
const SHADE_COLORS: Record<Node["shade"], string> = {
  dark: "#475569",   // slate-600
  mid: "#64748b",    // slate-500
  light: "#cbd5e1",  // slate-300
  white: "#f1f5f9",  // slate-100
};

const SHADE_STROKE: Record<Node["shade"], string> = {
  dark: "#334155",
  mid: "#475569",
  light: "#94a3b8",
  white: "#e2e8f0",
};

const ACTIVE_COLOR = "#f97316"; // orange-500
const ACTIVE_GLOW = "#fb923c";  // orange-400

// ---------- Component ----------
export default function AnimatedGraph() {
  const nodes = useMemo(() => generateNodes(), []);
  const edges = useMemo(() => computeEdges(nodes), [nodes]);
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIdx((i) => (i + 1) % PERSONA_CARDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const activeCard = PERSONA_CARDS[activeCardIdx];
  const activeNode = nodes[activeCard.nodeIdx];

  // Compute card position (prefers opposite side of graph from the node)
  const cardSide = activeNode.x > CENTER.x ? "left" : "right";

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[9/6.4]">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="nodeBlur">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
          <filter id="orangeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges — thin translucent web */}
        <g opacity="0.35">
          {edges.map((e, i) => {
            const na = nodes[e.a];
            const nb = nodes[e.b];
            const isActive = e.a === activeCard.nodeIdx || e.b === activeCard.nodeIdx;
            return (
              <line
                key={`edge-${i}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={isActive ? "#94a3b8" : "#475569"}
                strokeWidth={isActive ? 0.8 : 0.4}
                opacity={isActive ? 0.9 : 0.5}
                style={{ transition: "all 600ms ease" }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((n) => {
            const isActive = n.id === activeCard.nodeIdx;
            return (
              <g key={`node-${n.id}`}>
                {isActive && (
                  <>
                    {/* Outer glow ring */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r + 8}
                      fill="none"
                      stroke={ACTIVE_COLOR}
                      strokeWidth="1"
                      opacity="0.4"
                      style={{ animation: "pulseDot 2s ease-in-out infinite" }}
                    />
                    {/* Inner halo */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r + 4}
                      fill={ACTIVE_GLOW}
                      opacity="0.25"
                      filter="url(#orangeGlow)"
                    />
                  </>
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={isActive ? ACTIVE_COLOR : SHADE_COLORS[n.shade]}
                  stroke={isActive ? ACTIVE_GLOW : SHADE_STROKE[n.shade]}
                  strokeWidth={isActive ? 1.5 : 0.5}
                  style={{
                    transition: "all 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                {/* Subtle highlight on larger nodes */}
                {n.r >= 9 && (
                  <circle
                    cx={n.x - n.r * 0.3}
                    cy={n.y - n.r * 0.3}
                    r={n.r * 0.25}
                    fill="rgba(255,255,255,0.15)"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Connector line from active node to card */}
        <line
          x1={activeNode.x}
          y1={activeNode.y}
          x2={cardSide === "left" ? 60 : VIEW_W - 60}
          y2={activeNode.y - 100}
          stroke="#475569"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          opacity="0.4"
          style={{ transition: "all 600ms ease" }}
        />
      </svg>

      {/* Floating persona card */}
      <div
        key={activeCard.nodeIdx}
        className={`absolute top-8 ${
          cardSide === "left" ? "left-4 md:left-6" : "right-4 md:right-6"
        } w-72 md:w-80`}
        style={{
          animation: "reactionIn 500ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div className="rounded-xl border border-ink-800 bg-ink-900/90 backdrop-blur-xl shadow-2xl shadow-black/40 p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-sm font-semibold text-ink-300">
              {activeCard.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {activeCard.name}
              </div>
              <div className="text-xs text-ink-400 truncate">{activeCard.title}</div>
            </div>
          </div>

          {/* Company */}
          <div className="text-[11px] font-mono text-ink-500 mb-1">company</div>
          <div className="text-sm text-ink-200 mb-3">{activeCard.company}</div>

          {/* Description */}
          <div className="text-[11px] font-mono text-ink-500 mb-1">profile</div>
          <p className="text-xs text-ink-300 leading-relaxed mb-4">
            {activeCard.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {activeCard.tags.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-ink-800 bg-ink-850/60 text-[10px] font-mono text-ink-400"
              >
                <span className="text-ink-500">{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Index indicator */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {PERSONA_CARDS.map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeCardIdx ? "16px" : "6px",
                background: i === activeCardIdx ? ACTIVE_COLOR : "#35354f",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
