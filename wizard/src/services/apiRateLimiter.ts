/**
 * Client-side rate limiter tracking
 * Tracks requests per minute, hour, and session
 */

interface RateLimitTracking {
  minuteTimestamps: number[];
  hourTimestamps: number[];
  sessionTotal: number;
}

const MINUTE_LIMIT = 30;
const HOUR_LIMIT = 1000;
const STORAGE_KEY = 'audio-protocol-rate-limit';

/**
 * Loads rate limit state from sessionStorage
 */
function loadState(): RateLimitTracking {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading rate limit state:', error);
  }

  return {
    minuteTimestamps: [],
    hourTimestamps: [],
    sessionTotal: 0,
  };
}

/**
 * Saves rate limit state to sessionStorage
 */
function saveState(state: RateLimitTracking): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving rate limit state:', error);
  }
}

/**
 * Filters timestamps to those within the window
 */
function filterTimestamps(timestamps: number[], windowMs: number): number[] {
  const now = Date.now();
  return timestamps.filter(t => now - t < windowMs);
}

/**
 * Checks if a request can be made
 */
export function canMakeRequest(): {
  allowed: boolean;
  minuteRemaining: number;
  hourRemaining: number;
  sessionTotal: number;
  reason?: string;
} {
  const state = loadState();

  // Filter to sliding windows
  const minuteTimestamps = filterTimestamps(state.minuteTimestamps, 60000);
  const hourTimestamps = filterTimestamps(state.hourTimestamps, 3600000);

  const minuteRemaining = MINUTE_LIMIT - minuteTimestamps.length;
  const hourRemaining = HOUR_LIMIT - hourTimestamps.length;

  if (minuteTimestamps.length >= MINUTE_LIMIT) {
    return {
      allowed: false,
      minuteRemaining: 0,
      hourRemaining,
      sessionTotal: state.sessionTotal,
      reason: 'Minute limit exceeded',
    };
  }

  if (hourTimestamps.length >= HOUR_LIMIT) {
    return {
      allowed: false,
      minuteRemaining,
      hourRemaining: 0,
      sessionTotal: state.sessionTotal,
      reason: 'Hour limit exceeded',
    };
  }

  return {
    allowed: true,
    minuteRemaining,
    hourRemaining,
    sessionTotal: state.sessionTotal,
  };
}

/**
 * Tracks a new request
 */
export function trackRequest(): void {
  const state = loadState();
  const now = Date.now();

  // Add to tracking
  state.minuteTimestamps.push(now);
  state.hourTimestamps.push(now);
  state.sessionTotal++;

  // Filter old timestamps
  state.minuteTimestamps = filterTimestamps(state.minuteTimestamps, 60000);
  state.hourTimestamps = filterTimestamps(state.hourTimestamps, 3600000);

  saveState(state);
}

/**
 * Gets current rate limit statistics
 */
export function getStats() {
  const state = loadState();

  const minuteTimestamps = filterTimestamps(state.minuteTimestamps, 60000);
  const hourTimestamps = filterTimestamps(state.hourTimestamps, 3600000);

  return {
    minuteCount: minuteTimestamps.length,
    hourCount: hourTimestamps.length,
    sessionTotal: state.sessionTotal,
    minuteRemaining: MINUTE_LIMIT - minuteTimestamps.length,
    hourRemaining: HOUR_LIMIT - hourTimestamps.length,
  };
}

/**
 * Resets rate limit tracking (for testing)
 */
export function resetTracking(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
