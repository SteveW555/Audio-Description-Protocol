# Research: AI-Generated Natural Language Description

**Date**: 2025-09-30
**Feature**: 008-add-a-feature

## 1. OpenAI GPT-5 Nano Integration

**Decision**: Use OpenAI Node.js SDK v4.x with GPT-5 Nano model endpoint

**Rationale**:
- Official SDK provides TypeScript types, automatic retries, timeout handling
- GPT-5 Nano specified in FR-003 for cost-effective, fast phrase generation
- SDK handles token counting via `tiktoken` library for 900-token limit enforcement
- Streaming not needed for short phrase responses

**Alternatives Considered**:
- Direct HTTP requests: Rejected (more error-prone, manual token counting)
- LangChain: Rejected (overkill for single API call use case)
- Azure OpenAI: Rejected (spec specifies GPT-5 Nano, not Azure variant)

**Implementation Notes**:
- Use `openai.chat.completions.create()` with `model: "gpt-5-nano"`
- Prompt template: "Generate a concise 10-30 word natural language description for this music: [structured data]. Focus on mood, energy, instrumentation, and overall character."
- Token counting: `encoding.encode(promptText).length` before API call
- Max tokens response parameter: 50 (ensures <30 words)

## 2. Rate Limiting & Cost Tracking

**Decision**: Multi-tier in-memory rate limiter with sliding window algorithm + persistent daily cost tracking

**Rationale**:
- Sliding window more accurate than fixed window for burst traffic
- In-memory sufficient for single-server deployment (session/minute/hour state)
- Daily cost requires persistence (file-based JSON for simplicity)
- Meets FR-015 (30/min, 1000/hour), FR-016 (max 3 concurrent), FR-017 ($0.10/session, $0.50/day)

**Alternatives Considered**:
- Redis-based: Rejected (adds infrastructure complexity for single-user wizard)
- Token bucket: Rejected (sliding window better matches user expectations)
- Database for all tracking: Rejected (file-based simpler for daily cost)

**Implementation Notes**:
- Minute window: Array of timestamps, filter by `now - 60000ms`
- Hour window: Array of timestamps, filter by `now - 3600000ms`
- Session cost: Accumulate in-memory per sessionId
- Daily cost: Read/write JSON file with date key, reset on date change
- Concurrent requests: Semaphore pattern (counter + promise queue)

## 3. Email Notification System

**Decision**: Nodemailer with Gmail SMTP for limit notifications

**Rationale**:
- Nodemailer is standard Node.js email library (26M+ weekly downloads)
- Gmail SMTP free tier sufficient for low-volume notifications
- Simple configuration via environment variables
- No additional service accounts needed (SendGrid/SES overkill)

**Alternatives Considered**:
- SendGrid API: Rejected (requires account signup, free tier limited)
- AWS SES: Rejected (adds AWS dependency, more complex auth)
- In-app notification only: Rejected (FR-019 requires email to joeyfoursheds@gmail.com)

**Implementation Notes**:
- Config: `SMTP_HOST=smtp.gmail.com`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL=joeyfoursheds@gmail.com`
- Template: Plain text with limit details (type, current value, threshold, sessionId, timestamp)
- Error handling: Log email failures, don't block phrase generation
- Subject: "Audio Protocol Wizard - API Usage Limit Reached"

## 4. Debouncing & Real-time Updates

**Decision**: lodash.debounce in custom hook with Zustand state updates

**Rationale**:
- lodash.debounce battle-tested, handles edge cases (leading/trailing, cancellation)
- Custom hook `useAIPhraseGeneration` encapsulates debouncing + API logic
- Zustand updates trigger re-renders automatically, no manual optimization needed
- 750ms delay (FR-012) balances responsiveness vs API call reduction

**Alternatives Considered**:
- Manual setTimeout: Rejected (error-prone, lodash handles cancellation better)
- RxJS debounceTime: Rejected (adds heavy dependency for single use case)
- Server-side debouncing: Rejected (client-side better UX, immediate feedback)

**Implementation Notes**:
- Hook pattern:
  ```typescript
  const debouncedGenerate = useMemo(
    () => debounce(generatePhrase, 750, { leading: false, trailing: true }),
    []
  );
  ```
- Race condition handling: Include requestId in API call, ignore stale responses
- Cancel debounce on component unmount: `useEffect(() => () => debouncedGenerate.cancel(), [])`

## 5. Error Handling & Retry Logic

**Decision**: Fixed 2-second delay retry with error classification (retryable vs terminal)

**Rationale**:
- Fixed delay simpler than exponential backoff for single retry (FR-011)
- 2 seconds reasonable for transient errors without frustrating user
- Error classification prevents retry loops on permanent failures (4xx errors)
- Circuit breaker unnecessary for single-retry strategy

**Alternatives Considered**:
- Exponential backoff: Rejected (overkill for single retry per FR-011)
- Immediate retry: Rejected (likely to fail again for rate limit/timeout)
- Circuit breaker: Rejected (single retry doesn't warrant circuit breaking)

**Implementation Notes**:
- Retryable errors: 429 (rate limit), 500/502/503 (server errors), network timeout
- Terminal errors: 400 (bad request), 401 (auth), 403 (forbidden)
- Error states in UI:
  - First attempt: Show spinner
  - Retry attempt: Show "Retrying..." message
  - Final failure: Show "AI Phrase Update failed response" (per FR-011)
- Keep last successful phrase on error: Store `previousPhrase` in state

## 6. JSON Schema Extension

**Decision**: Add optional `nl_phrase` field to existing protocol schema with ajv validation

**Rationale**:
- Optional field maintains backward compatibility (existing data still valid)
- ajv is project standard for JSON Schema validation (fast, well-maintained)
- Versioned schema approach avoids breaking changes
- String type with minLength/maxLength constraints enforces FR-014 requirements

**Alternatives Considered**:
- zod: Rejected (ajv already in project, TypeScript types from JSON Schema preferred)
- Joi: Rejected (ajv standard for JSON Schema, better ecosystem)
- Required field: Rejected (breaks backward compatibility, optional per FR-008)

**Implementation Notes**:
- Schema addition:
  ```json
  {
    "nl_phrase": {
      "type": ["string", "null"],
      "minLength": 10,
      "maxLength": 200,
      "description": "AI-generated natural language description"
    }
  }
  ```
- Validation tests: Positive (valid phrase), negative (too short, too long, wrong type), optional (missing field valid)
- Migration: No migration needed (optional field), document in schema changelog

---

**Research Status**: ✅ Complete - All technical decisions documented with rationale
**Ready for Phase 1**: Design & Contracts
