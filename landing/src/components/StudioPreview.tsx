"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

// --- Fibonacci sphere for the rotating graph ---
function fibonacciSphere(n: number) {
  const nodes: { x: number; y: number; z: number; color: string }[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  const colors = ["#475569", "#94a3b8", "#cbd5e1"];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodes.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
      color: colors[i % 3],
    });
  }
  return nodes;
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

const NODE_COUNT = 16;
const SPHERE_R = 85;
const CAMERA_Z = 400;

function RotatingGraph() {
  const basePositions = useMemo(() => fibonacciSphere(NODE_COUNT), []);
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
    const i = setInterval(() => setActiveIdx((v) => (v + 1) % NODE_COUNT), 2400);
    return () => clearInterval(i);
  }, []);

  const projected = basePositions.map((p, i) => {
    const r = rotate(p.x, p.y, p.z, angle * 0.35, angle * 0.15);
    const scale = CAMERA_Z / (CAMERA_Z - r.z * SPHERE_R);
    return {
      idx: i,
      x: 120 + r.x * SPHERE_R * scale,
      y: 120 + r.y * SPHERE_R * scale,
      z: r.z,
      scale,
      color: p.color,
    };
  });

  const sorted = [...projected].sort((a, b) => a.z - b.z);

  return (
    <svg viewBox="0 0 240 240" className="w-full h-full">
      <defs>
        <filter id="chatGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {sorted.map((n) => {
        const isActive = n.idx === activeIdx;
        const radius = 10 * n.scale;
        const opacity = 0.35 + Math.max(0, (n.z + 1) / 2) * 0.65;
        return (
          <g key={n.idx}>
            {isActive && (
              <circle cx={n.x} cy={n.y} r={radius + 8} fill="#f97316" opacity="0.15" filter="url(#chatGlow)" />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={radius}
              fill={isActive ? "#f97316" : n.color}
              opacity={isActive ? 1 : opacity}
            />
          </g>
        );
      })}
    </svg>
  );
}

// --- Main component ---
export default function StudioPreview() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/5 overflow-hidden">
        {/* Top chrome */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-400 to-orange-600" />
            <span className="text-xs font-semibold text-slate-900">marketing analysis</span>
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
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-slate-600">
                You
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
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8M4 5h8M4 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-xs text-slate-800 leading-relaxed space-y-2.5">
                <p>
                  Running this against <span className="font-semibold text-slate-900">24 synthetic consumers</span> spanning Gen Z, Millennials, and parents across US demographics.
                </p>
                <p className={`transition-all duration-500 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}>
                  Each persona is reacting independently based on their profile — price sensitivity, channel habits, brand loyalty. Watch the live simulation on the right →
                </p>
                {stage >= 3 && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "240ms" }} />
                    </span>
                    <span>analyzing responses</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Live rotating graph */}
          <div className="relative p-5 md:p-6 bg-slate-50/30">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                live simulation
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                16 active
              </div>
            </div>
            <div className="relative aspect-square w-full flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full max-w-[260px] max-h-[260px]">
                  <RotatingGraph />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-slate-400 mt-3 pt-3 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                active persona
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                audience
              </span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <a
          href={STUDIO_URL}
          className="flex items-center justify-between px-5 py-3 bg-slate-50/60 border-t border-slate-100 hover:bg-slate-50 transition-colors group"
        >
          <span className="text-[10px] font-mono text-slate-500">simulation running · bring your own api key</span>
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
