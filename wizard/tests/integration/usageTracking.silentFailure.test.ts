import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SupabaseUsageTracker } from '../../src/services/usageTracking';
import type { UsageData } from '../../src/types/usage';
import { getSupabaseClient } from '../../src/lib/supabaseClient';

/**
 * Integration test for silent failure handling
 * Verifies that tracking errors never disrupt user experience
 */
describe('Usage Tracking - Silent Failure', () => {
  let tracker: SupabaseUsageTracker;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;
  let consoleLogSpy: any;

  beforeEach(() => {
    tracker = new SupabaseUsageTracker();

    // Spy on console methods to ensure silent failure
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should handle network errors silently', async () => {
    // Mock Supabase client to simulate network error
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        throw new Error('Network error');
      });
    }

    const usageData: UsageData = {
      buttonName: 'test-button',
      inputPhrase: 'test'
    };

    // Should NOT throw error
    await expect(tracker.track(usageData)).resolves.not.toThrow();

    // Should NOT log to console (silent failure requirement)
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('should handle Supabase client not configured', async () => {
    // This simulates VITE_SUPABASE_URL not set
    const usageData: UsageData = {
      buttonName: 'test-button'
    };

    await expect(tracker.track(usageData)).resolves.not.toThrow();

    // No console output
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should handle database constraint violations silently', async () => {
    // Try to track with invalid data that would violate constraints
    const invalidData: UsageData = {
      buttonName: '', // Empty string violates chk_button_name_not_empty constraint
      inputPhrase: 'test'
    };

    await expect(tracker.track(invalidData)).resolves.not.toThrow();

    // No console output
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should handle authentication errors silently', async () => {
    // Supabase RLS policies may reject inserts
    const usageData: UsageData = {
      buttonName: 'test-button',
      inputPhrase: 'test'
    };

    await expect(tracker.track(usageData)).resolves.not.toThrow();

    // No console output
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should reset tracking state even after failure', async () => {
    // Mock failure
    const mockSupabase = getSupabaseClient();
    if (mockSupabase) {
      vi.spyOn(mockSupabase, 'from').mockImplementation(() => {
        throw new Error('Simulated error');
      });
    }

    const usageData: UsageData = {
      buttonName: 'test-button'
    };

    await tracker.track(usageData);

    // Tracker should still reset its lock
    expect(tracker.isTracking()).toBe(false);
  });
});
