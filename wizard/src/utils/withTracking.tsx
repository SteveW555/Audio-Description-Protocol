import { usageTracker } from '../services/usageTracking';
import type { UsageData } from '../types/usage';

/**
 * Higher-order function that wraps a button handler with usage tracking
 * Tracking occurs AFTER the handler completes (success or error)
 * Errors from the original handler are re-thrown to preserve behavior
 *
 * @param handler - The original button handler function
 * @param extractData - Function to extract UsageData from handler result/error
 * @returns Wrapped handler with tracking
 */
export function withTracking<TArgs extends any[], TResult>(
  handler: (...args: TArgs) => Promise<TResult> | TResult,
  extractData: (result?: TResult, error?: Error, args?: TArgs) => UsageData
) {
  return async (...args: TArgs): Promise<TResult> => {
    let result: TResult | undefined;
    let error: Error | undefined;

    try {
      // Execute original handler first
      result = await handler(...args);
    } catch (e) {
      error = e as Error;
      // Track with error context, then re-throw
      try {
        const usageData = extractData(undefined, error, args);
        usageTracker.track(usageData);
      } catch {
        // Silent failure for tracking errors
      }
      throw error;
    }

    // Track successful completion
    try {
      const usageData = extractData(result, undefined, args);
      usageTracker.track(usageData);
    } catch {
      // Silent failure for tracking errors
    }

    return result;
  };
}

/**
 * Simplified wrapper for void handlers (no return value)
 * Common for button onClick handlers that just update state
 */
export function withTrackingVoid<TArgs extends any[]>(
  handler: (...args: TArgs) => void | Promise<void>,
  extractData: (error?: Error, args?: TArgs) => UsageData
) {
  return async (...args: TArgs): Promise<void> => {
    let error: Error | undefined;

    try {
      // Execute original handler
      await handler(...args);
    } catch (e) {
      error = e as Error;
      // Track with error, then re-throw
      try {
        const usageData = extractData(error, args);
        usageTracker.track(usageData);
      } catch {
        // Silent failure
      }
      throw error;
    }

    // Track successful completion
    try {
      const usageData = extractData(undefined, args);
      usageTracker.track(usageData);
    } catch {
      // Silent failure
    }
  };
}
