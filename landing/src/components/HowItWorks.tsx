"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

// --- Step 1: Scrolling columns of persona portraits ---
const PERSONA_INFO: Record<number, { name: string; segment: string }> = {
  5: { name: "Maya C.", segment: "Gen Z Creator" },
  9: { name: "Tanya M.", segment: "Weekend Warrior" },
  11: { name: "Tom H.", segment: "Practical Buyer" },
  13: { name: "David W.", segment: "Early Adopter" },
  22: { name: "Amelia P.", segment: "Skeptic" },
  25: { name: "Sophie L.", segment: "Brand Advocate" },
  33: { name: "Ryan N.", segment: "Social Influencer" },
  36: { name: "Elena M.", segment: "Impulse Shopper" },
  47: { name: "Priya K.", segment: "Luxury Millennial" },
  52: { name: "Greg S.", segment: "Casual Walker" },
  1: { name: "Jake M.", segment: "Convenience First" },
  3: { name: "Alex C.", segment: "Lifestyle Athlete" },
  7: { name: "Chris B.", segment: "Gym Regular" },
  19: { name: "Grace C.", segment: "Premium Health" },
  26: { name: "Olivia B.", segment: "Beauty Obsessed" },
  31: { name: "Isla S.", segment: "Home Curator" },
};

function PortraitTile({ id }: { id: number }) {
  const info = PERSONA_INFO[id] || { name: "", segment: "" };
  return (
    <div className="relative aspect-square rounded-md overflow-hidden border border-slate-200 bg-slate-100 group/tile">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.pravatar.cc/120?img=${id}`}
        alt={info.name}
        className="w-full h-full object-cover grayscale transition-all duration-500 ease-out group-hover/tile:grayscale-0 group-hover/tile:scale-110"
        loading="lazy"
      />
      {/* Hover overlay with persona info */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-1.5 pt-4 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300 ease-out">
        <div className="text-[9px] font-semibold text-white leading-tight truncate">
          {info.name}
        </div>
        <div className="text-[7px] font-mono text-white/80 leading-tight truncate mt-0.5">
          {info.segment}
        </div>
      </div>
    </div>
  );
}

function ScrollColumn({
  ids,
  direction,
  duration,
}: {
  ids: number[];
  direction: "up" | "down";
  duration: string;
}) {
  return (
    <div className="relative overflow-hidden">
      <div
        className={direction === "down" ? "scroll-col-down" : "scroll-col-up"}
        style={{ animationDuration: duration }}
      >
        <div className="flex flex-col gap-2">
          {[...ids, ...ids].map((id, i) => (
            <PortraitTile key={`${id}-${i}`} id={id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AudienceVisual() {
  // 4 columns of portraits, alternating direction
  const col1 = [5, 9, 11, 13];
  const col2 = [22, 25, 33, 36];
  const col3 = [47, 52, 3, 19];
  const col4 = [1, 7, 26, 31];

  return (
    <div className="relative h-64 bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/40 overflow-hidden p-2">
      <div className="grid grid-cols-4 gap-2 h-full">
        <ScrollColumn ids={col1} direction="down" duration="28s" />
        <ScrollColumn ids={col2} direction="up" duration="32s" />
        <ScrollColumn ids={col3} direction="down" duration="30s" />
        <ScrollColumn ids={col4} direction="up" duration="26s" />
      </div>
      {/* Top/bottom fade masks */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-100 via-slate-100/70 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-orange-50/40 via-slate-50/60 to-transparent pointer-events-none" />
    </div>
  );
}

// --- Step 2: Mini GNN graph (rotating sphere) ---
function fibonacciSphere(n: number) {
  const nodes: { x: number; y: number; z: number; shade: number }[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodes.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, shade: i % 3 });
  }
  return nodes;
}

function computeEdges(nodes: { x: number; y: number; z: number }[]) {
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({
        j,
        d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 + (n.z - nodes[i].z) ** 2,
      }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { j } of dists) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([Math.min(i, j), Math.max(i, j)]);
      }
    }
  }
  return edges;
}

function rotate(x: number, y: number, z: number, angleY: number, angleX: number) {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const rx = x * cosY + z * sinY;
  const rz = -x * sinY + z * cosY;
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const ry = y * cosX - rz * sinX;
  const rz2 = y * sinX + rz * cosX;
  return { x: rx, y: ry, z: rz2 };
}

const SHADES = ["#475569", "#94a3b8", "#cbd5e1"];

function BroadcastVisual() {
  const basePositions = useMemo(() => fibonacciSphere(36), []);
  const edges = useMemo(() => computeEdges(basePositions), [basePositions]);
  const [angle, setAngle] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      setAngle((now - start) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const i = setInterval(() => setActiveIdx((v) => (v + 1) % 36), 2600);
    return () => clearInterval(i);
  }, []);

  const projected = basePositions.map((p, i) => {
    const r = rotate(p.x, p.y, p.z, angle * 0.28, angle * 0.12);
    const scale = 320 / (320 - r.z * 70);
    return {
      idx: i,
      x: 120 + r.x * 70 * scale,
      y: 120 + r.y * 70 * scale,
      z: r.z,
      scale,
      shade: p.shade,
    };
  });

  const sorted = [...projected].sort((a, b) => a.z - b.z);

  return (
    <div className="relative h-64 bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/30 overflow-hidden flex items-center justify-center">
      <svg viewBox="0 0 240 240" className="w-full h-full max-w-[240px] max-h-[240px]">
        <defs>
          <filter id="hiwGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Edges */}
        <g>
          {edges.map(([a, b], i) => {
            const na = projected[a];
            const nb = projected[b];
            if (na.z < -0.4 && nb.z < -0.4) return null;
            const avgZ = (na.z + nb.z) / 2;
            const edgeOpacity = 0.12 + Math.max(0, (avgZ + 1) / 2) * 0.22;
            const isActiveEdge = a === activeIdx || b === activeIdx;
            return (
              <line
                key={`e-${i}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={isActiveEdge ? "#0a0a14" : "#1e293b"}
                strokeWidth={isActiveEdge ? 0.9 : 0.4}
                opacity={isActiveEdge ? 0.7 : edgeOpacity}
              />
            );
          })}
        </g>
        {/* Nodes */}
        {sorted.map((node) => {
          const isActive = node.idx === activeIdx;
          const radius = 5 * node.scale;
          const opacity = 0.35 + Math.max(0, (node.z + 1) / 2) * 0.65;
          const fillColor = isActive ? "#f97316" : SHADES[node.shade];
          return (
            <g key={node.idx}>
              {isActive && (
                <circle cx={node.x} cy={node.y} r={radius + 6} fill="#f97316" opacity="0.2" filter="url(#hiwGlow)" />
              )}
              <circle cx={node.x} cy={node.y} r={radius} fill={fillColor} opacity={isActive ? 1 : opacity} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Step 3: Area chart with multiple segments ---
function InsightsVisual() {
  // Sample data — intent distribution across score buckets per segment
  const segments = [
    { name: "luxury", color: "#10b981", values: [2, 4, 8, 15, 28, 32, 45, 58, 72, 68] },
    { name: "gen z", color: "#f97316", values: [5, 12, 22, 35, 48, 52, 45, 38, 28, 18] },
    { name: "value", color: "#f59e0b", values: [42, 58, 48, 32, 22, 14, 8, 5, 3, 2] },
  ];

  const W = 300;
  const H = 140;
  const PAD_X = 10;
  const PAD_Y = 20;
  const maxVal = 80;

  const buildPath = (values: number[]) => {
    const step = (W - PAD_X * 2) / (values.length - 1);
    const points = values.map((v, i) => ({
      x: PAD_X + i * step,
      y: H - PAD_Y - (v / maxVal) * (H - PAD_Y * 2),
    }));
    // Smooth path using quadratic bezier curves
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` Q ${cx},${prev.y} ${cx},${(prev.y + curr.y) / 2} T ${curr.x},${curr.y}`;
    }
    return { path: d, points };
  };

  const segmentPaths = segments.map((s) => ({ ...s, ...buildPath(s.values) }));

  return (
    <div className="relative h-64 bg-gradient-to-br from-slate-50 via-white to-emerald-50/25 overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">intent distribution</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums leading-none">6.3</span>
            <span className="text-[10px] font-mono text-slate-400">avg</span>
          </div>
        </div>
        <div className="flex gap-2">
          {segments.map((s) => (
            <div key={s.name} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              <span className="text-[8px] font-mono text-slate-500">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={PAD_X}
            y1={PAD_Y + frac * (H - PAD_Y * 2)}
            x2={W - PAD_X}
            y2={PAD_Y + frac * (H - PAD_Y * 2)}
            stroke="#e2e8f0"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
        ))}
        {/* Baseline */}
        <line x1={PAD_X} y1={H - PAD_Y} x2={W - PAD_X} y2={H - PAD_Y} stroke="#cbd5e1" strokeWidth="0.8" />

        {/* Area fills (back to front) */}
        {segmentPaths.map((s, i) => {
          const areaPath = s.path + ` L ${W - PAD_X},${H - PAD_Y} L ${PAD_X},${H - PAD_Y} Z`;
          return (
            <path
              key={`area-${s.name}`}
              d={areaPath}
              fill={s.color}
              opacity="0.08"
            />
          );
        })}

        {/* Lines */}
        {segmentPaths.map((s) => (
          <path
            key={`line-${s.name}`}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* End dots on each line */}
        {segmentPaths.map((s) => (
          <g key={`dot-${s.name}`}>
            <circle cx={s.points[s.points.length - 1].x} cy={s.points[s.points.length - 1].y} r="3" fill="white" />
            <circle cx={s.points[s.points.length - 1].x} cy={s.points[s.points.length - 1].y} r="2" fill={s.color} />
          </g>
        ))}

        {/* X-axis labels */}
        <text x={PAD_X} y={H - 4} fontSize="7" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">1</text>
        <text x={W / 2} y={H - 4} fontSize="7" fill="#94a3b8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">intent score</text>
        <text x={W - PAD_X} y={H - 4} fontSize="7" fill="#94a3b8" textAnchor="end" fontFamily="JetBrains Mono, monospace">10</text>
      </svg>
    </div>
  );
}

const STEPS = [
  {
    num: "01",
    tag: "define",
    title: "cast your audience",
    desc: "Compose consumers from real demographic data and behavioral segments. Load pre-built personas or generate new ones at scale.",
    visual: <AudienceVisual />,
    accent: "bg-blue-500",
  },
  {
    num: "02",
    tag: "broadcast",
    title: "deliver content",
    desc: "Send your ad, landing page, or campaign to every consumer simultaneously. Each reacts independently based on who they are.",
    visual: <BroadcastVisual />,
    accent: "bg-orange-500",
  },
  {
    num: "03",
    tag: "distill",
    title: "read the signal",
    desc: "Pull structured, segment-aware feedback: purchase intent, price perception, top concerns, channel fit — ready for your team.",
    visual: <InsightsVisual />,
    accent: "bg-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-32 border-t border-slate-200/70 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="mb-16 max-w-2xl">
            <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">how it works</div>
            <h2 className="font-mono text-3xl md:text-4xl text-slate-900 leading-tight">
              three steps from ad copy to actionable insight.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <RevealOnScroll key={step.num} delay={i * 120}>
              <div className="card-light overflow-hidden h-full flex flex-col">
                <div className="relative border-b border-slate-100">{step.visual}</div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${step.accent}`} />
                      <span className="text-xs font-mono text-slate-400">{step.num}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-mono text-slate-900 mb-2 leading-tight">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
