# Implementation Plan: Supabase Integration for Usage Tracking

**Branch**: `009-supabase-integration-use` | **Date**: 2025-10-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-supabase-integration-use/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ COMPLETE: Spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ COMPLETE: TypeScript + React frontend, Supabase for backend
   → Detect Project Type: Web application (wizard frontend)
   → Set Structure Decision: Web application (frontend focus with Supabase MCP integration)
3. Fill the Constitution Check section
   → ✅ COMPLETE: No violations - frontend-focused TypeScript implementation
4. Evaluate Constitution Check section
   → ✅ PASS: No violations, no complexity tracking needed
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → ✅ COMPLETE: Supabase MCP integration patterns researched
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → ✅ COMPLETE: All Phase 1 artifacts generated
7. Re-evaluate Constitution Check section
   → ✅ PASS: Design confirmed, no new violations
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach
   → ✅ COMPLETE: Task generation strategy described
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 9. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Implement silent usage tracking for all Dev Tools buttons in the Audio Protocol Wizard using Supabase. Each button click will record button name, timestamp, input phrase, response phrase, and result JSON to a \`adp_usage\` table after function completion. Failed tracking attempts (750ms timeout) will be silently suppressed to ensure zero user disruption. The feature integrates with the existing TypeScript/React wizard and uses the Supabase JavaScript client library for database operations.

## Technical Context

**Language/Version**: TypeScript 5.2+ (wizard frontend)  
**Primary Dependencies**: React 18.2+, Supabase Client, Express 4.18+ (server.js)  
**Storage**: Supabase PostgreSQL (cloud-hosted)  
**Testing**: Vitest (frontend unit tests), manual integration testing  
**Target Platform**: Web browser (modern evergreen browsers)  
**Project Type**: Web application (frontend focus)  
**Performance Goals**: <750ms for tracking operations, non-blocking UI  
**Constraints**: Silent failures (no user-facing errors), 750ms timeout, track after completion  
**Scale/Scope**: 6 Dev Tools buttons, indefinite data retention, always-on tracking

**User Context**: The Supabase JavaScript client library will be used for database operations. All tracking must occur AFTER the button's primary function completes successfully or with errors.

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Python + PyTorch First**: ✅ PASS - This feature is frontend-focused (TypeScript/React), not ML-related  
**Spec-First Development**: ✅ PASS - spec.md created and clarified before planning  
**JSON Schema Compliance**: ⚠️ DEFERRED - Usage data is internal tracking, not protocol data  
**Library-First Modularity**: ✅ PASS - Tracking utility will be modular and reusable  
**Test-Driven Delivery**: ✅ PASS - Contract tests and integration tests will be written

**Assessment**: No constitutional violations. This is a frontend observability feature that doesn't impact the core ADP protocol or ML stack.

## Project Structure

### Documentation (this feature)
```
specs/009-supabase-integration-use/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   └── supabase-schema.sql
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
wizard/
├── src/
│   ├── components/
│   │   └── WizardLayout.tsx         # Contains all Dev Tools buttons
│   ├── services/
│   │   ├── usageTracking.ts         # New: Usage tracking service
│   │   └── usageDataExtractors.ts   # New: Button-specific data extractors
│   ├── utils/
│   │   └── withTracking.tsx         # New: HOF wrapper for tracking
│   ├── types/
│   │   └── usage.ts                 # New: TypeScript interfaces
│   └── lib/
│       └── supabaseClient.ts        # New: Supabase client config
└── tests/
    ├── contract/
    │   └── supabase-schema.test.ts  # New: Schema validation tests
    ├── integration/
    │   └── usageTracking.*.test.ts  # New: Integration tests
    └── unit/
        └── usageTracking.*.test.ts  # New: Unit tests for tracking

server.js                             # Existing Express server
```

**Structure Decision**: Web application structure. The wizard is a React SPA with an Express backend (server.js). Usage tracking will be implemented as a frontend service that communicates with Supabase directly via the Supabase JavaScript client library.

## Phase 0: Outline & Research

**Research completed and documented in [research.md](./research.md)**

### Key Research Findings:

1. **Supabase Integration**: Use Supabase JavaScript client library directly in frontend
2. **Silent Error Handling**: Promise.race() with 750ms timeout + try/catch with no-op
3. **Concurrent Prevention**: Boolean lock with singleton tracking state
4. **Button Instrumentation**: Higher-order function wrapper pattern
5. **Data Extraction**: Button-specific extraction functions with null fallbacks
6. **Schema Design**: UUID + JSONB for flexible, scalable storage

**Output**: ✅ [research.md](./research.md) - All technical decisions documented

---

## Phase 1: Design & Contracts

**Phase 1 artifacts generated:**

### 1. Data Model ✅

[data-model.md](./data-model.md) - Complete entity definition for `adp_usage` table with:
- 7 fields (id, button_clicked_name, button_clicked_time, input_phrase, response_phrase, result_json, created_at)
- 4 indexes for query performance
- 2 constraints for data quality
- TypeScript interfaces
- Sample records for each button type

### 2. Supabase Schema Contract ✅

[contracts/supabase-schema.sql](./contracts/supabase-schema.sql) - Production-ready SQL DDL:
- Table creation with UUID extension
- Indexes (time, button name, composite, JSONB GIN)
- Constraints (non-empty button name, future time check)
- Row Level Security (RLS) policies
- Comments and sample queries

### 3. Integration Points ✅

Identified 6 button handlers in [WizardLayout.tsx](../../wizard/src/components/WizardLayout.tsx:98):
- Line 626: `handleRandomizeAll` - Randomize All Above
- Line 634: `handleRunModelTest` - Test All Models  
- Line 679: `handleGenerateCasualPhrase` - Generate Random Casual Phrase
- Line 816: `handleTranslatePhrase` - Translate
- Line 758: `handleGenerateStandardizedPhrase` - Generate Random Standardized Phrase
- Line 666: `handleSaveJSON` - Save JSON

### 4. Quickstart Validation ✅

[quickstart.md](./quickstart.md) - 10 manual test scenarios covering:
- Basic tracking (FR-001 to FR-008)
- Silent failures (FR-010, FR-011, FR-012)
- Timeout enforcement (FR-009)
- Concurrent click prevention (FR-015)
- All buttons coverage (FR-013)
- Error state tracking (FR-014)
- Data retention (FR-017)
- No UI for viewing data (FR-016)

### 5. TypeScript Service Interface

```typescript
// wizard/src/services/usageTracking.ts
export interface UsageData {
  buttonName: string;
  inputPhrase?: string | null;
  responsePhrase?: string | null;
  resultJson?: any;
}

export interface UsageTrackingService {
  track(data: UsageData): Promise<void>;
  isTracking(): boolean;
}

export class SupabaseUsageTracker implements UsageTrackingService {
  private tracking = false;
  private supabase: SupabaseClient;
  private readonly TIMEOUT_MS = 750;

  async track(data: UsageData): Promise<void> {
    // Ignore if already tracking
    if (this.tracking) return;

    this.tracking = true;
    try {
      await this.trackWithTimeout(data);
    } catch {
      // Silent failure - no logging, no user notification
    } finally {
      this.tracking = false;
    }
  }

  private async trackWithTimeout(data: UsageData): Promise<void> {
    await Promise.race([
      this.insertToSupabase(data),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), this.TIMEOUT_MS)
      )
    ]);
  }

  isTracking(): boolean {
    return this.tracking;
  }
}
```

### 6. Agent Context Update ✅

Running update script to add Supabase usage tracking to project context:

