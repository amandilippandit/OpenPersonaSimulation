"use client";

import { useEffect, useState } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

const SEGMENTS = [
  { label: "skeptical parents", share: 28, intent: 3.1, color: "bg-amber-400" },
  { label: "young professionals", share: 52, intent: 7.2, color: "bg-blue-400" },
  { label: "impulse shoppers", share: 20, intent: 9.0, color: "bg-emerald-400" },
];

export default function StudioPreview() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-900 font-semibold">audience report</div>
              <div className="text-[10px] font-mono text-slate-400">24 synthetic consumers · gpt-5-mini</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-mono text-emerald-700 font-semibold uppercase tracking-wider">live</span>
          </div>
        </div>

        {/* Content being tested */}
        <div className="px-6 pt-5 pb-4">
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">content tested</div>
          <div className="text-sm text-slate-700 leading-relaxed font-medium">
            &ldquo;Sleep Better Tonight. Meet ZenMatt — the smart mattress that learns your patterns. 90-night trial. $899.&rdquo;
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-slate-100" />

        {/* Key metrics */}
        <div className="px-6 py-5 space-y-4">
          {/* Purchase Intent */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">purchase intent</span>
              <span className="text-sm font-mono font-semibold text-slate-900">
                6.3<span className="text-slate-400 text-xs font-normal"> / 10</span>
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                style={{ width: animated ? "63%" : "0%" }}
              />
            </div>
          </div>

          {/* Willingness to Share */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">willingness to share</span>
              <span className="text-sm font-mono font-semibold text-slate-900">
                47<span className="text-slate-400 text-xs font-normal">%</span>
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                style={{ width: animated ? "47%" : "0%", transitionDelay: "150ms" }}
              />
            </div>
          </div>

          {/* Top Concern */}
          <div className="pt-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">top concern</div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50/70 border border-orange-100">
              <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M8 5v3.5M8 11v.5M1.5 14h13L8 2 1.5 14z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs text-orange-900 leading-snug">
                $899 price point feels steep to 40% of audience — needs stronger social proof
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-slate-100" />

        {/* By segment */}
        <div className="px-6 py-5">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-4">by segment</div>
          <div className="space-y-3">
            {SEGMENTS.map((seg, i) => (
              <div key={seg.label} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${seg.color}`} />
                      <span className="text-xs text-slate-700 truncate">{seg.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">{seg.share}%</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-900 flex-shrink-0 tabular-nums">
                      {seg.intent.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${seg.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: animated ? `${(seg.intent / 10) * 100}%` : "0%",
                        transitionDelay: `${300 + i * 120}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <a
          href={STUDIO_URL}
          className="flex items-center justify-between px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 hover:bg-slate-50 transition-colors group"
        >
          <span className="text-xs font-mono text-slate-500">generated in 14.2s · 3 scenarios</span>
          <span className="text-xs font-mono text-slate-900 font-semibold flex items-center gap-1.5 group-hover:gap-2 transition-all">
            view full report
            <svg className="w-3 h-3 text-orange-500" viewBox="0 0 12 12" fill="none">
              <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
