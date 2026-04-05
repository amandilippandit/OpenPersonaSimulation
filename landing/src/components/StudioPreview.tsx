"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Logo from "./Logo";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

// --- Persona profiles for node popups ---
interface Profile {
  initials: string;
  name: string;
  age: number;
  location: string;
  segment: string;
  income: string;
  channels: string;
  priceSensitivity: "high" | "medium" | "low";
  reaction: string;
  intentScore: number;
}

const PROFILES: Profile[] = [
  {
    initials: "JR", name: "Jordan Reyes", age: 27, location: "Los Angeles",
    segment: "Marathon Runner", income: "$78k", channels: "Strava · Instagram",
    priceSensitivity: "low", reaction: "Finally a brand that gets race-day prep",
    intentScore: 8.7,
  },
  {
    initials: "TM", name: "Tanya Mitchell", age: 34, location: "Denver",
    segment: "Weekend Warrior", income: "$92k", channels: "Instagram · YouTube",
    priceSensitivity: "medium", reaction: "Copy hits — but wait for a sale moment",
    intentScore: 6.1,
  },
  {
    initials: "MK", name: "Marcus Knight", age: 22, location: "Atlanta",
    segment: "Sneakerhead",      income: "$42k", channels: "TikTok · Discord",
    priceSensitivity: "medium", reaction: "If it drops limited I'm camping the app",
    intentScore: 9.1,
  },
  {
    initials: "AC", name: "Alex Chen", age: 29, location: "Brooklyn",
    segment: "Lifestyle Athlete", income: "$110k", channels: "Instagram · Podcasts",
    priceSensitivity: "low", reaction: "Love the mood. Feels earned, not hypey.",
    intentScore: 8.2,
  },
  {
    initials: "DW", name: "Diane Walker", age: 43, location: "Minneapolis",
    segment: "Budget Parent", income: "$64k", channels: "Search · Coupons",
    priceSensitivity: "high", reaction: "Not spending $140 on trainers for my kid",
    intentScore: 2.8,
  },
  {
    initials: "CB", name: "Chris Bell", age: 31, location: "Austin",
    segment: "Gym Regular", income: "$88k", channels: "YouTube · Reddit",
    priceSensitivity: "medium", reaction: "Need specs. Cushioning? Drop? Weight?",
    intentScore: 5.9,
  },
  {
    initials: "PS", name: "Priya Shah", age: 26, location: "San Francisco",
    segment: "Yoga Devotee", income: "$95k", channels: "Instagram · Email",
    priceSensitivity: "low", reaction: "Bold tone. Not sure it aligns with my practice.",
    intentScore: 4.3,
  },
  {
    initials: "RN", name: "Ryan Nakamura", age: 36, location: "Portland",
    segment: "Former Athlete", income: "$115k", channels: "Podcasts · Email",
    priceSensitivity: "medium", reaction: "The brand earned loyalty years ago. In.",
    intentScore: 8.8,
  },
  {
    initials: "MO", name: "Maya O'Connor", age: 19, location: "Chicago",
    segment: "Gen Z Fitness", income: "$28k", channels: "TikTok · Instagram",
    priceSensitivity: "high", reaction: "Obsessed with the ad but broke til payday",
    intentScore: 6.8,
  },
  {
    initials: "GS", name: "Greg Stevens", age: 52, location: "Phoenix",
    segment: "Walker / Casual", income: "$82k", channels: "TV · Facebook",
    priceSensitivity: "medium", reaction: "Looks like it's aimed at my kids, not me",
    intentScore: 3.7,
  },
  {
    initials: "ES", name: "Elena Santos", age: 38, location: "Miami",
    segment: "Wellness Mom", income: "$98k", channels: "Instagram · Podcasts",
    priceSensitivity: "medium", reaction: "Love the energy. Great gift for my husband.",
    intentScore: 7.2,
  },
  {
    initials: "NK", name: "Noah King", age: 30, location: "Seattle",
    segment: "Trail Runner", income: "$102k", channels: "Strava · Reddit",
    priceSensitivity: "low", reaction: "Would trust them for pavement, not trails",
    intentScore: 6.4,
  },
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
const CARD_WIDTH = 240;

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
  const activeProfile = PROFILES[activeIdx % PROFILES.length];

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

      {/* Active persona card — pinned to bottom-right, fixed width */}
      <div
        key={activeIdx}
        className="absolute pointer-events-none z-10"
        style={{
          bottom: "0px",
          right: "0px",
          width: `${CARD_WIDTH}px`,
          maxWidth: "calc(100% - 8px)",
          animation: "reactionIn 350ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div className="rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 p-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-600 flex-shrink-0">
              {activeProfile.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                {activeProfile.name}
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate leading-tight mt-0.5">
                {activeProfile.age} · {activeProfile.location}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider text-right leading-none mb-0.5">intent</div>
              <div className="text-sm font-mono font-bold text-slate-900 tabular-nums leading-none">
                {activeProfile.intentScore.toFixed(1)}
                <span className="text-[9px] font-normal text-slate-400">/10</span>
              </div>
            </div>
          </div>

          {/* Segment pill */}
          <div className="px-3 pt-3">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 border border-orange-100">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-mono text-orange-700 font-semibold">
                {activeProfile.segment}
              </span>
            </div>
          </div>

          {/* Marketing attributes */}
          <div className="grid grid-cols-2 gap-2 p-3 text-[10px] font-mono">
            <div>
              <div className="text-slate-400 uppercase tracking-wider text-[8px] mb-0.5">income</div>
              <div className="text-slate-700 font-semibold">{activeProfile.income}</div>
            </div>
            <div>
              <div className="text-slate-400 uppercase tracking-wider text-[8px] mb-0.5">price sens.</div>
              <div className="text-slate-700 font-semibold capitalize">{activeProfile.priceSensitivity}</div>
            </div>
            <div className="col-span-2">
              <div className="text-slate-400 uppercase tracking-wider text-[8px] mb-0.5">channels</div>
              <div className="text-slate-700">{activeProfile.channels}</div>
            </div>
          </div>

          {/* Reaction quote */}
          <div className="px-3 pb-3">
            <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-1">reaction</div>
            <div className="text-[11px] text-slate-700 italic leading-snug">
              &ldquo;{activeProfile.reaction}&rdquo;
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
              {/* User message — no avatar, right-aligned */}
              <div
                className={`flex justify-end transition-all duration-500 ${
                  stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                <div className="flex flex-col items-end gap-3 max-w-[85%]">
                  <div className="rounded-2xl bg-[#f4efe6] px-4 py-3">
                    <div
                      className="text-[13px] text-slate-900 leading-relaxed font-sans"
                      style={{ textAlign: "left", fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                      I want to test this Instagram ad against our core audience — young athletes, weekend warriors, and budget-conscious parents. Tell me which segments resonate and where the $140 price point breaks down.
                    </div>
                  </div>
                  {/* Attached IG post image */}
                  <div className="rounded-lg overflow-hidden border border-slate-200 w-[200px] transition-transform duration-300 ease-out hover:scale-[1.04] hover:shadow-xl hover:shadow-slate-900/15 cursor-pointer pointer-events-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hero-ad.jpg"
                      alt="Instagram ad being tested"
                      className="w-full h-auto block"
                    />
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
              <div className="absolute inset-0">
                <RotatingGraph />
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
