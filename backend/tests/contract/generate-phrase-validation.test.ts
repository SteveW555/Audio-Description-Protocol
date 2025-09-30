import { describe, test, expect } from '@jest/globals';

/**
 * Contract Test: POST /api/generate-phrase - Validation Errors 400
 *
 * This test defines the contract for request validation.
 * It MUST FAIL until the implementation is complete.
 */
describe('POST /api/generate-phrase - Validation Contract', () => {
  test('should return 400 when genre is missing', async () => {
    const request = {
      wizardData: {
        // Missing genre (required per FR-007)
        mood: ['energetic']
      },
      sessionId: 'test-session',
      requestId: 'test-request'
    };

    const response = await fetch('http://localhost:3001/api/generate-phrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('genre');
  });

  test('should return 400 when no attributes are provided', async () => {
    const request = {
      wizardData: {
        genre: { primary: 'rock' }
        // No mood, energy, texture, instrumentation, vocals, or bpm
      },
      sessionId: 'test-session',
      requestId: 'test-request'
    };

    const response = await fetch('http://localhost:3001/api/generate-phrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toMatch(/attribute|minimum data/i);
  });

  test('should return 400 when sessionId is missing', async () => {
    const request = {
      wizardData: {
        genre: { primary: 'rock' },
        mood: ['energetic']
      },
      // Missing sessionId
      requestId: 'test-request'
    };

    const response = await fetch('http://localhost:3001/api/generate-phrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('sessionId');
  });

  test('should return 400 when requestId is missing', async () => {
    const request = {
      wizardData: {
        genre: { primary: 'rock' },
        mood: ['energetic']
      },
      sessionId: 'test-session'
      // Missing requestId
    };

    const response = await fetch('http://localhost:3001/api/generate-phrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('requestId');
  });

  test('should accept minimal valid data (genre + one attribute)', async () => {
    const request = {
      wizardData: {
        genre: { primary: 'jazz' },
        mood: ['calm']
      },
      sessionId: 'test-session',
      requestId: 'test-request'
    };

    const response = await fetch('http://localhost:3001/api/generate-phrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    // Should not be a validation error (may be 200 or other non-400 error)
    expect(response.status).not.toBe(400);
  });
});
