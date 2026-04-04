"use client";

import { useState } from "react";
import { emotionToColor } from "@/lib/colors";
import type { AgentDetail, Action } from "@/types";

interface AgentInspectorProps {
  agent: AgentDetail | null;
  onSendMessage: (agentName: string, message: string) => Promise<Action[]>;
  onClose: () => void;
}

export default function AgentInspector({ agent, onSendMessage, onClose }: AgentInspectorProps) {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<Action[]>([]);
  const [sending, setSending] = useState(false);

  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-gray-700 text-3xl mb-3">&#x1F50D;</div>
          <p className="text-gray-500 text-sm font-mono">Select an agent</p>
          <p className="text-gray-600 text-xs font-mono mt-1">Click a node in the graph</p>
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

  const emotionColor = emotionToColor(agent.mental_state?.emotions);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-100">{agent.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {agent.age > 0 && `${agent.age}yo`}
              {agent.nationality && ` / ${agent.nationality}`}
            </p>
            {agent.occupation && (
              <p className="text-xs text-gray-500 mt-1">
                {agent.occupation.title}
                {agent.occupation.organization && ` at ${agent.occupation.organization}`}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-400 transition-colors text-lg leading-none"
          >
            x
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Personality */}
        {agent.personality && agent.personality.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Personality</h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.personality.map((trait, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mental State */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mental State</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: emotionColor }}
              />
              <span className="text-sm text-gray-300">{agent.mental_state?.emotions || "neutral"}</span>
            </div>
            {agent.mental_state?.attention && (
              <div>
                <span className="text-xs text-gray-500">Attention: </span>
                <span className="text-sm text-gray-400">{agent.mental_state.attention}</span>
              </div>
            )}
            {agent.mental_state?.goals && agent.mental_state.goals.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">Goals:</span>
                <ul className="mt-1 space-y-1">
                  {agent.mental_state.goals.map((goal, i) => (
                    <li key={i} className="text-xs text-gray-400 pl-3 relative before:absolute before:left-0 before:content-['->'] before:text-gray-600 font-mono">
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {agent.mental_state?.context && agent.mental_state.context.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">Context:</span>
                <ul className="mt-1 space-y-1">
                  {agent.mental_state.context.map((ctx, i) => (
                    <li key={i} className="text-xs text-gray-400 pl-3 font-mono truncate" title={ctx}>
                      {ctx}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stats</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-gray-200">{agent.actions_count}</div>
              <div className="text-[10px] text-gray-500 uppercase">Actions</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-gray-200">{agent.stimuli_count}</div>
              <div className="text-[10px] text-gray-500 uppercase">Stimuli</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-gray-200">{agent.memory_count || 0}</div>
              <div className="text-[10px] text-gray-500 uppercase">Memory</div>
            </div>
          </div>
        </div>

        {/* Interests */}
        {agent.preferences?.interests && agent.preferences.interests.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interests</h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.preferences.interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20"
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
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Latest Response</h3>
            <div className="space-y-2">
              {responses.map((r, i) => (
                <div key={i} className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-green-400">{r.type}</span>
                    {r.target && (
                      <span className="text-[10px] text-gray-500">to {r.target}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Send Message */}
      <div className="p-3 border-t border-gray-800 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send a message..."
            className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 font-mono"
          />
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
