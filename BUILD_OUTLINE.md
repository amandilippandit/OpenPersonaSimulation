# TinyTroupe — Complete Build-From-Scratch Outline

## Overview
**TinyTroupe** is an LLM-powered multiagent persona simulation library for imagination enhancement and business insights. Version 0.7.0, created by Paulo Salem at Microsoft.

- **Language**: Python 3.10+
- **Core dependency**: OpenAI API (also supports Azure OpenAI, Ollama)
- **Architecture**: Subpackage-based Python library with Mustache prompt templates, Pydantic structured outputs, LlamaIndex for vector search, and a transactional simulation caching system.
- **Total**: ~41,000 lines of Python across 60+ files, 14 subpackages

---

## Repository Structure (Target)

```
tinytroupe/
├── __init__.py                    # ConfigManager, LlamaIndex init, startup
├── config.ini                     # Default configuration
├── control.py                     # Simulation lifecycle, Transaction, @transactional
├── profiling.py                   # Profiler class
├── agent/
│   ├── __init__.py                # Pydantic action models, exports
│   ├── tiny_person.py             # TinyPerson (main agent class)
│   ├── action_generator.py        # ActionGenerator with quality checks
│   ├── memory.py                  # EpisodicMemory, SemanticMemory, consolidators
│   ├── mental_faculty.py          # Mental faculties (Recall, Grounding, ToolUse)
│   ├── grounding.py               # GroundingConnectors (local files, web)
│   └── prompts/
│       ├── tiny_person.mustache
│       └── tiny_person.v2.mustache
├── clients/
│   ├── __init__.py                # client() registry, force_api_type/cache
│   ├── openai_client.py           # OpenAIClient + LLMCacheBase
│   ├── azure_client.py            # AzureClient (extends OpenAI)
│   └── ollama_client.py           # OllamaClient
├── environment/
│   ├── __init__.py                # Exports
│   ├── tiny_world.py              # TinyWorld
│   └── tiny_social_network.py     # TinySocialNetwork (extends TinyWorld)
├── factory/
│   ├── __init__.py                # Exports
│   ├── tiny_factory.py            # TinyFactory base
│   ├── tiny_person_factory.py     # TinyPersonFactory
│   └── prompts/
│       ├── generate_person.mustache
│       └── generate_person_factory.md
├── extraction/
│   ├── __init__.py                # Exports
│   ├── results_extractor.py       # ResultsExtractor
│   ├── results_reducer.py         # ResultsReducer
│   ├── results_reporter.py        # ResultsReporter
│   ├── normalizer.py              # Normalizer
│   ├── artifact_exporter.py       # ArtifactExporter
│   └── prompts/
│       ├── interaction_results_extractor.mustache
│       └── normalizer.*.mustache (4 files)
├── enrichment/
│   ├── __init__.py                # Exports
│   ├── tiny_enricher.py           # TinyEnricher
│   ├── tiny_styler.py             # TinyStyler
│   └── prompts/
│       ├── enricher.system.mustache
│       ├── enricher.user.mustache
│       ├── styler.system.mustache
│       ├── styler.user.mustache
│       ├── rai_copyright_infringement_prevention.md
│       └── rai_harmful_content_prevention.md
├── experimentation/
│   ├── __init__.py                # Exports
│   ├── proposition.py             # Proposition class
│   ├── randomization.py           # ABRandomizer
│   ├── in_place_experiment_runner.py
│   └── statistical_tests.py       # StatisticalTester
├── steering/
│   ├── __init__.py                # Exports
│   ├── tiny_story.py              # TinyStory
│   ├── intervention.py            # Intervention, InterventionBatch
│   └── prompts/
│       ├── intervention.mustache
│       └── story.*.mustache (4 files)
├── tools/
│   ├── __init__.py                # Exports
│   ├── tiny_tool.py               # TinyTool base
│   ├── tiny_word_processor.py     # TinyWordProcessor
│   └── tiny_calendar.py           # TinyCalendar
├── validation/
│   ├── __init__.py                # Exports
│   ├── tiny_person_validator.py   # TinyPersonValidator
│   ├── propositions.py            # Pre-built Proposition instances
│   ├── simulation_validator.py    # SimulationExperimentEmpiricalValidator
│   ├── validation_chamber.py      # Stub
│   └── prompts/
│       └── check_person.mustache
├── utils/
│   ├── __init__.py                # Re-exports all submodules
│   ├── config.py                  # read_config_file, logging setup
│   ├── json.py                    # JsonSerializableRegistry, post_init, merge_dicts
│   ├── llm.py                     # LLMChat, @llm decorator, Pydantic response models
│   ├── rendering.py               # RichTextStyle, text formatting helpers
│   ├── misc.py                    # fresh_id, custom_hash, name_or_empty
│   ├── validation.py              # sanitize_raw_string, check_valid_fields
│   ├── semantics.py               # @llm-decorated semantic functions
│   ├── behavior.py                # Jaccard action similarity
│   ├── parallel.py                # parallel_map, parallel_map_dict
│   ├── concurrency.py             # Thread lock monitoring
│   └── media.py                   # Image handling for OpenAI vision API
├── ui/
│   └── jupyter_widgets.py         # AgentChatJupyterWidget
├── examples/
│   ├── agents.py                  # Pre-built agent creation functions
│   ├── loaders.py                 # Agent/fragment JSON loaders
│   ├── agents/*.agent.json        # 6 agent specs
│   └── fragments/*.agent.fragment.json  # 4 fragment specs
├── prompts/                       # (distributed per-subpackage, listed above)
config.ini                         # Root-level config (minimal)
pyproject.toml                     # Package metadata + dependencies
MANIFEST.in                        # Package data inclusion rules
.gitignore
.env.example
README.md
LICENSE (MIT)
examples/                          # Jupyter notebook examples (30)
tests/                             # Unit + scenario + non-functional tests
data/                              # Empirical, extraction, grounding data
```

---

## PHASE 1: Core Foundation

### 1.1 `tinytroupe/utils/config.py`
**Purpose**: Config file reading, logging setup.

**Key elements**:
- `read_config_file(use_cache=True, verbose=True) -> ConfigParser` — reads `config.ini` from module dir, then CWD overlay
- `ThreadSafeFileHandler(logging.FileHandler)` — thread-safe file logging with `threading.Lock()`
- `start_logger(config)` — console handler (Rich) + file handler + root logger setup
- `set_loglevel()`, `set_console_loglevel()`, `set_file_loglevel()`, `get_log_file_path()`, `set_include_thread_info(bool)`
- `pretty_print_config()`, `pretty_print_datetime()`, `pretty_print_tinytroupe_version()`
- Module globals: `_config`, `_log_file_path`, `_console_handler`, `_file_handler`, `_logging_lock = threading.RLock()`

### 1.2 `tinytroupe/utils/json.py`
**Purpose**: Serialization registry and utilities.

**Key elements**:
- `JsonSerializableRegistry` class:
  - `class_mapping = {}` — auto-populated by `__init_subclass__`
  - `serializable_attributes`, `serializable_attributes_renaming`, `suppress_attributes_from_serialization`
  - `custom_serializers`, `custom_deserializers` — dict of attr_name → callable
  - `to_json(include, suppress, file_path, serialization_type_field_name)` — serializes object
  - `from_json(cls, json_dict_or_path, suppress, post_init_params)` — deserializes, looks up class by name
  - `__init_subclass__` — auto-registers and merges parent serialization config
  - `_post_deserialization_init(**kwargs)` — calls `_post_init` if present
- `post_init(cls)` decorator — wraps `__init__` to also call `_post_init`
- `merge_dicts(current, additions, overwrite, error_on_conflict, remove_duplicates)` — recursive dict merge
- `remove_duplicate_items(lst)` — order-preserving dedup (handles dicts)

### 1.3 `tinytroupe/utils/misc.py`
- `AgentOrWorld = Union["TinyPerson", "TinyWorld"]`
- `first_non_none(*args)`
- `name_or_empty(named_entity)` — `.name` or `""`
- `custom_hash(obj)` — SHA-256 of `str(obj)`
- `fresh_id(scope="default") -> int` — monotonic per-scope counter
- `reset_fresh_id(scope=None)`

### 1.4 `tinytroupe/utils/rendering.py`
- `RichTextStyle` class — style constants for Rich console:
  - `STIMULUS_CONVERSATION_STYLE = "bold italic cyan1"`, etc.
  - `get_style_for(cls, kind, event_type)` classmethod
- `inject_html_css_style_prefix(html, style_prefix_attributes)`
- `break_text_at_length(text, max_length)`
- `pretty_datetime(dt)` — strftime
- `dedent(text)`, `wrap_text(text, width=100)`, `indent_at_current_level(text)`

### 1.5 `tinytroupe/utils/validation.py`
- `check_valid_fields(obj: dict, valid_fields: list)`
- `sanitize_raw_string(value: str)` — UTF-8 + NFC + length cap
- `sanitize_dict(value: dict)`
- `to_pydantic_or_sanitized_dict(value, model=None)`

### 1.6 `tinytroupe/utils/media.py`
- `_mime_type_for_image(path)` — maps extensions to MIME types
- `normalize_image_to_openai_url(image_ref)` — file→base64 data URI, pass URLs through
- `build_multimodal_content_array(text, image_refs, detail="auto")` — OpenAI vision format
- `hash_image(image_ref)` — SHA-256 of content
- `normalize_image_refs(images)` — None/str/list → list

### 1.7 `tinytroupe/utils/parallel.py`
- `parallel_map(objects, operation, max_workers=None)` — ThreadPoolExecutor
- `parallel_map_dict(dictionary, operation, max_workers=None)`
- `parallel_map_cross(iterables, operation, max_workers=None)` — cross product

### 1.8 `tinytroupe/utils/concurrency.py`
- `check_threads_for_lock(blocked_keywords=None)` — inspects thread frames
- `monitor_threads(interval=5, stop_event=None)` — periodic monitoring loop

### 1.9 `tinytroupe/utils/behavior.py`
- `_compute_single_action_jaccard_similarity(current_action, proposed_action) -> float`
- `next_action_jaccard_similarity(agent, proposed_next_action) -> float`
- Uses `textdistance.jaccard` on content words

### 1.10 `tinytroupe/utils/llm.py`
**Purpose**: LLM chat management, `@llm` decorator, Pydantic response models.

**Key elements**:
- `LLMScalarWithJustificationResponse(BaseModel)` — justification, value, confidence
- `LLMScalarWithJustificationAndReasoningResponse(BaseModel)` — + reasoning
- `compose_initial_LLM_messages_with_templates(system_template_name, user_template_name, base_module_folder, rendering_configs)` — Mustache template rendering
- `LLMChat` class:
  - `__init__(system_template_name, system_prompt, user_template_name, user_prompt, base_module_folder, output_type, enable_json_output_format, enable_justification_step, enable_reasoning_step, **model_params)`
  - `add_user_message()`, `add_system_message()`, `add_assistant_message()` — fluent API
  - `call()` — sends to client, extracts JSON, coerces types
  - State: `messages`, `conversation_history`, `response_raw`, `response_json`, `response_value`, `response_justification`, `response_confidence`
- `@llm(enable_json_output_format, enable_justification_step, enable_reasoning_step)` decorator — transforms a function with prompt-docstring into LLM call

### 1.11 `tinytroupe/utils/semantics.py`
All `@llm`-decorated:
- `correct_according_to_rule(observation, rules) -> str`
- `restructure_as_observed_vs_expected(description) -> str`
- `extract_observed_vs_expected_rules(description) -> dict`
- `formulate_corrective_rule(feedback) -> str`
- `combine_texts(*texts) -> str`
- `extract_information_from_text(query, text, context=None) -> str`
- `accumulate_based_on_query(query, new_entry, current_accumulation, context=None) -> str`
- `compute_semantic_proximity(text1, text2, context=None) -> float`

### 1.12 `tinytroupe/utils/__init__.py`
Re-exports all submodules via `from .config import *`, `from .json import *`, etc.

### 1.13 `tinytroupe/config.ini`
```ini
[OpenAI]
API_TYPE=openai
AZURE_API_VERSION=2024-12-01-preview
MODEL=gpt-5-mini
REASONING_MODEL=o3-mini
VISION_DETAIL=auto
EMBEDDING_MODEL=text-embedding-3-small
AZURE_EMBEDDING_MODEL_API_VERSION=2023-05-15
MAX_COMPLETION_TOKENS=128000
TIMEOUT=480
MAX_ATTEMPTS=5
WAITING_TIME=1
EXPONENTIAL_BACKOFF_FACTOR=5
MAX_CONCURRENT_MODEL_CALLS=4
REASONING_EFFORT=high
CACHE_API_CALLS=False
CACHE_FILE_NAME=openai_api_cache.json
MAX_CONTENT_DISPLAY_LENGTH=4000

[Simulation]
PARALLEL_AGENT_GENERATION=True
PARALLEL_AGENT_ACTIONS=True
RAI_HARMFUL_CONTENT_PREVENTION=True
RAI_COPYRIGHT_INFRINGEMENT_PREVENTION=True

[Cognition]
ENABLE_MEMORY_CONSOLIDATION=True
ENABLE_CONTINUOUS_CONTEXTUAL_SEMANTIC_MEMORY_RETRIEVAL=True
MIN_EPISODE_LENGTH=10
MAX_EPISODE_LENGTH=15
EPISODIC_MEMORY_FIXED_PREFIX_LENGTH=10
EPISODIC_MEMORY_LOOKBACK_LENGTH=20

[ActionGenerator]
MAX_ATTEMPTS=2
ENABLE_QUALITY_CHECKS=False
ENABLE_REGENERATION=True
ENABLE_DIRECT_CORRECTION=False
ENABLE_QUALITY_CHECK_FOR_PERSONA_ADHERENCE=True
ENABLE_QUALITY_CHECK_FOR_SELFCONSISTENCY=False
ENABLE_QUALITY_CHECK_FOR_FLUENCY=False
ENABLE_QUALITY_CHECK_FOR_SUITABILITY=False
ENABLE_QUALITY_CHECK_FOR_SIMILARITY=False
CONTINUE_ON_FAILURE=True
QUALITY_THRESHOLD=5

[Logging]
LOGLEVEL=ERROR
LOGLEVEL_CONSOLE=INFO
LOGLEVEL_FILE=DEBUG
LOG_INCLUDE_THREAD_ID=True
```

### 1.14 `tinytroupe/__init__.py`
**Purpose**: Package entry point.

**Key elements**:
- Print AI disclaimer on import
- `ConfigManager` class:
  - Constants: `LOGLEVEL_KEY`, `LOGLEVEL_CONSOLE_KEY`, `LOGLEVEL_FILE_KEY`, `LOG_INCLUDE_THREAD_ID_KEY`
  - `_initialize_from_config()` — reads all config keys, normalizes types, sets defaults
  - `_parse_concurrency_limit(value, default)` staticmethod
  - `update(key, value)`, `update_multiple(config_dict)`, `get(key, default)`, `get_with_fallback(key, fallback_key, default)`, `reset()`
  - `__getitem__(key)` — dict-like access
  - `config_defaults(**config_mappings)` — decorator factory: replaces None params with live config
- Module globals: `config = utils.read_config_file()`, `config_manager = ConfigManager()`
- LlamaIndex embedding setup (OpenAI or Azure based on `api_type`)
- Rich Jupyter margin patch

### 1.15 `tinytroupe/control.py`
**Purpose**: Simulation lifecycle, transactional caching.

**Key elements**:
- `concurrent_execution_lock = threading.Lock()`
- `Simulation` class:
  - States: `STATUS_STOPPED`, `STATUS_STARTED`
  - `begin(cache_path, auto_checkpoint)`, `end()`, `checkpoint()`
  - `add_agent()`, `add_environment()`, `add_factory()`
  - Cache: `_function_call_hash()`, `_is_transaction_event_cached()`, `_add_to_execution_trace()`, `_add_to_cache_trace()`, `_load_cache_file()`, `_save_cache_file()`
  - State: `_encode_simulation_state()`, `_decode_simulation_state()`
  - Transactions: `begin_transaction()`, `end_transaction()`, `begin_parallel_transactions()`, `end_parallel_transactions()`
- `Transaction` class:
  - `execute(begin_parallel, parallel_id)` — cache check → replay or execute
  - `_encode_function_output()`, `_decode_function_output()` — handles TinyPerson/TinyWorld/TinyFactory refs
- Exceptions: `SkipTransaction`, `CacheOutOfSync`, `ExecutionCached`
- `transactional(parallel=False)` decorator
- Module functions: `reset()`, `_simulation(id)`, `begin()`, `end()`, `checkpoint()`, `current_simulation()`, `cache_hits()`, `cache_misses()`

---

## PHASE 2: LLM Clients

### 2.1 `tinytroupe/clients/__init__.py`
- Exceptions: `InvalidRequestError`, `NonTerminalError`
- Registry: `_api_type_to_client = {}`, `_api_type_override = None`
- `register_client(api_type, client)`, `client()`, `force_api_type()`, `force_api_cache()`
- Default registrations for openai, azure, ollama

### 2.2 `tinytroupe/clients/openai_client.py`
- `LLMCacheBase` mixin — JSON-based API call caching (`_save_cache`, `_load_cache`, `set_api_cache`)
- `OpenAIClient(LLMCacheBase)`:
  - `_setup_from_config(timeout)` — creates `openai.OpenAI` with httpx timeouts
  - `send_message(current_messages, model, temperature, max_completion_tokens, response_format, ...)` — retry with exponential backoff, semaphore-limited concurrency, caching
  - Cost tracking: `get_cost_stats()`, `reset_cost_stats()`, `print_cost_report()`
  - Thread-safe: `_cache_lock = threading.RLock()`, `_concurrency_semaphore = BoundedSemaphore`

### 2.3 `tinytroupe/clients/azure_client.py`
- `AzureClient(OpenAIClient)` — overrides `_setup_from_config` for `AzureOpenAI` with key or Entra ID auth

### 2.4 `tinytroupe/clients/ollama_client.py`
- `OllamaClient(LLMCacheBase)` — direct HTTP requests to Ollama REST API

---

## PHASE 3: Agent System

### 3.1 `tinytroupe/agent/__init__.py`
- Pydantic models: `Action`, `CognitiveState`, `CognitiveActionModel`, `CognitiveActionModelWithReasoning`, `CognitiveActionsModel`, `CognitiveActionsModelWithReasoning`
- Exports all agent submodules

### 3.2 `tinytroupe/agent/grounding.py`
- `GroundingConnector(JsonSerializableRegistry)` — abstract (retrieve_relevant, retrieve_by_name, list_sources)
- `BaseSemanticGroundingConnector(GroundingConnector)` — LlamaIndex VectorStoreIndex:
  - Custom serializers/deserializers for Document and index
  - `add_document()`, `add_documents()`, `retrieve_relevant()`, `retrieve_by_name()`, `list_sources()`
- `LocalFilesGroundingConnector(BaseSemanticGroundingConnector)` — reads local folders via SimpleDirectoryReader
- `WebPagesGroundingConnector(BaseSemanticGroundingConnector)` — reads URLs via SimpleWebPageReader

### 3.3 `tinytroupe/agent/memory.py`
- `TinyMemory(TinyMentalFaculty)` — abstract base with store/retrieve/summarize
- `EpisodicMemory(TinyMemory)`:
  - `memory = []` (committed), `episodic_buffer = []` (current episode)
  - `commit_episode()`, `retrieve(first_n, last_n)`, `retrieve_recent()` (fixed_prefix + lookback)
  - `MEMORY_BLOCK_OMISSION_INFO` sentinel
- `SemanticMemory(TinyMemory)`:
  - LlamaIndex-backed, `BaseSemanticGroundingConnector`
  - Engram types: action, stimulus, feedback, consolidated, reflection, image_description
- `MemoryProcessor` — abstract base for consolidation
- `EpisodicConsolidator(MemoryProcessor)` — LLM-powered batch consolidation
- `ReflectionConsolidator(MemoryProcessor)` — stub

### 3.4 `tinytroupe/agent/mental_faculty.py`
- `TinyMentalFaculty(JsonSerializableRegistry)` — abstract (process_action, prompts)
- `CustomMentalFaculty` — user-defined actions/constraints
- `RecallFaculty` — RECALL and RECALL_WITH_FULL_SCAN actions
- `FilesAndWebGroundingFaculty` — CONSULT and LIST_DOCUMENTS actions
- `TinyToolUse` — delegates to tool list

### 3.5 `tinytroupe/agent/action_generator.py`
- `ActionGenerator(JsonSerializableRegistry)`:
  - Quality checks via Proposition copies from validation.propositions
  - `generate_next_actions()` / `generate_next_action()` — LLM call + quality loop
  - `_generate_tentative_action()` — sends messages to LLM with response_format schema
  - `_inject_multimodal_images()` — resolves image IDs
  - `_check_action_quality()` — runs all enabled propositions
  - `_correct_action()` — uses semantic utils for correction
- `PoorQualityActionException`

### 3.6 `tinytroupe/agent/tiny_person.py`
- `TinyPerson(JsonSerializableRegistry)` decorated with `@utils.post_init`:
  - Class constants: MAX_ACTIONS_BEFORE_DONE=15, MAX_ACTION_SIMILARITY=0.85, PP_TEXT_WIDTH=100
  - Class attrs: `all_agents = {}`, `communication_display = True`
  - Persona dict: name, age, nationality, country_of_residence, occupation, ...
  - Mental state dict: datetime, location, context, goals, attention, emotions, ...
  - Core methods:
    - `generate_agent_system_prompt()` — renders tiny_person.v2.mustache
    - `act(until_done, n, return_actions)` — main action loop
    - `listen()`, `socialize()`, `see()`, `think()`, `internalize_goal()`
    - `listen_and_act()`, `see_and_act()`, `think_and_act()`
    - `read_documents_from_folder()`, `read_documents_from_web()`
    - `move_to()`, `change_context()`
    - `define()`, `define_several()`, `define_relationships()`
    - `import_fragment()`, `include_persona_definitions()`
    - Memory: `store_in_memory()`, `retrieve_recent_memories()`, `retrieve_relevant_memories()`
    - `minibio()`, `pretty_current_interactions()`
    - State: `encode_complete_state()`, `decode_complete_state()`
    - `save_specification()`, `load_specification()`
  - Almost all mutating methods decorated with `@transactional()`

### 3.7 Prompt Templates (`tinytroupe/agent/prompts/`)
- `tiny_person.mustache` — v1 system prompt (legacy)
- `tiny_person.v2.mustache` — v2 system prompt with:
  - Persona section (name, age, nationality, occupation, personality, etc.)
  - Mental state section (datetime, location, goals, emotions, attention)
  - Faculty action definitions and constraints
  - Recent episodic memories
  - Accessible agents list
  - Output format instructions (JSON with action + cognitive_state)

---

## PHASE 4: Environment System

### 4.1 `tinytroupe/environment/tiny_world.py`
- `TinyWorld`:
  - Class attrs: `all_environments = {}`, `communication_display = True`, `default_initial_datetime`
  - Simulation: `_step()`, `_step_sequentially()`, `_step_in_parallel()` (ThreadPoolExecutor)
  - `run(steps, timedelta_per_step, return_actions, parallelize)` — main simulation loop
  - `skip(steps, timedelta_per_step)` — advance time without actions
  - Time conveniences: `run_minutes/hours/days/weeks/months/years`, `skip_*`
  - Agent management: `add_agent()`, `remove_agent()`, `get_agent_by_name()`
  - Action handling: `_handle_actions()`, `_handle_talk()`, `_handle_reach_out()`, `_handle_show()`
  - Communications display via Rich console
  - Interventions applied each step
  - State: `encode_complete_state()`, `decode_complete_state()`

### 4.2 `tinytroupe/environment/tiny_social_network.py`
- `TinySocialNetwork(TinyWorld)`:
  - `relations = {}` — undirected agent relations
  - `add_relation(agent_1, agent_2, name)` — registers relation
  - `_update_agents_contexts()` — updates accessibility
  - Overrides `_handle_reach_out()` — restricts to same relation

---

## PHASE 5: Factory System

### 5.1 `tinytroupe/factory/tiny_factory.py`
- `TinyFactory`:
  - `all_factories = {}`, `randomizer = random.Random(42)`
  - `add_factory()`, `clear_factories()`, `set_simulation_for_free_factories()`
  - `encode_complete_state()`, `decode_complete_state()`

### 5.2 `tinytroupe/factory/tiny_person_factory.py`
- `TinyPersonFactory(TinyFactory)`:
  - `all_unique_names = []` — global unique name tracking
  - `generate_person(agent_particularities, verbose)` — LLM-powered agent generation
  - `generate_people(number_of_people)` — batch generation (parallel optional)
  - `create_factory_from_demography(demography_description_or_file, population_size)` — creates sampling space
  - Internal: sampling space planning, characteristic sampling, diversity enforcement

---

## PHASE 6: Tools, Extraction, Enrichment, Steering

### 6.1 Tools (`tinytroupe/tools/`)
- `TinyTool(JsonSerializableRegistry)` — base with ownership, real-world protection, retry
- `TinyWordProcessor(TinyTool)` — WRITE_DOCUMENT action, export to md/docx/json
- `TinyCalendar(TinyTool)` — CREATE_EVENT action (partial implementation)

### 6.2 Extraction (`tinytroupe/extraction/`)
- `ResultsExtractor` — LLM-based extraction from agent/world interactions
- `ResultsReducer` — rule-based reduction of episodic memories
- `ResultsReporter` — LLM-based report generation from agents/data
- `Normalizer` — LLM-based element clustering and normalization
- `ArtifactExporter(JsonSerializableRegistry)` — export as txt/json/docx

### 6.3 Enrichment (`tinytroupe/enrichment/`)
- `TinyEnricher(JsonSerializableRegistry)` — LLM content enrichment via templates
- `TinyStyler` — styling variant

### 6.4 Steering (`tinytroupe/steering/`)
- `TinyStory` — narrative generation from agent/environment interactions
  - `start_story()`, `continue_story()` — LLM template-based
- `Intervention` — conditional effects on simulation targets
  - Preconditions: text (LLM Proposition), functional, propositional
  - `execute()` — checks precondition + applies effect
- `InterventionBatch` — applies same config to multiple interventions

---

## PHASE 7: Experimentation, Validation, Profiling

### 7.1 Experimentation (`tinytroupe/experimentation/`)
- `Proposition` — LLM-evaluated claims about agents/worlds:
  - `check()` → bool, `score()` → int 0-9
  - Supports preconditions, double-checking, reasoning models
- `ABRandomizer` — A/B test randomization with derandomization
- `InPlaceExperimentRunner` — JSON-config experiment management for notebooks
- `StatisticalTester` — 8 statistical tests (Welch t, Student t, KS, Mann-Whitney, etc.)

### 7.2 Validation (`tinytroupe/validation/`)
- `TinyPersonValidator` — multi-turn LLM interview validation
- `propositions.py` — 13 pre-built Proposition instances (persona_adherence, action_fluency, etc.)
- `SimulationExperimentEmpiricalValidator` — statistical + semantic validation vs empirical data
- `SimulationExperimentDataset(BaseModel)` — Pydantic dataset with auto type detection
- `ValidationChamber` — stub for future expansion

### 7.3 Profiling (`tinytroupe/profiling.py`)
- `Profiler` — attribute distribution analysis, matplotlib/seaborn visualization, correlation analysis

---

## PHASE 8: UI, Examples, Prompts, Data

### 8.1 UI (`tinytroupe/ui/`)
- `AgentChatJupyterWidget` — Jupyter widget for agent chat

### 8.2 Examples (`tinytroupe/examples/`)
- `agents.py` — creation functions: `create_oscar_the_architect()`, `create_lisa_the_data_scientist()`, etc.
- `loaders.py` — JSON agent/fragment loading
- Agent JSON specs (6): Friedrich_Wolf, Lila, Lisa, Marcos, Oscar, Sophie_Lefevre
- Fragment JSON specs (4): authoritarian, leftwing, libertarian, rightwing

### 8.3 All Prompt Templates (Mustache)
Listed per-subpackage above. These are critical — they define the LLM interaction format.

### 8.4 Data Files
- `data/empirical/` — survey CSVs for validation
- `data/extractions/` — sample outputs
- `data/facts/` — grounding text
- `data/grounding_examples/` — PDFs and text for grounding demos

---

## PHASE 9: Package Configuration

### 9.1 `pyproject.toml`
- Build: setuptools>=61.0
- Package: tinytroupe v0.7.0, Python >=3.10
- Dependencies: openai>=1.65, pydantic>=2.5.0, chevron, tiktoken, rich, llama-index, pandas, scipy, etc.
- pytest markers: examples, notebooks, core, slow, gpt41mini

### 9.2 `MANIFEST.in`
```
recursive-include tinytroupe *.ini *.py *.md *.mustache *.json
```

### 9.3 `.gitignore`
Standard Python + project-specific (*.pickle, .llmapi.bin, *.cache.*, outputs/, .env, etc.)

### 9.4 `.env.example`
```
OPENAI_API_KEY=
```

### 9.5 Root `config.ini`
Minimal version pointing to gpt-5-mini

---

## KEY ARCHITECTURAL PATTERNS

1. **`@utils.post_init`** — Wraps `__init__` to call `_post_init` after construction. Used on TinyPerson, SemanticMemory, grounding connectors.

2. **`@transactional()`** — Wraps methods in Transaction for simulation caching/replay. Used on all state-mutating methods.

3. **`@config_manager.config_defaults(**mappings)`** — Injects live config values as default params at call time.

4. **`@llm(...)`** — Transforms docstring-as-prompt functions into actual LLM calls. Body is ignored.

5. **`JsonSerializableRegistry`** — Universal serialization mixin with auto-class-registry, custom serializers, and attribute renaming.

6. **Action types**: TALK, THINK, DONE, RECALL, RECALL_WITH_FULL_SCAN, CONSULT, LIST_DOCUMENTS, REACH_OUT, WRITE_DOCUMENT, SHOW, CREATE_EVENT

7. **Memory engram types**: action, stimulus, feedback, consolidated, reflection, image_description, information

8. **Client abstraction**: `client()` → OpenAIClient/AzureClient/OllamaClient based on config

9. **Prompt rendering**: Chevron (Mustache) templates with rendering_configs dict

10. **Parallel execution**: ThreadPoolExecutor for agent actions in TinyWorld, parallel agent generation in factory

---

## BUILD ORDER (Dependency-Respecting)

```
1. utils/config.py          (no deps)
2. utils/misc.py             (no deps)
3. utils/rendering.py        (no deps)
4. utils/validation.py       (no deps)
5. utils/media.py            (no deps)
6. utils/parallel.py         (no deps)
7. utils/concurrency.py      (no deps)
8. utils/behavior.py         (textdistance)
9. utils/json.py             (no internal deps)
10. utils/llm.py             (needs clients, chevron)
11. utils/semantics.py       (needs @llm)
12. utils/__init__.py        (re-exports)
13. config.ini               (static file)
14. __init__.py              (needs utils, llama-index)
15. clients/__init__.py      (needs config_manager)
16. clients/openai_client.py (needs config_manager, openai)
17. clients/azure_client.py  (extends openai_client)
18. clients/ollama_client.py (needs config_manager)
19. control.py               (needs config_manager, utils)
20. agent/grounding.py       (needs utils, llama-index)
21. agent/memory.py          (needs utils, grounding, llm)
22. agent/mental_faculty.py  (needs utils, grounding)
23. agent/__init__.py        (Pydantic models)
24. agent/action_generator.py(needs clients, control, experimentation)
25. agent/tiny_person.py     (needs everything in agent/)
26. agent/prompts/           (static templates)
27. environment/tiny_world.py(needs agent, control)
28. environment/tiny_social_network.py (extends tiny_world)
29. factory/tiny_factory.py  (needs control)
30. factory/tiny_person_factory.py (needs agent, clients, factory)
31. experimentation/proposition.py (needs agent, environment, llm)
32. experimentation/randomization.py (no deps)
33. experimentation/statistical_tests.py (scipy, numpy)
34. experimentation/in_place_experiment_runner.py (needs statistical_tests)
35. validation/propositions.py (needs experimentation.Proposition)
36. validation/tiny_person_validator.py (needs agent, clients)
37. validation/simulation_validator.py (needs experimentation, utils)
38. tools/tiny_tool.py       (needs utils)
39. tools/tiny_word_processor.py (extends tiny_tool)
40. tools/tiny_calendar.py   (extends tiny_tool)
41. extraction/artifact_exporter.py (needs utils)
42. extraction/normalizer.py (needs utils, llm)
43. extraction/results_extractor.py (needs agent, clients)
44. extraction/results_reducer.py (needs agent)
45. extraction/results_reporter.py (needs agent, llm)
46. enrichment/tiny_enricher.py (needs utils, llm)
47. steering/tiny_story.py   (needs agent, environment, llm)
48. steering/intervention.py (needs experimentation)
49. profiling.py             (needs agent, extraction)
50. ui/jupyter_widgets.py    (needs agent)
51. examples/                (needs agent, factory, tools)
52. All prompt templates     (static files)
53. pyproject.toml, MANIFEST.in, .gitignore, README.md
54. tests/                   (needs everything)
```
