<h1 align="center">OpenPersona</h1>

<p align="center">
  <em>Synthetic human behavior at scale — powered by large language models.</em>
</p>

<p align="center">
  <a href="#get-started-in-60-seconds">Get Started</a> &bull;
  <a href="#core-concepts">Core Concepts</a> &bull;
  <a href="#openpersona-studio">Studio UI</a> &bull;
  <a href="#autoresearch">Autoresearch</a> &bull;
  <a href="#cookbook">Cookbook</a> &bull;
  <a href="#settings">Settings</a> &bull;
  <a href="#benchmarking-against-real-data">Benchmarking</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10%2B-3776AB?logo=python&logoColor=white" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/license-MIT-22c55e" alt="MIT License">
  <img src="https://img.shields.io/badge/release-0.7.0-f97316" alt="v0.7.0">
</p>

---

## The Problem

You need to know how **real humans** with different backgrounds, opinions, and quirks would respond to your product, ad campaign, or software — before spending money on focus groups or surveys.

**OpenPersona** spins up populations of synthetic people — each with a unique backstory, personality profile, beliefs, and behavioral tendencies — and observes how they react in controlled environments. They argue. They change their minds. They make irrational decisions. Just like real people.

This is not a chatbot framework. These agents model **human imperfection**, not helpfulness.

---

## Get Started in 60 Seconds

```bash
git clone https://github.com/amandilippandit/OpenPersonaSimulation.git
cd OpenPersonaSimulation
pip install -e .
export OPENAI_API_KEY="sk-..."
```

```python
from openpersona.agent import Persona
from openpersona.environment import World

chef = Persona("Marco")
chef.define("age", 42)
chef.define("nationality", "Italian")
chef.define("occupation", {"title": "Head Chef", "organization": "Trattoria Bella"})
chef.define("personality", {"traits": [
    "Passionate about traditional cooking methods.",
    "Skeptical of food technology and molecular gastronomy.",
    "Warm but opinionated — will argue about olive oil brands."
]})

investor = Persona("Priya")
investor.define("age", 35)
investor.define("nationality", "Indian")
investor.define("occupation", {"title": "VC Partner", "organization": "Horizon Ventures"})
investor.define("personality", {"traits": [
    "Data-driven and metrics-obsessed.",
    "Fascinated by food-tech and direct-to-consumer brands.",
    "Impatient with vague pitches — wants numbers fast."
]})

room = World("Pitch Meeting", [chef, investor])
room.make_everyone_accessible()
investor.listen("Marco, pitch me your idea for a premium frozen pasta subscription box.")
room.run(4)
```

Two synthetic humans. One pitch meeting. Zero scripts.

---

## Core Concepts

### Personas

A persona is a full synthetic identity — not a chatbot prompt:

| Layer | What You Define |
|---|---|
| Demographics | Age, gender, nationality, residence |
| Professional | Role, company, responsibilities, skills |
| Psychology | Big Five traits, values, emotional tendencies |
| Beliefs | Worldview, domain opinions, political leanings |
| Behaviors | Routines, habits, decision patterns |
| Preferences | Likes, dislikes, interests, tastes |
| Relationships | Connections to other agents |

### Environments

Containers where personas interact. Call `run()` and agents perceive what others say, think about it, and respond — in parallel or sequentially.

### The Stimulus-Action Loop

```
Receive stimulus → Update mental state → Generate action → Broadcast to environment
```

Stimuli: conversations, visuals, thoughts, goals, documents. Actions: speaking, thinking, recalling, consulting documents, using tools, or signaling completion.

---

## OpenPersona Studio

A full-stack web UI for building, running, and visualizing persona simulations.

### Three-Panel Layout

| Panel | What It Shows |
|---|---|
| **3D Social Graph** | Force-directed network — agents as nodes (colored by emotion), relations as edges, message animations on TALK |
| **Agent Inspector** | Selected agent's persona card, mental state, emotions, goals, memory stats, send-message input |
| **Event Feed** | Color-coded timeline of all actions (TALK=green, THINK=purple, DONE=gray, REACH_OUT=blue) |

### Architecture

```
studio/
├── backend/                  # FastAPI (Python)
│   ├── main.py               # 17 REST endpoints + WebSocket
│   ├── models.py             # Pydantic request/response models
│   └── simulation_manager.py # In-memory simulation state management
└── frontend/                 # Next.js 14 + TypeScript + Tailwind
    ├── src/components/
    │   ├── SimulationGraph.tsx    # 3D force graph (react-force-graph-3d)
    │   ├── AgentInspector.tsx     # Agent detail panel
    │   ├── EventFeed.tsx          # Action timeline
    │   ├── AgentCreator.tsx       # Modal form for new agents
    │   └── SimulationControls.tsx # Step/Run/Add Agent toolbar
    ├── src/hooks/useSimulation.ts # State + WebSocket management
    └── src/lib/api.ts            # Backend API client
```

### Run It

```bash
# Terminal 1 — Backend
uvicorn studio.backend.main:app --port 8000 --reload

# Terminal 2 — Frontend
cd studio/frontend && npm install && npm run dev

# Open http://localhost:3000
```

### API Endpoints

| Method | Path | What It Does |
|---|---|---|
| `POST` | `/api/simulations` | Create a new simulation |
| `POST` | `/api/simulations/{id}/agents` | Add an agent with persona spec |
| `POST` | `/api/simulations/{id}/step` | Run one simulation step |
| `POST` | `/api/simulations/{id}/run` | Run N steps |
| `GET` | `/api/simulations/{id}/graph` | Get social graph (nodes + edges) |
| `GET` | `/api/simulations/{id}/events` | Get all events/actions |
| `POST` | `/api/simulations/{id}/agents/{name}/listen_and_act` | Send message, get response |
| `WS` | `/ws/simulations/{id}` | Real-time event stream |

---

## Autoresearch

> Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). Same pattern, different domain.

An AI agent autonomously experiments with persona simulation configurations overnight. It modifies the code, runs a scenario, scores the result, keeps improvements, discards regressions, and loops forever.

### The Pattern

| | Karpathy's autoresearch | OpenPersona autoresearch |
|---|---|---|
| **Domain** | LLM training | Persona simulation |
| **One file to edit** | `train.py` | `autoresearch/experiment.py` |
| **One metric** | `val_bpb` (lower is better) | `quality_score` (higher is better, 0.0→1.0) |
| **Time budget** | 5 min | 3 min |
| **Experiments/hour** | ~12 | ~20 |

### The Metric: `quality_score`

A weighted composite of five dimensions:

| Dimension | Weight | What It Measures |
|---|---|---|
| Persona adherence | 25% | Does the agent act like its defined personality? |
| Response coherence | 25% | Are responses natural, well-formed, non-repetitive? |
| Interaction quality | 20% | Do multi-agent conversations have realistic turn-taking? |
| Extraction accuracy | 15% | Can structured data be reliably pulled from conversations? |
| Diversity | 15% | Do different personas actually behave differently? |

### Three Files

| File | Who edits | Role |
|---|---|---|
| `autoresearch/prepare.py` | **Nobody** | Fixed evaluation harness — 3 test scenarios, 5 scoring functions (read-only) |
| `autoresearch/experiment.py` | **The AI agent** | Persona specs, interaction patterns, extraction logic (everything fair game) |
| `autoresearch/program.md` | **You** | Instructions for the agent — the "research org code" |

### Run It

```bash
# Verify setup
python autoresearch/prepare.py --check

# Run one experiment manually
python autoresearch/experiment.py

# Go autonomous — point Claude/Codex at the instructions:
# "Read autoresearch/program.md and let's set up a new experiment run."
# Walk away. ~160 experiments overnight.
```

### What the Agent Can Try

Persona specs (Big Five traits, specific beliefs), prompt framing (first-person vs structured), conversation warm-up, multi-step interactions, personality fragments, memory priming, relationship definitions, environmental context, emotional state initialization, goal injection, varied interaction styles (interview, debate, brainstorm, negotiation).

---

## Cookbook

### Load a Pre-Built Persona

```python
from openpersona.agent import Persona
lisa = Persona.load_specification("./examples/agents/Lisa.agent.json")
lisa.listen_and_act("Describe your typical workday.")
```

### Generate a Population from Demographics

```python
from openpersona.factory import PersonaFactory
factory = PersonaFactory.create_factory_from_demography(
    "./examples/information/populations/brazil.json",
    population_size=40, context="Consumer panel for a fintech app"
)
panel = factory.generate_people(40)
```

### Run a Focus Group

```python
from openpersona.environment import World
from openpersona.extraction import ResultsExtractor

world = World("Focus Group", panel[:5])
world.make_everyone_accessible()
world.broadcast("What do you think about a new AI cooking assistant app?")
world.run(3)

extractor = ResultsExtractor()
results = extractor.extract_results_from_world(world,
    extraction_objective="Each person's opinion on the product",
    fields=["name", "opinion", "would_buy"])
```

### Evaluate a Claim About Behavior

```python
from openpersona.experimentation import Proposition
prop = Proposition("The agent demonstrates skepticism toward new technology.", include_personas=True)
passed = prop.check(target=agent)   # True/False
score = prop.score(target=agent)    # 0-9
```

### Generate a Narrative

```python
from openpersona.steering import Narrative
story = Narrative(environment=world, purpose="Document the negotiation dynamics.")
opening = story.start_story(requirements="Focus on tension.", number_of_words=200)
```

---

## Settings

Layered config: `openpersona/config.ini` (defaults) → `./config.ini` (project) → `config_manager.update()` (runtime).

| Section | Key | Default | Purpose |
|---|---|---|---|
| OpenAI | `API_TYPE` | `openai` | Provider: `openai`, `azure`, `ollama` |
| OpenAI | `MODEL` | `gpt-5-mini` | Primary model for agent cognition |
| OpenAI | `CACHE_API_CALLS` | `False` | Cache identical LLM requests |
| Simulation | `PARALLEL_AGENT_ACTIONS` | `True` | Run agents in parallel per step |
| ActionGenerator | `ENABLE_QUALITY_CHECKS` | `False` | Gate actions on persona-adherence |
| ActionGenerator | `QUALITY_THRESHOLD` | `5` | Minimum score (0-9) to accept |

```python
from openpersona import config_manager
config_manager.update("model", "gpt-4o")
config_manager.update("cache_api_calls", True)
```

---

## Benchmarking Against Real Data

### Persona Fidelity

```python
from openpersona.validation import PersonaValidator
score, explanation = PersonaValidator.validate_person(agent,
    expectations="Should behave like a cautious financial analyst.")
```

### Statistical Comparison with Surveys

```python
from openpersona.validation import validate_simulation_experiment_empirically
result = validate_simulation_experiment_empirically(
    control_data=real_responses, treatment_data=simulated_responses,
    statistical_test_type="welch_t_test"
)
print(f"Match: {result.overall_score:.2%}")
```

8 tests: Welch's t, Student's t, KS, Mann-Whitney, Wilcoxon, chi-square, ANOVA, Kruskal-Wallis.

---

## What Ships in the Box

| Directory | Contents |
|---|---|
| `openpersona/` | Core engine — 14 subpackages, 60+ modules |
| `studio/` | Full-stack web UI (FastAPI + Next.js + 3D graph) |
| `autoresearch/` | Autonomous experiment runner (Karpathy-style) |
| `examples/` | 30 Jupyter notebooks, 7 agent specs, 9 personality fragments |
| `tests/` | 35+ unit tests, 7 scenario tests |
| `data/` | Empirical survey CSVs, grounding documents |

---

## Running Tests

```bash
pytest tests/ -v                                          # full (needs API key)
pytest tests/unit/test_config.py tests/unit/test_statistical_tests.py -v  # no key needed
```

---

## Legal

This software generates synthetic content using AI models. Outputs may be inaccurate, biased, or inappropriate. You are solely responsible for reviewing all generated content. Do not simulate sensitive scenarios or use outputs to deceive or harm. Licensed under [MIT](./LICENSE).
