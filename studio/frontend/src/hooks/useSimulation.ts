"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api, getWebSocketUrl } from "@/lib/api";
import type {
  AgentDetail,
  AgentSummary,
  GraphData,
  GraphEdge,
  GraphNode,
  SimEvent,
  Action,
  WSMessage,
  CreateAgentPayload,
} from "@/types";

interface UseSimulationReturn {
  agents: AgentSummary[];
  graph: { nodes: GraphNode[]; links: GraphEdge[] };
  events: SimEvent[];
  selectedAgent: AgentDetail | null;
  stepCount: number;
  loading: boolean;
  running: boolean;
  error: string | null;
  glowingEdges: Set<string>;
  addAgent: (payload: CreateAgentPayload) => Promise<void>;
  step: () => Promise<void>;
  run: (steps: number) => Promise<void>;
  sendMessage: (agentName: string, message: string) => Promise<Action[]>;
  selectAgent: (name: string | null) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSimulation(simId: string): UseSimulationReturn {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; links: GraphEdge[] }>({ nodes: [], links: [] });
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [glowingEdges, setGlowingEdges] = useState<Set<string>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);

  const fetchGraph = useCallback(async () => {
    try {
      const data = await api.getGraph(simId);
      const nodes: GraphNode[] = (data.nodes || []).map((n: Record<string, unknown>) => ({
        id: (n.id as string) || (n.name as string),
        name: (n.name as string) || (n.id as string),
        emotions: (n.emotions as string) || "neutral",
        actions_count: (n.actions_count as number) || 0,
        stimuli_count: (n.stimuli_count as number) || 0,
        age: n.age as number | undefined,
        occupation: n.occupation as string | undefined,
      }));
      const links: GraphEdge[] = (data.edges || []).map((e: Record<string, unknown>) => ({
        source: e.source as string,
        target: e.target as string,
        relation: (e.relation as string) || "",
      }));
      setGraph({ nodes, links });
    } catch {
      // Graph endpoint might not be available yet
    }
  }, [simId]);

  const fetchAgents = useCallback(async () => {
    try {
      const data = await api.getAgents(simId);
      const mapped: AgentSummary[] = data.map((a: Record<string, unknown>) => ({
        name: a.name as string,
        age: (a.age as number) || 0,
        persona: (a.persona as string) || "",
        mental_state: (a.mental_state as AgentSummary["mental_state"]) || {
          emotions: "neutral",
          attention: "",
          goals: [],
          context: [],
        },
        actions_count: (a.actions_count as number) || 0,
        stimuli_count: (a.stimuli_count as number) || 0,
      }));
      setAgents(mapped);
    } catch {
      // Agents not loaded yet
    }
  }, [simId]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api.getEvents(simId);
      const mapped: SimEvent[] = data.map((e: Record<string, unknown>) => ({
        step: (e.step as number) || 0,
        agent: (e.agent as string) || "",
        kind: (e.kind as string) || (e.type as string) || "",
        type: (e.type as string) || (e.kind as string) || "",
        content: (e.content as string) || "",
        target: (e.target as string) || "",
        timestamp: (e.timestamp as string) || "",
      }));
      setEvents(mapped);
    } catch {
      // Events not loaded yet
    }
  }, [simId]);

  const fetchSimState = useCallback(async () => {
    try {
      const sim = (await api.getSimulation(simId)) as Record<string, unknown>;
      setStepCount((sim.step_count as number) || (sim.steps as number) || 0);
    } catch {
      // sim state
    }
  }, [simId]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchAgents(), fetchGraph(), fetchEvents(), fetchSimState()]);
  }, [fetchAgents, fetchGraph, fetchEvents, fetchSimState]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  // WebSocket connection
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    function connect() {
      try {
        ws = new WebSocket(getWebSocketUrl(simId));
        wsRef.current = ws;

        ws.onmessage = (event) => {
          try {
            const msg: WSMessage = JSON.parse(event.data);
            // On step completion, refresh everything
            if (msg.type === "step_complete" || msg.type === "action") {
              refresh();
            }
            // Handle talk actions for edge glow
            if (msg.type === "action" && msg.data) {
              const actionType = (msg.data.type as string) || "";
              if (actionType.toUpperCase() === "TALK" && msg.agent && msg.data.target) {
                const edgeKey = `${msg.agent}-${msg.data.target}`;
                setGlowingEdges((prev) => new Set(prev).add(edgeKey));
                setTimeout(() => {
                  setGlowingEdges((prev) => {
                    const next = new Set(prev);
                    next.delete(edgeKey);
                    return next;
                  });
                }, 2000);
              }
            }
          } catch {
            // parse error
          }
        };

        ws.onclose = () => {
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        reconnectTimeout = setTimeout(connect, 3000);
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [simId, refresh]);

  const addAgent = useCallback(
    async (payload: CreateAgentPayload) => {
      setError(null);
      try {
        await api.addAgent(simId, payload as unknown as Record<string, unknown>);
        await refresh();
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [simId, refresh]
  );

  const step = useCallback(async () => {
    setError(null);
    setRunning(true);
    try {
      const result = await api.step(simId);
      setStepCount(result.step);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }, [simId, refresh]);

  const run = useCallback(
    async (steps: number) => {
      setError(null);
      setRunning(true);
      try {
        const result = await api.run(simId, steps);
        setStepCount((prev) => prev + result.steps_completed);
        await refresh();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setRunning(false);
      }
    },
    [simId, refresh]
  );

  const sendMessage = useCallback(
    async (agentName: string, message: string): Promise<Action[]> => {
      setError(null);
      try {
        const result = await api.listenAndAct(simId, agentName, message);
        await refresh();
        return result.actions || [];
      } catch (e) {
        setError((e as Error).message);
        return [];
      }
    },
    [simId, refresh]
  );

  const selectAgent = useCallback(
    async (name: string | null) => {
      if (!name) {
        setSelectedAgent(null);
        return;
      }
      try {
        const data = await api.getAgent(simId, name);
        const detail: AgentDetail = {
          name: (data.name as string) || name,
          age: (data.age as number) || 0,
          nationality: (data.nationality as string) || "",
          occupation: (data.occupation as AgentDetail["occupation"]) || { title: "", organization: "" },
          personality: (data.personality as string[]) || [],
          preferences: (data.preferences as AgentDetail["preferences"]) || { interests: [] },
          mental_state: (data.mental_state as AgentDetail["mental_state"]) || {
            emotions: "neutral",
            attention: "",
            goals: [],
            context: [],
          },
          actions_count: (data.actions_count as number) || 0,
          stimuli_count: (data.stimuli_count as number) || 0,
          memory_count: (data.memory_count as number) || 0,
        };
        setSelectedAgent(detail);
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [simId]
  );

  return {
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
    refresh,
  };
}
