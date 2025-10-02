import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupabaseUsageTracker } from '../../src/services/usageTracking';
import type { UsageData } from '../../src/types/usage';

/**
 * Integration test for basic usage tracking flow
 * Verifies that button clicks are tracked and records are created
 */
describe('Usage Tracking - Basic Flow', () => {
  let tracker: SupabaseUsageTracker;

  beforeEach(() => {
    // This will fail until SupabaseUsageTracker is implemented
    tracker = new SupabaseUsageTracker();
  });

  it('should track a button click with all fields populated', async () => {
    const usageData: UsageData = {
      buttonName: 'translate-phrase',
      inputPhrase: 'chill vibes with smooth piano',
      responsePhrase: 'Ambient, relaxing mood, mellow energy, featuring Piano (melodic)',
      resultJson: {
        casualPhrase: 'chill vibes with smooth piano',
        standardizedPhrase: 'Ambient, relaxing mood, mellow energy, featuring Piano (melodic)',
        extractedTerms: {
          genre: 'Ambient',
          mood: ['relaxing'],
          energy: ['mellow']
        }
      }
    };

    // Should not throw error
    await expect(tracker.track(usageData)).resolves.not.toThrow();
  });

  it('should track a button click with null optional fields', async () => {
    const usageData: UsageData = {
      buttonName: 'randomize-all',
      inputPhrase: null,
      responsePhrase: null,
      resultJson: {
        genre: 'Electronic',
        mood: ['energetic', 'uplifting']
      }
    };

    await expect(tracker.track(usageData)).resolves.not.toThrow();
  });

  it('should track a button click with undefined optional fields', async () => {
    const usageData: UsageData = {
      buttonName: 'save-json'
      // inputPhrase, responsePhrase, resultJson intentionally omitted
    };

    await expect(tracker.track(usageData)).resolves.not.toThrow();
  });

  it('should complete tracking within reasonable time', async () => {
    const usageData: UsageData = {
      buttonName: 'test-button',
      inputPhrase: 'test',
      responsePhrase: 'test response'
    };

    const startTime = Date.now();
    await tracker.track(usageData);
    const elapsed = Date.now() - startTime;

    // Should complete within 1 second (750ms timeout + buffer)
    expect(elapsed).toBeLessThan(1000);
  });

  it('should not be tracking after completion', async () => {
    const usageData: UsageData = {
      buttonName: 'test-button'
    };

    await tracker.track(usageData);

    // Tracker should reset its lock after completion
    expect(tracker.isTracking()).toBe(false);
  });
});
