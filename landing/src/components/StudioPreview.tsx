"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Logo from "./Logo";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

// --- Persona profiles for node popups ---
const PROFILES = [
  { initials: "MC", name: "Maya Chen", segment: "Gen Z Creator", location: "Los Angeles" },
  { initials: "BT", name: "Ben Thompson", segment: "Value Seeker", location: "Columbus" },
  { initials: "PK", name: "Priya Kapoor", segment: "Luxury Millennial", location: "New York" },
  { initials: "TH", name: "Tom Henderson", segment: "Practical Buyer", location: "Austin" },
  { initials: "DW", name: "David Walker", segment: "Early Adopter", location: "Seattle" },
  { initials: "EM", name: "Elena Morales", segment: "Impulse Shopper", location: "Miami" },
  { initials: "MR", name: "Marcus Reed", segment: "Eco-Conscious", location: "Portland" },
  { initials: "LF", name: "Laura Fitzgerald", segment: "Loyal Customer", location: "Boston" },
  { initials: "RN", name: "Ryan Nakamura", segment: "Social Influencer", location: "San Francisco" },
  { initials: "GC", name: "Grace Coleman", segment: "Premium Health", location: "Denver" },
  { initials: "NP", name: "Nina Park", segment: "Researcher", location: "Toronto" },
  { initials: "NK", name: "Noah King", segment: "Minimalist", location: "Brooklyn" },
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
const CARD_WIDTH = 150;

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
    const i = setInterval(() => setActiveIdx((v) => (v + 1) % NODE_COUNT), 3000);
    return () => clearInterval(i);
  }, []);

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
  const cardOnLeft = activeNode.x > 120;

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 240 240" className="w-full h-full">
        <defs>
          <filter id="chatNodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges — black with depth opacity */}
        <g>
          {edges.map(([a, b], i) => {
            const na = projected[a];
            const nb = projected[b];
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

        {/* Nodes */}
        {sorted.map((node) => {
          const isActive = node.idx === activeIdx;
          const radius = 5.5 * node.scale;
          const opacity = 0.35 + Math.max(0, (node.z + 1) / 2) * 0.65;
          const fillColor = isActive ? "#f97316" : SHADE_COLORS[node.shade];
          return (
            <g key={node.idx}>
              {isActive && (
                <circle cx={node.x} cy={node.y} r={radius + 6} fill="#f97316" opacity="0.18" filter="url(#chatNodeGlow)" />
              )}
              <circle cx={node.x} cy={node.y} r={radius} fill={fillColor} opacity={isActive ? 1 : opacity} />
            </g>
          );
        })}
      </svg>

      {/* Active persona card — bigger */}
      <div
        key={activeIdx}
        className="absolute pointer-events-none z-10"
        style={{
          left: cardOnLeft
            ? "4px"
            : `calc(${(activeNode.x / 240) * 100}% + 16px)`,
          right: cardOnLeft
            ? `calc(${((240 - activeNode.x) / 240) * 100}% + 16px)`
            : "4px",
          top: `${(activeNode.y / 240) * 100}%`,
          transform: "translateY(-50%)",
          maxWidth: `${CARD_WIDTH}px`,
          animation: "reactionIn 350ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div className="rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/10 p-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-600 flex-shrink-0">
              {activeProfile.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-slate-900 truncate leading-tight">
                {activeProfile.name}
              </div>
              <div className="text-[9px] font-mono text-slate-500 truncate leading-tight">
                {activeProfile.location}
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100">
            <span className="w-1 h-1 rounded-full bg-orange-500" />
            <span className="text-[9px] font-mono text-orange-700 font-semibold">
              {activeProfile.segment}
            </span>
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
    <div className="w-full max-w-4xl" style={{ textAlign: "left" }}>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/5 overflow-hidden">
        {/* Top chrome */}
        <div className="flex items-center px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <Logo size={18} />
            <span className="text-xs font-semibold text-slate-900">openpersona</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.2fr_1fr]">
          {/* LEFT: Chat conversation + input */}
          <div className="flex flex-col border-r border-slate-100">
            <div className="flex-1 p-5 md:p-6 space-y-5">
              {/* User message — avatar right, orange-tinted bubble, right-aligned row */}
              <div
                className={`flex flex-row-reverse gap-3 transition-all duration-500 ${
                  stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-orange-600" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.5 14a5.5 5.5 0 0111 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col items-end gap-2 max-w-[85%]">
                  <div className="rounded-lg bg-orange-50/70 border border-orange-100 px-3 py-2">
                    <div
                      className="text-xs text-slate-900 leading-relaxed"
                      style={{ textAlign: "right" }}
                    >
                      Test this Instagram ad against our target audience.
                    </div>
                  </div>
                  {/* Attached IG post image — just the picture, right-aligned */}
                  <div className="rounded-lg overflow-hidden border border-slate-200 w-[180px]">
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
                  </div>
                </div>
              </div>

              {/* AI response — left-aligned paragraphs */}
              <div
                className={`flex gap-3 transition-all duration-500 ${
                  stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                  <Logo size={20} />
                </div>
                <div
                  className="flex-1 min-w-0 text-xs text-slate-800 leading-relaxed space-y-3"
                  style={{ textAlign: "left" }}
                >
                  <p style={{ textAlign: "left" }}>
                    I&apos;ll run this against a synthetic panel of{" "}
                    <span className="font-semibold text-slate-900">10,000 consumers</span>{" "}
                    spanning Gen Z through Boomers, distributed across US demographics and twelve behavioral segments.
                  </p>

                  <p
                    className={`transition-all duration-500 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}
                    style={{ textAlign: "left" }}
                  >
                    Each persona reacts independently based on price sensitivity, channel habits, brand loyalty, and personality-values alignment. You&apos;ll see segment-specific signals surface in the playground on the right as the simulation propagates.
                  </p>

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

            {/* Chat input (disabled) */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200">
                {/* Plus button */}
                <button
                  type="button"
                  tabIndex={-1}
                  className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                  aria-label="Add"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {/* Attach button */}
                <button
                  type="button"
                  tabIndex={-1}
                  className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                  aria-label="Attach file"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13 7.5L8.5 12a3 3 0 11-4.24-4.24l5.3-5.3a2 2 0 012.83 2.83L7.08 10.59a1 1 0 01-1.41-1.42L10 4.8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {/* Input (disabled via readOnly) */}
                <input
                  type="text"
                  readOnly
                  placeholder="ask a question..."
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none font-mono cursor-default"
                />
                {/* Send button as SVG */}
                <button
                  type="button"
                  tabIndex={-1}
                  className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center flex-shrink-0 hover:bg-slate-800 transition-colors"
                  aria-label="Send"
                >
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8l12-6-4 13-3-5-5-2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
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
