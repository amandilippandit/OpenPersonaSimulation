"""
Fixed evaluation harness for OpenPersona marketing content testing autoresearch.

DO NOT MODIFY THIS FILE. It contains the fixed evaluation, test scenarios,
and scoring functions that all experiments are measured against.

Usage:
    python autoresearch/prepare.py          # verify setup
    python autoresearch/prepare.py --check  # run quick smoke test
"""

import os
import sys
import argparse
from typing import Dict, List, Any

# ---------------------------------------------------------------------------
# Constants (fixed, do not modify)
# ---------------------------------------------------------------------------

TIME_BUDGET = 180         # experiment time budget in seconds (3 minutes)
MAX_AGENTS = 8            # max consumers per scenario
MAX_STEPS = 10            # max simulation steps per scenario
MAX_API_CALLS = 100       # soft cap on total API calls per experiment

# ---------------------------------------------------------------------------
# Marketing test scenarios — the ground truth content evaluation setups
# ---------------------------------------------------------------------------

SCENARIOS = [
    {
        "id": "ad_copy_test",
        "name": "Ad Copy Evaluation",
        "description": "Show an ad to diverse consumers and extract purchase intent, concerns, and emotional reactions",
        "content": (
            "Headline: Your Wallet Called. It Wants a Raise.\n"
            "Body: ThriftAI tracks every dollar you spend and finds savings you didn't know existed. "
            "Join 200,000 users who save an average of $340/month. Free 30-day trial. No credit card required."
        ),
        "prompt": "Read this ad carefully and share your honest, unfiltered reaction. Would you click? What's your first concern? Be specific.",
        "expected_fields": ["purchase_intent", "emotional_reaction", "main_concern", "would_share"],
        "min_agents": 3,
        "diversity_check": True,
        "audience_requirements": [
            {"segment": "young_professional", "age_range": [25, 35], "traits": ["tech-savvy", "budget-conscious", "values convenience"]},
            {"segment": "skeptical_parent", "age_range": [38, 52], "traits": ["cautious with finances", "skeptical of ads", "values trust and reviews"]},
            {"segment": "impulse_shopper", "age_range": [22, 40], "traits": ["impulse buyer", "brand-conscious", "trend-follower"]},
        ],
    },
    {
        "id": "brand_messaging",
        "name": "Brand Messaging Perception",
        "description": "Test whether a brand statement lands as intended across audience segments",
        "content": (
            "At Meridian, we believe luxury should be quiet. Our products aren't for the loud — "
            "they're for those who know. Crafted by hand, owned for generations, understated by design."
        ),
        "prompt": "Read this brand statement. In your own words, what kind of company is this? Who is it for? Do you trust them?",
        "expected_fields": ["perceived_positioning", "target_customer_guess", "trust_level", "memorability"],
        "min_agents": 3,
        "diversity_check": True,
        "audience_requirements": [
            {"segment": "luxury_consumer", "age_range": [40, 60], "traits": ["values craftsmanship", "discerning", "status-aware"]},
            {"segment": "mainstream_shopper", "age_range": [28, 45], "traits": ["value-focused", "practical", "skeptical of luxury marketing"]},
            {"segment": "gen_z", "age_range": [18, 26], "traits": ["brand-savvy", "authenticity-focused", "social-media native"]},
        ],
    },
    {
        "id": "product_launch",
        "name": "Product Launch Reception",
        "description": "Simulate word-of-mouth reaction when multiple consumers discuss a new product together",
        "content": (
            "New product announcement: NovaPen — a pen that transcribes your handwritten notes to digital text in real-time. "
            "Works with any paper. Syncs to your phone. $149. Available next month."
        ),
        "prompt": "A friend just showed you this product announcement. Discuss it with the others. Would you buy it? What about it excites or worries you?",
        "expected_fields": ["excitement_level", "likelihood_to_buy", "would_recommend", "price_perception"],
        "min_agents": 3,
        "diversity_check": False,
        "audience_requirements": [
            {"segment": "student", "age_range": [18, 24], "traits": ["note-taker", "budget-limited", "tech adopter"]},
            {"segment": "knowledge_worker", "age_range": [28, 45], "traits": ["productivity-focused", "willing to pay for tools", "organized"]},
            {"segment": "creative_professional", "age_range": [25, 40], "traits": ["values analog tools", "tactile preferences", "brand-sensitive"]},
        ],
    },
]

# ---------------------------------------------------------------------------
# Scoring functions (DO NOT CHANGE — these are the fixed metrics)
# ---------------------------------------------------------------------------

def score_audience_realism(responses: List[Dict], audience_specs: List[Dict]) -> float:
    """
    Score whether consumers behave authentically to their segment.
    Higher when traits show up in reactions (skeptical personas voice skepticism, etc.)
    Returns 0.0 to 1.0.
    """
    if not responses or not audience_specs:
        return 0.0

    scores = []
    for resp, spec in zip(responses, audience_specs):
        content = resp.get("content", "").lower()
        traits = spec.get("traits", [])

        # Trait alignment: key words from traits appear in response
        trait_score = 0.0
        if traits:
            hits = 0
            for trait in traits:
                keywords = [w for w in trait.lower().split() if len(w) > 3]
                if any(kw in content for kw in keywords):
                    hits += 1
            trait_score = min(1.0, hits / max(len(traits), 1))

        # Segment voice check — response length appropriate (not too short, not rambling)
        word_count = len(content.split())
        length_score = 1.0 if 15 <= word_count <= 200 else max(0.3, 1.0 - abs(word_count - 80) / 200)

        scores.append(0.65 * trait_score + 0.35 * length_score)

    return sum(scores) / len(scores)


def score_response_depth(responses: List[Dict]) -> float:
    """
    Score whether reactions are detailed and actionable (not generic).
    Returns 0.0 to 1.0.
    """
    if not responses:
        return 0.0

    scores = []
    for resp in responses:
        content = resp.get("content", "")
        score = 0.0

        if not content.strip():
            scores.append(0.0)
            continue

        # Specific details mentioned (numbers, quoted phrases, specific aspects)
        if any(c.isdigit() for c in content):
            score += 0.25
        if '"' in content or "'" in content:
            score += 0.15
        # Has reasoning language ("because", "since", "however")
        reasoning_words = ["because", "since", "however", "although", "but ", "actually", "reminds me"]
        if any(w in content.lower() for w in reasoning_words):
            score += 0.25
        # Multiple sentences (developed thought)
        sentences = [s.strip() for s in content.split('.') if len(s.strip()) > 5]
        if len(sentences) >= 2:
            score += 0.2
        if len(sentences) >= 4:
            score += 0.15

        scores.append(min(1.0, score))

    return sum(scores) / len(scores)


def score_discrimination(responses: List[Dict], audience_specs: List[Dict]) -> float:
    """
    Score whether different segments give meaningfully different reactions.
    If all consumers give similar responses, the test is useless.
    Returns 0.0 to 1.0.
    """
    if not responses or len(responses) < 2:
        return 0.0

    contents = [set(r.get("content", "").lower().split()) for r in responses]

    # Pairwise dissimilarity
    distances = []
    for i in range(len(contents)):
        for j in range(i + 1, len(contents)):
            set_i, set_j = contents[i], contents[j]
            if not set_i and not set_j:
                continue
            union = len(set_i | set_j)
            intersection = len(set_i & set_j)
            jaccard_dist = 1.0 - (intersection / union if union > 0 else 0.0)
            distances.append(jaccard_dist)

    if not distances:
        return 0.0

    avg_dist = sum(distances) / len(distances)

    # Sweet spot: 0.4-0.8 (meaningfully different but still on-topic)
    if avg_dist < 0.3:
        return avg_dist * 2  # too similar — bad discrimination
    elif avg_dist > 0.9:
        return 0.7  # suspiciously different
    else:
        return min(1.0, 0.5 + avg_dist * 0.6)


def score_actionability(extracted: Dict, expected_fields: List[str]) -> float:
    """
    Score whether structured feedback can be extracted for marketing team use.
    Returns 0.0 to 1.0.
    """
    if not extracted or not expected_fields:
        return 0.0

    found_with_content = 0
    for field in expected_fields:
        val = extracted.get(field)
        if val is not None and str(val).strip() and len(str(val).strip()) > 3:
            found_with_content += 1

    return found_with_content / len(expected_fields)


def score_coverage(responses: List[Dict]) -> float:
    """
    Score whether reactions surface BOTH positive and negative signals.
    All-positive or all-negative reactions are suspicious and not useful.
    Returns 0.0 to 1.0.
    """
    if not responses:
        return 0.0

    positive_markers = ["love", "great", "interesting", "excited", "like", "would buy", "impressed", "clever", "smart"]
    negative_markers = ["skeptical", "concern", "worry", "expensive", "doubt", "not sure", "wouldn't", "hesitant", "unclear"]

    pos_count = 0
    neg_count = 0
    for resp in responses:
        content = resp.get("content", "").lower()
        if any(m in content for m in positive_markers):
            pos_count += 1
        if any(m in content for m in negative_markers):
            neg_count += 1

    if pos_count == 0 and neg_count == 0:
        return 0.0
    if pos_count == 0 or neg_count == 0:
        return 0.4  # only one signal — incomplete coverage

    balance = min(pos_count, neg_count) / max(pos_count, neg_count)
    return 0.6 + 0.4 * balance


def compute_quality_score(
    audience_realism: float,
    response_depth: float,
    discrimination: float,
    actionability: float,
    coverage: float,
) -> float:
    """
    Compute the composite marketing test quality score. Weighted average.
    Returns 0.0 to 1.0.
    """
    return (
        0.25 * audience_realism     # Do consumers behave like real segments?
        + 0.25 * response_depth     # Are reactions detailed and actionable?
        + 0.20 * discrimination     # Do different segments differ meaningfully?
        + 0.15 * actionability      # Can structured data be extracted?
        + 0.15 * coverage           # Positive AND negative signals present?
    )


# ---------------------------------------------------------------------------
# Verification
# ---------------------------------------------------------------------------

def verify_setup():
    print("Checking OpenPersona installation...")
    try:
        import openpersona
        print(f"  openpersona OK")
    except ImportError:
        print("  ERROR: openpersona not installed. Run: pip install -e .")
        return False

    print("Checking API key...")
    if os.environ.get("OPENAI_API_KEY"):
        print("  OPENAI_API_KEY is set")
    else:
        print("  WARNING: OPENAI_API_KEY not set. Experiments will fail on LLM calls.")

    print(f"\nMarketing test scenarios loaded: {len(SCENARIOS)}")
    for s in SCENARIOS:
        print(f"  - {s['id']}: {s['name']} ({s['min_agents']} consumers)")

    print(f"\nTime budget: {TIME_BUDGET}s ({TIME_BUDGET // 60} minutes)")
    print(f"Max consumers per scenario: {MAX_AGENTS}")
    print("\nMetric: quality_score (0.0 - 1.0)")
    print("  25% audience realism")
    print("  25% response depth")
    print("  20% discrimination (segment differences)")
    print("  15% actionability (structured extraction)")
    print("  15% coverage (positive + negative signals)")

    print("\nSetup OK. Ready to run marketing tests.")
    return True


def smoke_test():
    print("Running smoke test...")
    try:
        from openpersona.agent import Persona
        from openpersona.environment import World
        agent = Persona("TestConsumer")
        agent.define("age", 30)
        world = World("TestRoom", [agent])
        print(f"  Smoke test PASSED")
        return True
    except Exception as e:
        print(f"  Smoke test FAILED: {e}")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Verify autoresearch setup for marketing content testing")
    parser.add_argument("--check", action="store_true", help="Run smoke test")
    args = parser.parse_args()

    ok = verify_setup()
    if args.check and ok:
        print()
        smoke_test()
