/**
 * Integration test for comprehensive validation report scenario
 *
 * This test validates Quickstart Scenario 5: Comprehensive Validation Report
 * Must FAIL initially (TDD red phase) before implementation.
 */

import { ValidationClient } from '../../../wizard/src/services/validation-client';
import { SessionStorageManager } from '../../../wizard/src/services/session-storage';

describe('Comprehensive Validation Report Integration', () => {
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

  test('should provide complete protocol assessment', async () => {
    // Test: Final validation provides complete protocol assessment
    // Setup: Completed protocol with mix of valid and invalid fields, All ADP schemas available

    // Create protocol with mix of valid and invalid fields
    const complexProtocolData = {
      // Valid fields
      title: "Comprehensive Test Protocol",
      duration: 300,

      // Invalid fields
      description: "",  // Empty description should be invalid
      annotations: [
        {
          timestamp: -5,  // Invalid negative timestamp
          text: "Invalid annotation",
          confidence: 1.5  // Invalid confidence > 1.0
        },
        {
          timestamp: 30,
          text: "Valid annotation",
          confidence: 0.85
        }
      ],

      // Missing required fields (depending on schema)
      metadata: null,

      // Musical analysis fields (some valid, some invalid)
      tempo: 120,  // Valid
      key_signature: "Invalid Key",  // Invalid format
      time_signature: null  // Missing required field
    };

    // Step 1: Click "Validate Complete Protocol" button
    const validationResult = await validationClient.validateProtocol({
      protocol_data: complexProtocolData,
      schema_type: "musical_analysis",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Step 2: Expect comprehensive validation report appears
    expect(validationResult).toBeDefined();
    expect(validationResult.is_valid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);

    // Step 3: Expect pass/fail status for each field clearly shown
    expect(validationResult.field_results).toBeDefined();
    expect(validationResult.field_results.title).toBe('valid');
    expect(validationResult.field_results.duration).toBe('valid');
    expect(validationResult.field_results.description).toBe('invalid');
    expect(validationResult.field_results.tempo).toBe('valid');
    expect(validationResult.field_results.key_signature).toBe('invalid');

    // Step 4: Expect brief error messages (1-2 sentences) for failures
    validationResult.errors.forEach(error => {
      expect(error.message).toBeDefined();
      expect(error.message.length).toBeGreaterThan(0);

      // Brief messages (1-2 sentences)
      const sentences = error.message.split('.').filter(s => s.trim().length > 0);
      expect(sentences.length).toBeLessThanOrEqual(2);

      // Should have field path
      expect(error.field_path).toBeDefined();
      expect(error.field_path.length).toBeGreaterThan(0);
    });

    // Step 5: Expect suggested fixes provided for common errors
    const errorsWithFixes = validationResult.errors.filter(error => error.suggested_fix);
    expect(errorsWithFixes.length).toBeGreaterThan(0);

    errorsWithFixes.forEach(error => {
      expect(error.suggested_fix).toBeDefined();
      expect(error.suggested_fix!.length).toBeGreaterThan(0);
    });

    // Validation: Complete protocol validation covers all requirements
    expect(validationResult.processed_at).toBeDefined();
    expect(validationResult.schema_version).toBeDefined();
  });

  test('should categorize errors by severity and type', async () => {
    const protocolWithVariousErrors = {
      title: "",  // Error: Required field missing
      duration: -100,  // Error: Invalid value
      description: "A".repeat(5000),  // Warning: Too long but not critical
      annotations: [
        {
          timestamp: "not_a_number",  // Error: Type mismatch
          text: "Test",
          confidence: 0.3  // Warning: Low confidence
        }
      ]
    };

    const result = await validationClient.validateProtocol({
      protocol_data: protocolWithVariousErrors,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    expect(result.is_valid).toBe(false);

    // Should have both errors and warnings
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.warnings.length).toBeGreaterThan(0);

    // Errors should be critical issues
    const criticalErrors = result.errors.filter(error => error.severity === 'error');
    expect(criticalErrors.length).toBeGreaterThan(0);

    // Warnings should be non-blocking issues
    const warningIssues = result.warnings.filter(warning => warning.warning_code);
    expect(warningIssues.length).toBeGreaterThan(0);

    // Each error should have proper categorization
    result.errors.forEach(error => {
      expect(error.error_code).toBeDefined();
      expect(error.severity).toMatch(/error|warning/);
      expect(error.field_path).toMatch(/^\$\./);  // JSONPath format
    });
  });

  test('should provide detailed field-level validation status', async () => {
    const protocolData = {
      title: "Field Status Test",
      duration: 240,
      description: "Valid description",
      annotations: [],
      metadata: {
        creator: "Test User",
        created_at: new Date().toISOString(),
        version: "1.0.0"
      },
      tags: ["audio", "test"],
      custom_fields: {
        project_id: "proj_123",
        category: "experimental"
      }
    };

    const result = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Should provide status for all fields
    expect(result.field_results).toBeDefined();

    const expectedFields = ['title', 'duration', 'description', 'annotations', 'metadata', 'tags'];
    expectedFields.forEach(field => {
      expect(result.field_results[field]).toMatch(/valid|invalid|pending/);
    });

    // Nested field status
    if (result.field_results['metadata.creator']) {
      expect(result.field_results['metadata.creator']).toBe('valid');
    }

    // Array field status
    expect(result.field_results.annotations).toBe('valid');
  });

  test('should handle validation across multiple schema types in single report', async () => {
    // Test protocol that could be validated against multiple schemas
    const multiSchemaProtocol = {
      // Core fields
      title: "Multi-Schema Protocol",
      duration: 180,

      // Musical analysis fields
      tempo: 125,
      key_signature: "C major",

      // Semantic attributes
      emotional_tone: "upbeat",
      genre_classification: "pop",

      // Dataset manifest fields
      dataset_version: "2.1.0",
      entries: [
        { id: "entry_1", path: "/audio/track1.wav" }
      ]
    };

    // Validate against different schemas
    const schemaTypes = ["core", "musical_analysis", "semantic_attributes", "dataset_manifest"];
    const validationResults = [];

    for (const schemaType of schemaTypes) {
      const result = await validationClient.validateProtocol({
        protocol_data: multiSchemaProtocol,
        schema_type: schemaType as any,
        session_id: sessionId,
        validation_mode: "full"
      });

      validationResults.push({ schemaType, result });
    }

    // Each schema should provide appropriate validation
    validationResults.forEach(({ schemaType, result }) => {
      expect(result.schema_version).toBeDefined();
      expect(result.processed_at).toBeDefined();

      // Core schema should validate core fields
      if (schemaType === "core") {
        expect(result.field_results.title).toBe('valid');
        expect(result.field_results.duration).toBe('valid');
      }

      // Musical analysis should check musical fields
      if (schemaType === "musical_analysis") {
        expect(result.field_results.tempo).toBe('valid');
        expect(result.field_results.key_signature).toBe('valid');
      }
    });
  });

  test('should provide performance metrics in validation report', async () => {
    const protocolData = {
      title: "Performance Test Protocol",
      duration: 300,
      annotations: new Array(100).fill(null).map((_, i) => ({
        timestamp: i * 3,
        text: `Annotation ${i}`,
        confidence: 0.8 + Math.random() * 0.2
      }))
    };

    const startTime = Date.now();

    const result = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    const endTime = Date.now();
    const validationTime = endTime - startTime;

    // Should meet performance target of <500ms
    expect(validationTime).toBeLessThan(500);

    // Result should include timing information
    expect(result.processed_at).toBeDefined();

    // Should handle large protocols efficiently
    expect(result.field_results).toBeDefined();
    expect(result.is_valid).toBeDefined();
  });

  test('should export validation report in structured format', async () => {
    const protocolData = {
      title: "Export Test Protocol",
      duration: 200,
      description: "",  // Invalid to generate errors
      annotations: [
        { timestamp: -1, text: "Invalid", confidence: 1.5 }  // Multiple errors
      ]
    };

    const result = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Should be exportable as structured data
    const exportData = {
      validation_summary: {
        is_valid: result.is_valid,
        total_errors: result.errors.length,
        total_warnings: result.warnings.length,
        schema_type: "core",
        validation_timestamp: result.processed_at
      },
      field_status: result.field_results,
      detailed_errors: result.errors.map(error => ({
        field: error.field_path,
        message: error.message,
        severity: error.severity,
        fix_suggestion: error.suggested_fix
      })),
      warnings: result.warnings
    };

    expect(exportData.validation_summary.total_errors).toBeGreaterThan(0);
    expect(exportData.detailed_errors.length).toBe(result.errors.length);
    expect(exportData.field_status.title).toBe('valid');
    expect(exportData.field_status.description).toBe('invalid');

    // Should be JSON serializable
    const jsonExport = JSON.stringify(exportData);
    expect(jsonExport.length).toBeGreaterThan(0);

    const parsed = JSON.parse(jsonExport);
    expect(parsed.validation_summary.is_valid).toBe(false);
  });
});