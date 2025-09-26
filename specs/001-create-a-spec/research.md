# Research: Audio Description Protocol (ADP) Framework

**Phase 0 Research Output**
**Date**: 2025-09-26

## Research Areas

### JSON Schema Standards and Best Practices

**Decision**: Use JSON Schema Draft 2020-12 with jsonschema Python library
**Rationale**:
- Latest stable JSON Schema standard with comprehensive validation features
- jsonschema library provides Draft 2020-12 support with Python 3.11+
- Supports versioning, references, and complex validation rules needed for ADP
- Wide ecosystem support for tooling and validation

**Alternatives Considered**:
- Pydantic models: Rejected due to constitutional requirement for JSON Schema compliance
- Cerberus: Rejected due to less comprehensive schema features
- Custom validation: Rejected due to reinventing standards

### Audio File Reference Standards

**Decision**: Support both absolute file paths and HTTP/HTTPS URLs
**Rationale**:
- File paths enable local development and offline workflows
- URLs enable web-based and cloud storage scenarios
- Both are simple, widely supported reference methods
- Avoids complexity of content-addressable storage for v1

**Alternatives Considered**:
- Content hashes (SHA256): Deferred to future versions due to complexity
- Streaming URLs: Covered by HTTP/HTTPS URL support
- Relative paths: Rejected due to portability issues

### Hierarchical Label Relationships

**Decision**: Use parent_id reference pattern in dictionary entries
**Rationale**:
- Simple to implement and understand
- Supports arbitrary depth hierarchies
- JSON-native approach avoiding complex nested structures
- Enables efficient validation and queries

**Alternatives Considered**:
- Nested JSON objects: Rejected due to complexity and difficulty querying
- Separate hierarchy schema: Rejected due to added complexity for v1
- Tag-based grouping: Rejected as insufficient for true hierarchical relationships

### Musical Analysis Protocol Design

**Decision**: Extend core annotation schema with musical_analysis object structure
**Rationale**:
- Maintains backward compatibility with simple annotations
- Provides rich musical analysis capabilities for specialized use cases
- Modular design allows optional musical analysis without breaking core functionality
- Structured approach to music theory, semantic description, and instrumentation
- Protocol versioning enables future enhancements to musical analysis features

**Alternatives Considered**:
- Separate musical annotation entity: Rejected due to duplication of core annotation fields
- Flat schema with musical fields at root: Rejected due to schema complexity and unclear separation
- Plugin-based analysis: Deferred to future versions due to implementation complexity

### Music Theory Validation Standards

**Decision**: Use standard chord symbol notation (root:quality format) and realistic BPM ranges
**Rationale**:
- Industry-standard chord symbol notation (e.g., "F#:min", "D:maj") is widely recognized
- BPM range validation (40-300) covers realistic musical tempo ranges
- Confidence scoring [0.0, 1.0] provides quantified uncertainty measures
- Roman numeral analysis supports harmonic function understanding
- JSON Schema pattern validation ensures consistent formatting

**Alternatives Considered**:
- Nashville notation: Rejected due to less widespread adoption
- ABC notation: Rejected as too complex for chord symbols
- Unlimited BPM range: Rejected to catch obvious analysis errors
- Integer confidence scores: Rejected in favor of decimal precision

### Semantic Description Taxonomy

**Decision**: Use controlled vocabularies for mood, energy, texture, and genre attributes
**Rationale**:
- Controlled vocabularies ensure consistency across annotators
- Hierarchical genre classification (primary/secondary/subgenres) captures musical complexity
- Multi-value attributes (arrays) allow nuanced descriptions
- Extensible design enables future vocabulary expansion
- JSON Schema enum validation prevents typos and inconsistencies

**Alternatives Considered**:
- Free-text descriptions: Rejected due to inconsistency and analysis difficulty
- Numerical scales: Rejected as less interpretable than semantic labels
- Single-value attributes: Rejected as insufficiently expressive for musical complexity
- External ontology references: Deferred due to added complexity

### Performance and Scale Architecture

**Decision**: File-based approach with in-memory validation for 10K scale
**Rationale**:
- 10K clips/annotations fit comfortably in memory for modern systems
- File-based approach aligns with Git workflows and version control
- JSON files are human-readable and debuggable
- Avoids database dependencies for simplicity

**Alternatives Considered**:
- SQLite database: Deferred to future versions if scale requirements increase
- NoSQL document store: Unnecessary complexity for current scale
- Streaming validation: Unnecessary for 10K item scale

### Python Package Architecture

**Decision**: Library-first with CLI wrapper, following src-layout
**Rationale**:
- Constitutional requirement for library-first modularity
- src-layout prevents import issues during development
- Separate CLI enables both programmatic and command-line usage
- Clear separation of concerns between validation logic and interface

**Alternatives Considered**:
- Flat package layout: Rejected due to import path issues
- CLI-only approach: Violates library-first constitutional principle
- Multiple packages: Unnecessary complexity for initial version

### Testing Strategy

**Decision**: Pytest with schema validation tests, fixtures, and contract testing
**Rationale**:
- Constitutional requirement for test-driven delivery
- Pytest provides excellent fixture management for JSON test data
- Schema validation tests ensure contract compliance
- Contract tests validate JSON Schema files against sample data

**Alternatives Considered**:
- unittest: Rejected due to less flexible fixture handling
- Custom test framework: Rejected as unnecessary reinvention
- Property-based testing: Deferred to future versions

## Technical Risk Assessment

**Low Risk**:
- JSON Schema validation (mature ecosystem)
- File path and URL handling (standard library support)
- Python packaging and CLI (well-established patterns)

**Medium Risk**:
- Hierarchical label validation complexity (custom logic required)
- Performance with large datasets (may need optimization later)

**High Risk**:
- Schema evolution and backwards compatibility (requires careful versioning)

## Implementation Priority

1. **High**: Core JSON Schema definitions and validation engine
2. **High**: Data models for key entities (DictionaryEntry, Annotation)
3. **Medium**: CLI interface and file handling
4. **Medium**: Hierarchical label relationship validation
5. **Low**: Performance optimization and advanced features

## Research Validation

All technical decisions align with constitutional principles:
- ✅ Python + PyTorch first (Python focus established)
- ✅ JSON Schema compliance (primary requirement)
- ✅ Library-first modularity (architecture decision)
- ✅ Test-driven delivery (testing strategy defined)
- ✅ Spec-first development (research follows specification)

**Status**: Research complete, ready for Phase 1 design