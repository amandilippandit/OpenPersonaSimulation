# autoresearch — OpenPersona Edition

This is an experiment to have an AI agent autonomously research and optimize persona simulation quality.

Instead of training neural networks, we're optimizing **synthetic human simulations**. The agent modifies simulation configurations, persona definitions, prompt templates, and interaction parameters — then measures how realistic the resulting agent behavior is against ground truth metrics.

## Setup

To set up a new experiment, work with the user to:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `apr5`). The branch `autoresearch/<tag>` must not already exist — this is a fresh run.
2. **Create the branch**: `git checkout -b autoresearch/<tag>` from current `auto` branch.
3. **Read the in-scope files**: The autoresearch directory is small. Read these files for full context:
   - `autoresearch/README.md` — repository context.
   - `autoresearch/prepare.py` — fixed constants, evaluation harness, scenario loader. Do not modify.
   - `autoresearch/experiment.py` — the file you modify. Persona configs, prompt strategies, interaction loops, extraction logic.
4. **Verify setup**: Check that `openpersona` is installed (`python -c "import openpersona"`). Check that `OPENAI_API_KEY` is set.
5. **Initialize results.tsv**: Create `autoresearch/results.tsv` with just the header row. The baseline will be recorded after the first run.
6. **Confirm and go**: Confirm setup looks good.

Once you get confirmation, kick off the experimentation.

## Experimentation

Each experiment runs a persona simulation scenario against a fixed evaluation harness. The experiment script runs for a **fixed time budget of 3 minutes** (wall clock). You launch it simply as: `python autoresearch/experiment.py`.

**What you CAN do:**
- Modify `autoresearch/experiment.py` — this is the only file you edit. Everything is fair game:
  - Persona definitions (age, occupation, personality traits, beliefs, preferences)
  - System prompt strategies (how persona context is framed)
  - Interaction patterns (how many steps, stimulus phrasing, conversation structure)
  - Extraction strategies (how to pull structured data from agent responses)
  - Number of agents, their relationships, world configuration
  - Memory settings, action generator parameters
  - Any creative approach to make simulated agents behave more realistically

**What you CANNOT do:**
- Modify `autoresearch/prepare.py`. It is read-only. It contains the fixed evaluation harness, test scenarios, and scoring functions.
- Modify any files in the `openpersona/` core library. The simulation engine is fixed.
- Install new packages or add dependencies.
- Modify the evaluation functions. The scoring in `prepare.py` is ground truth.

**The goal is simple: get the highest `quality_score`.** This is a composite metric (0.0 to 1.0) that measures:
1. **Persona adherence** — does the agent behave according to its defined personality?
2. **Response coherence** — are responses logically consistent and natural?
3. **Interaction quality** — do multi-agent conversations feel realistic?
4. **Extraction accuracy** — can structured data be reliably extracted from conversations?
5. **Diversity** — do different personas actually behave differently?

Since the time budget is fixed, you don't need to worry about runtime — it's always 3 minutes. Everything is fair game: change the persona specs, the interaction patterns, the number of agents, the prompt framing. The only constraint is that the code runs without crashing and finishes within the budget.

**API cost** is a soft constraint. Some increase is acceptable for meaningful quality gains, but it should not blow up dramatically. Prefer fewer, higher-quality LLM calls over many cheap ones.

**Simplicity criterion**: All else being equal, simpler is better. A small improvement that adds ugly complexity is not worth it. Removing something and getting equal or better results is a great outcome. When evaluating whether to keep a change, weigh the complexity cost against the improvement magnitude.

**The first run**: Your very first run should always be to establish the baseline, so you will run the experiment script as is.

## Output format

Once the script finishes it prints a summary like this:

```
---
quality_score:      0.7234
persona_adherence:  0.8100
response_coherence: 0.7500
interaction_quality: 0.6800
extraction_accuracy: 0.6900
diversity_score:    0.6870
total_seconds:      180.2
api_calls:          24
total_tokens:       48230
num_agents:         4
num_scenarios:      3
```

You can extract the key metric from the log file:

```
grep "^quality_score:" run.log
```

## Logging results

When an experiment is done, log it to `autoresearch/results.tsv` (tab-separated, NOT comma-separated).

The TSV has a header row and 5 columns:

```
commit	quality_score	api_calls	status	description
```

1. git commit hash (short, 7 chars)
2. quality_score achieved (e.g. 0.723400) — use 0.000000 for crashes
3. total API calls made (integer)
4. status: `keep`, `discard`, or `crash`
5. short text description of what this experiment tried

Example:

```
commit	quality_score	api_calls	status	description
a1b2c3d	0.723400	24	keep	baseline
b2c3d4e	0.748200	26	keep	add Big Five personality traits to persona spec
c3d4e5f	0.710000	24	discard	remove occupation context
d4e5f6g	0.000000	0	crash	invalid persona format
```

## The experiment loop

The experiment runs on a dedicated branch (e.g. `autoresearch/apr5`).

LOOP FOREVER:

1. Look at the git state: the current branch/commit we're on
2. Tune `autoresearch/experiment.py` with an experimental idea by directly hacking the code.
3. git commit
4. Run the experiment: `python autoresearch/experiment.py > autoresearch/run.log 2>&1` (redirect everything — do NOT use tee or let output flood your context)
5. Read out the results: `grep "^quality_score:\|^api_calls:" autoresearch/run.log`
6. If the grep output is empty, the run crashed. Run `tail -n 50 autoresearch/run.log` to read the stack trace and attempt a fix.
7. Record the results in the tsv (NOTE: do not commit the results.tsv file, leave it untracked by git)
8. If quality_score improved (higher), you "advance" the branch, keeping the git commit
9. If quality_score is equal or worse, you git reset back to where you started

**Ideas to try** (non-exhaustive — be creative):
- Richer persona specifications (Big Five traits, specific beliefs, behavioral patterns)
- Better prompt framing (first-person vs third-person, narrative vs structured)
- Conversation warm-up (prime agents with context before the main interaction)
- Multi-step interactions (let agents build rapport before the critical question)
- Persona fragments and overlays (combine base persona + domain-specific fragments)
- Optimized extraction prompts (better structured output instructions)
- Agent memory priming (pre-seed episodic or semantic memory)
- Relationship definitions between agents (colleague, stranger, mentor)
- Environmental context (location, time of day, social setting)
- Emotional state initialization (start agents in specific moods)
- Goal injection (give agents hidden objectives)
- Varied interaction styles (interview, debate, brainstorm, negotiation)

**Timeout**: Each experiment should take ~3 minutes total. If a run exceeds 6 minutes, kill it and treat it as a failure.

**Crashes**: If a run crashes, use your judgment: fix typos and re-run, or skip broken ideas.

**NEVER STOP**: Once the experiment loop has begun, do NOT pause to ask the human. The human might be asleep. You are autonomous. If you run out of ideas, think harder — re-read the evaluation criteria, try combining previous near-misses, try more radical persona configurations. The loop runs until the human interrupts you, period.
