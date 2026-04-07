"""
OpenPersona Studio — FastAPI backend.

Wraps the OpenPersona simulation library and exposes it via REST + WebSocket APIs.

Start with:
    uvicorn studio.backend.main:app --reload --port 8000
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import traceback
from datetime import timedelta
from typing import Dict, List

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    ActionOut,
    AddAgentRequest,
    AgentSummary,
    CreateSimulationRequest,
    EventRecord,
    GraphResponse,
    HealthResponse,
    ListenRequest,
    RelateRequest,
    RunRequest,
    SimulationSummary,
    StepRequest,
    StepResult,
)
from .simulation_manager import SimulationState, manager

logger = logging.getLogger("openpersona.studio")

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="OpenPersona Studio API",
    version="0.1.0",
    description="REST + WebSocket API for driving OpenPersona multi-agent simulations.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# WebSocket connection registry (sim_id -> set of WebSocket)
# ---------------------------------------------------------------------------

_ws_connections: Dict[str, set] = {}


async def _broadcast(sim_id: str, payload: dict):
    """Send a JSON message to every WebSocket subscribed to *sim_id*."""
    conns = _ws_connections.get(sim_id, set())
    dead = set()
    for ws in conns:
        try:
            await ws.send_json(payload)
        except Exception:
            dead.add(ws)
    conns -= dead


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_sim_or_404(sim_id: str) -> SimulationState:
    sim = manager.get(sim_id)
    if sim is None:
        raise HTTPException(status_code=404, detail=f"Simulation '{sim_id}' not found.")
    return sim


def _sim_summary(sim: SimulationState) -> dict:
    current_dt = None
    try:
        current_dt = str(sim.world.current_datetime)
    except Exception:
        pass
    return {
        "sim_id": sim.sim_id,
        "name": sim.name,
        "description": sim.description,
        "agent_count": len(sim.agents),
        "created_at": sim.created_at,
        "current_datetime": current_dt,
    }


def _actions_to_out(actions: list) -> List[ActionOut]:
    out = []
    for a in actions:
        if isinstance(a, dict):
            out.append(ActionOut(
                type=a.get("type", "UNKNOWN"),
                content=a.get("content", ""),
                target=a.get("target", ""),
            ))
    return out


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/api/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        openai_key_set=bool(os.environ.get("OPENAI_API_KEY")),
    )


# ---------------------------------------------------------------------------
# Simulations CRUD
# ---------------------------------------------------------------------------

@app.post("/api/simulations", status_code=201)
async def create_simulation(body: CreateSimulationRequest = CreateSimulationRequest()):
    try:
        sim = manager.create(name=body.name, description=body.description)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return _sim_summary(sim)


@app.get("/api/simulations")
async def list_simulations():
    return [_sim_summary(s) for s in manager.list_all()]


@app.get("/api/simulations/{sim_id}")
async def get_simulation(sim_id: str):
    sim = _get_sim_or_404(sim_id)
    return _sim_summary(sim)


@app.delete("/api/simulations/{sim_id}")
async def delete_simulation(sim_id: str):
    deleted = manager.delete(sim_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Simulation '{sim_id}' not found.")
    return {"deleted": True}


# ---------------------------------------------------------------------------
# Agents
# ---------------------------------------------------------------------------

@app.post("/api/simulations/{sim_id}/agents", status_code=201)
async def add_agent(sim_id: str, body: AddAgentRequest):
    sim = _get_sim_or_404(sim_id)
    try:
        config = body.model_dump(exclude_none=True)
        # Convert Pydantic sub-models to plain dicts for the library.
        if body.occupation is not None:
            config["occupation"] = body.occupation.model_dump(exclude_none=True)
        if body.personality is not None:
            config["personality"] = body.personality.model_dump(exclude_none=True)
        if body.preferences is not None:
            config["preferences"] = body.preferences.model_dump(exclude_none=True)

        agent = manager.add_agent(sim, config)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return sim.agent_summary(agent)


@app.get("/api/simulations/{sim_id}/agents")
async def list_agents(sim_id: str):
    sim = _get_sim_or_404(sim_id)
    return [sim.agent_summary(a) for a in sim.agents.values()]


@app.get("/api/simulations/{sim_id}/agents/{agent_name}")
async def get_agent(sim_id: str, agent_name: str):
    sim = _get_sim_or_404(sim_id)
    agent = sim.get_agent(agent_name)
    if agent is None:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found.")
    return sim.agent_summary(agent)


@app.delete("/api/simulations/{sim_id}/agents/{agent_name}")
async def delete_agent(sim_id: str, agent_name: str):
    sim = _get_sim_or_404(sim_id)
    removed = manager.remove_agent(sim, agent_name)
    if not removed:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found.")
    return {"deleted": True}


# ---------------------------------------------------------------------------
# Agent interactions
# ---------------------------------------------------------------------------

@app.post("/api/simulations/{sim_id}/agents/{agent_name}/listen")
async def agent_listen(sim_id: str, agent_name: str, body: ListenRequest):
    sim = _get_sim_or_404(sim_id)
    try:
        await asyncio.to_thread(manager.agent_listen, sim, agent_name, body.message)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"listen failed: {exc}")
    return {"status": "ok"}


@app.post("/api/simulations/{sim_id}/agents/{agent_name}/act")
async def agent_act(sim_id: str, agent_name: str):
    sim = _get_sim_or_404(sim_id)
    try:
        actions = await asyncio.to_thread(manager.agent_act, sim, agent_name)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"act failed: {exc}")
    return {"actions": _actions_to_out(actions)}


@app.post("/api/simulations/{sim_id}/agents/{agent_name}/listen_and_act")
async def agent_listen_and_act(sim_id: str, agent_name: str, body: ListenRequest):
    sim = _get_sim_or_404(sim_id)
    try:
        actions = await asyncio.to_thread(
            manager.agent_listen_and_act, sim, agent_name, body.message
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"listen_and_act failed: {exc}")
    return {"actions": _actions_to_out(actions)}


# ---------------------------------------------------------------------------
# Relations
# ---------------------------------------------------------------------------

@app.post("/api/simulations/{sim_id}/agents/{agent_name}/relate")
async def create_relation(sim_id: str, agent_name: str, body: RelateRequest):
    sim = _get_sim_or_404(sim_id)
    try:
        manager.create_relation(sim, agent_name, body.target, body.description)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# World steps
# ---------------------------------------------------------------------------

@app.post("/api/simulations/{sim_id}/step")
async def world_step(sim_id: str, body: StepRequest = StepRequest()):
    sim = _get_sim_or_404(sim_id)
    if not os.environ.get("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not set.")
    try:
        result = await asyncio.to_thread(manager.step, sim, body.timedelta_minutes)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"step failed: {exc}")
    formatted: Dict[str, list] = {}
    for agent_name, actions in result.items():
        formatted[agent_name] = _actions_to_out(actions)
    return StepResult(step=sim.step_counter, agents_actions=formatted)


@app.post("/api/simulations/{sim_id}/run")
async def world_run(sim_id: str, body: RunRequest):
    sim = _get_sim_or_404(sim_id)
    if not os.environ.get("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not set.")
    try:
        results = await asyncio.to_thread(manager.run, sim, body.steps, body.timedelta_minutes)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"run failed: {exc}")
    steps_out = []
    for i, step_result in enumerate(results):
        formatted: Dict[str, list] = {}
        for agent_name, actions in step_result.items():
            formatted[agent_name] = _actions_to_out(actions)
        steps_out.append(StepResult(step=sim.step_counter - len(results) + i + 1, agents_actions=formatted))
    return {"steps": steps_out}


# ---------------------------------------------------------------------------
# Graph & events
# ---------------------------------------------------------------------------

@app.get("/api/simulations/{sim_id}/graph", response_model=GraphResponse)
async def get_graph(sim_id: str):
    sim = _get_sim_or_404(sim_id)
    return manager.get_graph(sim)


@app.get("/api/simulations/{sim_id}/events")
async def get_events(sim_id: str):
    sim = _get_sim_or_404(sim_id)
    return sim.event_log


# ---------------------------------------------------------------------------
# WebSocket — real-time event streaming
# ---------------------------------------------------------------------------

@app.websocket("/ws/simulations/{sim_id}")
async def ws_simulation(websocket: WebSocket, sim_id: str):
    sim = manager.get(sim_id)
    if sim is None:
        await websocket.close(code=4004, reason="Simulation not found.")
        return

    await websocket.accept()
    _ws_connections.setdefault(sim_id, set()).add(websocket)

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "data": {"message": "Invalid JSON."}})
                continue

            cmd = msg.get("command")
            if cmd == "step":
                td_min = msg.get("timedelta_minutes")
                if not os.environ.get("OPENAI_API_KEY"):
                    await websocket.send_json({
                        "type": "error",
                        "data": {"message": "OPENAI_API_KEY is not set."},
                    })
                    continue
                try:
                    await websocket.send_json({
                        "type": "step_start",
                        "step": sim.step_counter + 1,
                        "timestamp": None,
                        "agent": None,
                        "data": {},
                    })
                    result = await asyncio.to_thread(manager.step, sim, td_min)
                    for agent_name, actions in result.items():
                        for a in actions:
                            payload = {
                                "type": "action",
                                "step": sim.step_counter,
                                "timestamp": sim.event_log[-1]["timestamp"] if sim.event_log else None,
                                "agent": agent_name,
                                "data": a if isinstance(a, dict) else {"content": str(a)},
                            }
                            await _broadcast(sim_id, payload)
                    await _broadcast(sim_id, {
                        "type": "step_end",
                        "step": sim.step_counter,
                        "timestamp": None,
                        "agent": None,
                        "data": {},
                    })
                except Exception as exc:
                    await websocket.send_json({
                        "type": "error",
                        "step": sim.step_counter,
                        "data": {"message": str(exc), "traceback": traceback.format_exc()},
                    })

            elif cmd == "run":
                steps = msg.get("steps", 1)
                td_min = msg.get("timedelta_minutes")
                if not os.environ.get("OPENAI_API_KEY"):
                    await websocket.send_json({
                        "type": "error",
                        "data": {"message": "OPENAI_API_KEY is not set."},
                    })
                    continue
                try:
                    for _ in range(steps):
                        await websocket.send_json({
                            "type": "step_start",
                            "step": sim.step_counter + 1,
                            "timestamp": None,
                            "agent": None,
                            "data": {},
                        })
                        result = await asyncio.to_thread(manager.step, sim, td_min)
                        for agent_name, actions in result.items():
                            for a in actions:
                                payload = {
                                    "type": "action",
                                    "step": sim.step_counter,
                                    "timestamp": sim.event_log[-1]["timestamp"] if sim.event_log else None,
                                    "agent": agent_name,
                                    "data": a if isinstance(a, dict) else {"content": str(a)},
                                }
                                await _broadcast(sim_id, payload)
                        await _broadcast(sim_id, {
                            "type": "step_end",
                            "step": sim.step_counter,
                            "timestamp": None,
                            "agent": None,
                            "data": {},
                        })
                except Exception as exc:
                    await websocket.send_json({
                        "type": "error",
                        "step": sim.step_counter,
                        "data": {"message": str(exc), "traceback": traceback.format_exc()},
                    })

            elif cmd == "ping":
                await websocket.send_json({"type": "pong"})

            else:
                await websocket.send_json({
                    "type": "error",
                    "data": {"message": f"Unknown command: {cmd}"},
                })

    except WebSocketDisconnect:
        pass
    finally:
        _ws_connections.get(sim_id, set()).discard(websocket)



