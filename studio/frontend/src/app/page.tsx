"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import CreateSimulation from "@/components/CreateSimulation";
import Logo from "@/components/Logo";

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
    <div className="h-screen flex flex-col bg-[#fafafa] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={20} />
            <span className="text-sm font-semibold text-slate-900">openpersona</span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">· studio</span>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary px-4 py-1.5 text-xs font-mono rounded-md"
          >
            + new simulation
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-10 animate-fade-up">
            <h1 className="font-mono text-2xl md:text-3xl text-slate-900 leading-tight mb-2">
              your simulations
            </h1>
            <p className="text-sm text-slate-500 font-mono">
              {simulations.length} active {simulations.length === 1 ? "simulation" : "simulations"}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-slate-400 font-mono text-xs">loading...</div>
            </div>
          ) : simulations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
              <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white flex items-center justify-center mb-4">
                <Logo size={24} />
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-1.5 font-mono">
                no simulations yet
              </h2>
              <p className="text-xs text-slate-500 mb-6 font-mono">
                create your first persona panel to get started
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary px-5 py-2.5 text-xs font-mono rounded-md"
              >
                + create simulation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {simulations.map((sim, i) => (
                <button
                  key={sim.id}
                  onClick={() => router.push(`/simulation/${sim.id}`)}
                  className="text-left card p-5 group animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                      {sim.name}
                    </h3>
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono mb-3">
                    <span className="text-slate-500">
                      <span className="text-slate-900 font-semibold">{sim.agent_count}</span> personas
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">
                      <span className="text-slate-900 font-semibold">{sim.step_count}</span> steps
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(sim.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
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

      {showCreate && (
        <CreateSimulation onSubmit={handleCreate} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}


