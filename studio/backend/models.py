"""
Pydantic request/response models for the OpenPersona Studio API.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared / reusable
# ---------------------------------------------------------------------------

class OccupationModel(BaseModel):
    title: str
    organization: Optional[str] = None
    description: Optional[str] = None


class PersonalityModel(BaseModel):
    traits: List[str] = Field(default_factory=list)


class PreferencesModel(BaseModel):
    interests: List[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Request bodies
# ---------------------------------------------------------------------------

class CreateSimulationRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class AddAgentRequest(BaseModel):
    name: str
    age: Optional[int] = None
    nationality: Optional[str] = None
    country_of_residence: Optional[str] = None
    occupation: Optional[OccupationModel] = None
    personality: Optional[PersonalityModel] = None
    preferences: Optional[PreferencesModel] = None
    # Catch-all for any additional persona fields the caller wants to set.
    extra_fields: Optional[Dict[str, Any]] = None


class ListenRequest(BaseModel):
    message: str


class StepRequest(BaseModel):
    timedelta_minutes: Optional[int] = None


class RunRequest(BaseModel):
    steps: int = 1
    timedelta_minutes: Optional[int] = None


class RelateRequest(BaseModel):
    target: str
    description: str = "An agent I can currently interact with."


# ---------------------------------------------------------------------------
# Response bodies
# ---------------------------------------------------------------------------

class SimulationSummary(BaseModel):
    sim_id: str
    name: str
    description: Optional[str] = None
    agent_count: int = 0
    created_at: str
    current_datetime: Optional[str] = None


class AgentSummary(BaseModel):
    name: str
    persona: Dict[str, Any] = Field(default_factory=dict)
    mental_state: Dict[str, Any] = Field(default_factory=dict)
    episodic_memory_count: int = 0
    semantic_memory_count: int = 0
    actions_count: int = 0
    stimuli_count: int = 0


class ActionOut(BaseModel):
    type: str
    content: str
    target: str


class StepResult(BaseModel):
    step: int
    agents_actions: Dict[str, List[ActionOut]] = Field(default_factory=dict)


class GraphNode(BaseModel):
    name: str
    persona: Dict[str, Any] = Field(default_factory=dict)
    mental_state: Dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    source: str
    target: str
    relation: str


class GraphResponse(BaseModel):
    nodes: List[GraphNode] = Field(default_factory=list)
    edges: List[GraphEdge] = Field(default_factory=list)


class EventRecord(BaseModel):
    step: Optional[int] = None
    timestamp: Optional[str] = None
    type: str  # "action" | "stimulus" | "step_start" | "step_end"
    agent: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)


class HealthResponse(BaseModel):
    status: str = "ok"
    openai_key_set: bool = False
