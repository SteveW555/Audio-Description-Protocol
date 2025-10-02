import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupabaseUsageTracker } from '../../src/services/usageTracking';
import type { UsageData } from '../../src/types/usage';
import { getSupabaseClient } from '../../src/lib/supabaseClient';

/**
 * Integration test for concurrent click prevention
 * Verifies that only the first tracking operation proceeds when multiple clicks occur rapidly
 */
describe('Usage Tracking - Concurrent Prevention', () => {
  let tracker: SupabaseUsageTracker;
  let insertCallCount: number;

  beforeEach(() => {
    tracker = new SupabaseUsageTracker();
    insertCallCount = 0;

    // Mock Supabase to track insert call count
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        return {
          insert: () => {
            insertCallCount++;
            // Simulate slow operation to keep tracking state active
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({ data: [{ id: 'test-id' }], error: null });
              }, 200);
            });
          }
        } as any;
      });
    }
  });

  it('should ignore concurrent tracking requests', async () => {
    const usageData1: UsageData = { buttonName: 'test-button-1' };
    const usageData2: UsageData = { buttonName: 'test-button-2' };
    const usageData3: UsageData = { buttonName: 'test-button-3' };

    // Fire 3 tracking requests rapidly
    const promise1 = tracker.track(usageData1);
    const promise2 = tracker.track(usageData2); // Should be ignored
    const promise3 = tracker.track(usageData3); // Should be ignored

    await Promise.all([promise1, promise2, promise3]);

    // Only 1 insert should have been attempted (first call)
    expect(insertCallCount).toBe(1);
  });

  it('should return isTracking true while tracking in progress', async () => {
    const usageData: UsageData = { buttonName: 'test-button' };

    // Start tracking (slow operation)
    const trackingPromise = tracker.track(usageData);

    // Check immediately - should be tracking
    expect(tracker.isTracking()).toBe(true);

    // Wait for completion
    await trackingPromise;

    // Should no longer be tracking
    expect(tracker.isTracking()).toBe(false);
  });

  it('should allow sequential tracking after first completes', async () => {
    const usageData1: UsageData = { buttonName: 'test-button-1' };
    const usageData2: UsageData = { buttonName: 'test-button-2' };

    // First tracking
    await tracker.track(usageData1);

    // Reset counter
    insertCallCount = 0;

    // Second tracking (should succeed since first completed)
    await tracker.track(usageData2);

    // Second insert should have been attempted
    expect(insertCallCount).toBe(1);
  });

  it('should handle rapid clicks with proper lock management', async () => {
    const usageDataArray = Array.from({ length: 10 }, (_, i) => ({
      buttonName: `test-button-${i}`
    }));

    // Fire 10 rapid tracking requests
    const promises = usageDataArray.map(data => tracker.track(data));

    await Promise.all(promises);

    // Only 1 insert should have occurred (others ignored due to lock)
    expect(insertCallCount).toBe(1);

    // Tracker should be unlocked after all complete
    expect(tracker.isTracking()).toBe(false);
  });

  it('should reset lock after timeout even with concurrent requests', async () => {
    // Mock very slow operation (will timeout)
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        return {
          insert: () => new Promise((resolve) => setTimeout(resolve, 2000))
        } as any;
      });
    }

    const usageData1: UsageData = { buttonName: 'test-button-1' };
    const usageData2: UsageData = { buttonName: 'test-button-2' };

    // Start tracking (will timeout after 750ms)
    const promise1 = tracker.track(usageData1);

    // Try concurrent request
    const promise2 = tracker.track(usageData2);

    await Promise.all([promise1, promise2]);

    // Lock should be released after timeout
    expect(tracker.isTracking()).toBe(false);
  });
});
