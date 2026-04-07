"""
In-memory manager for active OpenPersona simulations.

Each simulation owns a World, a dict of Persona agents, and an append-only
event log that records every action and stimulus with step number + timestamp.
"""

from __future__ import annotations

import logging
import os
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

logger = logging.getLogger("openpersona.studio")

# ---------------------------------------------------------------------------
# Lazy imports of the library — wrapped so the backend can still start even
# when the library is not installed (useful for testing the API surface).
# ---------------------------------------------------------------------------

_LIB_AVAILABLE = False

try:
    from openpersona.agent import Persona, EpisodicMemory, SemanticMemory
    from openpersona.environment import World
    _LIB_AVAILABLE = True
except Exception as exc:  # pragma: no cover
    logger.warning("openpersona library could not be imported: %s", exc)


def _has_openai_key() -> bool:
    return bool(os.environ.get("OPENAI_API_KEY"))


# ---------------------------------------------------------------------------
# SimulationState — one per active simulation
# ---------------------------------------------------------------------------

class SimulationState:
    """Holds all runtime state for a single simulation."""

    def __init__(self, sim_id: str, name: str, description: Optional[str] = None):
        self.sim_id = sim_id
        self.name = name
        self.description = description
        self.created_at = datetime.utcnow().isoformat()
        self.step_counter = 0
        self.event_log: List[Dict[str, Any]] = []

        # Disable rich console output during API-driven runs.
        World.communication_display = False
        Persona.communication_display = False

        self.world = World(name=name)
        self.agents: Dict[str, Persona] = {}

    # -- helpers -------------------------------------------------------------

    def record_event(
        self,
        event_type: str,
        agent: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
        step: Optional[int] = None,
    ) -> Dict[str, Any]:
        event = {
            "type": event_type,
            "step": step if step is not None else self.step_counter,
            "timestamp": datetime.utcnow().isoformat(),
            "agent": agent,
            "data": data or {},
        }
        self.event_log.append(event)
        return event

    def get_agent(self, name: str) -> Optional[Persona]:
        return self.agents.get(name)

    def agent_summary(self, agent: Persona) -> Dict[str, Any]:
        """Return a JSON-safe summary of an agent."""
        mental = {}
        if hasattr(agent, "_mental_state"):
            raw = agent._mental_state.copy()
            # Replace live agent references in accessible_agents with names.
            accessible = []
            for entry in raw.get("accessible_agents", []):
                if isinstance(entry, dict):
                    accessible.append({
                        "name": entry.get("name", str(entry.get("agent", ""))),
                        "relation_description": entry.get("relation_description", ""),
                    })
            raw["accessible_agents"] = accessible
            # Convert datetime to string if present.
            if raw.get("datetime") is not None:
                raw["datetime"] = str(raw["datetime"])
            mental = raw

        ep_count = 0
        sem_count = 0
        try:
            ep_count = agent.episodic_memory.count()
        except Exception:
            pass
        try:
            sem_count = agent.semantic_memory.count() if hasattr(agent.semantic_memory, "count") else 0
        except Exception:
            pass

        return {
            "name": agent.name,
            "persona": agent._persona if hasattr(agent, "_persona") else {},
            "mental_state": mental,
            "episodic_memory_count": ep_count,
            "semantic_memory_count": sem_count,
            "actions_count": getattr(agent, "actions_count", 0),
            "stimuli_count": getattr(agent, "stimuli_count", 0),
        }


# ---------------------------------------------------------------------------
# SimulationManager — singleton that owns all active simulations
# ---------------------------------------------------------------------------

class SimulationManager:
    """Thread-safe (GIL-level) manager for all active simulations."""

    def __init__(self):
        self._simulations: Dict[str, SimulationState] = {}

    # -- CRUD ----------------------------------------------------------------

    def create(self, name: Optional[str] = None, description: Optional[str] = None) -> SimulationState:
        if not _LIB_AVAILABLE:
            raise RuntimeError("openpersona library is not available. Cannot create simulation.")

        sim_id = uuid.uuid4().hex[:12]
        sim_name = name or f"Simulation-{sim_id}"
        state = SimulationState(sim_id=sim_id, name=sim_name, description=description)
        self._simulations[sim_id] = state
        return state

    def get(self, sim_id: str) -> Optional[SimulationState]:
        return self._simulations.get(sim_id)

    def delete(self, sim_id: str) -> bool:
        if sim_id in self._simulations:
            state = self._simulations.pop(sim_id)
            # Clean up global registries best-effort.
            try:
                for agent in list(state.agents.values()):
                    if agent.name in Persona.all_agents:
                        del Persona.all_agents[agent.name]
                if state.world.name in World.all_environments:
                    del World.all_environments[state.world.name]
            except Exception:
                pass
            return True
        return False

    def list_all(self) -> List[SimulationState]:
        return list(self._simulations.values())

    # -- Agent operations ----------------------------------------------------

    def add_agent(self, sim: SimulationState, agent_config: Dict[str, Any]) -> Persona:
        """Create a Persona from config, define its fields, and add to the world."""
        if not _LIB_AVAILABLE:
            raise RuntimeError("openpersona library is not available.")

        name = agent_config["name"]
        if name in sim.agents:
            raise ValueError(f"Agent '{name}' already exists in this simulation.")

        agent = Persona(name=name)

        # Standard fields
        for key in ("age", "nationality", "country_of_residence"):
            val = agent_config.get(key)
            if val is not None:
                agent.define(key, val)

        # Occupation (dict)
        occ = agent_config.get("occupation")
        if occ is not None:
            agent.define("occupation", occ if isinstance(occ, dict) else occ.dict())

        # Personality
        personality = agent_config.get("personality")
        if personality is not None:
            val = personality if isinstance(personality, dict) else personality.dict()
            agent.define("personality", val)

        # Preferences
        prefs = agent_config.get("preferences")
        if prefs is not None:
            val = prefs if isinstance(prefs, dict) else prefs.dict()
            agent.define("preferences", val)

        # Extra free-form fields
        extras = agent_config.get("extra_fields") or {}
        for k, v in extras.items():
            agent.define(k, v)

        sim.world.add_agent(agent)
        sim.agents[name] = agent

        # Auto-make all agents mutually accessible.
        sim.world.make_everyone_accessible()

        return agent

    def remove_agent(self, sim: SimulationState, agent_name: str) -> bool:
        agent = sim.agents.get(agent_name)
        if agent is None:
            return False
        sim.world.remove_agent(agent)
        del sim.agents[agent_name]
        # Clean global registry.
        try:
            if agent.name in Persona.all_agents:
                del Persona.all_agents[agent.name]
        except Exception:
            pass
        return True

    # -- Simulation steps ----------------------------------------------------

    def step(self, sim: SimulationState, timedelta_minutes: Optional[int] = None) -> Dict[str, List[Dict]]:
        """Run one world step and return actions per agent."""
        sim.step_counter += 1
        step_num = sim.step_counter

        sim.record_event("step_start", step=step_num)

        td = timedelta(minutes=timedelta_minutes) if timedelta_minutes else None

        try:
            agents_actions = sim.world._step(timedelta_per_step=td)
        except Exception as exc:
            sim.record_event("error", data={"message": str(exc)}, step=step_num)
            raise

        result: Dict[str, List[Dict]] = {}
        for agent_name, actions in (agents_actions or {}).items():
            action_list = []
            if actions:
                for a in (actions if isinstance(actions, list) else [actions]):
                    action_dict = a if isinstance(a, dict) else {"type": str(a), "content": "", "target": ""}
                    action_list.append(action_dict)
                    sim.record_event("action", agent=agent_name, data=action_dict, step=step_num)
            result[agent_name] = action_list

        sim.record_event("step_end", step=step_num)
        return result

    def run(
        self,
        sim: SimulationState,
        steps: int,
        timedelta_minutes: Optional[int] = None,
    ) -> List[Dict[str, List[Dict]]]:
        """Run N steps sequentially."""
        all_results = []
        for _ in range(steps):
            result = self.step(sim, timedelta_minutes=timedelta_minutes)
            all_results.append(result)
        return all_results

    # -- Agent interactions --------------------------------------------------

    def agent_listen(self, sim: SimulationState, agent_name: str, message: str):
        agent = sim.get_agent(agent_name)
        if agent is None:
            raise ValueError(f"Agent '{agent_name}' not found.")

        if not _has_openai_key():
            raise RuntimeError("OPENAI_API_KEY is not set. Cannot perform LLM-backed listen.")

        agent.listen(message)
        sim.record_event("stimulus", agent=agent_name, data={"message": message})

    def agent_act(self, sim: SimulationState, agent_name: str) -> List[Dict]:
        agent = sim.get_agent(agent_name)
        if agent is None:
            raise ValueError(f"Agent '{agent_name}' not found.")

        if not _has_openai_key():
            raise RuntimeError("OPENAI_API_KEY is not set. Cannot perform LLM-backed act.")

        actions = agent.act(return_actions=True)
        action_list = []
        if actions:
            for a in (actions if isinstance(actions, list) else [actions]):
                action_dict = a if isinstance(a, dict) else {"type": str(a), "content": "", "target": ""}
                action_list.append(action_dict)
                sim.record_event("action", agent=agent_name, data=action_dict)
        return action_list

    def agent_listen_and_act(self, sim: SimulationState, agent_name: str, message: str) -> List[Dict]:
        self.agent_listen(sim, agent_name, message)
        return self.agent_act(sim, agent_name)

    def create_relation(
        self,
        sim: SimulationState,
        agent_name: str,
        target_name: str,
        description: str,
    ):
        agent = sim.get_agent(agent_name)
        target = sim.get_agent(target_name)
        if agent is None:
            raise ValueError(f"Agent '{agent_name}' not found.")
        if target is None:
            raise ValueError(f"Target agent '{target_name}' not found.")
        agent.make_agent_accessible(target, relation_description=description)

    # -- Graph ---------------------------------------------------------------

    def get_graph(self, sim: SimulationState) -> Dict[str, Any]:
        nodes = []
        edges = []
        for agent in sim.agents.values():
            summary = sim.agent_summary(agent)
            nodes.append({
                "name": summary["name"],
                "persona": summary["persona"],
                "mental_state": summary["mental_state"],
            })
            # Edges from accessible_agents
            for entry in agent._mental_state.get("accessible_agents", []):
                target_name = entry.get("name", "")
                relation = entry.get("relation_description", "")
                edges.append({
                    "source": agent.name,
                    "target": target_name,
                    "relation": relation,
                })
        return {"nodes": nodes, "edges": edges}


# Module-level singleton
manager = SimulationManager()



