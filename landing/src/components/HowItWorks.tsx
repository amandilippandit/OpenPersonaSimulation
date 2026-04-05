"use client";

import RevealOnScroll from "./RevealOnScroll";

// --- Step 1: Audience chips fanned out ---
function AudienceVisual() {
  const chips = [
    { initials: "MC", name: "Maya", tag: "Gen Z", rotate: -8, offset: -36, z: 1, accent: false },
    { initials: "BT", name: "Ben", tag: "Value", rotate: -2, offset: -12, z: 2, accent: false },
    { initials: "PK", name: "Priya", tag: "Luxury", rotate: 3, offset: 12, z: 4, accent: true },
    { initials: "DW", name: "David", tag: "Early", rotate: 9, offset: 36, z: 3, accent: false },
  ];
  return (
    <div className="relative h-36 flex items-center justify-center overflow-hidden">
      {chips.map((chip, i) => (
        <div
          key={chip.initials}
          className="absolute transition-transform"
          style={{
            transform: `translateX(${chip.offset}px) rotate(${chip.rotate}deg)`,
            zIndex: chip.z,
          }}
        >
          <div
            className={`w-[88px] rounded-lg border px-2 py-2 shadow-md ${
              chip.accent
                ? "bg-orange-50 border-orange-300"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                  chip.accent ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {chip.initials}
              </div>
              <span className="text-[10px] font-semibold text-slate-900">{chip.name}</span>
            </div>
            <div
              className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono ${
                chip.accent ? "bg-white text-orange-700" : "bg-slate-50 text-slate-500"
              }`}
            >
              {chip.tag}
            </div>
          </div>
        </div>
      ))}
      {/* Ambient dots */}
      <div className="absolute top-2 left-4 w-1 h-1 rounded-full bg-slate-200" />
      <div className="absolute top-4 right-6 w-1 h-1 rounded-full bg-slate-200" />
      <div className="absolute bottom-3 right-4 w-1 h-1 rounded-full bg-slate-300" />
    </div>
  );
}

// --- Step 2: Broadcast ripples ---
function BroadcastVisual() {
  return (
    <div className="relative h-36 flex items-center justify-center">
      <svg viewBox="0 0 200 140" className="w-full h-full">
        <defs>
          <radialGradient id="broadcastGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Ripples */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="100"
            cy="70"
            r="20"
            fill="none"
            stroke="#f97316"
            strokeWidth="0.8"
            opacity="0.3"
            style={{
              animation: `ripple 3s cubic-bezier(0.16, 1, 0.3, 1) ${i * 1}s infinite`,
            }}
          />
        ))}
        {/* Outer ring of recipient dots */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = 100 + Math.cos(angle) * 55;
          const y = 70 + Math.sin(angle) * 45;
          return (
            <g key={i}>
              <line
                x1="100"
                y1="70"
                x2={x}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="0.5"
                strokeDasharray="1 2"
              />
              <circle
                cx={x}
                cy={y}
                r="3"
                fill={i === 4 ? "#f97316" : i === 8 ? "#64748b" : "#cbd5e1"}
              />
            </g>
          );
        })}
        {/* Central ad card */}
        <g>
          <rect x="75" y="52" width="50" height="36" rx="4" fill="url(#broadcastGrad)" />
          <rect
            x="75"
            y="52"
            width="50"
            height="36"
            rx="4"
            fill="#0f172a"
            stroke="#1e293b"
          />
          <text x="100" y="68" textAnchor="middle" fontSize="6" fill="#f97316" fontFamily="JetBrains Mono, monospace" fontWeight="600">AD</text>
          <rect x="82" y="72" width="36" height="1.5" rx="0.75" fill="#475569" />
          <rect x="82" y="76" width="28" height="1.5" rx="0.75" fill="#334155" />
          <rect x="82" y="80" width="32" height="1.5" rx="0.75" fill="#334155" />
        </g>
        {/* Pulse center dot */}
        <circle cx="100" cy="70" r="2" fill="#f97316" />
      </svg>
    </div>
  );
}

// --- Step 3: Insight dashboard ---
function InsightsVisual() {
  const bars = [
    { label: "luxury", value: 86, color: "bg-emerald-400" },
    { label: "early", value: 72, color: "bg-blue-400" },
    { label: "gen z", value: 64, color: "bg-orange-400" },
    { label: "value", value: 32, color: "bg-amber-400" },
  ];
  return (
    <div className="relative h-36 flex items-center justify-center p-2">
      <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm p-3">
        {/* Headline metric */}
        <div className="flex items-baseline justify-between mb-3 pb-2.5 border-b border-slate-100">
          <div>
            <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider leading-none mb-1">
              avg intent
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-slate-900 tabular-nums leading-none">
                6.3
              </span>
              <span className="text-[10px] font-mono text-slate-400">/10</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100">
            <svg className="w-2 h-2 text-emerald-600" viewBox="0 0 8 8" fill="none">
              <path d="M1 5l2-2 4 4M3 3h4v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="text-[8px] font-mono text-emerald-700 font-semibold">+12%</span>
          </div>
        </div>
        {/* Segment bars */}
        <div className="space-y-1.5">
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-500 w-10 truncate">{b.label}</span>
              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${b.color} rounded-full`}
                  style={{ width: `${b.value}%` }}
                />
              </div>
              <span className="text-[9px] font-mono font-semibold text-slate-700 tabular-nums w-6 text-right">
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
                {/* Visual area (top) */}
                <div className="relative bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                  {step.visual}
                </div>

                {/* Text content (bottom) */}
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
