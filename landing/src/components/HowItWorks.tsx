"use client";

import RevealOnScroll from "./RevealOnScroll";

// --- Step 1: Featured persona with roster behind ---
function AudienceVisual() {
  const roster = [
    { initials: "MC", name: "Maya", x: 12, y: 18 },
    { initials: "BT", name: "Ben", x: 78, y: 8 },
    { initials: "DW", name: "David", x: 82, y: 62 },
    { initials: "EM", name: "Elena", x: 8, y: 68 },
    { initials: "NK", name: "Noah", x: 48, y: 4 },
    { initials: "GC", name: "Grace", x: 50, y: 82 },
  ];
  return (
    <div className="relative h-64 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 overflow-hidden">
      {/* Background dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden>
        <defs>
          <pattern id="dotgrid-1" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="#cbd5e1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid-1)" />
      </svg>

      {/* Roster avatars around the perimeter */}
      {roster.map((p, i) => (
        <div
          key={p.initials}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">
            {p.initials}
          </div>
        </div>
      ))}

      {/* Featured central persona card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[200px] rounded-xl border border-orange-200 bg-white shadow-2xl shadow-orange-900/10 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center gap-2.5 p-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold text-white">
              PK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900 truncate leading-tight">Priya Kapoor</div>
              <div className="text-[10px] font-mono text-slate-500 truncate leading-tight">33 · New York</div>
            </div>
          </div>
          {/* Segment + attrs */}
          <div className="p-3 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 border border-orange-100">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-mono text-orange-700 font-semibold">Luxury Millennial</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono pt-1">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">◈</span>
                <span className="text-slate-600">$210k</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">∷</span>
                <span className="text-slate-600">Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Step 2: Content broadcasting with ripples + recipients ---
function BroadcastVisual() {
  return (
    <div className="relative h-64 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 overflow-hidden flex items-center justify-center">
      <svg viewBox="0 0 320 240" className="w-full h-full">
        <defs>
          <radialGradient id="bcastGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bcastAd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx="160" cy="120" r="110" fill="url(#bcastGlow)" />

        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="160"
            cy="120"
            r="40"
            fill="none"
            stroke="#f97316"
            strokeWidth="1"
            opacity="0.35"
            style={{
              animation: `ripple 3.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 1.06}s infinite`,
            }}
          />
        ))}

        {/* Recipient dots around perimeter */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
          const x = 160 + Math.cos(angle) * 95;
          const y = 120 + Math.sin(angle) * 80;
          const isOrange = i === 3;
          const isDark = i === 10;
          return (
            <g key={i}>
              <line
                x1="160"
                y1="120"
                x2={x}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="0.6"
                strokeDasharray="1 3"
                opacity="0.6"
              />
              <circle
                cx={x}
                cy={y}
                r={isOrange ? 5 : 4}
                fill={isOrange ? "#f97316" : isDark ? "#475569" : "#cbd5e1"}
              />
              {isOrange && (
                <circle cx={x} cy={y} r="9" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.3" />
              )}
            </g>
          );
        })}

        {/* Central content card — Instagram-style */}
        <g>
          <rect x="122" y="82" width="76" height="76" rx="8" fill="url(#bcastAd)" stroke="#334155" strokeWidth="0.5" />
          {/* Post header */}
          <circle cx="132" cy="92" r="3.5" fill="#fb923c" />
          <rect x="138" y="90.5" width="20" height="1.5" rx="0.75" fill="#64748b" />
          <rect x="138" y="94" width="12" height="1" rx="0.5" fill="#475569" />
          {/* Image area */}
          <rect x="128" y="100" width="64" height="38" rx="2" fill="#0f172a" />
          <text x="160" y="115" textAnchor="middle" fontSize="7" fill="#f97316" fontFamily="JetBrains Mono, monospace" fontWeight="700" letterSpacing="1">SLEEP</text>
          <text x="160" y="126" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="serif" fontStyle="italic">Better.</text>
          {/* Caption lines */}
          <rect x="128" y="144" width="52" height="1.2" rx="0.6" fill="#475569" />
          <rect x="128" y="148" width="36" height="1.2" rx="0.6" fill="#334155" />
          <rect x="128" y="152" width="44" height="1.2" rx="0.6" fill="#334155" />
        </g>
      </svg>
    </div>
  );
}

// --- Step 3: Full dashboard view ---
function InsightsVisual() {
  const bars = [
    { label: "luxury", value: 86, color: "bg-emerald-400" },
    { label: "early", value: 72, color: "bg-blue-400" },
    { label: "gen z", value: 64, color: "bg-orange-400" },
    { label: "practical", value: 48, color: "bg-purple-400" },
    { label: "value", value: 32, color: "bg-amber-400" },
  ];
  return (
    <div className="relative h-64 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 overflow-hidden flex items-center justify-center p-4">
      <div className="w-full max-w-[260px] rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
        {/* Big headline metric */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">purchase intent</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-mono font-bold text-slate-900 tabular-nums leading-none">6.3</span>
                <span className="text-[11px] font-mono text-slate-400">/ 10</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100">
                <svg className="w-2.5 h-2.5 text-emerald-600" viewBox="0 0 8 8" fill="none">
                  <path d="M1 5l2-2 4 4M3 3h4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="text-[9px] font-mono text-emerald-700 font-semibold">+12%</span>
              </div>
              {/* Mini sparkline */}
              <svg width="44" height="14" viewBox="0 0 44 14" className="opacity-60">
                <polyline points="0,10 6,8 12,9 18,6 24,7 30,4 36,5 44,2" fill="none" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Segment bars */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">by segment</span>
            <span className="text-[9px] font-mono text-slate-400">5 segments</span>
          </div>
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-600 w-14 truncate">{b.label}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.value}%` }} />
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-900 tabular-nums w-6 text-right">
                {(b.value / 10).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
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
                {/* Visual area — large, dominant */}
                <div className="relative border-b border-slate-100">
                  {step.visual}
                </div>

                {/* Text content */}
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
