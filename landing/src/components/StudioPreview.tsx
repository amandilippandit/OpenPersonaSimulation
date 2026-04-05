"use client";

import { useEffect, useState } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

// Persona nodes arranged around the central content node
const NODES = [
  { angle: 0,   intent: "high",   color: "#22c55e" },
  { angle: 45,  intent: "high",   color: "#22c55e" },
  { angle: 80,  intent: "medium", color: "#3b82f6" },
  { angle: 120, intent: "low",    color: "#f59e0b" },
  { angle: 160, intent: "medium", color: "#3b82f6" },
  { angle: 200, intent: "low",    color: "#f59e0b" },
  { angle: 240, intent: "medium", color: "#3b82f6" },
  { angle: 280, intent: "high",   color: "#22c55e" },
  { angle: 320, intent: "high",   color: "#22c55e" },
];

export default function StudioPreview() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/5 overflow-hidden">
        {/* Top chrome — Claude-style */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-400 to-orange-600" />
            <span className="text-xs font-semibold text-slate-900">marketing analysis</span>
            <span className="text-[10px] font-mono text-slate-400">· instagram post</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-mono text-emerald-700 font-semibold uppercase tracking-wider">live</span>
          </div>
        </div>

        {/* Split content */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* LEFT: Instagram post */}
          <div className="p-5 border-r border-slate-100">
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-3">content tested</div>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
              {/* Post header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[9px] font-bold text-slate-900">Z</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-slate-900 truncate">zenmatt</div>
                  <div className="text-[8px] text-slate-500 truncate">Sponsored</div>
                </div>
                <svg className="w-3 h-3 text-slate-400" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="8" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="13" cy="8" r="1.2" />
                </svg>
              </div>
              {/* Post image */}
              <div className="relative aspect-square bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-orange-500/25 blur-3xl" />
                <svg className="absolute bottom-0 w-full opacity-20" viewBox="0 0 400 100" fill="none">
                  <rect x="40" y="60" width="320" height="35" rx="4" fill="#e2e8f0" />
                  <rect x="40" y="42" width="320" height="22" rx="10" fill="#cbd5e1" />
                  <rect x="70" y="22" width="80" height="28" rx="5" fill="#f1f5f9" />
                  <rect x="250" y="22" width="80" height="28" rx="5" fill="#f1f5f9" />
                </svg>
                <div className="relative">
                  <div className="text-[7px] font-mono text-orange-300 uppercase tracking-[0.2em] mb-1.5">smart sleep</div>
                  <div className="font-serif text-white text-lg leading-tight mb-2">
                    Sleep Better<br />Tonight.
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-full border border-white/30 text-[8px] font-mono text-white/90">
                    $899 · 90-night trial
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                  <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                  <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </div>
                <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
              </div>
              {/* Caption */}
              <div className="px-3 pb-2.5">
                <div className="text-[10px] font-semibold text-slate-900">1,247 likes</div>
                <div className="text-[10px] text-slate-800 leading-snug mt-0.5">
                  <span className="font-semibold">zenmatt</span> The mattress that learns your sleep. <span className="text-blue-600">#sleep</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Simulation graph + results */}
          <div className="p-5">
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>audience reaction</span>
              <span className="text-slate-500">9 personas · 11.8s</span>
            </div>

            {/* Mini simulation graph */}
            <div className="relative rounded-lg border border-slate-200 bg-slate-50/50 p-4 mb-4">
              <svg viewBox="0 0 260 180" className="w-full h-auto">
                <defs>
                  <radialGradient id="preview-center" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#334155" />
                  </radialGradient>
                </defs>

                {/* Edges from center to each node */}
                {NODES.map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = 130 + Math.cos(rad) * 68;
                  const y = 90 + Math.sin(rad) * 55;
                  return (
                    <line
                      key={`edge-${i}`}
                      x1="130"
                      y1="90"
                      x2={x}
                      y2={y}
                      stroke="#cbd5e1"
                      strokeWidth="0.8"
                      opacity={animated ? 0.5 : 0}
                      style={{ transition: "opacity 600ms ease", transitionDelay: `${i * 60}ms` }}
                    />
                  );
                })}

                {/* Center content node */}
                <circle cx="130" cy="90" r="18" fill="url(#preview-center)" />
                <text x="130" y="94" textAnchor="middle" fontSize="7" fill="#f8fafc" fontFamily="JetBrains Mono, monospace" fontWeight="600">AD</text>

                {/* Persona nodes */}
                {NODES.map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = 130 + Math.cos(rad) * 68;
                  const y = 90 + Math.sin(rad) * 55;
                  return (
                    <g key={`node-${i}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill={node.color}
                        opacity={animated ? 0.9 : 0}
                        style={{
                          transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                          transitionDelay: `${150 + i * 60}ms`,
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="flex items-center justify-center gap-3 text-[9px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> high (4)</div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> medium (3)</div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> low (2)</div>
              </div>
            </div>

            {/* Key metrics */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">avg intent</span>
                  <span className="text-sm font-mono font-semibold text-slate-900">
                    6.3<span className="text-slate-400 text-[10px] font-normal"> /10</span>
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: animated ? "63%" : "0%", transitionDelay: "400ms" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">would share</span>
                  <span className="text-sm font-mono font-semibold text-slate-900">
                    47<span className="text-slate-400 text-[10px] font-normal">%</span>
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: animated ? "47%" : "0%", transitionDelay: "550ms" }}
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-orange-50/70 border border-orange-100">
                <svg className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                  <path d="M8 5v3.5M8 11v.5M1.5 14h13L8 2 1.5 14z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-[10px] text-orange-900 leading-snug">
                  <span className="font-semibold">Top concern:</span> $899 reads as steep without social proof. Add review badge.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <a
          href={STUDIO_URL}
          className="flex items-center justify-between px-5 py-3 bg-slate-50/60 border-t border-slate-100 hover:bg-slate-50 transition-colors group"
        >
          <span className="text-[10px] font-mono text-slate-500">analysis complete · 3 segments profiled</span>
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
