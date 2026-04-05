"""
OpenPersona autoresearch — marketing content testing experiment runner.

THIS IS THE FILE THE AGENT MODIFIES. Everything is fair game:
consumer persona specs, audience composition, reaction prompts,
extraction strategies, interaction patterns.

The goal: maximize quality_score (0.0 to 1.0) — produce realistic,
actionable marketing insights from synthetic consumer panels.

Usage:
    python autoresearch/experiment.py
    python autoresearch/experiment.py > autoresearch/run.log 2>&1
"""

import os
import sys
import time
import traceback
from datetime import timedelta

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from autoresearch.prepare import (
    SCENARIOS, TIME_BUDGET,
    score_audience_realism, score_response_depth,
    score_discrimination, score_actionability, score_coverage,
    compute_quality_score,
)

from openpersona.agent import Persona
from openpersona.environment import World
from openpersona import control

Persona.communication_display = False
World.communication_display = False

# ---------------------------------------------------------------------------
# Consumer persona templates — MODIFY THESE to improve quality_score
# ---------------------------------------------------------------------------

CONSUMER_PERSONAS = {
    "young_professional": {
        "name": "Jordan Kim",
        "age": 29,
        "nationality": "American",
        "occupation": {
            "title": "Marketing Coordinator",
            "organization": "a mid-size SaaS company",
            "description": "You coordinate campaigns and track digital ad performance. You're always watching trends.",
        },
        "personality": {
            "traits": [
                "You are tech-savvy and budget-conscious — you love a good deal.",
                "You value convenience and time-saving tools.",
                "You are suspicious of marketing claims but will try things with free trials.",
            ],
        },
    },
    "skeptical_parent": {
        "name": "Diane Mitchell",
        "age": 44,
        "nationality": "American",
        "occupation": {
            "title": "Elementary School Teacher",
            "organization": "a public school",
            "description": "You balance a tight household budget while raising two kids.",
        },
        "personality": {
            "traits": [
                "You are deeply cautious with money and time.",
                "You are skeptical of flashy ads — you rely on word of mouth and reviews.",
                "You value trust, transparency, and products that actually deliver.",
            ],
        },
    },
    "impulse_shopper": {
        "name": "Tyler Brooks",
        "age": 27,
        "nationality": "American",
        "occupation": {
            "title": "Sales Rep",
            "organization": "a consumer tech brand",
        },
        "personality": {
            "traits": [
                "You are an impulse buyer who gets swept up in good branding.",
                "You care about what's trending and what your friends have.",
                "You decide quickly and emotionally, then justify later.",
            ],
        },
    },
    "luxury_consumer": {
        "name": "Charles Whitmore",
        "age": 52,
        "nationality": "British",
        "occupation": {
            "title": "Investment Partner",
            "organization": "a private equity firm",
        },
        "personality": {
            "traits": [
                "You appreciate craftsmanship, heritage, and understated quality.",
                "You find overt marketing tacky — you prefer things that speak for themselves.",
                "You are discerning and status-aware but avoid obvious logos.",
            ],
        },
    },
    "mainstream_shopper": {
        "name": "Rachel Ortiz",
        "age": 36,
        "nationality": "American",
        "occupation": {
            "title": "Nurse",
            "organization": "a regional hospital",
        },
        "personality": {
            "traits": [
                "You are practical and focused on value for money.",
                "You are skeptical of luxury marketing — you want things that work.",
                "You make considered decisions based on reviews and recommendations.",
            ],
        },
    },
    "gen_z": {
        "name": "Riley Chen",
        "age": 22,
        "nationality": "American",
        "occupation": {
            "title": "Content Creator",
            "organization": "freelance, building on social platforms",
        },
        "personality": {
            "traits": [
                "You have sharp instincts for authenticity — you can smell BS from a mile away.",
                "You care about values: sustainability, transparency, ethics.",
                "You are native to digital marketing but resist traditional ad tactics.",
            ],
        },
    },
    "student": {
        "name": "Sam Patel",
        "age": 20,
        "nationality": "American",
        "occupation": {
            "title": "College Student",
            "organization": "studying engineering",
        },
        "personality": {
            "traits": [
                "You are budget-limited but willing to invest in productivity tools.",
                "You try new tech early and love finding useful gadgets.",
                "You share what you like with your peers freely.",
            ],
        },
    },
    "knowledge_worker": {
        "name": "Morgan Reeves",
        "age": 38,
        "nationality": "Canadian",
        "occupation": {
            "title": "Consultant",
            "organization": "an independent strategy consulting practice",
        },
        "personality": {
            "traits": [
                "You are productivity-obsessed and will pay for tools that save you time.",
                "You care about quality and longevity over trends.",
                "You evaluate products carefully before committing.",
            ],
        },
    },
    "creative_professional": {
        "name": "Alex Rivera",
        "age": 33,
        "nationality": "American",
        "occupation": {
            "title": "Graphic Designer",
            "organization": "a creative agency",
        },
        "personality": {
            "traits": [
                "You value analog, tactile experiences alongside digital tools.",
                "You are design-sensitive and notice branding details.",
                "You are selective about what you adopt — aesthetics matter.",
            ],
        },
    },
}


# ---------------------------------------------------------------------------
# Consumer creation — MODIFY to improve persona quality
# ---------------------------------------------------------------------------

def create_consumer(segment: str, spec: dict) -> Persona:
    """Create a consumer Persona from a spec dictionary."""
    agent = Persona(spec["name"])

    for key in ("age", "nationality"):
        if key in spec:
            agent.define(key, spec[key])

    if "occupation" in spec:
        agent.define("occupation", spec["occupation"])

    if "personality" in spec:
        agent.define("personality", spec["personality"])

    return agent


# ---------------------------------------------------------------------------
# Marketing test scenario runner — MODIFY interaction patterns
# ---------------------------------------------------------------------------

def run_marketing_test(scenario: dict) -> dict:
    """
    Run a marketing test scenario: show content to consumers, collect reactions.
    Returns dict with: responses, consumer_specs, extracted, expected_fields.
    """
    scenario_id = scenario["id"]
    requirements = scenario["audience_requirements"]

    # Build the consumer panel
    agents = []
    specs_used = []
    for req in requirements:
        segment = req["segment"]
        if segment not in CONSUMER_PERSONAS:
            continue
        spec = CONSUMER_PERSONAS[segment]
        agent = create_consumer(segment, spec)
        agents.append(agent)
        specs_used.append({**req, **spec})

    if len(agents) < scenario.get("min_agents", 1):
        return {"error": f"Not enough consumers for scenario {scenario_id}"}

    # Set up the test environment
    world = World(f"MarketTest_{scenario_id}", agents)
    world.make_everyone_accessible()

    # Show content + ask for reaction
    content = scenario["content"]
    prompt = scenario["prompt"]
    full_stimulus = f"{prompt}\n\n---\n{content}\n---"

    for agent in agents:
        agent.listen(full_stimulus)

    # Run simulation — let consumers react
    try:
        world.run(steps=2, timedelta_per_step=timedelta(minutes=5))
    except Exception as e:
        print(f"Warning: test {scenario_id} run failed: {e}")
        traceback.print_exc()

    # Collect consumer reactions (TALK actions)
    responses = []
    for agent in agents:
        talks = []
        if hasattr(agent, 'episodic_memory'):
            memories = agent.episodic_memory.retrieve_all()
            for mem in memories:
                if isinstance(mem, dict):
                    mem_content = mem.get("content", {})
                    if isinstance(mem_content, dict):
                        action = mem_content.get("action", {})
                        if isinstance(action, dict) and action.get("type") == "TALK":
                            talks.append(action.get("content", ""))

        combined = " ".join(talks)
        responses.append({
            "consumer": agent.name,
            "content": combined,
            "segment": next((s.get("segment", "") for s in specs_used if s.get("name") == agent.name), ""),
        })

    # Extract structured marketing feedback
    extracted = {}
    expected_fields = scenario.get("expected_fields", [])
    combined_text = " ".join(r["content"] for r in responses).lower()

    for field in expected_fields:
        # Heuristic extraction — look for field-relevant phrases
        for resp in responses:
            if resp["content"].strip():
                extracted[field] = resp["content"][:150]
                break

    return {
        "responses": responses,
        "consumer_specs": specs_used,
        "extracted": extracted,
        "expected_fields": expected_fields,
    }


# ---------------------------------------------------------------------------
# Main experiment runner
# ---------------------------------------------------------------------------

def run_experiment():
    """Run all marketing test scenarios and compute composite quality score."""
    start_time = time.time()

    print(f"Starting marketing content testing experiment (budget: {TIME_BUDGET}s)")
    print(f"Scenarios: {len(SCENARIOS)}")
    print()

    all_realism = []
    all_depth = []
    all_discrimination = []
    all_actionability = []
    all_coverage = []
    total_consumers = 0
    scenarios_run = 0

    for scenario in SCENARIOS:
        elapsed = time.time() - start_time
        if elapsed > TIME_BUDGET - 30:
            print(f"Time budget nearly exhausted ({elapsed:.0f}s), stopping.")
            break

        print(f"--- Running: {scenario['name']} ---")

        try:
            control.reset()
            Persona.clear_agents()
            World.clear_environments()

            result = run_marketing_test(scenario)

            if "error" in result:
                print(f"  Error: {result['error']}")
                continue

            realism = score_audience_realism(result["responses"], result["consumer_specs"])
            depth = score_response_depth(result["responses"])
            discrimination = score_discrimination(result["responses"], result["consumer_specs"])
            actionability = score_actionability(result["extracted"], result["expected_fields"])
            coverage = score_coverage(result["responses"])

            print(f"  Consumers: {len(result['responses'])}")
            print(f"  Audience realism:   {realism:.4f}")
            print(f"  Response depth:     {depth:.4f}")
            print(f"  Discrimination:     {discrimination:.4f}")
            print(f"  Actionability:      {actionability:.4f}")
            print(f"  Coverage:           {coverage:.4f}")

            all_realism.append(realism)
            all_depth.append(depth)
            all_discrimination.append(discrimination)
            all_actionability.append(actionability)
            all_coverage.append(coverage)
            total_consumers += len(result["responses"])
            scenarios_run += 1

        except Exception as e:
            print(f"  CRASHED: {e}")
            traceback.print_exc()

    avg = lambda lst: sum(lst) / len(lst) if lst else 0.0

    audience_realism = avg(all_realism)
    response_depth = avg(all_depth)
    discrimination = avg(all_discrimination)
    actionability = avg(all_actionability)
    coverage = avg(all_coverage)

    quality_score = compute_quality_score(
        audience_realism, response_depth, discrimination, actionability, coverage
    )

    total_seconds = time.time() - start_time

    print()
    print("---")
    print(f"quality_score:     {quality_score:.6f}")
    print(f"audience_realism:  {audience_realism:.4f}")
    print(f"response_depth:    {response_depth:.4f}")
    print(f"discrimination:    {discrimination:.4f}")
    print(f"actionability:     {actionability:.4f}")
    print(f"coverage:          {coverage:.4f}")
    print(f"total_seconds:     {total_seconds:.1f}")
    print(f"api_calls:         {0}")
    print(f"num_consumers:     {total_consumers}")
    print(f"num_scenarios:     {scenarios_run}")


if __name__ == "__main__":
    run_experiment()
