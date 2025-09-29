# Quickstart: Wizard-Python Validation Integration

**Feature**: 003-integrate-wizard-interface
**Date**: 2025-09-29

## Quick Test Scenarios

This guide provides step-by-step validation of the core integration functionality.

### Scenario 1: Real-time Field Validation

**Test**: Field-level validation triggers on wizard field changes

**Setup**:
1. Start Python validation API server
2. Open wizard interface in browser
3. Begin creating new audio description protocol

**Steps**:
1. Enter title field: "Test Audio"
2. Move focus to next field (blur event)
3. **Expect**: Green checkmark appears next to title field
4. Clear title field completely
5. Move focus to next field
6. **Expect**: Red X with error message "Title is required and must be 1-200 characters"

**Validation**: Field validation occurs within 500ms of blur event

### Scenario 2: Schema-Specific Validation

**Test**: Different validation rules for different ADP schema types

**Setup**:
1. Validation API running with all ADP schemas loaded
2. Wizard interface with schema selection capability

**Steps**:
1. Select "Core Audio Description" schema
2. Fill required core fields (title, duration)
3. **Expect**: Basic validation passes
4. Switch to "Musical Analysis" schema
5. **Expect**: Additional musical fields become required
6. Fill musical analysis fields incorrectly
7. **Expect**: Schema-specific error messages appear

**Validation**: Correct schema rules applied based on selection

### Scenario 3: Offline Validation Fallback

**Test**: Wizard continues working when validation service unavailable

**Setup**:
1. Wizard interface loaded and functional
2. Validation API initially running

**Steps**:
1. Start creating protocol with real-time validation working
2. Stop validation API server (simulate service outage)
3. Continue editing protocol fields
4. **Expect**: Offline indicator appears, but editing continues
5. **Expect**: Protocol data saved locally
6. Restart validation API
7. **Expect**: Queued validation requests process automatically

**Validation**: No loss of user work during service interruption

### Scenario 4: Session Persistence

**Test**: Validation rules remain consistent within session

**Setup**:
1. Validation API with v1.2.0 schema rules
2. Active wizard session

**Steps**:
1. Start protocol creation (session locks to v1.2.0 rules)
2. Update validation API to v1.3.0 (simulate rule change)
3. Continue editing same protocol
4. **Expect**: Validation still uses v1.2.0 rules
5. Start new wizard session
6. **Expect**: New session uses v1.3.0 rules

**Validation**: Session-scoped rule versioning prevents mid-session changes

### Scenario 5: Comprehensive Validation Report

**Test**: Final validation provides complete protocol assessment

**Setup**:
1. Completed protocol with mix of valid and invalid fields
2. All ADP schemas available

**Steps**:
1. Click "Validate Complete Protocol" button
2. **Expect**: Comprehensive validation report appears
3. **Expect**: Pass/fail status for each field clearly shown
4. **Expect**: Brief error messages (1-2 sentences) for failures
5. **Expect**: Suggested fixes provided for common errors

**Validation**: Complete protocol validation covers all requirements

## Integration Test Checklist

- [ ] FastAPI validation service starts without errors
- [ ] Wizard loads and connects to validation API
- [ ] Field-level validation triggers on blur events
- [ ] All ADP schema types validate correctly
- [ ] Error messages are brief and actionable
- [ ] Offline mode preserves user work
- [ ] Session persistence maintains rule versions
- [ ] Performance meets <500ms response time target
- [ ] TypeScript client properly handles API responses
- [ ] CORS configuration allows wizard-API communication

## Performance Benchmarks

- **Field validation response**: <500ms average
- **Full protocol validation**: <2 seconds for complex protocols
- **Schema loading**: <100ms cached, <1 second fresh load
- **Session creation**: <200ms
- **Offline detection**: <5 seconds after service interruption

## Error Recovery Scenarios

### API Service Restart
1. Service goes down during active session
2. User continues working (offline mode)
3. Service restarts with same schema version
4. Session reconnects automatically
5. Queued validations process

### Schema Update During Session
1. User has active session with v1.2.0 rules
2. Schema updates to v1.3.0 on server
3. Current session continues with v1.2.0
4. New sessions use v1.3.0
5. No disruption to active users

### Malformed Protocol Data
1. Wizard sends invalid JSON to API
2. API returns 400 with specific error details
3. Wizard displays user-friendly error message
4. User can correct and retry validation

## Success Criteria

✅ **Real-time validation**: Field validation on blur events
✅ **Schema compliance**: All ADP schemas + taxonomy supported
✅ **Offline capability**: Continues without validation service
✅ **Session persistence**: Rules locked per session
✅ **Brief error messages**: 1-2 sentences with actionable guidance
✅ **Performance targets**: <500ms validation response time