"use client";

import AnimatedGraph from "./AnimatedGraph";
import { useEffect, useRef, useState } from "react";

const STAGES = [
  { label: "01", title: "define your audience", desc: "consumer personas with real demographic, behavioral, and channel attributes" },
  { label: "02", title: "content broadcasts", desc: "your ad, landing page, or campaign reaches each persona simultaneously" },
  { label: "03", title: "segments react", desc: "each consumer responds based on their profile, priors, and buying patterns" },
  { label: "04", title: "insights emerge", desc: "structured feedback per segment — intent, concerns, channel fit, price perception" },
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative px-6 py-32 border-t border-slate-200/70 overflow-hidden bg-white">
      <div className="relative max-w-6xl mx-auto">
        <div className={`mb-12 max-w-2xl reveal ${visible ? "visible" : ""}`}>
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse-dot" />
              synthetic audience network
            </span>
          </div>
          <h2 className="font-mono text-3xl md:text-4xl text-slate-900 leading-tight">
            every node is a consumer.
            <br />
            <span className="text-slate-500">every edge is an influence signal.</span>
          </h2>
          <p className="mt-4 text-sm text-slate-600 max-w-xl leading-relaxed">
            Each persona carries a full marketing profile — segment, channel preference,
            price sensitivity, loyalty tier. When you test content, this entire network
            reacts at once. Hover any node to inspect the consumer.
          </p>
        </div>

        {/* The 3D animated graph */}
        <div className={`reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "200ms" }}>
          <AnimatedGraph />
        </div>

        {/* Stage explainer strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/70 pt-10">
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              className={`reveal ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${400 + i * 100}ms` }}
            >
              <div className="text-[10px] font-mono text-slate-400 mb-2">{s.label}</div>
              <div className="text-sm font-mono text-slate-900 mb-1.5">{s.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
