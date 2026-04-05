"use client";

import AnimatedGraph from "./AnimatedGraph";
import { useEffect, useRef, useState } from "react";

const STAGES = [
  { label: "01", title: "content broadcasts", desc: "your ad, tagline, or campaign arrives at every persona simultaneously" },
  { label: "02", title: "personas react", desc: "each consumer responds based on their demographics, traits, and biases" },
  { label: "03", title: "personas discuss", desc: "agents hear each other and update their reactions — word of mouth emerges" },
  { label: "04", title: "insights extract", desc: "structured feedback — intent, concerns, sentiment — ready for your team" },
];

export default function GraphSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative px-6 py-32 border-t border-ink-800/50 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)",
            animation: "pulseGlow 8s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className={`mb-16 max-w-2xl reveal ${visible ? "visible" : ""}`}>
          <div className="text-xs uppercase tracking-wider text-ink-500 mb-3">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" />
              live visualization
            </span>
          </div>
          <h2 className="font-mono text-3xl md:text-4xl text-white leading-tight">
            watch your content propagate through a synthetic audience.
          </h2>
          <p className="mt-4 text-sm text-ink-400 max-w-xl leading-relaxed">
            Each persona receives the stimulus, reacts based on their profile, and
            updates as they hear from others. What emerges is structured, actionable
            marketing signal — no focus group required.
          </p>
        </div>

        {/* The animated graph */}
        <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "200ms" }}>
          <AnimatedGraph />
        </div>

        {/* Stage explainer strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              className={`reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${400 + i * 100}ms` }}
            >
              <div className="text-[10px] font-mono text-ink-600 mb-2">{s.label}</div>
              <div className="text-sm font-mono text-white mb-1.5">{s.title}</div>
              <div className="text-xs text-ink-500 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
