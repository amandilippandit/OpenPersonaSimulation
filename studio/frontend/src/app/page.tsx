"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import CreateSimulation from "@/components/CreateSimulation";

interface SimCard {
  id: string;
  name: string;
  created_at: string;
  agent_count: number;
  step_count: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [simulations, setSimulations] = useState<SimCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadSimulations = useCallback(async () => {
    try {
      const data = await api.listSimulations();
      setSimulations(data);
    } catch {
      // API might not be available
      setSimulations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSimulations();
  }, [loadSimulations]);

  const handleCreate = async (name: string) => {
    const sim = await api.createSimulation({ name });
    router.push(`/simulation/${sim.id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
              OpenPersona <span className="text-purple-400">Studio</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 font-mono">
              Multi-agent simulation visualization
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-purple-500/20"
          >
            + Create New
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500 font-mono text-sm">Loading simulations...</div>
            </div>
          ) : simulations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-300 mb-2">No simulations yet</h2>
              <p className="text-sm text-gray-500 mb-6 font-mono">
                Create your first simulation to get started
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Create Simulation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => router.push(`/simulation/${sim.id}`)}
                  className="text-left glass-panel rounded-xl p-5 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-200 group-hover:text-purple-300 transition-colors">
                      {sim.name}
                    </h3>
                    <svg
                      className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-gray-500">
                      <span className="text-gray-300 font-bold">{sim.agent_count}</span> agents
                    </span>
                    <span className="text-gray-500">
                      <span className="text-gray-300 font-bold">{sim.step_count}</span> steps
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-600 mt-3 font-mono">
                    {new Date(sim.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreate && (
        <CreateSimulation
          onSubmit={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
