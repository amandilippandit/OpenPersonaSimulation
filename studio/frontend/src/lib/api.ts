const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  // Simulations
  createSimulation: (body: { name: string; agent_count?: number }) =>
    request<{ id: string; name: string; created_at: string; agent_count: number; step_count: number }>(
      "/api/simulations",
      { method: "POST", body: JSON.stringify(body) }
    ),

  getSimulation: (id: string) =>
    request<Record<string, unknown>>(`/api/simulations/${id}`),

  listSimulations: () =>
    request<{ id: string; name: string; created_at: string; agent_count: number; step_count: number }[]>(
      "/api/simulations"
    ).catch(() => []),

  // Agents
  addAgent: (simId: string, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/api/simulations/${simId}/agents`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAgents: (simId: string) =>
    request<Record<string, unknown>[]>(`/api/simulations/${simId}/agents`),

  getAgent: (simId: string, name: string) =>
    request<Record<string, unknown>>(`/api/simulations/${simId}/agents/${encodeURIComponent(name)}`),

  listenAndAct: (simId: string, name: string, message?: string) =>
    request<{ actions: { type: string; content: string; target?: string }[] }>(
      `/api/simulations/${simId}/agents/${encodeURIComponent(name)}/listen_and_act`,
      { method: "POST", body: JSON.stringify(message ? { message } : {}) }
    ),

  addRelation: (simId: string, name: string, body: Record<string, unknown>) =>
    request<Record<string, unknown>>(
      `/api/simulations/${simId}/agents/${encodeURIComponent(name)}/relate`,
      { method: "POST", body: JSON.stringify(body) }
    ),

  // Simulation control
  step: (simId: string) =>
    request<{ step: number; actions: Record<string, { type: string; content: string; target?: string }[]> }>(
      `/api/simulations/${simId}/step`,
      { method: "POST" }
    ),

  run: (simId: string, steps: number = 5) =>
    request<{ steps_completed: number; all_actions: unknown[] }>(
      `/api/simulations/${simId}/run`,
      { method: "POST", body: JSON.stringify({ steps }) }
    ),

  // Graph & Events
  getGraph: (simId: string) =>
    request<{ nodes: Record<string, unknown>[]; edges: Record<string, unknown>[] }>(
      `/api/simulations/${simId}/graph`
    ),

  getEvents: (simId: string) =>
    request<Record<string, unknown>[]>(`/api/simulations/${simId}/events`),
};

export function getWebSocketUrl(simId: string): string {
  const wsBase = (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000");
  return `${wsBase}/ws/simulations/${simId}`;
}
