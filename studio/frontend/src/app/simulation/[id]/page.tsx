"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSimulation } from "@/hooks/useSimulation";
import SimulationGraph from "@/components/SimulationGraph";
import AgentInspector from "@/components/AgentInspector";
import SimulationControls from "@/components/SimulationControls";
import AgentCreator from "@/components/AgentCreator";
import Logo from "@/components/Logo";

const ACTION_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  TALK: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  THINK: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  DONE: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  REACH_OUT: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

export default function SimulationPage() {
  const params = useParams();
  const router = useRouter();
  const simId = params.id as string;
  const [showAgentCreator, setShowAgentCreator] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    agents,
    graph,
    events,
    selectedAgent,
    stepCount,
    loading,
    running,
    error,
    glowingEdges,
    addAgent,
    step,
    run,
    sendMessage,
    selectAgent,
  } = useSimulation(simId);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="w-7 h-7 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 font-mono text-xs">loading simulation...</p>
        </div>
      </div>
    );
  }

  const handleBroadcast = async () => {
    if (!chatInput.trim() || broadcastSending || agents.length === 0) return;
    setBroadcastSending(true);
    try {
      // Send the message to all agents
      for (const a of agents) {
        await sendMessage(a.name, chatInput);
      }
      setChatInput("");
    } finally {
      setBroadcastSending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#fafafa] text-slate-900">
      {/* Top chrome — matches the landing hero panel */}
      <header className="flex items-center justify-between px-5 h-12 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
              <path d="M7 3L4 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <Logo size={18} />
          <span className="text-xs font-semibold text-slate-900">openpersona</span>
        </div>
        {error && (
          <span className="text-[10px] font-mono text-red-500 truncate max-w-sm">{error}</span>
        )}
      </header>

      {/* Controls bar */}
      <SimulationControls
        stepCount={stepCount}
        agentCount={agents.length}
        running={running}
        onAddAgent={() => setShowAgentCreator(true)}
        onStep={step}
        onRun={run}
      />

      {/* Main split: Chat left | Playground right */}
      <main className="flex-1 flex min-h-0">
        {/* LEFT: Chat conversation + Event feed */}
        <section className="flex-[1.2] flex flex-col border-r border-slate-200/70 min-w-0">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Welcome message — always shows at the top */}
            <div className="flex gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Logo size={20} />
              </div>
              <div className="flex-1 min-w-0 text-[13px] text-slate-700 leading-relaxed space-y-2" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                <p>
                  <span className="font-semibold text-slate-900">Welcome back.</span>{" "}
                  {agents.length === 0
                    ? "Start by adding personas to your audience panel, then paste your ad copy or campaign content below to begin testing."
                    : `You have ${agents.length} persona${agents.length === 1 ? "" : "s"} ready in the playground. Paste your ad copy, landing page text, or campaign message below — each persona will react independently based on their profile.`
                  }
                </p>
                {agents.length === 0 && (
                  <button
                    onClick={() => setShowAgentCreator(true)}
                    className="btn-primary px-3 py-1.5 text-[11px] font-mono rounded-md inline-flex items-center gap-1.5"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    add your first persona
                  </button>
                )}
              </div>
            </div>

            {/* Event messages rendered as chat bubbles */}
            {events.map((event, i) => {
              const kind = (event.kind || event.type || "").toUpperCase();
              const style = ACTION_STYLES[kind] || ACTION_STYLES.DONE;
              const isUserStimulus = kind === "STIMULUS" || kind === "LISTEN";

              if (isUserStimulus) {
                // User message — right-aligned cream bubble
                return (
                  <div key={i} className="flex justify-end animate-fade-up">
                    <div className="max-w-[80%] rounded-2xl bg-[#f4efe6] px-4 py-3">
                      <div className="text-[13px] text-slate-900 leading-relaxed" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                        {event.content || "(stimulus)"}
                      </div>
                      {event.agent && (
                        <div className="text-[9px] font-mono text-slate-500 mt-1.5 text-right">
                          → {event.agent}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // AI/persona response — left-aligned with logo
              return (
                <div key={i} className="flex gap-3 animate-fade-up">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Logo size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-semibold text-slate-900">
                        {event.agent}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold ${style.bg} ${style.text}`}
                      >
                        <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                        {kind}
                      </span>
                      {event.target && (
                        <span className="text-[9px] font-mono text-slate-400">
                          → {event.target}
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] text-slate-700 leading-relaxed" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
                      {event.content || <span className="italic text-slate-400">finished turn</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator when running */}
            {running && (
              <div className="flex gap-3 animate-fade-up">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                  <Logo size={18} />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-2">
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "240ms" }} />
                  </span>
                  <span>simulating reactions</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-slate-100 bg-white flex-shrink-0">
            <div className="input-field flex items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => setShowAgentCreator(true)}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                aria-label="Add persona"
                title="Add persona"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBroadcast()}
                placeholder={agents.length === 0 ? "add personas first..." : "paste ad copy or ask a question..."}
                disabled={agents.length === 0}
                className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none font-mono disabled:cursor-not-allowed"
              />
              <button
                onClick={handleBroadcast}
                disabled={broadcastSending || !chatInput.trim() || agents.length === 0}
                className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center flex-shrink-0 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                {broadcastSending ? (
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8l12-6-4 13-3-5-5-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: Playground graph + Inspector */}
        <section className="flex-1 flex flex-col min-w-0 bg-white relative">
          <div className="absolute top-4 left-5 z-10 flex items-center gap-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              playground
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              <span className="text-slate-900 font-semibold">{agents.length}</span> active
            </div>
          </div>

          {/* Inspector toggle */}
          {selectedAgent && (
            <button
              onClick={() => selectAgent(null)}
              className="absolute top-4 right-5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-[11px] font-mono text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              close
            </button>
          )}

          <div className="flex-1 flex min-h-0">
            {/* Graph */}
            <div className="flex-1 min-w-0">
              <SimulationGraph
                nodes={graph.nodes}
                links={graph.links}
                glowingEdges={glowingEdges}
                onNodeClick={(name) => selectAgent(name)}
                selectedAgent={selectedAgent?.name || null}
              />
            </div>

            {/* Inspector drawer */}
            {selectedAgent && (
              <div className="w-72 border-l border-slate-200 bg-white flex-shrink-0 overflow-hidden animate-reaction-in">
                <AgentInspector
                  agent={selectedAgent}
                  onSendMessage={sendMessage}
                  onClose={() => selectAgent(null)}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-end px-5 h-9 border-t border-slate-200/70 bg-white/80 flex-shrink-0">
        <span className="text-[10px] font-mono text-slate-400">
          {events.length} events · step {stepCount}
        </span>
      </footer>

      {/* Agent Creator Modal */}
      {showAgentCreator && (
        <AgentCreator
          onSubmit={addAgent}
          onClose={() => setShowAgentCreator(false)}
        />
      )}
    </div>
  );
}

