# Implementation Plan: AI-Generated Natural Language Description

**Branch**: `008-add-a-feature` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)

## Summary

Add real-time AI-generated natural language descriptions to wizard. GPT-5 Nano generates 10-30 word phrases from wizard selections (genre, mood, energy, texture, instrumentation, vocals, BPM). 750ms debouncing, rate limiting (30/min, 1000/hour), cost tracking ($0.10/session, $0.50/day), retry logic, quality validation.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+
**Primary Dependencies**: React 18, Zustand, OpenAI API, Vite
**Storage**: Session storage, JSON file output
**Testing**: Vitest, Jest, contract tests
**Target Platform**: Web browsers, Node.js backend
**Project Type**: Web (frontend wizard + backend AI service)
**Performance Goals**: <750ms latency (p95), 30 phrases/minute
**Constraints**: 750ms debounce, max 3 concurrent, 900 tokens/request, $0.10/session, $0.50/day, 30/min, 1000/hour rate limits
**Scale/Scope**: Single-user sessions, 10-15 steps, ~5-10 generations/workflow

## Constitution Check

✓ **Python + PyTorch First**: N/A (frontend + external AI API)
✓ **Spec-First**: PASS (spec.md with 11 clarifications)
✓ **JSON Schema**: PASS (FR-008 adds nl_phrase field with validation)
✓ **Library-First**: PASS (modular services design)
✓ **Test-Driven**: PASS (TDD approach with contract/unit/integration tests)
✓ **Ethical**: N/A (no dataset creation)

**Result**: ✅ PASS

## Project Structure

### Documentation
```
specs/008-add-a-feature/
├── spec.md (complete)
├── plan.md (this file)
├── research.md (Phase 0 - COMPLETE)
├── data-model.md (Phase 1 - documented inline in plan.md, lines 99-103)
├── quickstart.md (Phase 1 - PENDING)
└── contracts/ (Phase 1 - PENDING)
```

### Source Code
```
wizard/src/
├── components/
│   ├── WizardLayout.tsx (UPDATE)
│   └── NLPhraseDisplay.tsx (NEW)
├── hooks/
│   └── useAIPhraseGeneration.ts (NEW)
├── services/
│   ├── aiPhraseGenerator.ts (NEW)
│   ├── apiRateLimiter.ts (NEW)
│   ├── phraseValidator.ts (NEW)
│   └── emailNotifier.ts (NEW)
├── context/
│   └── WizardContext.ts (UPDATE)
└── types/
    └── wizard.ts (UPDATE)

backend/src/ (NEW)
├── services/
│   ├── openai-client.ts
│   ├── rate-limiter.ts
│   └── cost-tracker.ts
└── routes/
    └── generate-phrase.ts

schemas/
└── musical_annotation.schema.json (UPDATE: add nl_phrase to semantic_description)

tests/
├── contract/
│   └── aiServiceContract.test.ts (NEW, FAILING)
├── unit/ (NEW services)
└── integration/ (NEW user stories)
```

**Structure**: Web application with frontend (wizard/) + backend (backend/) for secure AI API management, credential protection, rate limiting, cost tracking, email notifications.

## Phase 0: Research

1. **OpenAI GPT-5 Nano**: API endpoint, auth, token counting, prompt engineering
2. **Rate Limiting**: Multi-tier (min/hour/session/day), in-memory vs persistent
3. **Email Notifications**: Library choice (nodemailer/sendgrid/SES), templates
4. **Debouncing**: React patterns with Zustand, race condition handling
5. **Error/Retry**: Exponential backoff vs fixed, error classification, circuit breaker
6. **Schema Extension**: Versioned updates, backward compatibility, validation libs

**Output**: research.md with decisions, rationale, alternatives for each

## Phase 1: Design & Contracts

### Data Model (data-model.md)

**Entities**:
- NLPhraseState (frontend): currentPhrase, previousPhrase, isGenerating, error, timestamp
- AIGenerationRequest: wizardData (excl key/scale/chords), sessionId, requestId
- AIGenerationResponse: phrase, confidence, tokensUsed, costUSD, requestId, timestamp
- RateLimitState (backend): minuteCount, hourCount, sessionCost, dailyCost, concurrentRequests, resets
- ValidationResult: isValid, errors, wordCount, hasInappropriateContent

**State Transitions**: IDLE → DEBOUNCING → VALIDATING_DATA → GENERATING → SUCCESS/ERROR/RETRYING

### API Contracts (contracts/)
- POST /api/generate-phrase (OpenAPI 3.0)
- Protocol schema update (nl_phrase field)

### Contract Tests
- aiServiceContract.test.ts (FAILING)
- nl-phrase-validation.test.ts (FAILING)

### Integration Tests (quickstart.md)
- Scenario 1: Complete wizard flow
- Scenario 2: Partial data
- Scenario 3: API failure + retry
- Scenario 4: Rate limit
- Scenario 5: Navigation backwards

### Update CLAUDE.md
Run: `.specify/scripts/bash/update-agent-context.sh claude`

**Output**: Data model entities documented in plan.md (lines 99-103), failing tests (Phase 3.2), CLAUDE.md updated (completed)

## Phase 2: Task Planning Approach

**Strategy**: Generate 30-35 tasks from Phase 1 artifacts
- Contract tests (API, schema)
- Unit tests (services: phrase gen, rate limit, validator)
- Integration tests (user stories)
- Implementation (TDD: tests → code)

**Ordering**: TDD (tests first) → Dependency (backend → frontend → UI) → Parallel [P] for independent tasks

**Categories**: Setup (3), Schema (2), Backend (8), Frontend (6), UI (4), Testing (5), Validation (2)

**IMPORTANT**: Executed by /tasks command, NOT /plan

## Phase 3+: Future

**Phase 3**: /tasks creates tasks.md
**Phase 4**: Execute tasks.md
**Phase 5**: Validation (tests, quickstart, performance)

## Complexity Tracking

**No violations** - All constitutional principles satisfied.

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research complete (research.md created)
- [x] Phase 1: Design complete (data-model outlined in plan)
- [x] Phase 2: Task planning approach (DESCRIBED)
- [ ] Phase 3: /tasks (READY TO EXECUTE)
- [ ] Phase 4: Implementation
- [ ] Phase 5: Validation

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS (no new violations)
- [x] All NEEDS CLARIFICATION resolved (11 in spec)
- [x] Complexity deviations: None

**READY FOR /tasks COMMAND**

---
*Constitution v1.0.0 - See `.specify/memory/constitution.md`*
