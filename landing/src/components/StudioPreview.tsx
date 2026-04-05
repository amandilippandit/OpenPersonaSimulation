"use client";

import { useEffect, useState } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

const REACTIONS = [
  {
    initials: "DM",
    name: "Diane Mitchell",
    segment: "Skeptical Parent",
    reaction: "$899 feels steep. I'd need to see real customer reviews first.",
    intent: 3,
    tone: "skeptical",
  },
  {
    initials: "JK",
    name: "Jordan Kim",
    segment: "Young Professional",
    reaction: "Love the 90-night trial. Risk-free is exactly what I need.",
    intent: 7,
    tone: "positive",
  },
  {
    initials: "TB",
    name: "Tyler Brooks",
    segment: "Impulse Shopper",
    reaction: "Ordering tonight. The tech feature sold me immediately.",
    intent: 9,
    tone: "enthusiastic",
  },
];

const TONE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  skeptical: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  positive: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  enthusiastic: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

export default function StudioPreview() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => (s + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
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

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Ad copy card */}
          <div
            className={`p-4 rounded-xl border border-slate-200 bg-slate-50/50 transition-all duration-500 ${
              stage >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
                ad copy under test
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse-dot" />
                broadcasting
              </div>
            </div>
            <div className="text-sm font-medium text-slate-900 leading-snug">
              Sleep Better Tonight. Meet ZenMatt — the smart mattress that learns your
              patterns. 90-night trial. $899.
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <div className="w-6 h-px bg-slate-300" />
              <span>3 consumers reacting</span>
              <div className="w-6 h-px bg-slate-300" />
            </div>
          </div>

          {/* Reaction cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {REACTIONS.map((r, i) => {
              const style = TONE_STYLES[r.tone];
              const visible = stage >= i + 1 || stage === 3;
              return (
                <div
                  key={r.initials}
                  className={`p-3 rounded-xl border border-slate-200 bg-white transition-all duration-500 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                      {r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-slate-900 truncate">
                        {r.name}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">{r.segment}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug mb-2 italic">
                    &ldquo;{r.reaction}&rdquo;
                  </p>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${style.bg}`}>
                    <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                    <span className={`text-[9px] font-mono ${style.text} uppercase tracking-wider`}>
                      intent
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${style.text}`}>
                      {r.intent}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregate insight */}
          <div
            className={`flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/60 transition-all duration-500 ${
              stage === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-semibold">
              ✓
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3 text-[10px] font-mono">
              <div>
                <div className="text-orange-700/60 uppercase tracking-wider text-[9px] mb-0.5">
                  avg intent
                </div>
                <div className="text-orange-900 font-semibold">6.3 / 10</div>
              </div>
              <div>
                <div className="text-orange-700/60 uppercase tracking-wider text-[9px] mb-0.5">
                  top concern
                </div>
                <div className="text-orange-900 font-semibold">price vs trust</div>
              </div>
              <div>
                <div className="text-orange-700/60 uppercase tracking-wider text-[9px] mb-0.5">
                  split
                </div>
                <div className="text-orange-900 font-semibold">2 buy · 1 skip</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              3 consumers online
            </span>
            <span className="text-slate-300">·</span>
            <span>step 1 of 3</span>
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
