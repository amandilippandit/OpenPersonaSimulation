# autoresearch — Marketing Content Testing

> Autonomous overnight optimization for marketing simulation quality. Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

An AI agent autonomously tunes synthetic consumer panels to produce the most realistic, actionable reactions to your marketing content.

## The Setup

You have a marketing content testing pipeline: show an ad to synthetic consumers → they react → extract structured insights. But how do you know if the consumers are realistic enough? If the segments discriminate enough? If the reactions are deep enough to act on?

You don't manually tune the consumer panel. You let an AI agent do it overnight.

## The One Metric

**`quality_score`** (0.0 → 1.0) — composite of five dimensions:

| Dimension | Weight | What It Measures |
|---|---|---|
| Audience realism | 25% | Do synthetic consumers behave like real target segments? |
| Response depth | 25% | Are reactions detailed enough to act on? |
| Discrimination | 20% | Do different segments give meaningfully different feedback? |
| Actionability | 15% | Can structured marketing data be extracted? |
| Coverage | 15% | Do reactions surface both positive AND negative signals? |

## The One File

The agent edits `autoresearch/experiment.py`. Everything inside is fair game:

- Consumer persona definitions (demographics, psychographics, traits)
- Audience composition per test scenario
- Reaction prompts and framing
- Interaction patterns (solo reaction vs group discussion)
- Extraction strategies for structured feedback

## The Three Fixed Scenarios

All experiments are evaluated against these three marketing tests:

1. **Ad Copy Evaluation** — show an ad, measure purchase intent and concerns
2. **Brand Messaging Perception** — test whether brand positioning lands correctly
3. **Product Launch Reception** — simulate word-of-mouth reaction to a new product

## Quick Start

```bash
# Verify setup
python autoresearch/prepare.py --check

# Run one experiment manually
python autoresearch/experiment.py

# Autonomous: point Claude/Codex at program.md
# "Read autoresearch/program.md and let's set up a new experiment run."
# Walk away. ~160 experiments overnight.
```

## What the Agent Tries

- Richer consumer psychographics (values, anxieties, aspirations)
- Demographic accuracy (region-specific traits, income signals)
- Conversation framing (first-person reaction vs group discussion)
- Multi-stage reactions (initial impression → deeper consideration)
- Priming consumers with brand context before showing content
- Varied response prompts (structured vs open-ended)
- Segment-specific prompt adjustments
- Memory seeding with prior brand experiences
- Hidden shopping goals that shape reactions

## Results

Logged to `autoresearch/results.tsv`:

```
commit    quality_score    api_calls    status    description
a1b2c3d   0.6820           18           keep      baseline
b2c3d4e   0.7190           20           keep      add values/anxieties to psychographics
c3d4e5f   0.6540           18           discard   removed occupation context
d4e5f6g   0.7410           22           keep      two-stage reaction (impression -> reasoning)
```
