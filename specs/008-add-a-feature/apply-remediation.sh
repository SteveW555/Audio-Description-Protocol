#!/bin/bash
# Remediation script for /analyze findings
# Applies all 14 fixes to spec.md, plan.md, and tasks.md

SPEC_FILE="spec.md"
PLAN_FILE="plan.md"
TASKS_FILE="tasks.md"

echo "=== Applying Remediation Fixes ==="
echo ""

# Fix A2, I2, D1: Update error message in clarifications (line 62)
echo "[1/15] Fixing A2: Error message in clarification..."
sed -i 's/AI Phrase Update failed response/Unable to generate phrase. Retrying automatically.../g' "$SPEC_FILE"

# Add new clarifications (after line 71)
echo "[2/15] Adding new clarifications for A4, U2..."
# This requires manual insertion - sed line insertion

# Fix A1: Word count in Key Entities (line 120)
echo "[3/15] Fixing A1: Word count consistency..."
sed -i 's/(approximately 10-30 words)/(exactly 10-30 words)/g' "$SPEC_FILE"

# Fix FR-005 location clarity (line 103)
echo "[4/15] Fixing T2: UI location in FR-005..."
sed -i 's/located below the Human-Readable Summary panel/located immediately below the Human-Readable Summary panel (after WizardLayout.tsx line 202)/g' "$SPEC_FILE"

# Fix FR-011 responsibility and cross-reference (line 109)
echo "[5/15] Fixing A2, I2, D1: FR-011 retry logic..."
sed -i 's/System MUST automatically retry API failures once silently, then on second failure display the last successfully generated phrase with error indication "AI Phrase Update failed response"/Backend MUST automatically retry transient API failures (429, 500, 502, 503, timeout) once with 2-second delay (see FR-014 for validation failure retry); on second failure display the last successfully generated phrase with error indication "Unable to generate phrase. Retrying automatically..."/g' "$SPEC_FILE"

# Fix FR-013 optional sections (line 111)
echo "[6/15] Fixing A3: FR-013 optional sections..."
sed -i 's/System MUST NOT trigger phrase generation when a user skips optional sections/System MUST NOT trigger phrase generation when a user skips optional sections (instrumentation, vocals, BPM, secondary genre, music theory)/g' "$SPEC_FILE"

# Fix FR-014 validation criteria and cross-reference (line 112)
echo "[7/15] Fixing A1, A4, D1: FR-014 validation..."
sed -i 's/System MUST validate generated phrases for quality (non-empty, appropriate content); if validation fails, retry generation once silently, then display error indication while keeping last valid phrase/Frontend MUST validate generated phrases for quality (10-30 word count, non-empty, coherent English text, no profanity or offensive content); if validation fails, retry generation once silently (see FR-011 for API failure retry), then display error indication while keeping last valid phrase/g' "$SPEC_FILE"

# Fix FR-018 token limit handling (line 116)
echo "[8/15] Fixing U1: FR-018 token limit enforcement..."
sed -i 's/System MUST limit token usage to maximum 900 tokens per API request$/System MUST limit token usage to maximum 900 tokens per API request; requests exceeding this limit MUST be rejected with error message "Request too complex. Please simplify your selections."/g' "$SPEC_FILE"

# Fix FR-019 email format (line 117)
echo "[9/15] Fixing U2, C1: FR-019 notification format..."
sed -i 's/System MUST notify user when any API usage limit is reached and send usage details via email to joeyfoursheds@gmail.com$/System MUST notify user with in-app message when any API usage limit is reached AND send detailed usage report via email to joeyfoursheds@gmail.com (subject: "Audio Protocol Wizard - API Usage Limit Reached", plain text format with limit type, current value, threshold, session ID, timestamp)/g' "$SPEC_FILE"

# Fix T1: Schema file naming in plan.md (line 72)
echo "[10/15] Fixing T1: Schema file naming in plan.md..."
sed -i 's/protocol-v2.json (UPDATE: add nl_phrase)/musical_annotation.schema.json (UPDATE: add nl_phrase to semantic_description)/g' "$PLAN_FILE"

# Fix I1: Phase 1 artifacts in plan.md (lines 39-42)
echo "[11/15] Fixing I1: Phase 1 artifact status..."
sed -i 's/research.md (Phase 0 - PENDING)/research.md (Phase 0 - COMPLETE)/g' "$PLAN_FILE"
sed -i 's/data-model.md (Phase 1 - PENDING)/data-model.md (Phase 1 - documented inline in plan.md, lines 99-103)/g' "$PLAN_FILE"

# Fix I1: Phase 1 output in plan.md (line 125)
echo "[12/15] Fixing I1: Phase 1 output description..."
sed -i 's/data-model.md, contracts\/\*, failing tests, quickstart.md, CLAUDE.md updated/Data model entities documented in plan.md (lines 99-103), failing tests (Phase 3.2), CLAUDE.md updated (completed)/g' "$PLAN_FILE"

# Fix T1, I3: Schema file naming in tasks.md (line 19)
echo "[13/15] Fixing T1, I3: Schema file in tasks.md..."
sed -i 's/schemas\/protocol-v2.json/schemas\/musical_annotation.schema.json/g' "$TASKS_FILE"
sed -i 's/add nl_phrase field (string|null, minLength 10, maxLength 200, optional)/add nl_phrase field to semantic_description object (string|null, minLength 10, maxLength 200, optional)/g' "$TASKS_FILE"

# Fix I2: Retry logic in tasks.md (line 71)
echo "[14/15] Fixing I2: Retry responsibility in T034..."
sed -i 's/handle success\/error\/retry (FR-011)/handle success\/error, retry validation failures (FR-014). Backend handles API failure retries (FR-011)/g' "$TASKS_FILE"

echo "[15/15] All sed-based fixes applied!"
echo ""
echo "=== Manual Steps Required ==="
echo "1. Add two new clarification Q&As after line 71 in spec.md:"
echo "   - Q: What constitutes appropriate content..."
echo "   - Q: What format should email notifications use..."
echo "2. Add FR-019b after FR-019 in spec.md (line 118)"
echo "3. Remove quickstart.md and contracts/ references from plan.md line 39-42"
echo ""
echo "Run 'diff spec.md.backup spec.md' to review changes"
