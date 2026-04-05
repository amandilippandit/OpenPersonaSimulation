"use client";

import { useState } from "react";
import type { AgentDetail, Action } from "@/types";

interface AgentInspectorProps {
  agent: AgentDetail | null;
  onSendMessage: (agentName: string, message: string) => Promise<Action[]>;
  onClose: () => void;
}

const EMOTION_COLORS: Record<string, string> = {
  happy: "#22c55e",
  positive: "#22c55e",
  excited: "#f97316",
  curious: "#3b82f6",
  calm: "#64748b",
  neutral: "#94a3b8",
  skeptical: "#f59e0b",
  cautious: "#f59e0b",
  frustrated: "#ef4444",
  sad: "#8b5cf6",
  thinking: "#a855f7",
};

function emotionToColor(emotion: string | undefined | null): string {
  if (!emotion) return "#94a3b8";
  const lower = emotion.toLowerCase();
  for (const [key, color] of Object.entries(EMOTION_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "#94a3b8";
}

export default function AgentInspector({ agent, onSendMessage, onClose }: AgentInspectorProps) {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<Action[]>([]);
  const [sending, setSending] = useState(false);

  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center mx-auto mb-3">
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-xs font-mono font-semibold text-slate-900">select an agent</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">click a node in the graph</p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      const actions = await onSendMessage(agent.name, message);
      setResponses(actions);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  const emotionColor = emotionToColor(agent.mental_state?.emotions as string | undefined);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 truncate">{agent.name}</h2>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
              {agent.age > 0 && `${agent.age}`}
              {agent.nationality && ` · ${agent.nationality}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors flex-shrink-0 ml-2"
            aria-label="Close"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {agent.occupation && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 border border-orange-100">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-[10px] font-mono text-orange-700 font-semibold truncate">
              {agent.occupation.title}
            </span>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Personality */}
        {agent.personality && agent.personality.length > 0 && (
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">personality</div>
            <div className="flex flex-wrap gap-1">
              {agent.personality.map((trait, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mental State */}
        <div>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">mental state</div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: emotionColor }}
              />
              <span className="text-xs text-slate-700">
                {(agent.mental_state?.emotions as string) || "neutral"}
              </span>
            </div>
            {agent.mental_state?.attention && (
              <div>
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">attention</div>
                <div className="text-xs text-slate-700">{String(agent.mental_state.attention)}</div>
              </div>
            )}
            {Array.isArray(agent.mental_state?.goals) && agent.mental_state.goals.length > 0 && (
              <div>
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">goals</div>
                <ul className="space-y-1">
                  {(agent.mental_state.goals as string[]).map((goal, i) => (
                    <li key={i} className="text-[11px] text-slate-600 font-mono pl-3 relative">
                      <span className="absolute left-0 text-orange-500">→</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">stats</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-center">
              <div className="text-base font-mono font-bold text-slate-900 tabular-nums">{agent.actions_count}</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">actions</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-center">
              <div className="text-base font-mono font-bold text-slate-900 tabular-nums">{agent.stimuli_count}</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">stimuli</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-center">
              <div className="text-base font-mono font-bold text-slate-900 tabular-nums">{agent.memory_count || 0}</div>
              <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">memory</div>
            </div>
          </div>
        </div>

        {/* Interests */}
        {agent.preferences?.interests && agent.preferences.interests.length > 0 && (
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">interests</div>
            <div className="flex flex-wrap gap-1">
              {agent.preferences.interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Response display */}
        {responses.length > 0 && (
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-2">latest response</div>
            <div className="space-y-2">
              {responses.map((r, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[9px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                      {r.type}
                    </span>
                    {r.target && (
                      <span className="text-[10px] text-slate-400 font-mono">→ {r.target}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Send Message */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
        <div className="input-field flex items-center gap-2 px-3 py-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="send a message..."
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none font-mono"
          />
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center flex-shrink-0 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            {sending ? (
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l12-6-4 13-3-5-5-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
