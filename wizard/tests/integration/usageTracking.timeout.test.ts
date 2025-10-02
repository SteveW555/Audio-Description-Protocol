import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupabaseUsageTracker } from '../../src/services/usageTracking';
import type { UsageData } from '../../src/types/usage';
import { getSupabaseClient } from '../../src/lib/supabaseClient';

/**
 * Integration test for 750ms timeout enforcement
 * Verifies that tracking operations timeout after 750ms
 */
describe('Usage Tracking - Timeout Enforcement', () => {
  let tracker: SupabaseUsageTracker;

  beforeEach(() => {
    tracker = new SupabaseUsageTracker();
  });

  it('should timeout after 750ms if Supabase insert hangs', async () => {
    // Mock Supabase to simulate slow response
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        return {
          insert: () => {
            // Simulate slow database operation (2 seconds)
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({ data: null, error: null });
              }, 2000);
            });
          }
        } as any;
      });
    }

    const usageData: UsageData = {
      buttonName: 'test-button',
      inputPhrase: 'test'
    };

    const startTime = Date.now();
    await tracker.track(usageData);
    const elapsed = Date.now() - startTime;

    // Should complete within 750ms + small buffer (800ms max)
    expect(elapsed).toBeLessThan(800);
  });

  it('should not throw error when timeout occurs', async () => {
    // Mock slow operation
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        return {
          insert: () => new Promise((resolve) => setTimeout(resolve, 2000))
        } as any;
      });
    }

    const usageData: UsageData = {
      buttonName: 'test-button'
    };

    // Should NOT throw (silent timeout)
    await expect(tracker.track(usageData)).resolves.not.toThrow();
  });

  it('should reset tracking state after timeout', async () => {
    // Mock slow operation
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        return {
          insert: () => new Promise((resolve) => setTimeout(resolve, 2000))
        } as any;
      });
    }

    const usageData: UsageData = {
      buttonName: 'test-button'
    };

    await tracker.track(usageData);

    // Tracker should reset lock after timeout
    expect(tracker.isTracking()).toBe(false);
  });

  it('should allow fast operations to complete before timeout', async () => {
    // Mock fast operation (100ms)
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        return {
          insert: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({ data: [{ id: 'test-id' }], error: null });
              }, 100);
            });
          }
        } as any;
      });
    }

    const usageData: UsageData = {
      buttonName: 'test-button',
      inputPhrase: 'fast operation'
    };

    const startTime = Date.now();
    await tracker.track(usageData);
    const elapsed = Date.now() - startTime;

    // Should complete in ~100ms (well before 750ms timeout)
    expect(elapsed).toBeGreaterThan(90);
    expect(elapsed).toBeLessThan(200);
  });
});
