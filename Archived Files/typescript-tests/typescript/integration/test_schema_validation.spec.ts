/**
 * Integration test for schema-specific validation scenario
 *
 * This test validates Quickstart Scenario 2: Schema-Specific Validation
 * Must FAIL initially (TDD red phase) before implementation.
 */

import { ValidationClient } from '../../../wizard/src/services/validation-client';
import { SessionStorageManager } from '../../../wizard/src/services/session-storage';

describe('Schema-Specific Validation Integration', () => {
  let validationClient: ValidationClient;
  let sessionManager: SessionStorageManager;
  let sessionId: string;

  beforeEach(async () => {
    validationClient = new ValidationClient('http://localhost:8000/api/v1');
    sessionManager = new SessionStorageManager();

    const session = await validationClient.createSession();
    sessionId = session.session_id;
  });

  afterEach(() => {
    sessionManager.clearSession();
  });

  test('should apply different validation rules for different ADP schema types', async () => {
    // Test: Different validation rules for different ADP schema types
    // Setup: Validation API running with all ADP schemas loaded, Wizard with schema selection

    // Step 1: Select "Core Audio Description" schema
    const coreProtocolData = {
      title: "Basic Audio Track",
      duration: 180
    };

    const coreValidation = await validationClient.validateProtocol({
      protocol_data: coreProtocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Step 3: Expect basic validation passes
    expect(coreValidation.is_valid).toBe(true);
    expect(coreValidation.errors).toHaveLength(0);

    // Step 4: Switch to "Musical Analysis" schema
    const musicalAnalysisData = {
      title: "Musical Audio Track",
      duration: 180,
      // Musical analysis requires additional fields
      tempo: null,  // This should be required for musical_analysis
      key_signature: null,
      time_signature: null
    };

    const musicalValidation = await validationClient.validateProtocol({
      protocol_data: musicalAnalysisData,
      schema_type: "musical_analysis",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Step 5: Expect additional musical fields become required
    expect(musicalValidation.is_valid).toBe(false);

    // Should have errors for missing musical analysis fields
    const missingFields = musicalValidation.errors.filter(error =>
      error.field_path.includes('tempo') ||
      error.field_path.includes('key_signature') ||
      error.field_path.includes('time_signature')
    );
    expect(missingFields.length).toBeGreaterThan(0);
  });

  test('should validate semantic attributes schema requirements', async () => {
    const semanticAttributesData = {
      title: "Semantic Audio",
      duration: 240,
      semantic_tags: [],  // Required for semantic_attributes but empty
      emotional_tone: null,
      genre_classification: null
    };

    const result = await validationClient.validateProtocol({
      protocol_data: semanticAttributesData,
      schema_type: "semantic_attributes",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Step 6: Fill musical analysis fields incorrectly
    expect(result.is_valid).toBe(false);

    // Step 7: Expect schema-specific error messages appear
    const semanticErrors = result.errors.filter(error =>
      error.field_path.includes('semantic_tags') ||
      error.field_path.includes('emotional_tone') ||
      error.field_path.includes('genre_classification')
    );
    expect(semanticErrors.length).toBeGreaterThan(0);

    // Error messages should be specific to semantic attributes
    semanticErrors.forEach(error => {
      expect(error.message).toMatch(/semantic|emotional|genre/i);
    });
  });

  test('should validate dataset manifest schema requirements', async () => {
    const datasetManifestData = {
      title: "Dataset Manifest",
      dataset_version: "1.0.0",
      entries: [],  // Should require at least one entry
      metadata: null  // Required field
    };

    const result = await validationClient.validateProtocol({
      protocol_data: datasetManifestData,
      schema_type: "dataset_manifest",
      session_id: sessionId,
      validation_mode: "full"
    });

    expect(result.is_valid).toBe(false);

    // Should have dataset-specific validation errors
    const datasetErrors = result.errors.filter(error =>
      error.field_path.includes('entries') ||
      error.field_path.includes('metadata') ||
      error.field_path.includes('dataset_version')
    );
    expect(datasetErrors.length).toBeGreaterThan(0);
  });

  test('should support all ADP schemas with taxonomy validation', async () => {
    // Validation: Correct schema rules applied based on selection
    const schemas = await validationClient.getAvailableSchemas();

    // Should include all required ADP schema types from clarifications
    const schemaIds = schemas.map(s => s.schema_id);
    expect(schemaIds).toContain("core");
    expect(schemaIds).toContain("musical_analysis");
    expect(schemaIds).toContain("semantic_attributes");
    expect(schemaIds).toContain("dataset_manifest");

    // Each schema should support taxonomy validation
    for (const schema of schemas) {
      expect(schema.description).toContain("taxonomy");
    }
  });

  test('should provide schema-specific error codes', async () => {
    const invalidMusicalData = {
      title: "Musical Track",
      duration: 180,
      tempo: "invalid_tempo_format",  // Should be number
      key_signature: "Z major"        // Invalid key signature
    };

    const result = await validationClient.validateProtocol({
      protocol_data: invalidMusicalData,
      schema_type: "musical_analysis",
      session_id: sessionId,
      validation_mode: "full"
    });

    expect(result.is_valid).toBe(false);

    // Error codes should be schema-specific
    const tempoError = result.errors.find(e => e.field_path.includes('tempo'));
    expect(tempoError?.error_code).toMatch(/MUSICAL|TEMPO/i);

    const keyError = result.errors.find(e => e.field_path.includes('key_signature'));
    expect(keyError?.error_code).toMatch(/MUSICAL|KEY/i);
  });

  test('should handle schema transitions during validation', async () => {
    // Start with core validation
    let protocolData = {
      title: "Evolving Audio",
      duration: 200
    };

    const coreResult = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    expect(coreResult.is_valid).toBe(true);

    // Transition to musical analysis schema with same data
    const musicalResult = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "musical_analysis",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Should now fail due to missing musical fields
    expect(musicalResult.is_valid).toBe(false);
    expect(musicalResult.errors.length).toBeGreaterThan(coreResult.errors.length);
  });

  test('should validate taxonomy compliance across all schemas', async () => {
    const schemas = ["core", "musical_analysis", "semantic_attributes", "dataset_manifest"];

    for (const schemaType of schemas) {
      const taxonomyData = {
        title: `${schemaType} test`,
        taxonomy_version: "invalid_version",  // Should follow semantic versioning
        custom_fields: {
          invalid_taxonomy_reference: "unknown_taxonomy_id"
        }
      };

      const result = await validationClient.validateProtocol({
        protocol_data: taxonomyData,
        schema_type: schemaType as any,
        session_id: sessionId,
        validation_mode: "full"
      });

      // All schemas should validate taxonomy compliance
      const taxonomyErrors = result.errors.filter(error =>
        error.field_path.includes('taxonomy') ||
        error.error_code.includes('TAXONOMY')
      );

      expect(taxonomyErrors.length).toBeGreaterThan(0);
    }
  });
});