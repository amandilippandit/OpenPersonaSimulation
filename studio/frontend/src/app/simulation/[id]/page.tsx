"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSimulation } from "@/hooks/useSimulation";
import SimulationGraph from "@/components/SimulationGraph";
import AgentInspector from "@/components/AgentInspector";
import EventFeed from "@/components/EventFeed";
import SimulationControls from "@/components/SimulationControls";
import AgentCreator from "@/components/AgentCreator";

export default function SimulationPage() {
  const params = useParams();
  const router = useRouter();
  const simId = params.id as string;
  const [showAgentCreator, setShowAgentCreator] = useState(false);

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
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-mono text-sm">Loading simulation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-mono"
        >
          &lt;- Back
        </button>
        <div className="w-px h-5 bg-gray-800" />
        <h1 className="text-sm font-semibold text-gray-200">
          OpenPersona <span className="text-purple-400">Studio</span>
        </h1>
        <span className="text-xs font-mono text-gray-600">sim:{simId.slice(0, 8)}</span>
        {error && (
          <span className="ml-auto text-xs text-red-400 font-mono truncate max-w-md">{error}</span>
        )}
      </div>

      {/* Controls */}
      <SimulationControls
        stepCount={stepCount}
        agentCount={agents.length}
        running={running}
        onAddAgent={() => setShowAgentCreator(true)}
        onStep={step}
        onRun={run}
      />

      {/* Main content: graph + inspector */}
      <div className="flex-1 flex min-h-0">
        {/* Left: 3D Graph */}
        <div className="flex-[3] relative min-w-0">
          <SimulationGraph
            nodes={graph.nodes}
            links={graph.links}
            glowingEdges={glowingEdges}
            onNodeClick={(name) => selectAgent(name)}
            selectedAgent={selectedAgent?.name || null}
          />
          {/* Floating agent count */}
          {agents.length > 0 && (
            <div className="absolute top-4 left-4 glass-panel rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                {agents.map((a) => (
                  <button
                    key={a.name}
                    onClick={() => selectAgent(a.name)}
                    className={`text-xs font-mono px-2 py-1 rounded-md transition-colors ${
                      selectedAgent?.name === a.name
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                    title={`${a.name} - ${a.mental_state?.emotions || "neutral"}`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Agent Inspector */}
        <div className="w-80 border-l border-gray-800 bg-gray-900/70 backdrop-blur-md overflow-hidden flex-shrink-0">
          <AgentInspector
            agent={selectedAgent}
            onSendMessage={sendMessage}
            onClose={() => selectAgent(null)}
          />
        </div>
      </div>

      {/* Bottom: Event Feed */}
      <div className="h-44 border-t border-gray-800 bg-gray-900/70 backdrop-blur-md flex-shrink-0">
        <EventFeed events={events} />
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
