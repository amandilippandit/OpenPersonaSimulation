export interface Simulation {
  id: string;
  name: string;
  created_at: string;
  agent_count: number;
  step_count: number;
}

export interface AgentSummary {
  name: string;
  age: number;
  persona: string;
  mental_state: MentalState;
  actions_count: number;
  stimuli_count: number;
}

export interface MentalState {
  emotions: string;
  attention: string;
  goals: string[];
  context: string[];
}

export interface AgentDetail {
  name: string;
  age: number;
  nationality: string;
  occupation: {
    title: string;
    organization: string;
  };
  personality: string[];
  preferences: {
    interests: string[];
  };
  mental_state: MentalState;
  actions_count: number;
  stimuli_count: number;
  memory_count: number;
}

export interface GraphNode {
  id: string;
  name: string;
  emotions: string;
  actions_count: number;
  stimuli_count: number;
  age?: number;
  occupation?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SimEvent {
  step: number;
  agent: string;
  kind: string;
  type?: string;
  content?: string;
  target?: string;
  timestamp: string;
}

export interface Action {
  type: string;
  content: string;
  target?: string;
}

export interface WSMessage {
  type: string;
  step?: number;
  agent?: string;
  data?: Record<string, unknown>;
}

export interface CreateAgentPayload {
  name: string;
  age: number;
  nationality: string;
  occupation: {
    title: string;
    organization: string;
  };
  personality: {
    traits: string[];
  };
  preferences: {
    interests: string[];
  };
}
