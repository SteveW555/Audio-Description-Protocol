import type { RateLimitState, RateLimitInfo } from '../types/index.js';

/**
 * Multi-tier rate limiter with sliding window algorithm
 * Enforces FR-015 (30/min, 1000/hour) and FR-016 (max 3 concurrent)
 */
class RateLimiter {
  private state: RateLimitState = {
    minuteTimestamps: [],
    hourTimestamps: [],
    concurrentRequests: 0,
  };

  private readonly MINUTE_LIMIT = 30; // FR-015
  private readonly HOUR_LIMIT = 1000; // FR-015
  private readonly CONCURRENT_LIMIT = 3; // FR-016

  /**
   * Sliding window: filters timestamps to those within the window
   */
  private filterTimestamps(timestamps: number[], windowMs: number): number[] {
    const now = Date.now();
    return timestamps.filter(t => now - t < windowMs);
  }

  /**
   * Clean up old timestamps to prevent memory leak
   */
  private cleanup(): void {
    const now = Date.now();
    this.state.minuteTimestamps = this.state.minuteTimestamps.filter(
      t => now - t < 60000
    );
    this.state.hourTimestamps = this.state.hourTimestamps.filter(
      t => now - t < 3600000
    );
  }

  /**
   * Checks if a request can be made without exceeding limits
   */
  public canMakeRequest(): RateLimitInfo {
    this.cleanup();

    // Check minute limit
    const minuteCount = this.filterTimestamps(
      this.state.minuteTimestamps,
      60000
    ).length;
    if (minuteCount >= this.MINUTE_LIMIT) {
      return {
        allowed: false,
        limitType: 'minute',
        current: minuteCount,
        limit: this.MINUTE_LIMIT,
        retryAfter: 60,
      };
    }

    // Check hour limit
    const hourCount = this.filterTimestamps(
      this.state.hourTimestamps,
      3600000
    ).length;
    if (hourCount >= this.HOUR_LIMIT) {
      return {
        allowed: false,
        limitType: 'hour',
        current: hourCount,
        limit: this.HOUR_LIMIT,
        retryAfter: 3600,
      };
    }

    // Check concurrent limit
    if (this.state.concurrentRequests >= this.CONCURRENT_LIMIT) {
      return {
        allowed: false,
        limitType: 'concurrent',
        current: this.state.concurrentRequests,
        limit: this.CONCURRENT_LIMIT,
        retryAfter: 10, // Estimated retry time
      };
    }

    return { allowed: true };
  }

  /**
   * Tracks a new request (adds timestamp, increments concurrent)
   */
  public trackRequest(): void {
    const now = Date.now();
    this.state.minuteTimestamps.push(now);
    this.state.hourTimestamps.push(now);
    this.state.concurrentRequests++;
  }

  /**
   * Marks a request as complete (decrements concurrent)
   */
  public completeRequest(): void {
    if (this.state.concurrentRequests > 0) {
      this.state.concurrentRequests--;
    }
  }

  /**
   * Semaphore pattern for concurrent request control
   */
  public async acquireSemaphore(): Promise<() => void> {
    // Wait until concurrent limit allows
    while (this.state.concurrentRequests >= this.CONCURRENT_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.state.concurrentRequests++;

    // Return release function
    return () => {
      this.completeRequest();
    };
  }

  /**
   * Gets current rate limit statistics
   */
  public getStats() {
    this.cleanup();
    return {
      minuteCount: this.filterTimestamps(this.state.minuteTimestamps, 60000).length,
      hourCount: this.filterTimestamps(this.state.hourTimestamps, 3600000).length,
      concurrentCount: this.state.concurrentRequests,
      minuteRemaining: this.MINUTE_LIMIT - this.filterTimestamps(this.state.minuteTimestamps, 60000).length,
      hourRemaining: this.HOUR_LIMIT - this.filterTimestamps(this.state.hourTimestamps, 3600000).length,
    };
  }

  /**
   * Resets all rate limiting state (for testing)
   */
  public reset(): void {
    this.state = {
      minuteTimestamps: [],
      hourTimestamps: [],
      concurrentRequests: 0,
    };
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Export class for testing
export { RateLimiter };
