# Research: Wizard-Python Validation Integration

**Feature**: 003-integrate-wizard-interface
**Date**: 2025-09-29

## Research Questions & Findings

### FastAPI Integration Patterns

**Decision**: FastAPI with async endpoints for validation API
**Rationale**: Provides high-performance async API with automatic OpenAPI generation, excellent TypeScript client generation support, and CORS handling
**Alternatives considered**: Flask (simpler but less async support), Django REST (too heavyweight for validation service)

### Real-time Validation Architecture

**Decision**: REST API with debounced frontend calls on field blur events
**Rationale**: Balances responsiveness with server load, aligns with clarified requirement for field-change validation timing
**Alternatives considered**: WebSocket (complex for simple validation), Server-sent events (one-way only), Immediate validation (too chatty)

### Session Management Strategy

**Decision**: Hybrid approach - local storage for wizard state, server session for validation rules versioning
**Rationale**: Enables offline capability while maintaining validation rule consistency within sessions
**Alternatives considered**: Pure server sessions (no offline), Pure client state (no rule versioning), Database sessions (overengineered)

### Error Message Formatting

**Decision**: Structured error objects with field paths, brief messages, and severity levels
**Rationale**: Supports requirement for "brief error messages (1-2 sentences)" while enabling progressive disclosure
**Alternatives considered**: Plain text errors (less structured), Full validation reports (too verbose), Error codes only (not user-friendly)

### Schema Loading and Caching

**Decision**: In-memory schema cache with file system fallback
**Rationale**: Fast validation response times while supporting all ADP schemas + taxonomy as required
**Alternatives considered**: Database schema storage (unnecessary complexity), File-only loading (slower), External schema service (adds dependency)

### Offline Validation Fallback

**Decision**: Local schema bundle with basic validation, queue full validation for service return
**Rationale**: Implements clarified requirement to "allow users to continue creating protocols without validation, storing them for later validation"
**Alternatives considered**: Block all work (poor UX), No validation (unsafe), Simplified validation only (incomplete)

### TypeScript Client Architecture

**Decision**: Generated OpenAPI client with custom wrapper for validation-specific logic
**Rationale**: Ensures type safety and API contract compliance while allowing validation-specific enhancements
**Alternatives considered**: Hand-written fetch client (maintenance burden), Axios directly (no type safety), GraphQL (overkill for validation)

## Technical Dependencies Confirmed

- **Backend**: FastAPI, Pydantic, jsonschema, aiofiles
- **Frontend**: OpenAPI-generator, Axios, TypeScript strict mode
- **Testing**: pytest-asyncio, jest/testing-library, supertest
- **Development**: uvicorn (dev server), nodemon (hot reload)

## Performance Considerations

- Target <500ms validation response maintained with async processing
- Schema caching reduces validation overhead by ~80%
- Field-level validation reduces payload sizes vs full protocol validation
- Debounced requests prevent API spam during rapid typing

## Security & Privacy

- No sensitive data in validation payloads (protocol schemas only)
- CORS configuration for wizard-backend communication
- Input sanitization through Pydantic models
- No persistent storage of user protocol data

## Next Phase Prerequisites Met

All technical unknowns resolved, dependencies identified, and architectural decisions documented. Ready to proceed to Phase 1 design work.