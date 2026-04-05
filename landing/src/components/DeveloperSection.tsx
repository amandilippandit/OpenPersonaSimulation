"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const TABS = [
  { id: "pip", label: "pip", cmd: "pip install git+https://github.com/amandilippandit/OpenPersonaSimulation.git" },
  { id: "uv", label: "uv", cmd: "uv pip install git+https://github.com/amandilippandit/OpenPersonaSimulation.git" },
  { id: "clone", label: "git clone", cmd: "git clone https://github.com/amandilippandit/OpenPersonaSimulation && cd OpenPersonaSimulation && pip install -e ." },
];

export default function DeveloperSection() {
  const [activeTab, setActiveTab] = useState("pip");
  const [copied, setCopied] = useState(false);

  const currentCmd = TABS.find((t) => t.id === activeTab)?.cmd || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="relative px-6 py-24 border-t border-slate-200/70 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-slate-400">&gt;_</span>
                  for developers
                </span>
              </div>
              <h2 className="font-mono text-2xl md:text-3xl text-slate-900 leading-tight">
                prefer code over UI?
              </h2>
              <p className="mt-3 text-sm text-slate-600 max-w-lg leading-relaxed">
                Import OpenPersona as a Python library and build persona-testing into
                your own workflows, CI pipelines, or data products.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/amandilippandit/OpenPersonaSimulation#readme"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-mono"
              >
                read docs →
              </a>
              <a
                href="https://github.com/amandilippandit/OpenPersonaSimulation"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-mono"
              >
                view source →
              </a>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="terminal-light p-5">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-3 pb-3 border-b border-slate-800">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    activeTab === t.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={handleCopy}
                className="text-slate-500 hover:text-slate-200 transition-colors p-1"
                aria-label="Copy"
              >
                {copied ? (
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 10V4a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* Command */}
            <div className="flex items-start gap-3 font-mono text-xs overflow-x-auto">
              <span className="text-slate-500 select-none flex-shrink-0">$</span>
              <span className="text-slate-100 whitespace-pre break-all">{currentCmd}</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Code example */}
        <RevealOnScroll delay={200}>
          <div className="mt-6 terminal-light p-5">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                example: test ad copy in 12 lines
              </span>
            </div>
            <pre className="text-xs font-mono text-slate-100 leading-relaxed overflow-x-auto">
              <code>{`from openpersona.agent import Persona
from openpersona.environment import World
from openpersona.extraction import ResultsExtractor

audience = [Persona(name) for name in ["Diane", "Jordan", "Tyler"]]
# ...define each consumer's persona...

room = World("Focus Group", audience)
room.make_everyone_accessible()
for agent in audience:
    agent.listen("Read this ad: " + your_ad_copy)
room.run(steps=2)

ResultsExtractor().extract_results_from_agents(audience,
    fields=["intent", "concern", "would_buy"])`}</code>
            </pre>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
