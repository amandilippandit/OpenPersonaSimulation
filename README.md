<h1 align="center">OpenPersona</h1>

<p align="center">
  <em>Test your marketing content against synthetic audiences before you spend a dollar on media.</em>
</p>

<p align="center">
  <a href="#what-it-does">What It Does</a> &bull;
  <a href="#quickstart">Quickstart</a> &bull;
  <a href="#workflows">Workflows</a> &bull;
  <a href="#openpersona-studio">Studio UI</a> &bull;
  <a href="#autoresearch">Autoresearch</a> &bull;
  <a href="#api">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10%2B-3776AB?logo=python&logoColor=white" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/license-MIT-22c55e" alt="MIT License">
  <img src="https://img.shields.io/badge/release-0.7.0-f97316" alt="v0.7.0">
</p>

---

## The Problem

You wrote an ad. You're about to spend $50K on media. But you don't actually know how your audience will react. Options so far:

- **Focus groups** — slow, expensive, biased by who shows up
- **A/B testing in production** — costly to be wrong in public
- **Your gut feeling** — flattering, often wrong
- **Surveys** — respondents don't actually behave how they say they will

**OpenPersona** gives you a fourth option: spin up 50 synthetic consumers with realistic personalities, demographics, and biases, show them your ad, and see how they react — structured, scored, and actionable. In minutes instead of weeks.

This is built specifically for **marketing content testing**: ad copy, landing pages, taglines, brand messaging, product positioning, campaign concepts, email subject lines, social posts, pitch decks.

---

## What It Does

### Test Ad Copy Against Audiences
Show the same ad to 50 personas across your target demographic. Get back: purchase intent, emotional reactions, trust scores, comprehension, objections, and suggested improvements — broken down by segment.

### A/B Test Before You Launch
Run Variation A against Persona Group 1 and Variation B against Persona Group 2. Statistical comparison of response distributions. Know which headline wins before spending on media.

### Evaluate Brand Messaging
Read your brand guidelines to a diverse simulated audience. Measure how consistently different personas interpret your positioning. Find where your message gets lost.

### Predict Campaign Reception
Simulate your launch week. Show your campaign to 100 consumers across demographics, let them "discuss" it with each other (word-of-mouth simulation), and extract: initial reaction, trust signals, virality indicators, concerns.

### Find the Right Persona
Generate 200 synthetic consumers from demographic data, show them your product, and find the 20 who respond most strongly. These become your ideal customer profile — with full backstories, objections, and purchase triggers.

---

## Quickstart

```bash
git clone https://github.com/amandilippandit/OpenPersonaSimulation.git
cd OpenPersonaSimulation
pip install -e .
export OPENAI_API_KEY="sk-..."
```

### Test an Ad in 20 Lines

```python
from openpersona.agent import Persona
from openpersona.environment import World
from openpersona.extraction import ResultsExtractor

# Your target audience
audiences = [
    {"name": "Emma", "age": 28, "occupation": {"title": "Marketing Manager"},
     "personality": {"traits": ["value-conscious", "brand-loyal", "socially active"]}},
    {"name": "James", "age": 45, "occupation": {"title": "IT Director"},
     "personality": {"traits": ["skeptical of marketing", "research-driven", "price-sensitive"]}},
    {"name": "Priya", "age": 34, "occupation": {"title": "Working Parent"},
     "personality": {"traits": ["time-constrained", "quality-focused", "impulse buyer"]}},
]

agents = [Persona(a["name"]) for a in audiences]
for agent, spec in zip(agents, audiences):
    for k, v in spec.items():
        if k != "name":
            agent.define(k, v)

# Your ad copy
ad_copy = """
Sleep Better Tonight.
Introducing ZenMatt — the smart mattress that learns your sleep patterns
and adapts in real-time. 90-night trial. Free shipping. $899.
"""

# Test it
room = World("Focus Group", agents)
room.make_everyone_accessible()
for agent in agents:
    agent.listen(f"Read this ad and share your honest reaction:\n\n{ad_copy}")
room.run(2)

# Extract structured feedback
extractor = ResultsExtractor()
results = extractor.extract_results_from_agents(agents,
    extraction_objective="Get each person's reaction to the ad",
    fields=["purchase_intent_1_to_10", "emotional_reaction",
            "main_concern", "would_share_with_friend"])

for r in results:
    print(r)
```

Output:
```
{"name": "Emma", "purchase_intent_1_to_10": 7, "emotional_reaction": "curious and excited",
 "main_concern": "how does the 'learning' work exactly?", "would_share_with_friend": true}
{"name": "James", "purchase_intent_1_to_10": 3, "emotional_reaction": "skeptical",
 "main_concern": "buzzwords without specifics, need reviews", "would_share_with_friend": false}
{"name": "Priya", "purchase_intent_1_to_10": 8, "emotional_reaction": "intrigued",
 "main_concern": "$899 is steep but 90-night trial helps", "would_share_with_friend": true}
```

---

## Workflows

### 1. Ad Copy A/B Testing

```python
from openpersona.experimentation import ABRandomizer

ab = ABRandomizer(real_name_1="control", real_name_2="variant_b")

headline_a = "Sleep Better Tonight"
headline_b = "The Last Mattress You'll Ever Need"

# Randomize which audience sees which variant
for i, persona in enumerate(audiences):
    shown_a, shown_b = ab.randomize(i, headline_a, headline_b)
    persona.listen(f"How does this headline make you feel?\n{shown_a}")
    # ... collect response, map back to real variant via derandomize()
```

### 2. Campaign Reception Simulation

```python
from openpersona.factory import PersonaFactory

# Generate 50 consumers matching US demographics
factory = PersonaFactory.create_factory_from_demography(
    "./examples/information/populations/usa.json",
    population_size=50,
    context="Tech-savvy consumers aged 25-45"
)
audience = factory.generate_people(50)

# Launch simulation
world = World("Launch Week", audience)
world.make_everyone_accessible()
world.broadcast("Check out this new product launch: [your campaign]")
world.run(steps=5)  # Let them react and discuss

# Measure virality, sentiment, concerns
```

### 3. Brand Message Consistency Check

```python
from openpersona.experimentation import Proposition

brand_message = "We are a premium, sustainable, family-owned company."

# For each persona, check if they correctly perceived the brand
perception_check = Proposition(
    "The agent perceived this brand as premium, sustainable, and family-oriented.",
    include_personas=True
)

scores = [perception_check.score(target=agent) for agent in audience]
print(f"Brand clarity score: {sum(scores)/len(scores)}/9")
```

---

## OpenPersona Studio

Full-stack web UI for running marketing tests visually.

### Features

- **3D Audience Graph** — each node is a synthetic consumer, colored by emotional response to your content. See at a glance which segments are engaged, skeptical, or excited.
- **Content Testing Panel** — paste ad copy, taglines, or brand messages. Instant responses from your audience.
- **A/B Compare View** — side-by-side variant responses with statistical significance indicators.
- **Segment Analytics** — break down responses by age, occupation, personality traits.
- **Export Reports** — structured JSON/CSV of all reactions for your marketing team.

### Three Panels

| Panel | Shows |
|---|---|
| **3D Audience Graph** | Consumers as nodes colored by emotion (positive=green, skeptical=red, neutral=gray) |
| **Content Inspector** | Selected consumer's profile + their detailed reaction to your content |
| **Response Timeline** | Real-time stream of reactions as your ad propagates through the audience |

### Run It

```bash
# Terminal 1 — Backend
uvicorn studio.backend.main:app --port 8000 --reload

# Terminal 2 — Frontend
cd studio/frontend && npm install && npm run dev

# Open http://localhost:3000
```

---

## Autoresearch

> Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). Autonomous overnight optimization for marketing testing quality.

An AI agent autonomously experiments with audience configurations to find the persona setups that produce the most realistic, actionable marketing insights.

### One Metric

**`quality_score`** (0.0 → 1.0) — composite of:
- Audience realism (do consumers behave like real target segments?)
- Response depth (are reactions detailed and actionable?)
- Discrimination (do different segments give meaningfully different feedback?)
- Actionability (can you extract specific improvements from responses?)
- Coverage (does the audience surface both positive and negative reactions?)

### One File

The agent edits `autoresearch/experiment.py` — consumer persona specs, audience composition, reaction prompts, extraction strategies. Everything fair game.

### Overnight Iteration

```bash
# Verify setup
python autoresearch/prepare.py --check

# Run manually
python autoresearch/experiment.py

# Autonomous: point Claude/Codex at autoresearch/program.md
# Walk away. ~160 experiments overnight.
```

---

## API

### Backend Endpoints (FastAPI)

| Method | Path | What It Does |
|---|---|---|
| `POST` | `/api/simulations` | Create a new test session |
| `POST` | `/api/simulations/{id}/agents` | Add consumer to audience |
| `POST` | `/api/simulations/{id}/test_content` | Show content to all consumers, get reactions |
| `POST` | `/api/simulations/{id}/ab_test` | Run A/B test across audience |
| `POST` | `/api/simulations/{id}/extract` | Pull structured feedback |
| `GET` | `/api/simulations/{id}/graph` | 3D audience visualization data |
| `GET` | `/api/simulations/{id}/events` | Full response timeline |
| `WS` | `/ws/simulations/{id}` | Real-time reaction stream |

### Core Library API

```python
from openpersona.agent import Persona
from openpersona.environment import World
from openpersona.factory import PersonaFactory
from openpersona.extraction import ResultsExtractor, Normalizer
from openpersona.experimentation import ABRandomizer, Proposition
from openpersona.validation import validate_simulation_experiment_empirically
```

---

## What's Inside

| Directory | Purpose |
|---|---|
| `openpersona/` | Core engine — persona modeling, multi-agent environments |
| `studio/` | Web UI for visual marketing testing (FastAPI + Next.js + Three.js) |
| `autoresearch/` | Autonomous experiment runner for testing quality optimization |
| `examples/` | 30 notebooks including ad evaluation, brand research, focus groups |
| `data/empirical/` | Real market research CSVs for validation |
| `tests/` | Test suite |

---

## Validation

Compare simulation results against real survey data:

```python
from openpersona.validation import validate_simulation_experiment_empirically

result = validate_simulation_experiment_empirically(
    control_data=real_survey_csv,
    treatment_data=simulation_results,
    statistical_test_type="welch_t_test"
)
print(f"Simulation matches reality: {result.overall_score:.2%}")
```

8 statistical tests available: Welch's t, Student's t, KS, Mann-Whitney, Wilcoxon, chi-square, ANOVA, Kruskal-Wallis.

---

## Settings

```python
from openpersona import config_manager

# Runtime config
config_manager.update("model", "gpt-5-mini")
config_manager.update("cache_api_calls", True)          # cache LLM responses
config_manager.update("parallel_agent_actions", True)   # parallel audience reactions
```

Or edit `config.ini` for persistent settings.

---

## Legal

This tool generates synthetic consumer reactions using AI. Outputs are simulations, not guarantees of real market behavior. Always validate critical marketing decisions against real audience testing. Do not use to deceive consumers or simulate sensitive scenarios. MIT Licensed



