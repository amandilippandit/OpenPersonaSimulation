"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000";

const TABS = [
  { id: "pip", label: "pip", cmd: "pip install git+https://github.com/amandilippandit/OpenPersonaSimulation.git" },
  { id: "uv", label: "uv", cmd: "uv pip install git+https://github.com/amandilippandit/OpenPersonaSimulation.git" },
  { id: "clone", label: "git clone", cmd: "git clone https://github.com/amandilippandit/OpenPersonaSimulation" },
];

const MODES = [
  { id: "terminal", label: "terminal", icon: ">_" },
  { id: "agent", label: "agent", icon: "◆" },
  { id: "demo", label: "try demo", icon: "→" },
];

export default function DeveloperSection() {
  const [activeTab, setActiveTab] = useState("pip");
  const [activeMode, setActiveMode] = useState("terminal");
  const [copied, setCopied] = useState(false);

  const currentCmd = TABS.find((t) => t.id === activeTab)?.cmd || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="relative px-6 py-28 border-t border-slate-200/70 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto text-center">
        <RevealOnScroll>
          <h2 className="font-mono text-4xl md:text-5xl text-slate-900 leading-[1.1] tracking-tight mb-4">
            prefer code.
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-10">
            Import OpenPersona as a Python library and build persona-testing into your
            own workflows, CI pipelines, or data products.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="w-full max-w-2xl mx-auto text-left">
            {/* Mode selector row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-slate-400">install openpersona</span>
              <div className="flex items-center gap-1">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMode(m.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                      activeMode === m.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <span className="text-[9px] opacity-70">{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {activeMode === "terminal" && (
              <>
                {/* Package manager tabs */}
                <div className="flex items-center gap-1 mb-2">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-3 py-1 rounded-md text-[12px] font-mono transition-all ${
                        activeTab === t.id
                          ? "bg-slate-200 text-slate-900"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Terminal block */}
                <div className="terminal-light p-5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3 flex-1 font-mono text-sm overflow-x-auto">
                    <span className="text-slate-500 select-none">&gt;</span>
                    <span className="text-slate-100 whitespace-nowrap">{currentCmd}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="text-slate-500 hover:text-slate-200 transition-colors p-1 -m-1 flex-shrink-0"
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
              </>
            )}

            {activeMode === "agent" && (
              <div className="terminal-light p-6">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 font-mono">
                  point your AI agent at the docs
                </div>
                <div className="font-mono text-sm text-slate-100 space-y-2">
                  <div>
                    <span className="text-slate-500">&gt;</span> Read openpersona docs and
                    build me a focus group that tests ad copy
                  </div>
                  <div className="text-slate-500 text-xs mt-3 pt-3 border-t border-slate-800">
                    # Works with Claude Code, Cursor, Codex
                  </div>
                </div>
              </div>
            )}

            {activeMode === "demo" && (
              <div className="terminal-light p-6">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 font-mono">
                  run the studio locally
                </div>
                <a
                  href={STUDIO_URL}
                  className="block font-mono text-sm text-slate-100 hover:text-white transition-colors"
                >
                  → open the studio in a new tab
                </a>
                <div className="text-slate-500 text-xs mt-3 pt-3 border-t border-slate-800">
                  # No signup. Runs against your local backend.
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* CTAs below */}
        <RevealOnScroll delay={200}>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href={STUDIO_URL}
              className="btn-primary-light px-5 py-2.5 rounded-md text-sm font-medium"
            >
              get started free
            </a>
            <a
              href="https://github.com/amandilippandit/OpenPersonaSimulation#readme"
              className="btn-ghost-light px-5 py-2.5 rounded-md text-sm font-medium"
            >
              read the docs
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
