# Feature 008: AI-Generated Natural Language Description - Specification Overview

**Branch**: 008-add-a-feature
**Created**: 2025-09-30
**Status**: Specification complete, implementation not started

## Quick Summary
This feature adds real-time AI-generated natural language descriptions to the audio wizard interface. As users complete each step of the wizard (Genre, Mood, Energy, Texture, Instrumentation, Vocals, BPM), GPT-5 Nano generates a concise 10-30 word human-readable phrase summarizing their selections. The phrase updates automatically with 750ms debouncing, includes rate limiting and cost controls, and is persisted in the final JSON output.

---

## Document Summaries

### spec.md (13,454 bytes)
**Purpose**: Complete functional specification with requirements, user stories, and clarifications

**Key Content**:
- **21 Functional Requirements** covering phrase generation, display, persistence, rate limiting, cost tracking, error handling, validation, and email notifications
- **Primary User Story**: User sees continuously updated natural-language summary of wizard selections for quick understanding without manual writing
- **13 Clarifications Resolved** including:
  - AI model selection (GPT-5 Nano)
  - Failure handling (silent retry once, then show error with last valid phrase)
  - Rate limits (30/min, 1000/hour, max 3 concurrent)
  - Cost limits ($0.10/session, $0.50/day)
  - Email notifications to joeyfoursheds@gmail.com when limits reached
  - Phrase validation (profanity filter, coherent syntax, musical relevance)
  - Minimum data requirements (genre + at least one attribute)
  - Music theory exclusions (key/scale/chords not used in phrase generation)
- **5 Acceptance Scenarios** covering step-by-step progression, instrumentation details, complete workflow, loading states, backward navigation
- **7 Edge Cases** documented including partial data, API failures, inappropriate content, debouncing, skipped steps, limit exhaustion

### plan.md (6,168 bytes)
**Purpose**: Technical implementation plan with architecture, dependencies, and phases

**Key Content**:
- **Technical Stack**: TypeScript 5.x, Node.js 18+, React 18, Zustand, OpenAI API, Vite
- **Performance Goals**: <750ms latency (p95), 30 phrases/minute
- **Constraints**: 750ms debounce, max 3 concurrent, 900 tokens/request
- **Constitutional Compliance**: All 5 principles validated (PASS)
- **Project Structure**:
  - Frontend updates: WizardLayout.tsx, new NLPhraseDisplay.tsx component, useAIPhraseGeneration hook
  - Backend services: openai-client.ts, rate-limiter.ts, cost-tracker.ts, emailNotifier.ts
  - Schema updates: musical_annotation.schema.json with nl_phrase field
- **4 Implementation Phases**:
  - Phase 0: Research (6 decision areas)
  - Phase 1: Design & Contracts (data model, quickstart, contracts)
  - Phase 2: Task planning (46 tasks across 3 phases)
  - Phase 3: Implementation (TDD approach)

### research.md (6,629 bytes)
**Purpose**: Technical research and architecture decisions for 6 key areas

**Key Decisions**:
1. **OpenAI Integration**: Use OpenAI Node.js SDK v4.x with GPT-5 Nano, tiktoken for token counting, max 50 tokens response (ensures <30 words)
2. **Rate Limiting**: Multi-tier sliding window algorithm (in-memory for minute/hour, file-based JSON for daily cost tracking)
3. **Email Notifications**: Nodemailer with Gmail SMTP for limit notifications to joeyfoursheds@gmail.com
4. **Debouncing**: lodash.debounce in custom hook with 750ms delay, Zustand state management
5. **Error Handling**: Fixed 2-second retry delay with error classification (retryable vs terminal)
6. **Schema Extension**: Version nl_phrase field as v1.1.0, use JSON Schema validation, backward compatible (optional field)

**Alternatives Considered**:
- Direct HTTP vs SDK (rejected - SDK better error handling)
- Redis vs in-memory rate limiting (rejected - overkill for single-user)
- SendGrid/AWS SES vs nodemailer (rejected - Gmail SMTP simpler)
- Manual setTimeout vs lodash.debounce (rejected - lodash handles edge cases)
- Exponential backoff vs fixed retry (fixed chosen for predictability)

### tasks.md (9,613 bytes)
**Purpose**: Dependency-ordered task breakdown with TDD emphasis

**Key Content**:
- **46 Total Tasks** organized into 4 phases:
  - Phase 3.1: Setup & Environment (6 tasks)
  - Phase 3.2: Tests First / TDD (15 tasks - ALL MUST FAIL before implementation)
  - Phase 3.3: Core Implementation (15 tasks)
  - Phase 3.4: Integration & Polish (10 tasks)
- **25 Tasks Marked [P]** for parallel execution
- **Test Categories**:
  - 4 Schema & Contract tests (generate-phrase success/ratelimit/validation, nl-phrase validation)
  - 6 Backend unit tests (openai-client, rate-limiter, cost-tracker)
  - 5 Integration tests (complete flow, partial data, error retry, rate limit, backward navigation)
- **Critical Dependencies**:
  - Setup → Tests → Implementation → Validation (sequential phases)
  - Types (T022-T023) before services (T024-T034)
  - Backend services before frontend integration
  - All tests green before polish phase
- **File Paths Specified** for all tasks with exact locations

### apply-remediation.sh (5,644 bytes)
**Purpose**: Shell script for applying cross-artifact consistency fixes from /analyze command

**Content**: Automated remediation script generated by the /analyze slash command to fix inconsistencies between spec.md, plan.md, and tasks.md. Contains 14 fixes addressing missing details, unclear requirements, and alignment issues across artifacts.

---

## Statistics

### Requirements
- **Functional Requirements**: 21 (FR-001 through FR-019, plus FR-020/FR-021 for notifications)
- **Non-Functional**: Implicit performance (<750ms latency), cost ($0.10/$0.50 limits), rate (30/min, 1000/hour)
- **Clarifications Resolved**: 13
- **Acceptance Scenarios**: 5
- **Edge Cases**: 7

### Tasks & Timeline
- **Total Tasks**: 46
- **Parallel Tasks**: 25 (54% can run concurrently)
- **Test Tasks**: 15 (TDD-first approach)
- **Implementation Tasks**: 15 (core services, API, UI)
- **Polish Tasks**: 10 (integration, validation, docs)
- **Estimated Timeline**: 3-5 days (with parallel execution)
- **Critical Path**: Setup (6) → Tests (15) → Backend (6) → Frontend (9) → Integration (10)

### Scope
- **Frontend Changes**: 2 new components, 1 hook, 3 services, 2 context updates
- **Backend Changes**: New backend/ directory with 4 services, 1 API route, 2 middleware
- **Schema Changes**: 1 field addition (nl_phrase to semantic_description)
- **Dependencies Added**: openai@^4.0.0, nodemailer@^6.9.0, lodash@^4.17.0 (+ types)
- **Test Files**: 15 new test files (4 contract, 6 unit, 5 integration)

### Architecture
- **Design Pattern**: Service-oriented architecture with clear separation of concerns
- **State Management**: Zustand for frontend, in-memory + file-based for backend
- **API Communication**: REST endpoint (POST /api/generate-phrase)
- **Validation**: Multi-layer (schema, contract, business logic, content quality)
- **Error Strategy**: Silent retry → fallback to last valid → user notification → email alert

---

## Key Technical Highlights

### 1. Debouncing Strategy
- 750ms delay after last wizard step change
- Prevents excessive API calls during rapid user input
- Cancels pending requests when component unmounts
- Race condition handling with requestId tracking

### 2. Multi-Tier Rate Limiting
- **Minute**: 30 requests (sliding window)
- **Hour**: 1000 requests (sliding window)
- **Concurrent**: Max 3 simultaneous requests (semaphore pattern)
- **Session Cost**: $0.10 limit (in-memory tracking)
- **Daily Cost**: $0.50 limit (persistent file-based JSON)

### 3. Error Handling Flow
```
API Call → Timeout/Failure
  → Silent Retry (2s delay, error classification)
    → Success → Validate Phrase Quality
      → Invalid → Retry Generation
        → Still Invalid → Show Error + Keep Last Valid Phrase
    → Failure → Show Last Valid Phrase + Error Message
```

### 4. Data Exclusions
Music theory fields (key, scale, chords) explicitly excluded from phrase generation per clarification - deemed too technical for creative natural language descriptions.

### 5. Validation Layers
1. **Input**: Genre + at least one attribute required
2. **Schema**: nl_phrase string 10-200 chars, optional
3. **Content**: Word count 10-30, profanity filter, coherent syntax
4. **Domain**: Must relate to musical characteristics

---

## Implementation Status

### Completed
- ✅ Specification (spec.md with 13 clarifications)
- ✅ Technical research (6 architecture decisions)
- ✅ Implementation plan (4 phases documented)
- ✅ Task breakdown (46 tasks with dependencies)
- ✅ Cross-artifact analysis (14 inconsistencies identified via /analyze)

### Not Started
- ❌ Backend directory structure and services
- ❌ Test infrastructure (15 failing tests required by TDD)
- ❌ OpenAI API integration
- ❌ Frontend components and hooks
- ❌ Schema updates
- ❌ Integration and validation

### Next Actions
1. Execute T001-T006 (Setup & Environment)
2. Write T007-T021 (Tests - must fail)
3. Implement T022-T036 (Core implementation until tests pass)
4. Execute T037-T046 (Integration, validation, polish)

---

## Constitutional Compliance

| Principle | Status | Notes |
|-----------|--------|-------|
| Python + PyTorch First | N/A | Frontend + external AI API, no ML training |
| Spec-First | ✅ PASS | Complete spec.md with 21 requirements |
| JSON Schema | ✅ PASS | nl_phrase field addition with validation |
| Library-First | ✅ PASS | Modular services design |
| Test-Driven | ✅ PASS | TDD approach with 15 pre-implementation tests |
| Ethical | N/A | No dataset creation, using commercial API |

**Overall**: ✅ PASS (4/4 applicable principles met)

---

## Dependencies & Integration Points

### External Services
- OpenAI API (GPT-5 Nano model)
- Gmail SMTP (email notifications)

### Environment Variables Required
```
OPENAI_API_KEY=sk-...
SMTP_HOST=smtp.gmail.com
SMTP_USER=...
SMTP_PASS=...
NOTIFY_EMAIL=joeyfoursheds@gmail.com
PORT=3001
```

### Integration with Existing Wizard
- Hooks into WizardContext state changes
- Observes: genre, mood, energy, texture, instrumentation, vocals, bpm
- Updates: NL Phrase display label (existing UI element)
- Modifies: musical_annotation.schema.json semantic_description

### Output Format Changes
```json
{
  "semantic_description": {
    "genre": {...},
    "mood": [...],
    "energy": [...],
    "texture": [...],
    "vocals": {...},
    "instrumentation": {...},
    "nl_phrase": "Uplifting trance track with lush arrangement featuring sparkling piano" // NEW
  }
}
```

---

## Risk Assessment

### Technical Risks
- **OpenAI API availability**: Mitigated by retry logic + fallback to last valid phrase
- **Rate limit exhaustion**: Mitigated by multi-tier tracking + email alerts
- **Cost overruns**: Mitigated by hard limits ($0.10/$0.50) + notifications
- **Inappropriate content**: Mitigated by profanity filter + validation

### User Experience Risks
- **Perceived slowness**: Mitigated by 750ms debounce + loading indicator
- **Confusing error states**: Mitigated by clear messages + last valid phrase display
- **Email spam**: Mitigated by notifications only on limit breach (infrequent)

### Development Risks
- **Test complexity**: 15 pre-implementation tests, mitigated by clear task descriptions
- **Backend/frontend coordination**: Mitigated by contract tests validating API interface
- **State management bugs**: Mitigated by Zustand + requestId race condition handling

---

## Related Documentation
- Feature specification: [spec.md](./spec.md)
- Implementation plan: [plan.md](./plan.md)
- Technical research: [research.md](./research.md)
- Task breakdown: [tasks.md](./tasks.md)
- Remediation script: [apply-remediation.sh](./apply-remediation.sh)
- Project constitution: [../../.specify/CONSTITUTION.md](../../.specify/CONSTITUTION.md)
