<p align="center">
  <img src="./docs/tinytroupe_stage.png" alt="Simulated personas in a virtual workspace." width="680">
</p>

<h1 align="center">OpenPersona</h1>

<p align="center">
  <em>Synthetic human behavior at scale — powered by large language models.</em>
</p>

<p align="center">
  <a href="#get-started-in-60-seconds">Get Started</a> &bull;
  <a href="#core-concepts">Core Concepts</a> &bull;
  <a href="#use-cases">Use Cases</a> &bull;
  <a href="#system-design">System Design</a> &bull;
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

You have a product idea, an ad campaign, or a piece of software — and you need to know how **real humans** with **different backgrounds, opinions, and quirks** would respond to it. Traditional options are slow (focus groups), expensive (surveys at scale), or shallow (your own gut feeling).

**OpenPersona** lets you spin up populations of synthetic people — each with a unique backstory, personality profile, set of beliefs, and behavioral tendencies — and observe how they react to stimuli in controlled environments. They argue with each other. They change their minds. They make irrational decisions. Just like real people.

This is not a chatbot framework. These agents are designed to **model human imperfection**, not optimize for helpfulness.

---

## Get Started in 60 Seconds

```bash
git clone https://github.com/amandilippandit/OpenPersonaSimulation.git
cd OpenPersonaSimulation
pip install -e .
export OPENAI_API_KEY="sk-..."
```

```python
from tinytroupe.agent import TinyPerson
from tinytroupe.environment import TinyWorld

# Assemble two people
chef = TinyPerson("Marco")
chef.define("age", 42)
chef.define("nationality", "Italian")
chef.define("occupation", {"title": "Head Chef", "organization": "Trattoria Bella"})
chef.define("personality", {"traits": [
    "Passionate about traditional cooking methods.",
    "Skeptical of food technology and molecular gastronomy.",
    "Warm but opinionated — will argue about olive oil brands."
]})

investor = TinyPerson("Priya")
investor.define("age", 35)
investor.define("nationality", "Indian")
investor.define("occupation", {"title": "VC Partner", "organization": "Horizon Ventures"})
investor.define("personality", {"traits": [
    "Data-driven and metrics-obsessed.",
    "Fascinated by food-tech and direct-to-consumer brands.",
    "Impatient with vague pitches — wants numbers fast."
]})

# Put them in a room
room = TinyWorld("Pitch Meeting", [chef, investor])
room.make_everyone_accessible()
investor.listen("Marco, pitch me your idea for a premium frozen pasta subscription box.")
room.run(4)
```

Two synthetic humans. One pitch meeting. Zero scripts. The conversation unfolds based entirely on who they are.

---

## Core Concepts

### Personas

A persona is a detailed specification of a synthetic human. Not a chatbot prompt — a **full identity**:

| Layer | What You Define | Example |
|---|---|---|
| Demographics | Age, gender, nationality, residence | 34, Female, Brazilian, lives in Berlin |
| Professional | Role, company, responsibilities, skills | UX Researcher at Spotify, expert in qualitative methods |
| Psychology | Big Five traits, values, emotional tendencies | High openness, low neuroticism, values autonomy |
| Beliefs | Political views, worldview, domain opinions | Believes remote work is the future, skeptical of crypto |
| Behaviors | Daily routines, habits, decision patterns | Journals every morning, shops impulsively on weekends |
| Preferences | Likes, dislikes, interests, tastes | Loves indie films, hates small talk, collects vinyl |
| Relationships | Connections to other agents | Colleague of Agent X, mentor to Agent Y |

Personas can be defined in Python, loaded from JSON files, or generated from demographic profiles by the factory system.

### Environments

An environment is a container where personas interact. When you call `run()`, each agent perceives what others say and do, thinks about it, and responds — in parallel or sequentially. The environment routes messages, enforces social structures, and advances simulated time.

### The Stimulus-Action Loop

Every agent operates on a simple cycle:

```
Receive stimulus → Update mental state → Generate action → Broadcast to environment
```

Stimuli can be conversations, visual descriptions, thoughts, goals, or documents. Actions include speaking, thinking, recalling memories, consulting grounded documents, using tools, or signaling completion.

---

## Use Cases

### Consumer Research
Generate 50 demographically diverse personas and run them through a product concept test. Extract structured opinions, purchase intent, and objections — in minutes instead of weeks.

### Ad Copy Testing
Show different ad variations to simulated audience segments. Measure which version resonates with which demographic — before committing media spend.

### Synthetic Data Pipelines
Need realistic customer service tickets, product reviews, or survey responses for model training? Generate them from personas with known characteristics so you control the distribution.

### Software QA
Feed your search engine, chatbot, or recommendation system with inputs from simulated users who have realistic intent and context — not random strings.

### Stakeholder Simulation
Before presenting a product roadmap, simulate how a skeptical CFO, an enthusiastic CTO, and a risk-averse compliance officer would each react to your proposal.

### Academic Research
Study opinion dynamics, social influence, group polarization, or consensus formation in controlled multi-agent settings with reproducible configurations.

---

## System Design

```
tinytroupe/
├── agent/                  # Persona engine
│   ├── tiny_person.py      # Identity, perception, action, memory
│   ├── memory.py           # Episodic buffer + semantic vector store
│   ├── action_generator.py # LLM-driven action production with guardrails
│   ├── mental_faculty.py   # Pluggable capabilities (recall, grounding, tools)
│   └── grounding.py        # Document retrieval via LlamaIndex
├── environment/            # Interaction containers
│   ├── tiny_world.py       # General-purpose multi-agent environment
│   └── tiny_social_network.py  # Relation-constrained communication
├── factory/                # Population synthesis
│   └── tiny_person_factory.py  # Demographic-aware agent generation
├── clients/                # LLM provider abstraction
│   ├── openai_client.py    # OpenAI + caching + cost tracking
│   ├── azure_client.py     # Azure OpenAI (key + Entra ID)
│   └── ollama_client.py    # Local model support
├── control.py              # Simulation lifecycle + replay from cache
├── extraction/             # Structured output from conversations
├── enrichment/             # Content enhancement via LLM
├── steering/               # Narrative generation + conditional interventions
├── experimentation/        # Propositions, A/B randomization, stat tests
├── validation/             # Persona fidelity checks + empirical comparison
├── tools/                  # Word processor, calendar (agent-usable)
├── profiling.py            # Population distribution visualization
└── utils/                  # Serialization, config, @llm decorator, helpers
```

### How the Internals Fit Together

**Memory** operates on two levels. Episodic memory stores a rolling buffer of everything the agent experiences — conversations, thoughts, actions — with a sliding window for prompt inclusion. Semantic memory uses a LlamaIndex vector store to index and retrieve relevant information from documents, past consolidated memories, and grounded sources.

**Action generation** sends the agent's system prompt (persona + mental state + recent memories + faculty definitions) to the LLM and parses structured output via Pydantic models. Optional quality gates evaluate the response against persona-adherence propositions and can trigger regeneration or correction.

**Simulation control** wraps state-mutating methods with `@transactional()`. On the first run, every transaction captures a snapshot of the simulation state alongside the LLM response. On subsequent runs, if the input hash matches, the cached response replays instantly — no API call needed. This makes iterative experimentation dramatically cheaper.

**The `@llm` decorator** turns any Python function into an LLM call. Write the task description as a docstring, declare the return type, and the decorator handles prompt construction, API invocation, JSON parsing, and type coercion. The function body is ignored at runtime.

---

## Cookbook

### Load a Pre-Built Persona from JSON

```python
from tinytroupe.agent import TinyPerson

lisa = TinyPerson.load_specification("./examples/agents/Lisa.agent.json")
lisa.listen_and_act("Describe your typical workday.")
```

Six ready-made personas ship in `examples/agents/`: an architect, a data scientist, a sociologist, a chef, and more.

### Overlay Personality Fragments

Fragments let you mix and match behavioral modules across different agents:

```python
agent = TinyPerson("Alex")
agent.define("age", 29)
agent.define("occupation", {"title": "Product Manager"})

# Layer on travel enthusiasm and political leanings
agent.import_fragment("./examples/fragments/travel_enthusiast.agent.fragment.json")
agent.import_fragment("./examples/fragments/libertarian.agent.fragment.json")
```

### Generate a Population from Demographics

```python
from tinytroupe.factory import TinyPersonFactory

factory = TinyPersonFactory.create_factory_from_demography(
    "./examples/information/populations/brazil.json",
    population_size=40,
    context="Consumer panel for a new fintech app"
)
panel = factory.generate_people(40)
```

The factory reads demographic distributions (age brackets, income levels, education, regions) and produces a diverse set of agents that statistically mirrors the target population.

### Run a Multi-Step Simulation with Time

```python
from datetime import timedelta
from tinytroupe.environment import TinyWorld

world = TinyWorld("Workshop", agents)
world.run(steps=6, timedelta_per_step=timedelta(hours=2))

# Or use shorthand
world.run_days(1)
world.run_hours(4)
```

### Extract Structured Data from Conversations

```python
from tinytroupe.extraction import ResultsExtractor

extractor = ResultsExtractor()
data = extractor.extract_results_from_agents(
    agents=panel,
    extraction_objective="Determine each person's purchase intent for the product.",
    fields=["name", "intent", "reason", "price_sensitivity"]
)
```

### Evaluate a Claim About Agent Behavior

```python
from tinytroupe.experimentation import Proposition

claim = Proposition(
    "The agent consistently demonstrates skepticism toward new technology.",
    include_personas=True
)
passed = claim.check(target=agent)        # True / False
score = claim.score(target=agent)         # 0 (disagree) to 9 (strongly agree)
```

### Generate a Narrative from a Simulation

```python
from tinytroupe.steering import TinyStory

story = TinyStory(environment=world, purpose="Document the negotiation dynamics.")
opening = story.start_story(requirements="Focus on the tension between the two leads.", number_of_words=200)
continuation = story.continue_story(requirements="Build toward a resolution.", number_of_words=300)
```

### Set Up Conditional Interventions

```python
from tinytroupe.steering import Intervention

nudge = Intervention(targets=[agent])
nudge.set_textual_precondition("The agent has become disengaged from the conversation.")
nudge.set_effect(lambda targets: targets[0].think("Maybe I should re-engage and share my perspective."))

world = TinyWorld("Debate", agents, interventions=[nudge])
world.run(5)
```

### Profile a Generated Population

```python
from tinytroupe.profiling import Profiler

profiler = Profiler(attributes=["age", "occupation.title", "nationality"])
profiler.profile(panel, plot=True)
```

Outputs distribution charts and correlation analysis across your agent population.

---

## Settings

OpenPersona reads configuration from `tinytroupe/config.ini` (defaults), then overlays any `config.ini` in your working directory, then accepts runtime overrides.

### Key Parameters

| Section | Parameter | Default | Purpose |
|---|---|---|---|
| OpenAI | `API_TYPE` | `openai` | Provider: `openai`, `azure`, or `ollama` |
| OpenAI | `MODEL` | `gpt-5-mini` | Primary model for agent cognition |
| OpenAI | `REASONING_MODEL` | `o3-mini` | Model for deep analysis tasks |
| OpenAI | `EMBEDDING_MODEL` | `text-embedding-3-small` | Embedding model for semantic memory |
| OpenAI | `MAX_COMPLETION_TOKENS` | `128000` | Token budget per response |
| OpenAI | `TIMEOUT` | `480` | API timeout in seconds |
| OpenAI | `CACHE_API_CALLS` | `False` | Cache identical LLM requests |
| Simulation | `PARALLEL_AGENT_ACTIONS` | `True` | Parallelize agent steps within a round |
| Cognition | `ENABLE_MEMORY_CONSOLIDATION` | `True` | Periodically compress episodic memories |
| ActionGenerator | `ENABLE_QUALITY_CHECKS` | `False` | Gate actions on persona-adherence scores |
| ActionGenerator | `QUALITY_THRESHOLD` | `5` | Minimum score (0-9) to accept an action |

### Runtime Override

```python
from tinytroupe import config_manager

config_manager.update("model", "gpt-4o")
config_manager.update("cache_api_calls", True)
config_manager.update("action_generator_enable_quality_checks", True)
```

---

## Benchmarking Against Real Data

Simulations are only useful if they approximate reality. OpenPersona includes tools to measure that gap quantitatively.

### Persona Fidelity Check

Ask an LLM evaluator to interview your agent and score how well it embodies its specification:

```python
from tinytroupe.validation import TinyPersonValidator

score, explanation = TinyPersonValidator.validate_person(
    agent,
    expectations="Should behave like a cautious, detail-oriented financial analyst."
)
```

### Statistical Comparison with Survey Data

Compare simulation outputs against real-world responses using hypothesis tests:

```python
from tinytroupe.validation import validate_simulation_experiment_empirically

result = validate_simulation_experiment_empirically(
    control_data=real_responses,
    treatment_data=simulated_responses,
    statistical_test_type="welch_t_test"  # or ks_test, mann_whitney, chi_square, etc.
)
print(f"Match score: {result.overall_score:.2%}")
```

Eight test types available: Welch's t, Student's t, Kolmogorov-Smirnov, Mann-Whitney U, Wilcoxon signed-rank, chi-square, ANOVA, and Kruskal-Wallis.

---

## Saving Compute

### Simulation Snapshots

Checkpoint your simulation state partway through. On re-runs, completed steps replay from cache — no API calls needed:

```python
from tinytroupe import control

control.begin("experiment_v3.cache.json")
# Steps 1-8 replay from cache...
# Step 9 onward runs fresh
control.checkpoint()
control.end()
```

### Response Caching

Set `CACHE_API_CALLS=True` in your config. Any identical prompt-model pair returns the cached completion. Useful for deterministic iteration during development.

### Cost Monitoring

```python
from tinytroupe.clients import client

client().pretty_print_cost_stats()
```

Track spend at the API client, environment, or individual agent level.

---

## Running the Test Suite

```bash
# Full suite (needs OPENAI_API_KEY)
pytest tests/ -v

# Fast subset — no API key required
pytest tests/unit/test_config.py tests/unit/test_statistical_tests.py -v

# Core integration tests
pytest tests/ -m "core and not slow" -v
```

---

## What Ships in the Box

| Directory | Contents |
|---|---|
| `tinytroupe/` | Core library — 14 subpackages, 60+ Python modules |
| `examples/` | 30 Jupyter notebooks covering every major workflow |
| `examples/agents/` | 7 ready-made persona JSON files |
| `examples/fragments/` | 9 personality overlay modules |
| `examples/information/` | Demographic profiles for Brazil, Colombia, Spain, USA |
| `tests/` | 35+ unit tests, 7 scenario tests, security tests |
| `data/` | Empirical survey CSVs, grounding documents, sample exports |
| `publications/` | Research paper experiment artifacts |
| `docs/` | API documentation, screenshots, guides |

---

## Requirements

- Python 3.10 or later
- An LLM API key (OpenAI, Azure OpenAI, or local Ollama)
- Core dependencies: `openai`, `pydantic`, `llama-index`, `chevron`, `rich`, `pandas`, `scipy`, `tiktoken`
- Full list in [pyproject.toml](./pyproject.toml)

---

## Acknowledgements

OpenPersona builds on the research and engineering work of the [TinyTroupe](https://github.com/microsoft/TinyTroupe) project by Paulo Salem and the team at Microsoft Research. Their foundational paper is available at [arXiv:2507.09788](https://arxiv.org/abs/2507.09788).

---

## Legal

This software generates synthetic content using AI models. Outputs may be inaccurate, biased, or inappropriate. You are solely responsible for reviewing and validating all generated content before any use. Do not use this tool to simulate sensitive scenarios or to deceive, manipulate, or cause harm. Comply with all applicable laws and regulations.

Licensed under the [MIT License](./LICENSE).
