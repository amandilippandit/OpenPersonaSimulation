"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSimulation } from "@/hooks/useSimulation";
import SimulationGraph from "@/components/SimulationGraph";
import AgentInspector from "@/components/AgentInspector";
import EventFeed from "@/components/EventFeed";
import SimulationControls from "@/components/SimulationControls";
import AgentCreator from "@/components/AgentCreator";
import Logo from "@/components/Logo";

export default function SimulationPage() {
  const params = useParams();
  const router = useRouter();
  const simId = params.id as string;
  const [showAgentCreator, setShowAgentCreator] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center">
          <div className="w-7 h-7 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 font-mono text-xs">loading simulation...</p>
        </div>
      </div>
    );
  }

  const handleSelectAgent = (name: string | null) => {
    selectAgent(name);
    if (name) setInspectorOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-[#fafafa] text-slate-900">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-5 h-12 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl flex-shrink-0">
        <button
          onClick={() => router.push("/")}
          className="text-slate-500 hover:text-slate-900 transition-colors text-xs font-mono flex items-center gap-1.5"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M7 3L4 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          back
        </button>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-2">
          <Logo size={16} />
          <span className="text-xs font-semibold text-slate-900">openpersona</span>
          <span className="text-[10px] font-mono text-slate-400">
            · sim:{simId.slice(0, 8)}
          </span>
        </div>
        {error && (
          <span className="ml-auto text-[10px] font-mono text-red-500 truncate max-w-md">
            {error}
          </span>
        )}
      </header>

      {/* Controls */}
      <SimulationControls
        stepCount={stepCount}
        agentCount={agents.length}
        running={running}
        onAddAgent={() => setShowAgentCreator(true)}
        onStep={step}
        onRun={run}
      />

      {/* Main: Playground graph + optional right drawer */}
      <main className="flex-1 flex min-h-0 relative">
        {/* Left: Playground */}
        <section className="flex-1 relative min-w-0 bg-white">
          <div className="absolute top-4 left-5 z-10 flex items-center gap-3">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              playground
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              <span className="text-slate-900 font-semibold">{agents.length}</span> active
            </div>
          </div>
          <SimulationGraph
            nodes={graph.nodes}
            links={graph.links}
            glowingEdges={glowingEdges}
            onNodeClick={handleSelectAgent}
            selectedAgent={selectedAgent?.name || null}
          />

          {/* Floating agent chips */}
          {agents.length > 0 && (
            <div className="absolute bottom-4 left-5 right-5 flex items-center gap-1.5 overflow-x-auto">
              {agents.map((a) => (
                <button
                  key={a.name}
                  onClick={() => handleSelectAgent(a.name)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all flex-shrink-0 ${
                    selectedAgent?.name === a.name
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
                  }`}
                  title={typeof a.mental_state?.emotions === "string" ? a.mental_state.emotions : "neutral"}
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}

          {/* Inspector toggle */}
          <button
            onClick={() => setInspectorOpen(!inspectorOpen)}
            className="absolute top-4 right-5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-[11px] font-mono text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6 4v3M6 9v.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {inspectorOpen ? "hide" : "inspect"}
          </button>
        </section>

        {/* Right: Inspector drawer */}
        {inspectorOpen && (
          <aside className="w-80 border-l border-slate-200 bg-white flex-shrink-0 overflow-hidden animate-reaction-in">
            <AgentInspector
              agent={selectedAgent}
              onSendMessage={sendMessage}
              onClose={() => {
                selectAgent(null);
                setInspectorOpen(false);
              }}
            />
          </aside>
        )}
      </main>

      {/* Bottom event feed (collapsible) */}
      <div className="border-t border-slate-200/70 bg-white flex-shrink-0">
        <button
          onClick={() => setFeedOpen(!feedOpen)}
          className="w-full flex items-center justify-between px-5 h-9 text-[10px] font-mono text-slate-500 hover:text-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider">event feed</span>
            <span className="text-slate-400">·</span>
            <span>{events.length} events</span>
            {running && (
              <>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse-dot" />
                  live
                </span>
              </>
            )}
          </div>
          <svg
            className={`w-3 h-3 transition-transform ${feedOpen ? "rotate-180" : ""}`}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {feedOpen && (
          <div className="h-40 border-t border-slate-200/70 animate-fade-up">
            <EventFeed events={events} />
          </div>
        )}
      </div>

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
