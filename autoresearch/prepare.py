"""
Fixed evaluation harness for OpenPersona autoresearch experiments.
Downloads nothing — uses the OpenPersona library directly.

DO NOT MODIFY THIS FILE. It contains the fixed evaluation, test scenarios,
and scoring functions that all experiments are measured against.

Usage:
    python autoresearch/prepare.py          # verify setup
    python autoresearch/prepare.py --check  # run quick smoke test
"""

import os
import sys
import time
import json
import argparse
from typing import Dict, List, Any, Optional

# ---------------------------------------------------------------------------
# Constants (fixed, do not modify)
# ---------------------------------------------------------------------------

TIME_BUDGET = 180         # experiment time budget in seconds (3 minutes)
MAX_AGENTS = 8            # max agents per scenario
MAX_STEPS = 10            # max simulation steps per scenario
MAX_API_CALLS = 100       # soft cap on total API calls per experiment

# ---------------------------------------------------------------------------
# Test scenarios — the ground truth interaction setups
# ---------------------------------------------------------------------------

SCENARIOS = [
    {
        "id": "product_opinion",
        "name": "Product Opinion Interview",
        "description": "Interview agents about a new product and extract structured opinions",
        "stimulus": "What do you think about a new AI-powered personal finance app that automatically invests your spare change? Would you use it? Why or why not?",
        "expected_fields": ["opinion", "would_use", "main_reason", "concern"],
        "min_agents": 2,
        "diversity_check": True,
        "persona_requirements": [
            {"role": "tech_enthusiast", "age_range": [22, 35], "traits": ["early adopter", "tech-savvy"]},
            {"role": "conservative_saver", "age_range": [45, 65], "traits": ["risk-averse", "traditional"]},
        ],
    },
    {
        "id": "focus_group",
        "name": "Focus Group Discussion",
        "description": "Multi-agent discussion about a topic with natural turn-taking",
        "stimulus": "Let's discuss: should remote work be the default for knowledge workers?",
        "expected_fields": ["position", "key_argument", "concession"],
        "min_agents": 3,
        "diversity_check": True,
        "persona_requirements": [
            {"role": "manager", "traits": ["leadership", "productivity-focused"]},
            {"role": "remote_advocate", "traits": ["values flexibility", "introverted"]},
            {"role": "office_advocate", "traits": ["extroverted", "values collaboration"]},
        ],
    },
    {
        "id": "negotiation",
        "name": "Negotiation Scenario",
        "description": "Two agents negotiate with competing interests",
        "stimulus": "You need to agree on a budget allocation. You have $100K total. Discuss and reach a compromise.",
        "expected_fields": ["proposed_split", "reasoning", "compromise_willingness"],
        "min_agents": 2,
        "diversity_check": False,
        "persona_requirements": [
            {"role": "engineering_lead", "traits": ["technical", "ambitious"]},
            {"role": "marketing_lead", "traits": ["creative", "persuasive"]},
        ],
    },
]

# ---------------------------------------------------------------------------
# Scoring functions (DO NOT CHANGE — these are the fixed metrics)
# ---------------------------------------------------------------------------

def score_persona_adherence(agent_responses: List[Dict], persona_specs: List[Dict]) -> float:
    """
    Score how well agents behave according to their persona specifications.
    Checks that traits, age-appropriate language, and role-consistent opinions appear.
    Returns 0.0 to 1.0.
    """
    if not agent_responses or not persona_specs:
        return 0.0

    scores = []
    for resp, spec in zip(agent_responses, persona_specs):
        content = resp.get("content", "").lower()
        traits = spec.get("traits", [])

        # Check trait signals in response
        trait_score = 0.0
        if traits:
            trait_hits = 0
            for trait in traits:
                # Look for trait-aligned language patterns
                trait_words = trait.lower().split()
                for word in trait_words:
                    if word in content and len(word) > 3:
                        trait_hits += 1
                        break
            trait_score = min(1.0, trait_hits / max(len(traits), 1))

        # Check response length (too short = low effort, too long = rambling)
        word_count = len(content.split())
        length_score = 1.0
        if word_count < 10:
            length_score = word_count / 10.0
        elif word_count > 500:
            length_score = max(0.3, 1.0 - (word_count - 500) / 1000.0)

        # Check role consistency (mentioned their role context)
        role = spec.get("role", "")
        role_score = 0.5  # neutral default
        if role and any(w in content for w in role.lower().split("_")):
            role_score = 1.0

        scores.append(0.4 * trait_score + 0.3 * length_score + 0.3 * role_score)

    return sum(scores) / len(scores)


def score_response_coherence(responses: List[Dict]) -> float:
    """
    Score logical coherence and naturalness of responses.
    Checks for: complete sentences, no repetition, logical flow.
    Returns 0.0 to 1.0.
    """
    if not responses:
        return 0.0

    scores = []
    for resp in responses:
        content = resp.get("content", "")
        score = 0.0

        # Has content at all
        if not content.strip():
            scores.append(0.0)
            continue

        # Sentence structure (ends with punctuation)
        if content.strip()[-1] in '.!?':
            score += 0.3
        else:
            score += 0.1

        # Not excessively repetitive (check unique word ratio)
        words = content.lower().split()
        if words:
            unique_ratio = len(set(words)) / len(words)
            score += 0.3 * min(1.0, unique_ratio / 0.5)

        # Has substance (not just filler)
        substantive_words = [w for w in words if len(w) > 4]
        if substantive_words:
            score += 0.2 * min(1.0, len(substantive_words) / 5.0)

        # Multiple sentences (shows developed thought)
        sentences = [s.strip() for s in content.split('.') if s.strip()]
        if len(sentences) >= 2:
            score += 0.2

        scores.append(min(1.0, score))

    return sum(scores) / len(scores)


def score_interaction_quality(conversation_log: List[Dict]) -> float:
    """
    Score multi-agent interaction quality.
    Checks for: turn-taking, responsiveness, topic coherence.
    Returns 0.0 to 1.0.
    """
    if not conversation_log or len(conversation_log) < 2:
        return 0.0

    score = 0.0

    # Multiple speakers participated
    speakers = set(e.get("agent", "") for e in conversation_log if e.get("agent"))
    if len(speakers) >= 2:
        score += 0.3
    elif len(speakers) == 1:
        score += 0.1

    # Has back-and-forth (alternating speakers)
    prev_speaker = None
    alternations = 0
    for event in conversation_log:
        speaker = event.get("agent", "")
        if speaker and speaker != prev_speaker:
            alternations += 1
        prev_speaker = speaker
    if len(conversation_log) > 0:
        alt_ratio = alternations / len(conversation_log)
        score += 0.3 * min(1.0, alt_ratio / 0.5)

    # Responses reference each other (mentions other agent names)
    references = 0
    for event in conversation_log:
        content = event.get("content", "").lower()
        for speaker in speakers:
            if speaker.lower() in content and speaker != event.get("agent", ""):
                references += 1
                break
    if len(conversation_log) > 0:
        score += 0.2 * min(1.0, references / max(1, len(speakers)))

    # Conversation has a natural arc (not all same length responses)
    lengths = [len(e.get("content", "").split()) for e in conversation_log if e.get("content")]
    if len(lengths) >= 2:
        variance = sum((l - sum(lengths)/len(lengths))**2 for l in lengths) / len(lengths)
        if variance > 10:  # some variety in response length
            score += 0.2

    return min(1.0, score)


def score_extraction_accuracy(extracted: Dict, expected_fields: List[str]) -> float:
    """
    Score how well structured data was extracted from conversations.
    Returns 0.0 to 1.0.
    """
    if not extracted or not expected_fields:
        return 0.0

    found = 0
    non_empty = 0
    for field in expected_fields:
        if field in extracted:
            found += 1
            val = extracted[field]
            if val is not None and str(val).strip():
                non_empty += 1

    field_coverage = found / len(expected_fields)
    content_quality = non_empty / len(expected_fields) if found > 0 else 0.0

    return 0.5 * field_coverage + 0.5 * content_quality


def score_diversity(agent_responses: List[Dict]) -> float:
    """
    Score how different agents give different responses (not all saying the same thing).
    Returns 0.0 to 1.0.
    """
    if not agent_responses or len(agent_responses) < 2:
        return 0.0

    contents = [r.get("content", "").lower().split() for r in agent_responses]

    # Compute pairwise Jaccard distance
    distances = []
    for i in range(len(contents)):
        for j in range(i + 1, len(contents)):
            set_i = set(contents[i])
            set_j = set(contents[j])
            if not set_i and not set_j:
                continue
            intersection = len(set_i & set_j)
            union = len(set_i | set_j)
            jaccard = intersection / union if union > 0 else 0.0
            distances.append(1.0 - jaccard)  # distance = 1 - similarity

    if not distances:
        return 0.0

    avg_distance = sum(distances) / len(distances)
    # We want moderate diversity (0.3-0.8 range), not complete dissimilarity
    if avg_distance < 0.1:
        return avg_distance * 3  # too similar
    elif avg_distance > 0.95:
        return 0.8  # suspiciously different
    else:
        return min(1.0, avg_distance * 1.2)


def compute_quality_score(
    persona_adherence: float,
    response_coherence: float,
    interaction_quality: float,
    extraction_accuracy: float,
    diversity_score: float,
) -> float:
    """
    Compute the composite quality score. Weighted average.
    Returns 0.0 to 1.0.
    """
    return (
        0.25 * persona_adherence
        + 0.25 * response_coherence
        + 0.20 * interaction_quality
        + 0.15 * extraction_accuracy
        + 0.15 * diversity_score
    )


# ---------------------------------------------------------------------------
# Verification
# ---------------------------------------------------------------------------

def verify_setup():
    """Check that everything needed is in place."""
    print("Checking OpenPersona installation...")
    try:
        import openpersona
        print(f"  openpersona version: {openpersona.__name__} OK")
    except ImportError:
        print("  ERROR: openpersona not installed. Run: pip install -e .")
        return False

    print("Checking API key...")
    if os.environ.get("OPENAI_API_KEY"):
        print("  OPENAI_API_KEY is set")
    else:
        print("  WARNING: OPENAI_API_KEY not set. Experiments will fail on LLM calls.")

    print(f"Scenarios loaded: {len(SCENARIOS)}")
    for s in SCENARIOS:
        print(f"  - {s['id']}: {s['name']} ({s['min_agents']} agents)")

    print(f"\nTime budget: {TIME_BUDGET}s ({TIME_BUDGET // 60} minutes)")
    print(f"Max agents per scenario: {MAX_AGENTS}")
    print(f"Max steps per scenario: {MAX_STEPS}")

    print("\nSetup OK. Ready to experiment.")
    return True


def smoke_test():
    """Quick test that the library can create agents and run basic operations."""
    print("Running smoke test...")
    try:
        from openpersona.agent import Persona
        from openpersona.environment import World

        agent = Persona("TestAgent")
        agent.define("age", 30)
        agent.define("occupation", {"title": "Tester"})

        world = World("TestWorld", [agent])
        print(f"  Created agent: {agent.name}")
        print(f"  Created world: {world.name}")
        print("  Smoke test PASSED")
        return True
    except Exception as e:
        print(f"  Smoke test FAILED: {e}")
        return False


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Verify autoresearch setup for OpenPersona")
    parser.add_argument("--check", action="store_true", help="Run smoke test")
    args = parser.parse_args()

    ok = verify_setup()
    if args.check and ok:
        print()
        smoke_test()
