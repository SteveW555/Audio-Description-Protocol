import { describe, test, expect } from '@jest/globals';

/**
 * Contract Test: POST /api/generate-phrase - Success 200
 *
 * This test defines the contract for successful phrase generation.
 * It MUST FAIL until the implementation is complete.
 */
describe('POST /api/generate-phrase - Success Contract', () => {
  test('should return 200 with valid phrase for complete wizard data', async () => {
    const request = {
      wizardData: {
        genre: { primary: 'rock' },
        mood: ['energetic', 'upbeat'],
        energy: ['high-energy'],
        texture: ['layered'],
        instrumentation: [
          { instrument: 'guitar', role: 'lead' },
          { instrument: 'drums', role: 'percussion' }
        ],
        vocals: { presence: 'lead' },
        bpm: 120
      },
      sessionId: 'test-session-123',
      requestId: 'test-request-456'
    };

    // This will fail until the API endpoint is implemented
    const response = await fetch('http://localhost:3001/api/generate-phrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(200);

    const data = await response.json() as any;
    expect(data).toHaveProperty('phrase');
    expect(data).toHaveProperty('confidence');
    expect(data).toHaveProperty('tokensUsed');
    expect(data).toHaveProperty('costUSD');
    expect(data).toHaveProperty('requestId', request.requestId);
    expect(data).toHaveProperty('timestamp');

    // Validate phrase format
    expect(typeof data.phrase).toBe('string');
    expect(data.phrase.length).toBeGreaterThanOrEqual(10);
    expect(data.phrase.length).toBeLessThanOrEqual(200);

    // Validate word count (10-30 words per FR-014)
    const wordCount = data.phrase.split(/\s+/).length;
    expect(wordCount).toBeGreaterThanOrEqual(10);
    expect(wordCount).toBeLessThanOrEqual(30);

    // Validate numeric fields
    expect(data.confidence).toBeGreaterThanOrEqual(0);
    expect(data.confidence).toBeLessThanOrEqual(1);
    expect(data.tokensUsed).toBeGreaterThan(0);
    expect(data.tokensUsed).toBeLessThanOrEqual(900);
    expect(data.costUSD).toBeGreaterThan(0);
  });
});
