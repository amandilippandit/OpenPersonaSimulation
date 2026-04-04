<p align="center">
  <img src="./docs/tinytroupe_stage.png" alt="A tiny office with tiny people in a simulation." width="700">
</p>

<h1 align="center">OpenPersonaSimulation</h1>

<p align="center">
  <strong>LLM-powered multiagent persona simulation for imagination enhancement and business insights.</strong>
</p>

<p align="center">
  <a href="#quickstart">Quickstart</a> &bull;
  <a href="#what-it-does">What It Does</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#examples">Examples</a> &bull;
  <a href="#api-reference">API Reference</a> &bull;
  <a href="#configuration">Configuration</a> &bull;
  <a href="#validation">Validation</a> &bull;
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10%2B-blue" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/version-0.7.0-orange" alt="Version 0.7.0">
  <img src="https://img.shields.io/badge/LLM-GPT--5--mini-purple" alt="GPT-5-mini">
</p>

---

## Why This Exists

Most AI agent frameworks build **assistants** that help humans do tasks. This library does something different: it builds **simulated humans** that *behave* like real people — complete with personalities, biases, emotions, mistakes, and opinions.

Why would you want that?

- **You're launching a product** and want to know how 50 different customer archetypes would react to your pitch — before spending a dollar on real focus groups.
- **You're writing ad copy** and want to A/B test it against a simulated audience of diverse demographics instantly.
- **You're building software** and need realistic test inputs that a human would actually type — not just fuzz.
- **You're doing market research** and want to validate whether your simulation matches real survey data using statistical tests.

This is a **simulation toolkit**, not an assistant framework. The agents here are meant to be flawed, opinionated, and realistic — because that's what humans are.

> Based on [Microsoft's TinyTroupe](https://github.com/microsoft/TinyTroupe) research project. See the [TinyTroupe paper](https://arxiv.org/abs/2507.09788) for the full academic context.

---

## Quickstart

### 1. Install

```bash
# Clone this repo
git clone https://github.com/amandilippandit/OpenPersonaSimulation.git
cd OpenPersonaSimulation

# Create environment (conda or venv)
conda create -n personas python=3.10 && conda activate personas

# Install
pip install -e .
```

### 2. Set your API key

```bash
export OPENAI_API_KEY="sk-..."
```

Supports **OpenAI**, **Azure OpenAI**, and experimental **Ollama** for local models.

### 3. Run your first simulation

```python
from tinytroupe.agent import TinyPerson
from tinytroupe.environment import TinyWorld

# Create two agents
architect = TinyPerson("Oscar")
architect.define("age", 30)
architect.define("nationality", "German")
architect.define("occupation", {"title": "Architect", "organization": "Awesome Inc."})
architect.define("personality", {"traits": [
    "You love modernist architecture and sustainable design.",
    "You are creative but practical.",
    "You enjoy traveling and playing guitar."
]})

scientist = TinyPerson("Lisa")
scientist.define("age", 28)
scientist.define("nationality", "Canadian")
scientist.define("occupation", {"title": "Data Scientist", "organization": "Microsoft"})
scientist.define("personality", {"traits": [
    "You are curious and analytical.",
    "You love solving problems with data.",
    "You enjoy cooking and playing piano."
]})

# Drop them into a world and let them talk
world = TinyWorld("Office", [architect, scientist])
world.make_everyone_accessible()
scientist.listen("Talk to Oscar about sustainable building design.")
world.run(4)
```

That's it. Two simulated humans having a realistic conversation in 10 lines of code.

---

## What It Does

<table>
<tr>
<td width="50%">

### Simulate People
Create agents with deep persona specifications — age, occupation, personality traits (Big Five), beliefs, preferences, routines, skills, relationships, and more. They think, talk, recall memories, consult documents, and use tools.

### Simulate Worlds
Place agents in environments where they interact autonomously. Conversations, debates, focus groups, interviews — all driven by the personas you define, not scripted dialogue.

### Extract Insights
Pull structured data out of simulations. Extract preferences, reduce interactions to key decisions, normalize free-text responses into categories, and generate reports.

</td>
<td width="50%">

### Validate Against Reality
Compare simulation outputs against real survey data using statistical tests (Welch's t-test, KS test, Mann-Whitney, chi-square, and more). Know when your simulation matches human behavior — and when it doesn't.

### Scale Populations
Generate diverse populations from demographic data. Define a sampling space (age distributions, occupations, education levels) and let the factory produce 50+ unique agents with realistic variety.

### Control Quality
Built-in action quality checks ensure agents stay true to their persona. If an agent's response drifts from their personality, the system can regenerate or correct it automatically.

</td>
</tr>
</table>

---

## Architecture

```
tinytroupe/
├── agent/                  # TinyPerson, memory, mental faculties, grounding
│   ├── tiny_person.py      # Core agent: act, listen, think, see, remember
│   ├── memory.py           # Episodic + semantic memory (LlamaIndex vectors)
│   ├── action_generator.py # LLM action generation with quality checks
│   ├── mental_faculty.py   # Recall, grounding, tool use faculties
│   └── grounding.py        # Local file + web page semantic search
├── environment/            # TinyWorld, TinySocialNetwork
├── factory/                # LLM-powered agent generation from demographics
├── clients/                # OpenAI, Azure, Ollama API abstraction
├── control.py              # Simulation lifecycle, transactional caching
├── extraction/             # ResultsExtractor, Normalizer, ArtifactExporter
├── enrichment/             # LLM content enrichment and styling
├── steering/               # TinyStory narratives, Intervention system
├── experimentation/        # Proposition evaluation, A/B testing, statistics
├── validation/             # Agent validation, empirical comparison
├── tools/                  # TinyWordProcessor, TinyCalendar
├── profiling.py            # Population distribution analysis
└── utils/                  # Config, serialization, LLM helpers, @llm decorator
```

### Key Design Patterns

| Pattern | What It Does |
|---|---|
| `@transactional()` | Wraps methods in a cache-and-replay transaction. Replay expensive simulations from cache without re-calling the LLM. |
| `@llm()` decorator | Transforms any Python function into an LLM call. The docstring becomes the prompt; the return type enforces output format. |
| `JsonSerializableRegistry` | Universal serialization mixin. Every agent, world, and factory can be saved/loaded as JSON with automatic class registry. |
| `@post_init` | Ensures `_post_init()` runs after construction — used for lazy initialization of vector indices and connectors. |
| `config_defaults()` | Decorator that injects live config values as default parameters at call time. |

---

## Examples

### 30 Jupyter notebooks included in [`examples/`](./examples/)

| Notebook | What It Demonstrates |
|---|---|
| [Simple Chat](./examples/Simple%20Chat.ipynb) | Minimal agent conversation |
| [Interview with Customer](./examples/Interview%20with%20Customer.ipynb) | Deep-dive customer interview |
| [Product Brainstorming](./examples/Product%20Brainstorming.ipynb) | Multi-agent focus group |
| [Advertisement for TV](./examples/Advertisement%20for%20TV.ipynb) | Ad evaluation with preference extraction |
| [Bottled Gazpacho Market Research 5](./examples/Bottled%20Gazpacho%20Market%20Research%205.ipynb) | Empirical validation with real survey data |
| [Synthetic Data Generation](./examples/Synthetic%20Data%20Generation.ipynb) | Realistic synthetic data pipelines |
| [Political Compass](./examples/Political%20Compass%20(customizing%20agents%20with%20fragments).ipynb) | Agent customization with personality fragments |
| [Vision modality](./examples/Vision%20for%20Product%2C%20Diagnosis%20and%20Appreciation%20Feedback%20(image%20modality).ipynb) | Image understanding with agents |
| [Creating and Validating Agents](./examples/Creating%20and%20Validating%20Agents.ipynb) | Agent creation, validation, and profiling |

### Quick Example: Focus Group in 15 Lines

```python
from tinytroupe.factory import TinyPersonFactory
from tinytroupe.environment import TinyWorld
from tinytroupe.extraction import ResultsExtractor

# Generate 5 diverse consumers from US demographics
factory = TinyPersonFactory.create_factory_from_demography(
    "./examples/information/populations/usa.json", population_size=5
)
people = factory.generate_people(5)

# Run a focus group
world = TinyWorld("Focus Group", people)
world.make_everyone_accessible()
world.broadcast("What do you think about a new AI-powered cooking assistant app?")
world.run(3)

# Extract structured results
extractor = ResultsExtractor()
results = extractor.extract_results_from_world(world, 
    extraction_objective="What is each person's opinion on the product?",
    fields=["name", "opinion", "would_buy"])
```

---

## API Reference

### Core Classes

#### `TinyPerson` — The Agent

```python
agent = TinyPerson("Name")

# Define persona
agent.define("age", 30)
agent.define("occupation", {"title": "Engineer", "organization": "Acme"})
agent.define("personality", {"traits": ["curious", "analytical"]})
agent.define_relationships([{"agent": other_agent, "description": "colleague"}])

# Stimulus methods
agent.listen("Hello!")                       # Conversation stimulus
agent.see("A beautiful sunset")             # Visual stimulus  
agent.think("I should reconsider my plan")  # Internal thought
agent.internalize_goal("Close the deal")    # Goal injection

# Convenience (stimulus + act in one call)
agent.listen_and_act("What do you think about AI?")
agent.see_and_act("A product prototype", images=["photo.png"])

# Memory
agent.read_documents_from_folder("./reports/")
agent.read_documents_from_web(["https://example.com/article"])

# Serialization
agent.save_specification("agent.json")
loaded = TinyPerson.load_specification("agent.json")
```

#### `TinyWorld` — The Environment

```python
world = TinyWorld("Lab", [agent1, agent2])

# Run simulation
world.run(steps=5, timedelta_per_step=timedelta(hours=1))
world.run_hours(3)
world.run_days(1)

# Add interventions (conditional effects)
intervention = Intervention(targets=[agent1])
intervention.set_textual_precondition("The agent seems frustrated")
intervention.set_effect(lambda targets: targets[0].think("Take a deep breath"))
world.add_intervention(intervention)
```

#### `TinyPersonFactory` — Population Generation

```python
# From demographic data
factory = TinyPersonFactory.create_factory_from_demography(
    "demographics.json", population_size=100,
    context="Market research for luxury travel"
)
people = factory.generate_people(50)  # parallel by default

# From description
factory = TinyPersonFactory(context="A tech startup in Berlin")
person = factory.generate_person("A senior backend engineer who loves open source")
```

#### `Proposition` — LLM-Evaluated Claims

```python
from tinytroupe.experimentation import Proposition

# Boolean check
prop = Proposition("The agent's response is professional and on-brand")
result = prop.check(target=agent)  # True/False

# Scored evaluation (0-9)
score = prop.score(target=agent)   # 0 = completely false, 9 = completely true
```

---

## Configuration

Configuration is layered: `tinytroupe/config.ini` (defaults) -> `./config.ini` (project override) -> `config_manager.update()` (runtime).

```ini
[OpenAI]
API_TYPE = openai              # openai | azure | ollama
MODEL = gpt-5-mini             # Main model for agent responses
REASONING_MODEL = o3-mini      # For deep analysis tasks
EMBEDDING_MODEL = text-embedding-3-small
MAX_COMPLETION_TOKENS = 128000
TIMEOUT = 480
CACHE_API_CALLS = False        # Set True to cache LLM responses

[Simulation]
PARALLEL_AGENT_ACTIONS = True  # Run agents in parallel within each step
PARALLEL_AGENT_GENERATION = True

[Cognition]
ENABLE_MEMORY_CONSOLIDATION = True
MIN_EPISODE_LENGTH = 10
MAX_EPISODE_LENGTH = 15

[ActionGenerator]
ENABLE_QUALITY_CHECKS = False  # Enable persona-adherence quality gates
QUALITY_THRESHOLD = 5          # 0-9 scale
ENABLE_REGENERATION = True     # Auto-regenerate low-quality actions
```

```python
# Runtime override
from tinytroupe import config_manager
config_manager.update("model", "gpt-4o")
config_manager.update("cache_api_calls", True)
```

---

## Validation

### Agent Validation

Validate that an agent behaves according to its persona:

```python
from tinytroupe.validation import TinyPersonValidator

score, justification = TinyPersonValidator.validate_person(
    agent, 
    expectations="Should behave like a conservative banker who is skeptical of new technology"
)
print(f"Score: {score}/10 — {justification}")
```

### Empirical Validation Against Real Data

Compare simulation results against actual survey data:

```python
from tinytroupe.validation import validate_simulation_experiment_empirically

result = validate_simulation_experiment_empirically(
    control_data=real_survey_dataset,
    treatment_data=simulation_dataset,
    validation_types=["statistical", "semantic"],
    statistical_test_type="welch_t_test"
)
print(f"Overall match score: {result.overall_score:.2f}")  # 0.0 to 1.0
```

Available statistical tests: `welch_t_test`, `student_t_test`, `ks_test`, `mann_whitney`, `wilcoxon`, `chi_square`, `anova`, `kruskal_wallis`.

---

## Caching & Cost Control

### Simulation State Caching

Replay expensive multi-step simulations from cache:

```python
from tinytroupe import control

control.begin("my_simulation.cache.json")
# ... run expensive simulation steps ...
control.checkpoint()  # save state
# ... tweak later steps without re-running earlier ones ...
control.end()
```

### LLM API Caching

Enable in `config.ini` with `CACHE_API_CALLS=True`. Identical LLM calls return cached responses.

### Cost Tracking

```python
from tinytroupe.clients import client

client().pretty_print_cost_stats()          # API-level costs
TinyWorld.pretty_print_global_cost_stats()  # Environment-level
TinyPerson.pretty_print_global_cost_stats() # Agent-level
```

---

## Assistants vs. Simulators

This is not another AI assistant framework. Here's the difference:

| AI Assistants | Persona Simulations (This Library) |
|---|---|
| Strives for truth and accuracy | Has opinions, biases, and blind spots |
| Has no past or personal history | Has a backstory of experiences and beliefs |
| Is helpful and compliant | Can be stubborn, skeptical, or enthusiastic |
| Optimizes for the "right" answer | Produces realistic human responses |
| Assists users with tasks | Helps users **understand other humans** |

---

## Project Structure

```
.
├── tinytroupe/          # The Python library (14 subpackages, 60+ files)
├── examples/            # 30 Jupyter notebook demos
├── tests/               # 35+ unit tests, 7 scenario tests, security tests
├── data/                # Empirical survey data, grounding documents
├── publications/        # Research paper artifacts and experiments
├── docs/                # API documentation, images, guides
├── config.ini           # Default configuration
└── pyproject.toml       # Package metadata and dependencies
```

---

## Running Tests

```bash
# All tests (requires OPENAI_API_KEY)
pytest tests/ -v

# Core tests only (faster)
pytest tests/ -m "core and not slow" -v

# Non-API tests (no key needed)
pytest tests/unit/test_config.py tests/unit/test_statistical_tests.py -v
```

---

## Requirements

- Python 3.10+
- OpenAI API key (or Azure OpenAI / Ollama)
- Key dependencies: `openai>=1.65`, `pydantic>=2.5`, `llama-index`, `chevron`, `rich`, `pandas`, `scipy`

Full dependency list in [pyproject.toml](./pyproject.toml).

---

## Legal Disclaimer

This library is for **research and simulation only**. It relies on AI models to generate content that may include unrealistic, inappropriate, or inaccurate results. You are responsible for reviewing all generated content before use. Generated outputs do not reflect the opinions of the authors or Microsoft. See [RESPONSIBLE_AI_FAQ.md](./RESPONSIBLE_AI_FAQ.md) for details.

**Prohibited uses:** Do not simulate sensitive situations (violence, sexual content). Do not use outputs to deliberately deceive, mislead, or harm people. You must comply with all applicable laws.

---

## Acknowledgements

Based on [Microsoft TinyTroupe](https://github.com/microsoft/TinyTroupe), created by Paulo Salem and the TinyTroupe team at Microsoft Research.

**Citing:**
```bibtex
@article{tinytroupe2025,
  author  = {Paulo Salem and Robert Sim and Christopher Olsen and Prerit Saxena and Rafael Barcelos and Yi Ding},
  title   = {TinyTroupe: An LLM-powered Multiagent Persona Simulation Toolkit},
  journal = {arXiv preprint arXiv:2507.09788},
  year    = {2025}
}
```

---

<p align="center">
  <sub>MIT License</sub>
</p>
