"use client";

import { useEffect, useState } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

// Mini graph nodes positioned in a rough cluster
const NODES = [
  { id: 0, x: 55, y: 42, r: 10, emotion: "#f59e0b", active: false }, // amber - skeptical
  { id: 1, x: 82, y: 55, r: 12, emotion: "#f97316", active: true },  // orange - active
  { id: 2, x: 110, y: 38, r: 8, emotion: "#3b82f6", active: false }, // blue - neutral
  { id: 3, x: 135, y: 68, r: 9, emotion: "#22c55e", active: false }, // green - positive
  { id: 4, x: 68, y: 78, r: 8, emotion: "#a855f7", active: false },  // purple - thinking
  { id: 5, x: 105, y: 92, r: 9, emotion: "#22c55e", active: false }, // green - positive
  { id: 6, x: 40, y: 62, r: 7, emotion: "#64748b", active: false },  // slate - neutral
  { id: 7, x: 145, y: 48, r: 7, emotion: "#f59e0b", active: false }, // amber - skeptical
];

const EDGES = [
  [0, 1], [1, 2], [1, 3], [0, 4], [4, 5], [1, 5], [0, 6], [2, 7], [3, 7], [4, 6],
];

const EVENTS = [
  { agent: "Diane", action: "TALK", content: "I'd need to see reviews first", time: "11:03" },
  { agent: "Jordan", action: "TALK", content: "Love the 90-night trial", time: "11:03" },
  { agent: "Tyler", action: "THINK", content: "considering the price point", time: "11:03" },
  { agent: "Diane", action: "TALK", content: "$899 feels steep to me", time: "11:03" },
  { agent: "Jordan", action: "DONE", content: "", time: "11:03" },
];

const ACTION_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  TALK: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
  THINK: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-500" },
  DONE: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-500" },
  REACH_OUT: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500" },
};

export default function StudioPreview() {
  const [rotation, setRotation] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState(2);

  // Subtle graph rotation (CSS transform)
  useEffect(() => {
    const start = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      setRotation(((now - start) / 1000) * 8); // slow rotation
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Progressively reveal events
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleEvents((v) => (v >= EVENTS.length ? 2 : v + 1));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="px-3 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-400">
              studio.openpersona.dev
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400">live</div>
        </div>

        {/* Studio app — dark theme */}
        <div className="bg-[#0a0a14]">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-emerald-400">ready</span>
              </div>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">
                step <span className="text-slate-100 font-semibold">2</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">
                <span className="text-slate-100 font-semibold">8</span> agents
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 text-[10px] font-mono text-slate-300 border border-slate-700 rounded hover:border-slate-600 transition-colors">
                + add agent
              </button>
              <button className="px-2 py-1 text-[10px] font-mono text-white bg-blue-600 rounded hover:bg-blue-500 transition-colors">
                step
              </button>
              <button className="px-2 py-1 text-[10px] font-mono text-white bg-purple-600 rounded hover:bg-purple-500 transition-colors">
                run 5
              </button>
              <button className="px-2 py-1 text-[10px] font-mono text-white bg-purple-700 rounded hover:bg-purple-600 transition-colors">
                run 10
              </button>
            </div>
          </div>

          {/* Main panels */}
          <div className="grid grid-cols-5 gap-px bg-slate-800/50">
            {/* 3D Graph panel (3/5) */}
            <div className="col-span-3 bg-[#0a0a14] p-4 min-h-[260px] relative">
              <div className="absolute top-3 left-4 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                audience graph · 3d
              </div>
              <div className="absolute top-3 right-4 text-[9px] font-mono text-slate-500">
                8 nodes · 10 edges
              </div>
              <div className="flex items-center justify-center h-full pt-6">
                <svg
                  viewBox="0 0 200 130"
                  className="w-full max-w-xs"
                  style={{ transform: `rotateY(${rotation}deg)`, transformStyle: "preserve-3d" }}
                >
                  {/* Edges */}
                  <g opacity="0.3">
                    {EDGES.map(([a, b], i) => (
                      <line
                        key={`edge-${i}`}
                        x1={NODES[a].x}
                        y1={NODES[a].y}
                        x2={NODES[b].x}
                        y2={NODES[b].y}
                        stroke="#475569"
                        strokeWidth="0.6"
                      />
                    ))}
                  </g>
                  {/* Nodes */}
                  {NODES.map((n) => (
                    <g key={`node-${n.id}`}>
                      {n.active && (
                        <circle cx={n.x} cy={n.y} r={n.r + 5} fill={n.emotion} opacity="0.2" />
                      )}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={n.r}
                        fill={n.emotion}
                        opacity={n.active ? 1 : 0.85}
                      />
                    </g>
                  ))}
                </svg>
              </div>
              <div className="absolute bottom-2 left-4 flex items-center gap-3 text-[8px] font-mono text-slate-500">
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />positive</div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />skeptical</div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" />thinking</div>
              </div>
            </div>

            {/* Agent inspector (2/5) */}
            <div className="col-span-2 bg-[#0a0a14] p-4">
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-3">
                agent inspector
              </div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-[10px] font-semibold text-orange-400">
                  DM
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-100 truncate">Diane Mitchell</div>
                  <div className="text-[10px] text-slate-500 truncate">44 · Skeptical Parent</div>
                </div>
              </div>
              {/* Persona fields */}
              <div className="space-y-2 mb-3">
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">emotion</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-amber-400 font-mono">cautious</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">attention</div>
                  <div className="text-[10px] text-slate-300 font-mono">price point</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">latest</div>
                  <div className="text-[10px] text-slate-400 italic leading-snug">
                    &ldquo;$899 feels steep...&rdquo;
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800 text-[9px] font-mono">
                <div>
                  <span className="text-slate-500">actions </span>
                  <span className="text-slate-200">4</span>
                </div>
                <div>
                  <span className="text-slate-500">stimuli </span>
                  <span className="text-slate-200">3</span>
                </div>
                <div>
                  <span className="text-slate-500">mem </span>
                  <span className="text-slate-200">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event feed */}
          <div className="border-t border-slate-800 px-4 py-2.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">event feed</div>
              <div className="flex-1 h-px bg-slate-800" />
              <div className="text-[9px] font-mono text-slate-600">{EVENTS.length} events</div>
            </div>
            <div className="space-y-1">
              {EVENTS.slice(0, visibleEvents).map((e, i) => {
                const style = ACTION_STYLES[e.action];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[10px] font-mono"
                    style={{ animation: "fadeIn 400ms ease-out both" }}
                  >
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
                      <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                      <span className="text-[9px]">{e.action}</span>
                    </span>
                    <span className="text-slate-400 font-semibold">{e.agent}:</span>
                    <span className="text-slate-500 truncate flex-1">
                      {e.content || <span className="italic">finished turn</span>}
                    </span>
                    <span className="text-slate-600">{e.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar with CTA */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              connected
            </span>
            <span className="text-slate-300">·</span>
            <span>openai · gpt-5-mini</span>
          </div>
          <a
            href={STUDIO_URL}
            className="text-[10px] font-mono text-slate-900 hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            open in studio
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path d="M3 9l6-6M5 3h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
