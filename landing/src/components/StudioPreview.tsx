"use client";

import { useEffect, useState } from "react";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

export default function StudioPreview() {
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTyped(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full max-w-5xl">
      <div className="grid md:grid-cols-[360px_1fr] gap-6 md:gap-8">
        {/* LEFT: Instagram post */}
        <div className="relative">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
            instagram post
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-lg shadow-slate-900/5">
            {/* Post header */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-900">
                  Z
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-slate-900 truncate">zenmatt</div>
                <div className="text-[9px] text-slate-500 truncate">Sponsored · Sleep Co.</div>
              </div>
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="8" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="13" cy="8" r="1.5" />
              </svg>
            </div>

            {/* Post image — stylized product visual */}
            <div className="relative aspect-square bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {/* Ambient light */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-orange-500/20 blur-3xl" />
              {/* Bed silhouette */}
              <svg className="absolute bottom-0 w-full opacity-25" viewBox="0 0 400 120" fill="none">
                <rect x="40" y="70" width="320" height="40" rx="4" fill="#e2e8f0" />
                <rect x="40" y="50" width="320" height="25" rx="12" fill="#cbd5e1" />
                <rect x="70" y="30" width="80" height="30" rx="6" fill="#f1f5f9" />
                <rect x="250" y="30" width="80" height="30" rx="6" fill="#f1f5f9" />
              </svg>
              <div className="relative">
                <div className="text-[9px] font-mono text-orange-300 uppercase tracking-[0.2em] mb-2">smart sleep</div>
                <div className="font-serif text-white text-2xl leading-tight mb-3">
                  Sleep Better<br />Tonight.
                </div>
                <div className="inline-block px-3 py-1 rounded-full border border-white/30 text-[10px] font-mono text-white/90">
                  $899 · 90-night trial
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </div>

            {/* Caption */}
            <div className="px-3 pb-3">
              <div className="text-[11px] font-semibold text-slate-900 mb-0.5">1,247 likes</div>
              <div className="text-[11px] text-slate-800 leading-snug">
                <span className="font-semibold">zenmatt</span> The smart mattress that learns your patterns. Deep sleep, tracked. <span className="text-blue-600">#sleep #wellness #smarthome</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5">2 hours ago</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Claude-style response */}
        <div className="relative">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-orange-400 to-orange-600" />
            audience response
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 overflow-hidden">
            {/* Response header */}
            <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-100">
              <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8M4 5h8M4 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-900">openpersona</div>
                <div className="text-[10px] text-slate-500">tested against 24 synthetic consumers · 11.8s</div>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-mono text-emerald-700 font-semibold">complete</span>
              </div>
            </div>

            {/* Response body */}
            <div className="px-5 py-5 space-y-5">
              {/* Intro */}
              <div
                className={`text-sm text-slate-800 leading-relaxed transition-all duration-700 ${
                  typed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                I tested your Instagram post with a diverse audience of 24 synthetic
                consumers. Here&apos;s how they reacted:
              </div>

              {/* Sentiment callout */}
              <div
                className={`flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100 transition-all duration-700 ${
                  typed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: "120ms" }}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🎯</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 mb-0.5">Overall sentiment: Mixed but actionable</div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    Strong interest from 18-35 segments, price resistance from older buyers.
                  </div>
                </div>
              </div>

              {/* Key insights section */}
              <div
                className={`transition-all duration-700 ${typed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{ transitionDelay: "240ms" }}
              >
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2.5">key insights</div>
                <ul className="space-y-2 text-[13px] text-slate-700 leading-relaxed">
                  <li className="flex gap-2.5">
                    <span className="text-orange-500 font-bold">→</span>
                    <span>The <span className="font-semibold text-slate-900">90-night trial</span> is your strongest hook. Lead with it.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-orange-500 font-bold">→</span>
                    <span><span className="font-semibold text-slate-900">40% flagged $899 as too expensive</span> without visible proof points.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-orange-500 font-bold">→</span>
                    <span>Gen Z responded to aesthetic; millennials wanted the <span className="font-semibold text-slate-900">tech story</span>.</span>
                  </li>
                </ul>
              </div>

              {/* Segment breakdown */}
              <div
                className={`transition-all duration-700 ${typed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{ transitionDelay: "360ms" }}
              >
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2.5">intent by segment</div>
                <div className="space-y-2">
                  {[
                    { label: "young professionals", intent: 7.8, color: "bg-emerald-400", text: "text-emerald-700" },
                    { label: "gen z / trend-driven", intent: 6.4, color: "bg-blue-400", text: "text-blue-700" },
                    { label: "value-conscious parents", intent: 3.2, color: "bg-amber-400", text: "text-amber-700" },
                  ].map((s, i) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className="text-[11px] text-slate-700 flex-1 min-w-0 truncate">{s.label}</div>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                        <div
                          className={`h-full ${s.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{
                            width: typed ? `${(s.intent / 10) * 100}%` : "0%",
                            transitionDelay: `${500 + i * 120}ms`,
                          }}
                        />
                      </div>
                      <div className={`text-xs font-mono font-semibold tabular-nums w-8 text-right ${s.text}`}>
                        {s.intent.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div
                className={`flex items-start gap-2.5 p-3 rounded-lg bg-orange-50/70 border border-orange-100 transition-all duration-700 ${
                  typed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
                style={{ transitionDelay: "480ms" }}
              >
                <span className="text-xs font-mono text-orange-700 font-bold mt-0.5">TL;DR</span>
                <span className="text-[11px] text-orange-900 leading-snug flex-1">
                  Add a pinned review or &ldquo;10K slept better&rdquo; badge to the image to lift intent from older segments.
                </span>
              </div>
            </div>

            {/* Footer */}
            <a
              href={STUDIO_URL}
              className="flex items-center justify-between px-5 py-3 bg-slate-50/60 border-t border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <span className="text-[10px] font-mono text-slate-500">continue conversation</span>
              <span className="text-xs font-mono text-slate-900 font-semibold flex items-center gap-1.5 group-hover:gap-2 transition-all">
                open in studio
                <svg className="w-3 h-3 text-orange-500" viewBox="0 0 12 12" fill="none">
                  <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
