"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Logo from "./Logo";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

// --- Persona profiles for node popups ---
const PROFILES = [
  { initials: "MC", name: "Maya Chen", segment: "Gen Z Creator" },
  { initials: "BT", name: "Ben Thompson", segment: "Value Seeker" },
  { initials: "PK", name: "Priya Kapoor", segment: "Luxury Millennial" },
  { initials: "TH", name: "Tom Henderson", segment: "Practical Buyer" },
  { initials: "DW", name: "David Walker", segment: "Early Adopter" },
  { initials: "EM", name: "Elena Morales", segment: "Impulse Shopper" },
  { initials: "MR", name: "Marcus Reed", segment: "Eco-Conscious" },
  { initials: "LF", name: "Laura Fitzgerald", segment: "Loyal Customer" },
  { initials: "RN", name: "Ryan Nakamura", segment: "Social Influencer" },
  { initials: "GC", name: "Grace Coleman", segment: "Premium Health" },
  { initials: "NP", name: "Nina Park", segment: "Researcher" },
  { initials: "NK", name: "Noah King", segment: "Minimalist" },
];

// --- Fibonacci sphere ---
function fibonacciSphere(n: number) {
  const nodes: { x: number; y: number; z: number; shade: number }[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodes.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
      shade: i % 3,
    });
  }
  return nodes;
}

// --- Nearest-neighbor edges (computed once from 3D positions) ---
function computeEdges(nodes: { x: number; y: number; z: number }[]) {
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => {
        const dx = n.x - nodes[i].x;
        const dy = n.y - nodes[i].y;
        const dz = n.z - nodes[i].z;
        return { j, d: dx * dx + dy * dy + dz * dz };
      })
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

const NODE_COUNT = 64;
const SPHERE_R = 88;
const CAMERA_Z = 380;
const SHADE_COLORS = ["#475569", "#94a3b8", "#cbd5e1"];

function RotatingGraph() {
  const basePositions = useMemo(() => fibonacciSphere(NODE_COUNT), []);
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
    const i = setInterval(() => setActiveIdx((v) => (v + 1) % NODE_COUNT), 2800);
    return () => clearInterval(i);
  }, []);

  // Project all nodes
  const projected = basePositions.map((p, i) => {
    const r = rotate(p.x, p.y, p.z, angle * 0.28, angle * 0.12);
    const scale = CAMERA_Z / (CAMERA_Z - r.z * SPHERE_R);
    return {
      idx: i,
      x: 120 + r.x * SPHERE_R * scale,
      y: 120 + r.y * SPHERE_R * scale,
      z: r.z,
      scale,
      shade: p.shade,
    };
  });

  const sorted = [...projected].sort((a, b) => a.z - b.z);
  const activeNode = projected[activeIdx];
  const activeProfile = PROFILES[activeIdx % PROFILES.length];

  // Position card to opposite side of active node
  const cardOnLeft = activeNode.x > 120;
  const cardX = cardOnLeft ? 8 : 148;

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        <defs>
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges — black with low opacity */}
        <g>
          {edges.map(([a, b], i) => {
            const na = projected[a];
            const nb = projected[b];
            // Skip edges where both nodes are in the back
            if (na.z < -0.4 && nb.z < -0.4) return null;
            const avgZ = (na.z + nb.z) / 2;
            const edgeOpacity = 0.12 + Math.max(0, (avgZ + 1) / 2) * 0.2;
            const isActiveEdge = a === activeIdx || b === activeIdx;
            return (
              <line
                key={`edge-${i}`}
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

        {/* Nodes — back to front */}
        {sorted.map((node) => {
          const isActive = node.idx === activeIdx;
          const radius = 5.5 * node.scale;
          const opacity = 0.35 + Math.max(0, (node.z + 1) / 2) * 0.65;
          const fillColor = isActive ? "#f97316" : SHADE_COLORS[node.shade];
          return (
            <g key={node.idx}>
              {isActive && (
                <circle cx={node.x} cy={node.y} r={radius + 6} fill="#f97316" opacity="0.18" filter="url(#nodeGlow)" />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={fillColor}
                opacity={isActive ? 1 : opacity}
              />
            </g>
          );
        })}

        {/* Connector line from active node to card */}
        <line
          x1={activeNode.x}
          y1={activeNode.y}
          x2={cardX + (cardOnLeft ? 84 : 0)}
          y2={activeNode.y}
          stroke="#0a0a14"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          opacity="0.3"
        />
      </svg>

      {/* Active persona card */}
      <div
        key={activeIdx}
        className="absolute pointer-events-none"
        style={{
          left: `${(cardX / 240) * 100}%`,
          top: `${(activeNode.y / 240) * 100}%`,
          transform: "translateY(-50%)",
          animation: "reactionIn 350ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div className="rounded-md border border-slate-900 bg-white shadow-md px-2 py-1.5 w-[84px]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[8px] font-bold text-orange-600">
              {activeProfile.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-semibold text-slate-900 truncate leading-tight">
                {activeProfile.name}
              </div>
              <div className="text-[7px] font-mono text-slate-500 truncate leading-tight">
                {activeProfile.segment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main component ---
export default function StudioPreview() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/5 overflow-hidden">
        {/* Top chrome */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <Logo size={18} />
            <span className="text-xs font-semibold text-slate-900">openpersona</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-mono text-emerald-700 font-semibold uppercase tracking-wider">live</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr]">
          {/* LEFT: Chat conversation */}
          <div className="p-5 md:p-6 border-r border-slate-100 space-y-5">
            {/* User message */}
            <div
              className={`flex gap-3 transition-all duration-500 ${
                stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2.5 14a5.5 5.5 0 0111 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-900 leading-relaxed mb-2">
                  Test this Instagram ad against our target audience.
                </div>
                {/* Attached IG post image */}
                <div className="inline-block rounded-lg border border-slate-200 overflow-hidden max-w-[240px]">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-slate-100 bg-slate-50/50">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-[1px]">
                      <div className="w-full h-full rounded-full bg-white" />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-900">zenmatt</span>
                    <span className="text-[9px] text-slate-400">· Sponsored</span>
                  </div>
                  <div className="relative aspect-square bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 flex items-center justify-center p-4 text-center overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-orange-500/25 blur-2xl" />
                    <svg className="absolute bottom-0 w-full opacity-20" viewBox="0 0 400 100" fill="none">
                      <rect x="40" y="60" width="320" height="35" rx="4" fill="#e2e8f0" />
                      <rect x="40" y="42" width="320" height="22" rx="10" fill="#cbd5e1" />
                      <rect x="70" y="22" width="80" height="28" rx="5" fill="#f1f5f9" />
                      <rect x="250" y="22" width="80" height="28" rx="5" fill="#f1f5f9" />
                    </svg>
                    <div className="relative">
                      <div className="text-[6px] font-mono text-orange-300 uppercase tracking-[0.2em] mb-1">smart sleep</div>
                      <div className="font-serif text-white text-base leading-tight mb-1.5">
                        Sleep Better<br />Tonight.
                      </div>
                      <div className="inline-block px-1.5 py-0.5 rounded-full border border-white/30 text-[7px] font-mono text-white/90">
                        $899 · 90-night trial
                      </div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1.5 text-[9px] font-mono text-slate-400 bg-slate-50/50 border-t border-slate-100">
                    zenmatt-ad-v3.png
                  </div>
                </div>
              </div>
            </div>

            {/* AI response */}
            <div
              className={`flex gap-3 transition-all duration-500 ${
                stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <div className="w-7 h-7 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                <Logo size={14} />
              </div>
              <div className="flex-1 min-w-0 text-xs text-slate-800 leading-relaxed space-y-3">
                <p>
                  I&apos;ll run this against a synthetic panel of{" "}
                  <span className="font-semibold text-slate-900">10,000 consumers</span>.
                </p>

                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">audience composition</div>
                  <ul className="space-y-1">
                    <li className="flex gap-2">
                      <span className="text-orange-500 font-semibold">·</span>
                      <span>Gen Z through Boomers</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-orange-500 font-semibold">·</span>
                      <span>US demographic distribution</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-orange-500 font-semibold">·</span>
                      <span>12 behavioral segments</span>
                    </li>
                  </ul>
                </div>

                <div className={`transition-all duration-500 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">reacting to</div>
                  <ul className="space-y-1">
                    <li className="flex gap-2">
                      <span className="text-slate-400 font-semibold">·</span>
                      <span>price sensitivity</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-slate-400 font-semibold">·</span>
                      <span>channel habits &amp; brand loyalty</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-slate-400 font-semibold">·</span>
                      <span>personality &amp; values alignment</span>
                    </li>
                  </ul>
                </div>

                {stage >= 3 && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "240ms" }} />
                    </span>
                    <span>simulating reactions</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Playground */}
          <div className="relative p-5 md:p-6 bg-slate-50/30">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                playground
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                <span className="text-slate-900 font-semibold">10,000</span> active
              </div>
            </div>
            <div className="relative aspect-square w-full flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full max-w-[280px] max-h-[280px]">
                  <RotatingGraph />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <a
          href={STUDIO_URL}
          className="flex items-center justify-end px-5 py-3 bg-slate-50/60 border-t border-slate-100 hover:bg-slate-50 transition-colors group"
        >
          <span className="text-xs font-mono text-slate-900 font-semibold flex items-center gap-1.5 group-hover:gap-2 transition-all">
            open in studio
            <svg className="w-3 h-3 text-orange-500" viewBox="0 0 12 12" fill="none">
              <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
