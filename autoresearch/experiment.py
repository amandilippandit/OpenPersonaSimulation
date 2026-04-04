"""
OpenPersona autoresearch — experiment runner.

THIS IS THE FILE THE AGENT MODIFIES. Everything is fair game:
persona definitions, interaction patterns, extraction strategies,
prompt framing, memory settings, agent configurations.

The goal: maximize quality_score (0.0 to 1.0).

Usage:
    python autoresearch/experiment.py
    python autoresearch/experiment.py > autoresearch/run.log 2>&1
"""

import os
import sys
import time
import json
import traceback
from datetime import timedelta

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from autoresearch.prepare import (
    SCENARIOS, TIME_BUDGET,
    score_persona_adherence, score_response_coherence,
    score_interaction_quality, score_extraction_accuracy,
    score_diversity, compute_quality_score,
)

from openpersona.agent import Persona
from openpersona.environment import World
from openpersona import control, config_manager

# Suppress rich console output during experiments
Persona.communication_display = False
World.communication_display = False

# ---------------------------------------------------------------------------
# Persona definitions — MODIFY THESE to improve quality_score
# ---------------------------------------------------------------------------

PERSONA_SPECS = {
    "tech_enthusiast": {
        "name": "Alex Chen",
        "age": 28,
        "nationality": "American",
        "occupation": {
            "title": "Software Engineer",
            "organization": "a Silicon Valley startup",
            "description": "You build mobile apps and are always trying the latest tech products.",
        },
        "personality": {
            "traits": [
                "You are an early adopter who loves trying new technology.",
                "You are optimistic about AI and automation.",
                "You speak with enthusiasm and use tech jargon naturally.",
            ],
        },
        "preferences": {
            "interests": ["AI", "fintech", "mobile apps", "cryptocurrency"],
        },
    },
    "conservative_saver": {
        "name": "Margaret Thompson",
        "age": 58,
        "nationality": "American",
        "occupation": {
            "title": "Retired Teacher",
            "organization": "formerly a public school",
            "description": "You taught high school math for 30 years. You value stability and careful planning.",
        },
        "personality": {
            "traits": [
                "You are risk-averse and prefer traditional financial methods.",
                "You are skeptical of new technology, especially with money.",
                "You speak carefully and ask practical questions.",
            ],
        },
        "preferences": {
            "interests": ["gardening", "reading", "family", "community volunteering"],
        },
    },
    "manager": {
        "name": "David Park",
        "age": 42,
        "nationality": "Korean-American",
        "occupation": {
            "title": "Engineering Manager",
            "organization": "a Fortune 500 tech company",
            "description": "You manage a team of 15 engineers and care deeply about productivity and team health.",
        },
        "personality": {
            "traits": [
                "You are a pragmatic leader who values data-driven decisions.",
                "You care about team morale and work-life balance.",
                "You see both sides of arguments before forming an opinion.",
            ],
        },
    },
    "remote_advocate": {
        "name": "Sarah Lin",
        "age": 31,
        "nationality": "Canadian",
        "occupation": {
            "title": "UX Designer",
            "organization": "a fully remote design agency",
            "description": "You've worked remotely for 5 years and thrive in asynchronous environments.",
        },
        "personality": {
            "traits": [
                "You strongly value flexibility and autonomy in work.",
                "You are introverted and do your best deep work in quiet environments.",
                "You are articulate about the benefits of remote work from personal experience.",
            ],
        },
    },
    "office_advocate": {
        "name": "Marcus Johnson",
        "age": 37,
        "nationality": "British",
        "occupation": {
            "title": "Sales Director",
            "organization": "a mid-size consulting firm",
            "description": "You lead a sales team and believe that in-person collaboration drives the best results.",
        },
        "personality": {
            "traits": [
                "You are extroverted and energized by in-person interaction.",
                "You value spontaneous collaboration and mentoring juniors face-to-face.",
                "You are persuasive and back your arguments with business outcomes.",
            ],
        },
    },
    "engineering_lead": {
        "name": "Raj Patel",
        "age": 39,
        "nationality": "Indian",
        "occupation": {
            "title": "VP of Engineering",
            "organization": "a Series B startup",
            "description": "You oversee all technical development and need resources for infrastructure scaling.",
        },
        "personality": {
            "traits": [
                "You are technically minded and ambitious about product quality.",
                "You advocate strongly for engineering investment.",
                "You use data and technical arguments to make your case.",
            ],
        },
    },
    "marketing_lead": {
        "name": "Elena Rodriguez",
        "age": 34,
        "nationality": "Spanish",
        "occupation": {
            "title": "CMO",
            "organization": "a Series B startup",
            "description": "You run all marketing and need budget for a major brand campaign.",
        },
        "personality": {
            "traits": [
                "You are creative and persuasive in pitching ideas.",
                "You believe brand awareness is critical for growth.",
                "You use market data and competitor analysis in arguments.",
            ],
        },
    },
}


# ---------------------------------------------------------------------------
# Agent creation — MODIFY to improve persona quality
# ---------------------------------------------------------------------------

def create_agent(role: str, spec: dict) -> Persona:
    """Create a Persona from a spec dictionary."""
    agent = Persona(spec["name"])

    for key in ("age", "nationality", "country_of_residence"):
        if key in spec:
            agent.define(key, spec[key])

    if "occupation" in spec:
        agent.define("occupation", spec["occupation"])

    if "personality" in spec:
        agent.define("personality", spec["personality"])

    if "preferences" in spec:
        agent.define("preferences", spec["preferences"])

    return agent


# ---------------------------------------------------------------------------
# Scenario runners — MODIFY interaction patterns to improve quality
# ---------------------------------------------------------------------------

def run_scenario(scenario: dict) -> dict:
    """
    Run a single scenario and return results.
    Returns dict with: agent_responses, conversation_log, extracted_data, persona_specs
    """
    scenario_id = scenario["id"]
    requirements = scenario["persona_requirements"]

    # Create agents for this scenario
    agents = []
    specs_used = []
    for req in requirements:
        role = req["role"]
        if role not in PERSONA_SPECS:
            continue
        spec = PERSONA_SPECS[role]
        agent = create_agent(role, spec)
        agents.append(agent)
        specs_used.append({**req, **spec})

    if len(agents) < scenario.get("min_agents", 1):
        return {"error": f"Not enough agents for scenario {scenario_id}"}

    # Create world and run interaction
    world = World(f"Scenario_{scenario_id}", agents)
    world.make_everyone_accessible()

    # Deliver the stimulus to all agents
    stimulus = scenario["stimulus"]
    for agent in agents:
        agent.listen(stimulus)

    # Run simulation steps
    try:
        world.run(steps=3, timedelta_per_step=timedelta(minutes=5))
    except Exception as e:
        print(f"Warning: scenario {scenario_id} run failed: {e}")
        traceback.print_exc()

    # Collect responses (TALK actions from each agent)
    agent_responses = []
    conversation_log = []

    for agent in agents:
        # Get all TALK content from this agent
        talks = []
        if hasattr(agent, 'episodic_memory'):
            memories = agent.episodic_memory.retrieve_all()
            for mem in memories:
                if isinstance(mem, dict):
                    content = mem.get("content", {})
                    if isinstance(content, dict):
                        action = content.get("action", {})
                        if isinstance(action, dict) and action.get("type") == "TALK":
                            talk_content = action.get("content", "")
                            talks.append(talk_content)
                            conversation_log.append({
                                "agent": agent.name,
                                "content": talk_content,
                                "type": "TALK",
                            })

        combined = " ".join(talks)
        agent_responses.append({
            "agent": agent.name,
            "content": combined,
            "role": next((s.get("role", "") for s in specs_used if s.get("name") == agent.name), ""),
        })

    # Extract structured data from responses
    extracted = {}
    for field in scenario.get("expected_fields", []):
        # Simple extraction: look for field-relevant content
        for resp in agent_responses:
            if resp["content"].strip():
                extracted[field] = resp["content"][:200]
                break

    return {
        "agent_responses": agent_responses,
        "conversation_log": conversation_log,
        "extracted_data": extracted,
        "persona_specs": specs_used,
        "expected_fields": scenario.get("expected_fields", []),
    }


# ---------------------------------------------------------------------------
# Main experiment runner
# ---------------------------------------------------------------------------

def run_experiment():
    """Run all scenarios and compute the composite quality score."""
    start_time = time.time()
    api_calls_start = 0  # would track from client if available

    print(f"Starting experiment (time budget: {TIME_BUDGET}s)")
    print(f"Scenarios: {len(SCENARIOS)}")
    print()

    all_adherence = []
    all_coherence = []
    all_interaction = []
    all_extraction = []
    all_diversity = []
    total_agents = 0
    scenarios_run = 0

    for scenario in SCENARIOS:
        elapsed = time.time() - start_time
        if elapsed > TIME_BUDGET - 30:  # leave 30s buffer
            print(f"Time budget nearly exhausted ({elapsed:.0f}s), stopping early.")
            break

        print(f"--- Running scenario: {scenario['name']} ---")

        try:
            # Reset simulation state between scenarios
            control.reset()
            Persona.clear_agents()
            World.clear_environments()

            result = run_scenario(scenario)

            if "error" in result:
                print(f"  Error: {result['error']}")
                continue

            # Score this scenario
            adherence = score_persona_adherence(result["agent_responses"], result["persona_specs"])
            coherence = score_response_coherence(result["agent_responses"])
            interaction = score_interaction_quality(result["conversation_log"])
            extraction = score_extraction_accuracy(result["extracted_data"], result["expected_fields"])
            diversity = score_diversity(result["agent_responses"])

            print(f"  Agents: {len(result['agent_responses'])}")
            print(f"  Conversation events: {len(result['conversation_log'])}")
            print(f"  Persona adherence:  {adherence:.4f}")
            print(f"  Response coherence: {coherence:.4f}")
            print(f"  Interaction quality: {interaction:.4f}")
            print(f"  Extraction accuracy: {extraction:.4f}")
            print(f"  Diversity score:    {diversity:.4f}")

            all_adherence.append(adherence)
            all_coherence.append(coherence)
            all_interaction.append(interaction)
            all_extraction.append(extraction)
            all_diversity.append(diversity)
            total_agents += len(result["agent_responses"])
            scenarios_run += 1

        except Exception as e:
            print(f"  Scenario CRASHED: {e}")
            traceback.print_exc()

    # Compute aggregate scores
    avg = lambda lst: sum(lst) / len(lst) if lst else 0.0

    persona_adherence = avg(all_adherence)
    response_coherence = avg(all_coherence)
    interaction_quality = avg(all_interaction)
    extraction_accuracy = avg(all_extraction)
    diversity_score = avg(all_diversity)

    quality_score = compute_quality_score(
        persona_adherence, response_coherence,
        interaction_quality, extraction_accuracy, diversity_score,
    )

    total_seconds = time.time() - start_time

    # Print summary in the expected format
    print()
    print("---")
    print(f"quality_score:      {quality_score:.6f}")
    print(f"persona_adherence:  {persona_adherence:.4f}")
    print(f"response_coherence: {response_coherence:.4f}")
    print(f"interaction_quality: {interaction_quality:.4f}")
    print(f"extraction_accuracy: {extraction_accuracy:.4f}")
    print(f"diversity_score:    {diversity_score:.4f}")
    print(f"total_seconds:      {total_seconds:.1f}")
    print(f"api_calls:          {0}")  # TODO: integrate with client cost tracking
    print(f"total_tokens:       {0}")  # TODO: integrate with client cost tracking
    print(f"num_agents:         {total_agents}")
    print(f"num_scenarios:      {scenarios_run}")


if __name__ == "__main__":
    run_experiment()
