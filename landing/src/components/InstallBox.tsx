"use client";

import { useState } from "react";

const TABS = [
  { id: "pip", label: "pip", cmd: "pip install openpersona" },
  { id: "uv", label: "uv", cmd: "uv add openpersona" },
  { id: "poetry", label: "poetry", cmd: "poetry add openpersona" },
  { id: "git", label: "git", cmd: "git clone https://github.com/amandilippandit/OpenPersonaSimulation" },
];

const MODES = [
  { id: "terminal", label: "terminal", icon: ">_" },
  { id: "studio", label: "studio", icon: "▣" },
  { id: "demo", label: "try demo", icon: "→" },
];

export default function InstallBox() {
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
    <div className="w-full max-w-2xl">
      {/* Mode selector */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider text-slate-400">install openpersona</span>
        <div className="flex items-center gap-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`tab-light ${activeMode === m.id ? "tab-light-active" : "tab-light-inactive"} flex items-center gap-1.5`}
            >
              <span className="text-[10px] opacity-70">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {activeMode === "terminal" && (
        <>
          <div className="flex items-center gap-1 mb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`tab-light ${activeTab === t.id ? "tab-light-active" : "tab-light-inactive"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="terminal-light p-4 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3 flex-1 font-mono text-sm overflow-x-auto">
              <span className="text-slate-500 select-none">$</span>
              <span className="text-slate-100 whitespace-nowrap">{currentCmd}</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-slate-500 hover:text-slate-200 transition-colors p-1 -m-1"
              aria-label="Copy to clipboard"
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

      {activeMode === "studio" && (
        <div className="terminal-light p-6">
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">launch the visual studio</div>
          <div className="font-mono text-sm text-slate-100 space-y-2">
            <div><span className="text-slate-500">$</span> uvicorn studio.backend.main:app --port 8000</div>
            <div><span className="text-slate-500">$</span> cd studio/frontend && npm run dev</div>
            <div className="text-slate-500 mt-3 text-xs"># 3D persona graph, live event feed, agent inspector</div>
          </div>
        </div>
      )}

      {activeMode === "demo" && (
        <div className="terminal-light p-6">
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-3">try it live</div>
          <a
            href={process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000"}
            className="block font-mono text-sm text-slate-100 hover:text-white transition-colors"
          >
            → open the studio in a new tab
          </a>
          <div className="text-slate-500 text-xs mt-2">no signup. runs against your local backend.</div>
        </div>
      )}
    </div>
  );
}
