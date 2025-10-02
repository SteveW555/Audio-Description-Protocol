# Quickstart: Supabase Usage Tracking Validation

**Feature**: 009-supabase-integration-use
**Date**: 2025-10-02

## Purpose

This quickstart provides manual validation scenarios to verify the Supabase usage tracking implementation meets all functional requirements from [spec.md](./spec.md).

## Prerequisites

1. Supabase project created with `adp_usage` table deployed
2. Audio Protocol Wizard running locally (`npm run dev`)
3. Supabase environment variables configured:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Access to Supabase dashboard for querying `adp_usage` table

## Validation Scenarios

### Scenario 1: Basic Tracking - Randomize All Button

**Objective**: Verify basic tracking functionality for button with no input/response phrases

**Steps**:
1. Navigate to wizard Dev Tools section
2. Click "Randomize All Above" button
3. Wait for button function to complete (wizard fields populate)
4. Query Supabase: `SELECT * FROM adp_usage ORDER BY created_at DESC LIMIT 1;`

**Expected Results**:
- ✅ New record exists with `button_clicked_name = 'randomize-all'`
- ✅ `button_clicked_time` is within last 60 seconds
- ✅ `input_phrase` is NULL
- ✅ `response_phrase` is NULL
- ✅ `result_json` contains wizard data snapshot (genre, mood, instruments, etc.)
- ✅ No error messages displayed to user
- ✅ Button completed normally (wizard populated with random data)

**FR Coverage**: FR-001, FR-002, FR-003, FR-007, FR-008, FR-010, FR-011, FR-014

---

### Scenario 2: Phrase Translation Tracking

**Objective**: Verify tracking captures input and response phrases

**Steps**:
1. In Dev Tools, enter "chill vibes with smooth piano" in Phrase Translation input
2. Click "Translate" button
3. Wait for translation to complete
4. Query Supabase: `SELECT * FROM adp_usage WHERE button_clicked_name = 'translate-phrase' ORDER BY created_at DESC LIMIT 1;`

**Expected Results**:
- ✅ New record with `button_clicked_name = 'translate-phrase'`
- ✅ `input_phrase = 'chill vibes with smooth piano'`
- ✅ `response_phrase` contains standardized vocabulary translation
- ✅ `result_json` contains extracted terms and translation metadata
- ✅ Wizard fields populated with translated terms
- ✅ No tracking errors visible to user

**FR Coverage**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008

---

### Scenario 3: Silent Failure - Simulated Network Error

**Objective**: Verify tracking failures are silently suppressed

**Steps**:
1. Open browser DevTools → Network tab
2. Set network to "Offline" mode (or block Supabase domain)
3. Click "Generate Random Casual Phrase" button
4. Observe behavior

**Expected Results**:
- ✅ No error messages displayed to user
- ✅ No console errors logged
- ✅ Button function completes normally (casual phrase generated and displayed)
- ✅ User experience completely unaffected
- ✅ No record created in Supabase (verify with query after re-enabling network)

**FR Coverage**: FR-010, FR-011, FR-012

---

### Scenario 4: 750ms Timeout Enforcement

**Objective**: Verify tracking times out after 750ms

**Steps**:
1. Throttle network to "Slow 3G" in browser DevTools
2. Click "Test All Models" button
3. Observe timing (may need to check browser Performance tab or add temporary console.time logs)

**Expected Results**:
- ✅ Tracking attempt completes or times out within 750ms
- ✅ Button function not delayed (model test runs normally)
- ✅ No user-facing impact regardless of tracking success/failure

**FR Coverage**: FR-009, FR-010, FR-011

---

### Scenario 5: Concurrent Click Prevention

**Objective**: Verify subsequent clicks ignored while tracking in progress

**Steps**:
1. Set network to "Slow 3G" to slow down tracking
2. Rapidly click "Generate Random Standardized Phrase" button 5 times in quick succession
3. Wait for completion
4. Query Supabase: `SELECT COUNT(*) FROM adp_usage WHERE button_clicked_name = 'generate-standardized-phrase' AND button_clicked_time > NOW() - INTERVAL '1 minute';`

**Expected Results**:
- ✅ Only 1 record created (first click tracked, subsequent clicks ignored)
- ✅ User sees only 1 phrase generated (from first click)
- ✅ No duplicate tracking entries

**FR Coverage**: FR-015

---

### Scenario 6: All Buttons Tracked

**Objective**: Verify all 6 Dev Tools buttons have tracking enabled

**Steps**:
1. Click each button once:
   - Randomize All Above
   - Test All Models
   - Generate Random Casual Phrase
   - Translate (with input phrase)
   - Generate Random Standardized Phrase
   - Save JSON (after randomizing data)
2. Query Supabase: `SELECT button_clicked_name, COUNT(*) FROM adp_usage WHERE button_clicked_time > NOW() - INTERVAL '5 minutes' GROUP BY button_clicked_name;`

**Expected Results**:
- ✅ 6 records total (one for each button)
- ✅ All button names present:
  - `randomize-all`
  - `test-all-models`
  - `generate-casual-phrase`
  - `translate-phrase`
  - `generate-standardized-phrase`
  - `save-json`

**FR Coverage**: FR-001, FR-002, FR-013

---

### Scenario 7: Error State Tracking

**Objective**: Verify tracking occurs even when button function fails

**Steps**:
1. Modify Translate input to trigger API error (e.g., extremely long input >10000 chars)
2. Click "Translate" button
3. Observe error handling
4. Query Supabase for latest translate-phrase record

**Expected Results**:
- ✅ Record created with input phrase
- ✅ `response_phrase` is NULL or contains error message
- ✅ `result_json` captures error state
- ✅ User sees error from button function (not from tracking)

**FR Coverage**: FR-001, FR-008, FR-014

---

### Scenario 8: Special Characters and Long Text

**Objective**: Verify handling of edge case input data

**Steps**:
1. Enter phrase with special characters: `"Groovy 🎸 vibes with ♪ symbols & émojis!"`
2. Click "Translate"
3. Query Supabase for record

**Expected Results**:
- ✅ `input_phrase` correctly stores special characters and emojis
- ✅ No encoding errors
- ✅ Data retrieved correctly from database

**FR Coverage**: FR-004, FR-005, FR-014

---

### Scenario 9: Data Retention

**Objective**: Verify records are retained indefinitely

**Steps**:
1. Create test record (click any button)
2. Wait 24+ hours (or query old test data)
3. Query Supabase for old records

**Expected Results**:
- ✅ Old records still present (not auto-deleted)
- ✅ All fields intact

**FR Coverage**: FR-017

---

### Scenario 10: No UI for Viewing Data

**Objective**: Verify no user-facing UI for viewing tracking data

**Steps**:
1. Navigate through entire wizard interface
2. Check Dev Tools section
3. Inspect all UI elements

**Expected Results**:
- ✅ No tables, lists, or views displaying usage data
- ✅ No buttons for "View Usage" or similar
- ✅ Data only accessible via Supabase dashboard (backend/admin)

**FR Coverage**: FR-016

---

## Success Criteria

All 10 scenarios must pass for the implementation to be considered complete.

## Troubleshooting

### No Records Created
- Check Supabase environment variables are set correctly
- Verify Supabase project URL and anon key
- Check browser console for network errors (temporarily remove silent failure to debug)
- Verify `adp_usage` table exists with correct schema

### Records Missing Fields
- Check button-specific data extractors are implemented correctly
- Verify NULL handling for optional fields

### Tracking Delays UI
- Verify tracking is async and fire-and-forget
- Check 750ms timeout is implemented
- Ensure tracking happens AFTER button function, not before/during

## Post-Validation

After all scenarios pass:
1. Document any issues encountered
2. Update implementation if needed
3. Proceed to Phase 5: Production deployment
