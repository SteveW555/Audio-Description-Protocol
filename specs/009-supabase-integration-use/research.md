# Research: Supabase Integration for Usage Tracking

**Feature**: 009-supabase-integration-use
**Date**: 2025-10-02
**Status**: Complete

## Research Questions

### 1. Supabase MCP Integration vs. Direct Client

**Question**: Should we use the Supabase MCP server or the direct Supabase JavaScript client library?

**Decision**: Use Supabase JavaScript client library in the frontend

**Rationale**:
- MCP servers are designed for AI agent interactions and backend orchestration
- Direct client library provides better TypeScript integration and autocomplet
- Frontend can establish authenticated connections directly to Supabase
- Better error handling and retry mechanisms built into the official client
- MCP server adds unnecessary complexity for simple CRUD operations

**Alternatives Considered**:
1. **Supabase MCP Server** - Would require additional server-side proxy logic, adds latency
2. **Custom API endpoint** - Over-engineered for simple tracking needs
3. **Direct PostgreSQL client** - Bypasses Supabase's security and authentication features

**Implementation Path**: Install `@supabase/supabase-js` and configure with environment variables

---

### 2. Silent Error Handling Pattern

**Question**: How do we ensure tracking errors never disrupt the user experience?

**Decision**: Promise.race() with 750ms timeout + try/catch with no-op error handler

**Rationale**:
- `Promise.race([trackingPromise, timeoutPromise])` ensures 750ms hard limit
- Wrapping in try/catch with empty catch block ensures silent failures
- No logging, no user notifications, no state updates on failure
- Fire-and-forget pattern allows button function to complete independently

**Alternatives Considered**:
1. **Simple fire-and-forget async** - No timeout control, could hang indefinitely
2. **AbortController** - More complex,doesn't guarantee silent completion
3. **Background worker** - Over-engineered for this use case

**Code Pattern**:
```typescript
const trackWithTimeout = async (data: UsageData) => {
  try {
    await Promise.race([
      trackToSupabase(data),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 750)
      )
    ]);
  } catch {
    // Silent failure - do nothing
  }
};
```

---

### 3. Concurrent Tracking Prevention

**Question**: How do we prevent multiple tracking operations from running simultaneously?

**Decision**: Singleton tracking state with boolean lock

**Rationale**:
- Simple boolean flag `isTracking` prevents concurrent operations
- Checks flag before initiating tracking, ignores request if already tracking
- Resets flag after completion or timeout
- No queuing needed (concurrent clicks are explicitly ignored per spec)
- Thread-safe in JavaScript's single-threaded event loop

**Alternatives Considered**:
1. **Queue-based approach** - Over-engineered, violates "ignore subsequent clicks" requirement
2. **Debouncing** - Would delay tracking, doesn't match "after completion" requirement
3. **Global mutex** - Unnecessary complexity for single-threaded JS environment

**Implementation**:
```typescript
class UsageTracker {
  private isTracking = false;

  async track(data: UsageData) {
    if (this.isTracking) return; // Ignore concurrent requests

    this.isTracking = true;
    try {
      await this.trackWithTimeout(data);
    } finally {
      this.isTracking = false;
    }
  }
}
```

---

### 4. Button Instrumentation Approach

**Question**: How do we instrument all 6 Dev Tools buttons without duplicating tracking logic?

**Decision**: Higher-order function wrapper for button handlers

**Rationale**:
- Centralized tracking logic in single location
- Each button handler wrapped with `withTracking(handler, buttonName)`
- Original handler executes first, tracking happens after
- Captures input/output from handler execution context
- Easy to test and maintain

**Alternatives Considered**:
1. **Manual tracking calls in each handler** - Repetitive, error-prone, hard to maintain
2. **Proxy pattern** - Over-engineered for simple callback wrapping
3. **Decorator pattern** - Not idiomatic in React/TypeScript for this use case

**Implementation Pattern**:
```typescript
const withTracking = (
  handler: ButtonHandler,
  buttonName: string
) => async (...args: any[]) => {
  let result;
  let error;

  try {
    result = await handler(...args);
  } catch (e) {
    error = e;
    throw e; // Re-throw to preserve original behavior
  } finally {
    // Track after completion (success or failure)
    usageTracker.track({
      buttonName,
      inputPhrase: extractInput(args),
      responsePh rase: extractResponse(result),
      resultJson: result || error
    });
  }

  return result;
};
```

---

### 5. Data Extraction from Button Contexts

**Question**: How do we extract input_phrase, response_phrase, and result_json from different button types?

**Decision**: Button-specific extraction functions with fallback to null

**Rationale**:
- Each button has different data structures (casual phrase, translation, model test, etc.)
- Create mapping of button names to extraction functions
- Return null for fields that don't apply to specific buttons
- Satisfies FR-014 requirement to handle empty/null values

**Button Data Mapping**:
- **Randomize All Above**: No input/response phrases, result is wizard data snapshot
- **Test All Models**: No phrases, result is model test results JSON
- **Generate Random Casual Phrase**: No input, response is generated casual phrase, result is API response
- **Translate**: Input is casual phrase, response is standardized phrase, result is translation data
- **Generate Random Standardized Phrase**: No input, response is generated standardized phrase, result is wizard data
- **Save JSON**: No phrases, result is saved JSON structure

**Implementation**:
```typescript
const extractors: Record<string, DataExtractor> = {
  'randomize-all': () => ({
    inputPhrase: null,
    responsePh rase: null,
    resultJson: wizardData
  }),
  'translate-phrase': (input, output) => ({
    inputPhrase: input,
    responsePh rase: output.standardizedPhrase,
    resultJson: output
  }),
  // ... etc
};
```

---

### 6. Supabase Table Schema Design

**Question**: What indexes and constraints should the adp_usage table have?

**Decision**: UUID primary key, timestamp index, button name index, JSONB for flexible result storage

**Rationale**:
- UUID prevents ID collision in distributed scenarios
- Timestamp index supports time-range queries for analytics
- Button name index enables filtering/grouping by button type
- JSONB allows flexible schema for different button result types
- NOT NULL on core fields (button name, timestamp) ensures data quality

**Schema Decisions**:
- Use `TIMESTAMP WITH TIME ZONE` for accurate global tracking
- TEXT type for phrases (unlimited length, handles special characters)
- JSONB type for result_json (queryable, compact storage)
- Auto-generated `created_at` for audit trail
- No foreign keys (independent tracking table)

---

## Summary of Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Integration Method | Supabase JS Client | Better TypeScript support, simpler architecture |
| Error Handling | Promise.race + try/catch | Guaranteed 750ms timeout, silent failures |
| Concurrency Control | Boolean lock | Simple, effective, matches spec requirement |
| Instrumentation | HOF wrapper | Centralized logic, easy maintenance |
| Data Extraction | Button-specific extractors | Flexible, handles varying data structures |
| Schema Design | UUID + JSONB | Scalable, flexible, optimized for queries |

## Next Steps

Proceed to Phase 1: Design & Contracts with these research findings incorporated.
