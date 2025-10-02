/**
 * TypeScript interfaces for usage tracking
 */

/**
 * Data to be tracked for a button click
 * This is the input to the tracking service
 */
export interface UsageData {
  buttonName: string;
  inputPhrase?: string | null;
  responsePhrase?: string | null;
  resultJson?: any;
}

/**
 * Complete usage record as stored in Supabase
 * Matches the adp_usage table schema
 */
export interface UsageRecord {
  id: string; // UUID
  button_clicked_name: string;
  button_clicked_time: string; // ISO 8601 timestamp
  input_phrase: string | null;
  response_phrase: string | null;
  result_json: any | null; // Generic JSON object
  created_at: string; // ISO 8601 timestamp
}

/**
 * Interface for usage tracking service implementations
 */
export interface UsageTrackingService {
  /**
   * Track a button click with associated data
   * This operation is fire-and-forget with a 750ms timeout
   * All errors are silently suppressed
   */
  track(data: UsageData): Promise<void>;

  /**
   * Check if a tracking operation is currently in progress
   * Used to prevent concurrent tracking operations
   */
  isTracking(): boolean;
}
