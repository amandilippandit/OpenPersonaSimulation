"use client";

import { useState } from "react";
import type { CreateAgentPayload } from "@/types";

interface AgentCreatorProps {
  onSubmit: (payload: CreateAgentPayload) => Promise<void>;
  onClose: () => void;
}

export default function AgentCreator({ onSubmit, onClose }: AgentCreatorProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(30);
  const [nationality, setNationality] = useState("");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [personality, setPersonality] = useState("");
  const [interests, setInterests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("name is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        name: name.trim(),
        age,
        nationality: nationality.trim(),
        occupation: { title: title.trim(), organization: organization.trim() },
        personality: {
          traits: personality.split(",").map((s) => s.trim()).filter(Boolean),
        },
        preferences: {
          interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
        },
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || "failed to create agent");
    } finally {
      setSubmitting(false);
    }
  };

  const labelCls = "block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 w-full max-w-md animate-reaction-in max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-sm font-semibold text-slate-900 font-mono">create persona</h2>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto">
          {error && (
            <div className="text-xs font-mono text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className={labelCls}>name *</label>
            <div className="input-field px-3 py-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. jordan reyes"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>age</label>
              <div className="input-field px-3 py-2">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  min={1}
                  max={120}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>nationality</label>
              <div className="input-field px-3 py-2">
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="american"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>job title</label>
              <div className="input-field px-3 py-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="architect"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>organization</label>
              <div className="input-field px-3 py-2">
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="acme corp"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>
              personality <span className="text-slate-400 normal-case tracking-normal">(comma-separated)</span>
            </label>
            <div className="input-field px-3 py-2">
              <input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="creative, analytical, introverted"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>
              interests <span className="text-slate-400 normal-case tracking-normal">(comma-separated)</span>
            </label>
            <div className="input-field px-3 py-2">
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="jazz, rock climbing, philosophy"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
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
              {submitting ? "creating..." : "create persona"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


