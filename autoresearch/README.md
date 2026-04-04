# autoresearch — OpenPersona Edition

> Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). Same idea, different domain.

Where the original autoresearch lets an AI agent autonomously optimize LLM training code overnight, this version lets an AI agent autonomously optimize **persona simulation quality**.

The agent modifies persona definitions, interaction patterns, prompt strategies, and extraction logic. It runs a scenario, scores the output, keeps improvements, discards regressions, and loops forever. You wake up to a log of experiments and (hopefully) more realistic synthetic humans.

## How it works

Three files that matter:

| File | Role | Who edits it |
|---|---|---|
| `prepare.py` | Fixed evaluation harness — scoring functions, test scenarios, constants | **No one** (read-only) |
| `experiment.py` | The experiment — persona specs, interaction loops, extraction strategies | **The AI agent** |
| `program.md` | Instructions for the agent — the "research org code" | **The human** |

The agent modifies `experiment.py`, runs it, checks the `quality_score`, and decides to keep or discard. The score is a weighted composite of:

- **Persona adherence** (25%) — does the agent act like its defined persona?
- **Response coherence** (25%) — are responses natural and well-formed?
- **Interaction quality** (20%) — do multi-agent conversations feel real?
- **Extraction accuracy** (15%) — can structured data be pulled from conversations?
- **Diversity** (15%) — do different personas actually behave differently?

Each experiment runs for a **fixed 3-minute time budget**.

## Quick start

```bash
# From the repo root
pip install -e .
export OPENAI_API_KEY="sk-..."

# Verify setup
python autoresearch/prepare.py --check

# Run a single experiment manually
python autoresearch/experiment.py

# Go autonomous — point Claude/Codex at program.md and let it rip
```

## Running the agent

Open your AI coding agent in this repo and prompt:

```
Read autoresearch/program.md and let's set up a new experiment run.
```

Then walk away. The agent will:
1. Create a branch
2. Establish baseline
3. Loop: modify → run → score → keep/discard → repeat

At ~3 minutes per experiment, expect ~20 experiments/hour, ~160 overnight.

## What the agent can try

- Richer persona specs (Big Five traits, specific beliefs, behavioral patterns)
- Prompt framing (first-person narrative vs structured attributes)
- Conversation warm-up (build rapport before critical questions)
- Multi-step interactions (let dynamics develop over more turns)
- Persona fragments (modular personality overlays)
- Memory priming (pre-seed agent context)
- Relationship definitions (colleague vs stranger vs authority figure)
- Environmental context (location, time pressure, social setting)
- Emotional state initialization (start agents in specific moods)
- Goal injection (hidden objectives that shape behavior)
- Varied interaction styles (interview vs debate vs brainstorm)

## Results format

Results are logged to `results.tsv` (tab-separated):

```
commit	quality_score	api_calls	status	description
a1b2c3d	0.723400	24	keep	baseline
b2c3d4e	0.748200	26	keep	add Big Five personality traits
c3d4e5f	0.710000	24	discard	remove occupation context
```
