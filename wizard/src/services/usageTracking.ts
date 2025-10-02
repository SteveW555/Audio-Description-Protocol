import { getSupabaseClient } from '../lib/supabaseClient';
import type { UsageData, UsageTrackingService } from '../types/usage';

/**
 * Supabase implementation of usage tracking service
 * Tracks button clicks with 750ms timeout and silent failure handling
 */
export class SupabaseUsageTracker implements UsageTrackingService {
  private tracking = false;
  private readonly TIMEOUT_MS = 750;

  /**
   * Track a button click with associated data
   * This operation is fire-and-forget with a 750ms timeout
   * All errors are silently suppressed to ensure zero user impact
   */
  async track(data: UsageData): Promise<void> {
    // Ignore if already tracking (concurrent prevention)
    if (this.tracking) {
      return;
    }

    this.tracking = true;

    try {
      await this.trackWithTimeout(data);
    } catch {
      // Silent failure - no logging, no user notification
      // This is intentional per FR-010, FR-011, FR-012
    } finally {
      this.tracking = false;
    }
  }

  /**
   * Check if a tracking operation is currently in progress
   */
  isTracking(): boolean {
    return this.tracking;
  }

  /**
   * Internal method to track with 750ms timeout enforcement
   */
  private async trackWithTimeout(data: UsageData): Promise<void> {
    await Promise.race([
      this.insertToSupabase(data),
      this.createTimeoutPromise()
    ]);
  }

  /**
   * Insert usage data to Supabase adp_usage table
   */
  private async insertToSupabase(data: UsageData): Promise<void> {
    const supabase = getSupabaseClient();

    // Silent return if Supabase not configured
    if (!supabase) {
      return;
    }

    const record = {
      button_clicked_name: data.buttonName,
      button_clicked_time: new Date().toISOString(),
      input_phrase: data.inputPhrase ?? null,
      response_phrase: data.responsePhrase ?? null,
      result_json: data.resultJson ?? null
    };

    const { error } = await supabase
      .from('adp_usage')
      .insert(record);

    // Silent failure - throw to be caught by outer try/catch
    if (error) {
      throw error;
    }
  }

  /**
   * Create a promise that rejects after TIMEOUT_MS milliseconds
   */
  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Tracking timeout')), this.TIMEOUT_MS)
    );
  }
}

/**
 * Singleton instance of the usage tracker
 * Export for use in button handlers
 */
export const usageTracker = new SupabaseUsageTracker();
