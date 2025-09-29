/**
 * Integration test for real-time field validation scenario
 *
 * This test validates Quickstart Scenario 1: Real-time Field Validation
 * Must FAIL initially (TDD red phase) before implementation.
 */

import { ValidationClient } from '../../../wizard/src/services/validation-client';
import { SessionStorageManager } from '../../../wizard/src/services/session-storage';

describe('Real-time Field Validation Integration', () => {
  let validationClient: ValidationClient;
  let sessionManager: SessionStorageManager;
  let sessionId: string;

  beforeEach(async () => {
    // Initialize validation client pointing to test API
    validationClient = new ValidationClient('http://localhost:8000/api/v1');
    sessionManager = new SessionStorageManager();

    // Create a new validation session
    const session = await validationClient.createSession();
    sessionId = session.session_id;
  });

  afterEach(() => {
    // Clean up session storage
    sessionManager.clearSession();
  });

  test('should provide immediate validation feedback on field completion', async () => {
    // Test: Field-level validation triggers on wizard field changes
    // Setup: Start Python validation API server, Open wizard interface, Begin creating protocol

    // Step 1: Enter title field: "Test Audio"
    const validTitleData = {
      protocol_data: {
        title: "Test Audio",
        duration: null
      },
      schema_type: "core" as const,
      field_path: "$.title",
      session_id: sessionId,
      validation_mode: "field" as const
    };

    // Step 2: Move focus to next field (blur event) - should trigger validation
    const validationResult = await validationClient.validateProtocol(validTitleData);

    // Step 3: Expect green checkmark (positive validation feedback)
    expect(validationResult.is_valid).toBe(true);
    expect(validationResult.field_results.title).toBe('valid');
    expect(validationResult.errors).toHaveLength(0);

    // Validation: Field validation occurs within 500ms of blur event
    const startTime = Date.now();
    await validationClient.validateProtocol(validTitleData);
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(500);
  });

  test('should show error message for invalid field data', async () => {
    // Step 4: Clear title field completely
    const invalidTitleData = {
      protocol_data: {
        title: "",  // Empty title should be invalid
        duration: null
      },
      schema_type: "core" as const,
      field_path: "$.title",
      session_id: sessionId,
      validation_mode: "field" as const
    };

    // Step 5: Move focus to next field
    const validationResult = await validationClient.validateProtocol(invalidTitleData);

    // Step 6: Expect Red X with error message "Title is required and must be 1-200 characters"
    expect(validationResult.is_valid).toBe(false);
    expect(validationResult.field_results.title).toBe('invalid');
    expect(validationResult.errors).toHaveLength(1);

    const error = validationResult.errors[0];
    expect(error.field_path).toBe('$.title');
    expect(error.message).toContain('Title');
    expect(error.message).toContain('required');
    expect(error.severity).toBe('error');

    // Error message should be brief (1-2 sentences)
    const sentences = error.message.split('.').filter(s => s.trim().length > 0);
    expect(sentences.length).toBeLessThanOrEqual(2);
  });

  test('should handle multiple field validations in sequence', async () => {
    // Test rapid field changes to ensure validation keeps up
    const fields = [
      { path: "$.title", value: "Test Audio" },
      { path: "$.duration", value: 180 },
      { path: "$.description", value: "A test audio description" }
    ];

    for (const field of fields) {
      const protocolData = {
        title: field.path === "$.title" ? field.value : "Test Audio",
        duration: field.path === "$.duration" ? field.value : 180,
        description: field.path === "$.description" ? field.value : ""
      };

      const validationRequest = {
        protocol_data: protocolData,
        schema_type: "core" as const,
        field_path: field.path,
        session_id: sessionId,
        validation_mode: "field" as const
      };

      const result = await validationClient.validateProtocol(validationRequest);

      // Each field should validate successfully
      expect(result.field_results[field.path.replace('$.', '')]).toBe('valid');
    }
  });

  test('should maintain validation state during field navigation', async () => {
    // Validate first field
    const titleValidation = await validationClient.validateProtocol({
      protocol_data: { title: "Valid Title" },
      schema_type: "core" as const,
      field_path: "$.title",
      session_id: sessionId,
      validation_mode: "field" as const
    });

    expect(titleValidation.is_valid).toBe(true);

    // Navigate to second field and validate
    const durationValidation = await validationClient.validateProtocol({
      protocol_data: {
        title: "Valid Title",  // Previous field data preserved
        duration: 120
      },
      schema_type: "core" as const,
      field_path: "$.duration",
      session_id: sessionId,
      validation_mode: "field" as const
    });

    expect(durationValidation.is_valid).toBe(true);
    // Previous validation state should be maintained
    expect(durationValidation.field_results.title).toBe('valid');
    expect(durationValidation.field_results.duration).toBe('valid');
  });

  test('should provide suggested fixes for common validation errors', async () => {
    // Test invalid duration (negative value)
    const invalidDurationData = {
      protocol_data: {
        title: "Test Audio",
        duration: -1  // Invalid negative duration
      },
      schema_type: "core" as const,
      field_path: "$.duration",
      session_id: sessionId,
      validation_mode: "field" as const
    };

    const result = await validationClient.validateProtocol(invalidDurationData);

    expect(result.is_valid).toBe(false);
    expect(result.errors).toHaveLength(1);

    const error = result.errors[0];
    expect(error.field_path).toBe('$.duration');
    expect(error.suggested_fix).toBeDefined();
    expect(error.suggested_fix).toContain('positive');
  });
});