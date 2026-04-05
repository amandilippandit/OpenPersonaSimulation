# autoresearch — Marketing Content Testing Edition

This is an experiment to have an AI agent autonomously optimize **marketing content testing quality**.

The agent tunes synthetic consumer panels, reaction prompts, and extraction strategies to produce the most realistic, actionable marketing insights. Each experiment scores how well the simulated panel would substitute for real focus group research.

## Setup

To set up a new experiment, work with the user to:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `apr5`). The branch `autoresearch/<tag>` must not already exist.
2. **Create the branch**: `git checkout -b autoresearch/<tag>` from current `auto` branch.
3. **Read the in-scope files**:
   - `autoresearch/README.md` — context.
   - `autoresearch/prepare.py` — fixed scoring harness. Do not modify.
   - `autoresearch/experiment.py` — the file you modify. Consumer personas, reaction logic, extraction.
4. **Verify setup**: Check that `openpersona` is installed and `OPENAI_API_KEY` is set.
5. **Initialize results.tsv**: Create `autoresearch/results.tsv` with just the header row.
6. **Confirm and go**: Confirm setup looks good.

Once you get confirmation, kick off the experimentation.

## Experimentation

Each experiment runs three fixed marketing test scenarios against a scoring harness. The script runs for a **fixed time budget of 3 minutes**. You launch it as: `python autoresearch/experiment.py`.

**What you CAN do:**
- Modify `autoresearch/experiment.py`. Everything is fair game:
  - Consumer persona specifications (demographics, psychographics, traits, values)
  - Audience composition per scenario
  - Reaction prompts and stimulus framing
  - Interaction patterns (solo reactions vs group discussion)
  - Extraction strategies for structured feedback
  - Memory priming with brand context
  - Goal injection (shopping intent, mood, prior experiences)

**What you CANNOT do:**
- Modify `autoresearch/prepare.py`. It contains the fixed scenarios and scoring functions.
- Modify any files in `openpersona/` core library.
- Install new packages.

**The goal: maximize `quality_score`** (0.0 to 1.0). It measures:
- **Audience realism** (25%) — consumers behave like their segment
- **Response depth** (25%) — reactions are detailed and actionable
- **Discrimination** (20%) — different segments give meaningfully different feedback
- **Actionability** (15%) — structured marketing data can be extracted
- **Coverage** (15%) — both positive AND negative signals surface

**Simplicity criterion**: All else being equal, simpler is better. Prefer fewer personas with better depth over more personas with shallow reactions.

**The first run**: Establish the baseline by running the experiment script unchanged.

## Output format

```
---
quality_score:     0.7234
audience_realism:  0.8100
response_depth:    0.7500
discrimination:    0.6800
actionability:     0.6900
coverage:          0.6870
total_seconds:     180.2
api_calls:         24
num_consumers:     9
num_scenarios:     3
```

Extract the key metric:
```
grep "^quality_score:" autoresearch/run.log
```

## Logging results

Log to `autoresearch/results.tsv` (tab-separated, NOT committed to git):

```
commit    quality_score    api_calls    status    description
```

1. git commit hash (short, 7 chars)
2. quality_score achieved (e.g. 0.723400) — use 0.000000 for crashes
3. total API calls made
4. status: `keep`, `discard`, or `crash`
5. short description of what was tried

Example:

```
commit    quality_score    api_calls    status    description
a1b2c3d   0.682000         18           keep      baseline
b2c3d4e   0.719000         20           keep      add values/anxieties to psychographics
c3d4e5f   0.654000         18           discard   removed occupation context
d4e5f6g   0.741000         22           keep      two-stage reaction prompt
```

## The experiment loop

LOOP FOREVER:

1. Look at the git state.
2. Tune `autoresearch/experiment.py` with an experimental idea.
3. git commit.
4. Run: `python autoresearch/experiment.py > autoresearch/run.log 2>&1`
5. Read results: `grep "^quality_score:\|^api_calls:" autoresearch/run.log`
6. If grep output is empty, the run crashed. Check `tail -n 50 autoresearch/run.log`.
7. Record results in the tsv.
8. If quality_score improved, keep the commit.
9. If equal or worse, git reset back.

**Ideas to try:**
- Richer psychographics (values, anxieties, aspirations, brand relationships)
- Demographic accuracy (regional speech, income signals, generational markers)
- Two-stage reactions (initial impression → deeper reasoning)
- Priming with brand context before showing content
- Structured response prompts (request specific formats)
- Scenario-specific prompt adjustments
- Memory seeding (prior brand experiences, recent purchases)
- Hidden shopping goals that shape reactions
- Varied emotional starting states
- Peer discussion before individual responses

**Timeout**: ~3 minutes per experiment. Kill anything over 6 minutes.

**Crashes**: Fix typos, skip fundamentally broken ideas.

**NEVER STOP**: Once the loop has begun, do NOT pause to ask the human. You are autonomous. Run until manually interrupted.
