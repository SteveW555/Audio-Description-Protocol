/**
 * Integration test for session persistence scenario
 *
 * This test validates Quickstart Scenario 4: Session Persistence
 * Must FAIL initially (TDD red phase) before implementation.
 */

import { ValidationClient } from '../../../wizard/src/services/validation-client';
import { SessionStorageManager } from '../../../wizard/src/services/session-storage';

describe('Session Persistence Integration', () => {
  let validationClient: ValidationClient;
  let sessionManager: SessionStorageManager;

  beforeEach(() => {
    validationClient = new ValidationClient('http://localhost:8000/api/v1');
    sessionManager = new SessionStorageManager();
  });

  afterEach(() => {
    sessionManager.clearSession();
  });

  test('should maintain validation rules consistent within session', async () => {
    // Test: Validation rules remain consistent within session
    // Setup: Validation API with v1.2.0 schema rules, Active wizard session

    // Step 1: Start protocol creation (session locks to v1.2.0 rules)
    const session = await validationClient.createSession();
    const sessionId = session.session_id;
    const initialRulesVersion = session.validation_rules_version;

    // Verify initial session creation
    expect(sessionId).toBeDefined();
    expect(initialRulesVersion).toMatch(/^\d+\.\d+\.\d+$/); // Semantic versioning

    // Step 2: Update validation API to v1.3.0 (simulate rule change)
    // Note: In real implementation, this would be handled by the server
    // For testing, we simulate by checking that session maintains its locked version

    // Step 3: Continue editing same protocol
    const protocolData = {
      title: "Session Persistence Test",
      duration: 180,
      description: "Testing rule version consistency"
    };

    const validationResult = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    // Step 4: Expect validation still uses v1.2.0 rules
    expect(validationResult.schema_version).toBe(initialRulesVersion);
    expect(validationResult.is_valid).toBe(true);

    // Session persistence maintained
    const sessionData = sessionManager.getSessionData(sessionId);
    expect(sessionData.validation_rules_version).toBe(initialRulesVersion);

    // Step 5: Start new wizard session
    const newSession = await validationClient.createSession();
    const newSessionId = newSession.session_id;

    // Step 6: Expect new session uses v1.3.0 rules (or current version)
    expect(newSessionId).not.toBe(sessionId);

    // New session should potentially have updated rules
    const newValidationResult = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: newSessionId,
      validation_mode: "full"
    });

    // Validation: Session-scoped rule versioning prevents mid-session changes
    expect(newValidationResult.schema_version).toBeDefined();
    // New session may have same or different version, but should be consistent within session
  });

  test('should persist session data across browser refreshes', async () => {
    // Create session with some protocol data
    const session = await validationClient.createSession();
    const sessionId = session.session_id;

    const protocolData = {
      title: "Persistent Session Data",
      duration: 240,
      annotations: [
        { timestamp: 10, text: "First annotation" },
        { timestamp: 30, text: "Second annotation" }
      ]
    };

    // Save session data
    sessionManager.saveSessionData(sessionId, {
      protocol_data: protocolData,
      validation_rules_version: session.validation_rules_version,
      created_at: session.created_at,
      last_activity: new Date().toISOString()
    });

    // Simulate browser refresh by clearing in-memory state
    sessionManager.clearMemoryState();

    // Restore session data
    const restoredData = sessionManager.getSessionData(sessionId);
    expect(restoredData).toBeDefined();
    expect(restoredData.protocol_data.title).toBe("Persistent Session Data");
    expect(restoredData.protocol_data.annotations).toHaveLength(2);
    expect(restoredData.validation_rules_version).toBe(session.validation_rules_version);
  });

  test('should handle session expiration gracefully', async () => {
    // Create session
    const session = await validationClient.createSession();
    const sessionId = session.session_id;

    // Simulate session expiration (24 hours per requirements)
    const expiredSessionData = {
      protocol_data: { title: "Expired Session" },
      validation_rules_version: session.validation_rules_version,
      created_at: session.created_at,
      last_activity: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() // 25 hours ago
    };

    sessionManager.saveSessionData(sessionId, expiredSessionData);

    // Check if session is expired
    const isExpired = sessionManager.isSessionExpired(sessionId);
    expect(isExpired).toBe(true);

    // Should create new session when expired one is used
    try {
      await validationClient.validateProtocol({
        protocol_data: { title: "Test" },
        schema_type: "core",
        session_id: sessionId,
        validation_mode: "field"
      });
    } catch (error: any) {
      expect(error.message).toMatch(/expired|invalid session/i);
    }
  });

  test('should maintain validation cache within session', async () => {
    const session = await validationClient.createSession();
    const sessionId = session.session_id;

    const protocolData = {
      title: "Cached Validation Test",
      duration: 180
    };

    // First validation
    const firstResult = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    const firstTimestamp = Date.now();

    // Second validation with same data should use cache
    const secondResult = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    const secondTimestamp = Date.now();

    // Results should be identical
    expect(secondResult.is_valid).toBe(firstResult.is_valid);
    expect(secondResult.schema_version).toBe(firstResult.schema_version);

    // Second call should be faster (cached)
    expect(secondTimestamp - firstTimestamp).toBeLessThan(100);

    // Cache should be stored in session
    const cachedResults = sessionManager.getValidationCache(sessionId);
    expect(cachedResults).toBeDefined();
    expect(Object.keys(cachedResults)).toContain(JSON.stringify(protocolData));
  });

  test('should handle concurrent session management', async () => {
    // Create multiple sessions concurrently
    const sessionPromises = [
      validationClient.createSession(),
      validationClient.createSession(),
      validationClient.createSession()
    ];

    const sessions = await Promise.all(sessionPromises);

    // All sessions should be unique
    const sessionIds = sessions.map(s => s.session_id);
    const uniqueIds = new Set(sessionIds);
    expect(uniqueIds.size).toBe(3);

    // All sessions should have same validation rules version
    const rulesVersions = sessions.map(s => s.validation_rules_version);
    expect(rulesVersions[0]).toBe(rulesVersions[1]);
    expect(rulesVersions[1]).toBe(rulesVersions[2]);

    // Each session should maintain independent state
    for (let i = 0; i < sessions.length; i++) {
      const protocolData = {
        title: `Session ${i} Protocol`,
        duration: 120 + i * 30
      };

      const result = await validationClient.validateProtocol({
        protocol_data: protocolData,
        schema_type: "core",
        session_id: sessions[i].session_id,
        validation_mode: "full"
      });

      expect(result.is_valid).toBe(true);

      // Save session-specific data
      sessionManager.saveSessionData(sessions[i].session_id, {
        protocol_data: protocolData,
        validation_rules_version: sessions[i].validation_rules_version,
        created_at: sessions[i].created_at,
        last_activity: new Date().toISOString()
      });
    }

    // Verify session isolation
    for (let i = 0; i < sessions.length; i++) {
      const sessionData = sessionManager.getSessionData(sessions[i].session_id);
      expect(sessionData.protocol_data.title).toBe(`Session ${i} Protocol`);
      expect(sessionData.protocol_data.duration).toBe(120 + i * 30);
    }
  });

  test('should update last activity timestamp on validation requests', async () => {
    const session = await validationClient.createSession();
    const sessionId = session.session_id;

    const initialTimestamp = Date.now();

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 100));

    // Make validation request
    await validationClient.validateProtocol({
      protocol_data: { title: "Activity Update Test" },
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "field"
    });

    // Check that last activity was updated
    const sessionData = sessionManager.getSessionData(sessionId);
    const lastActivity = new Date(sessionData.last_activity).getTime();

    expect(lastActivity).toBeGreaterThan(initialTimestamp);
  });

  test('should preserve validation state during network interruptions', async () => {
    const session = await validationClient.createSession();
    const sessionId = session.session_id;

    // Build up validation state
    const validationHistory = [
      { field: "title", value: "Network Test", result: "valid" },
      { field: "duration", value: 200, result: "valid" },
      { field: "description", value: "Testing network resilience", result: "valid" }
    ];

    // Save validation state
    sessionManager.saveValidationHistory(sessionId, validationHistory);

    // Simulate network interruption and recovery
    const restoredHistory = sessionManager.getValidationHistory(sessionId);
    expect(restoredHistory).toHaveLength(3);
    expect(restoredHistory[0].field).toBe("title");
    expect(restoredHistory[0].result).toBe("valid");

    // Validation state should be restored correctly
    const protocolData = {
      title: "Network Test",
      duration: 200,
      description: "Testing network resilience"
    };

    const result = await validationClient.validateProtocol({
      protocol_data: protocolData,
      schema_type: "core",
      session_id: sessionId,
      validation_mode: "full"
    });

    expect(result.is_valid).toBe(true);
    expect(result.field_results.title).toBe("valid");
    expect(result.field_results.duration).toBe("valid");
  });
});