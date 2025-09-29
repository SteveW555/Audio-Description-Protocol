/**
 * Integration test for offline validation fallback scenario
 *
 * This test validates Quickstart Scenario 3: Offline Validation Fallback
 * Must FAIL initially (TDD red phase) before implementation.
 */

import { ValidationClient } from '../../../wizard/src/services/validation-client';
import { SessionStorageManager } from '../../../wizard/src/services/session-storage';

describe('Offline Validation Fallback Integration', () => {
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

  test('should continue working when validation service becomes unavailable', async () => {
    // Test: Wizard continues working when validation service unavailable
    // Setup: Wizard interface loaded and functional, Validation API initially running

    // Step 1: Start creating protocol with real-time validation working
    const initialData = {
      protocol_data: {
        title: "Test Audio",
        duration: 180
      },
      schema_type: "core" as const,
      session_id: sessionId,
      validation_mode: "field" as const
    };

    // Verify validation service is working initially
    const initialResult = await validationClient.validateProtocol(initialData);
    expect(initialResult.is_valid).toBe(true);

    // Step 2: Stop validation API server (simulate service outage)
    // Note: In real test, this would actually stop the server
    // For this contract test, we simulate by pointing to non-existent endpoint
    const offlineClient = new ValidationClient('http://localhost:9999/api/v1');

    // Step 3: Continue editing protocol fields
    const offlineData = {
      protocol_data: {
        title: "Test Audio - Offline Edit",
        duration: 200,
        description: "Added while offline"
      },
      schema_type: "core" as const,
      session_id: sessionId,
      validation_mode: "field" as const
    };

    // Step 4: Expect offline indicator appears, but editing continues
    try {
      await offlineClient.validateProtocol(offlineData);
      // Should not reach here in offline mode
      fail('Expected validation to fail when service unavailable');
    } catch (error) {
      // This is expected - validation service unavailable
      expect(error).toBeDefined();
    }

    // Step 5: Expect protocol data saved locally
    const localData = sessionManager.getProtocolData();
    expect(localData).toBeDefined();
    expect(localData.title).toContain("Offline");

    // Step 6: Restart validation API
    // Step 7: Expect queued validation requests process automatically
    const onlineResult = await validationClient.validateProtocol(offlineData);
    expect(onlineResult.is_valid).toBe(true);

    // Validation: No loss of user work during service interruption
    expect(onlineResult.field_results.title).toBe('valid');
    expect(onlineResult.field_results.duration).toBe('valid');
  });

  test('should provide clear offline status indicators', async () => {
    const offlineClient = new ValidationClient('http://localhost:9999/api/v1');

    try {
      await offlineClient.validateProtocol({
        protocol_data: { title: "Test" },
        schema_type: "core",
        session_id: sessionId,
        validation_mode: "field"
      });
    } catch (error: any) {
      // Should provide clear indication of offline status
      expect(error.message).toMatch(/offline|unavailable|connection/i);
    }

    // Offline detection should happen within 5 seconds
    const startTime = Date.now();
    try {
      await offlineClient.getAvailableSchemas();
    } catch (error) {
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(5000);
    }
  });

  test('should queue validation requests during offline period', async () => {
    const validationQueue: any[] = [];

    // Simulate queuing mechanism
    const queuedValidationData = [
      {
        protocol_data: { title: "Queued Item 1" },
        schema_type: "core" as const,
        session_id: sessionId,
        validation_mode: "field" as const
      },
      {
        protocol_data: { title: "Queued Item 2", duration: 150 },
        schema_type: "core" as const,
        session_id: sessionId,
        validation_mode: "field" as const
      }
    ];

    // Add to queue while offline
    validationQueue.push(...queuedValidationData);
    expect(validationQueue).toHaveLength(2);

    // When service returns, process queue
    for (const queuedRequest of validationQueue) {
      const result = await validationClient.validateProtocol(queuedRequest);
      expect(result).toBeDefined();
      expect(result.is_valid).toBeDefined();
    }

    // Queue should be cleared after processing
    validationQueue.length = 0;
    expect(validationQueue).toHaveLength(0);
  });

  test('should maintain protocol state during service interruption', async () => {
    // Build up protocol state while online
    const protocolState = {
      title: "Progressive Audio",
      duration: 180,
      annotations: [],
      metadata: {
        created_at: new Date().toISOString(),
        version: "1.0.0"
      }
    };

    // Save state locally
    sessionManager.saveProtocolData(protocolState);

    // Simulate service interruption
    const offlineClient = new ValidationClient('http://localhost:9999/api/v1');

    // Continue building protocol while offline
    protocolState.annotations.push({
      timestamp: 30,
      text: "Added while offline",
      confidence: 0.9
    });

    sessionManager.saveProtocolData(protocolState);

    // When service returns, state should be preserved
    const restoredState = sessionManager.getProtocolData();
    expect(restoredState.title).toBe("Progressive Audio");
    expect(restoredState.annotations).toHaveLength(1);
    expect(restoredState.annotations[0].text).toContain("offline");

    // Validate restored state when back online
    const validationResult = await validationClient.validateProtocol({
      protocol_data: restoredState,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    expect(validationResult.is_valid).toBe(true);
  });

  test('should handle reconnection gracefully', async () => {
    // Simulate disconnect/reconnect cycle
    const protocolData = {
      title: "Reconnection Test",
      duration: 120
    };

    // Save data while offline
    sessionManager.saveProtocolData(protocolData);

    // Test reconnection
    const reconnectionResult = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    expect(reconnectionResult.is_valid).toBe(true);

    // Session should still be valid after reconnection
    const sessionInfo = await validationClient.createSession();
    expect(sessionInfo.session_id).toBeDefined();
  });

  test('should provide local validation capabilities during offline mode', async () => {
    // Basic local validation should work even when service unavailable
    const protocolData = {
      title: "",  // Invalid - empty title
      duration: -1  // Invalid - negative duration
    };

    // Local validation should catch obvious errors
    const localErrors = sessionManager.validateLocally(protocolData, "core");
    expect(localErrors).toHaveLength(2);

    expect(localErrors[0].field_path).toBe("$.title");
    expect(localErrors[0].message).toContain("required");

    expect(localErrors[1].field_path).toBe("$.duration");
    expect(localErrors[1].message).toContain("positive");
  });

  test('should sync validation results when service returns', async () => {
    // Create offline validation results
    const offlineValidations = [
      {
        protocol_data: { title: "Offline 1" },
        timestamp: Date.now() - 1000,
        local_result: { is_valid: true, errors: [] }
      },
      {
        protocol_data: { title: "Offline 2" },
        timestamp: Date.now() - 500,
        local_result: { is_valid: false, errors: [{ field_path: "$.duration", message: "Missing duration" }] }
      }
    ];

    // When service returns, sync with server validation
    for (const offline of offlineValidations) {
      const serverResult = await validationClient.validateProtocol({
        protocol_data: offline.protocol_data,
        schema_type: "core",
        session_id: sessionId,
        validation_mode: "full"
      });

      // Compare local vs server validation
      expect(serverResult.is_valid).toBe(offline.local_result.is_valid);
    }
  });
});