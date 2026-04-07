"use client";

import { useState } from "react";

interface CreateSimulationProps {
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function CreateSimulation({ onSubmit, onClose }: CreateSimulationProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("simulation name is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(name.trim());
      onClose();
    } catch (err) {
      setError((err as Error).message || "failed to create simulation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-sm mx-4 animate-reaction-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 font-mono">new simulation</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="text-xs font-mono text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
              simulation name
            </label>
            <div className="input-field px-3 py-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. focus group · apparel ad"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 px-4 py-2 text-xs font-mono rounded-md"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 px-4 py-2 text-xs font-mono rounded-md disabled:opacity-40"
            >
              {submitting ? "creating..." : "create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

