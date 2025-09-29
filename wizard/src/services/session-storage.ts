/**
 * Session storage management for wizard-python validation integration
 *
 * Manages local session state, protocol data persistence, and validation
 * caching with support for offline operation and browser refresh recovery.
 */

import { ValidationResult, SessionInfo } from './validation-client';

// Types for session data management
export interface SessionData {
  session_id: string;
  validation_rules_version: string;
  protocol_data: Record<string, any>;
  created_at: string;
  last_activity: string;
}

export interface ValidationCacheEntry {
  result: ValidationResult;
  cached_at: string;
  protocol_hash: string;
}

export interface OfflineValidationQueue {
  id: string;
  request_data: any;
  timestamp: string;
  retry_count: number;
}

/**
 * Session storage manager for wizard validation integration
 *
 * Provides persistent storage for session data, protocol state, and
 * validation results with support for offline operation.
 */
export class SessionStorageManager {
  private readonly SESSION_KEY = 'adp_wizard_session';
  private readonly PROTOCOL_KEY = 'adp_wizard_protocol';
  private readonly VALIDATION_CACHE_KEY = 'adp_wizard_validation_cache';
  private readonly OFFLINE_QUEUE_KEY = 'adp_wizard_offline_queue';
  private readonly VALIDATION_HISTORY_KEY = 'adp_wizard_validation_history';

  private readonly CACHE_TTL_MINUTES = 5;
  private readonly SESSION_TTL_HOURS = 24;

  /**
   * Save session data to local storage
   *
   * @param sessionId Session ID to save data for
   * @param data Session data to persist
   */
  saveSessionData(sessionId: string, data: Partial<SessionData>): void {
    try {
      const existingData = this.getSessionData(sessionId) || {};

      const sessionData: SessionData = {
        session_id: sessionId,
        validation_rules_version: data.validation_rules_version || existingData.validation_rules_version || '1.2.0',
        protocol_data: data.protocol_data || existingData.protocol_data || {},
        created_at: data.created_at || existingData.created_at || new Date().toISOString(),
        last_activity: new Date().toISOString()
      };

      localStorage.setItem(`${this.SESSION_KEY}_${sessionId}`, JSON.stringify(sessionData));

      // Also save as current session
      localStorage.setItem(this.SESSION_KEY, sessionId);

      console.log(`Session data saved for ${sessionId}`);
    } catch (error) {
      console.error('Failed to save session data:', error);
    }
  }

  /**
   * Get session data from local storage
   *
   * @param sessionId Session ID to retrieve data for
   * @returns Session data or null if not found
   */
  getSessionData(sessionId: string): SessionData | null {
    try {
      const data = localStorage.getItem(`${this.SESSION_KEY}_${sessionId}`);
      if (!data) return null;

      const sessionData = JSON.parse(data) as SessionData;

      // Check if session is expired
      if (this.isSessionExpired(sessionId)) {
        this.clearSessionData(sessionId);
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Failed to get session data:', error);
      return null;
    }
  }

  /**
   * Get current active session ID
   *
   * @returns Current session ID or null if none active
   */
  getCurrentSessionId(): string | null {
    try {
      return localStorage.getItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to get current session ID:', error);
      return null;
    }
  }

  /**
   * Check if session is expired
   *
   * @param sessionId Session ID to check
   * @returns True if session is expired
   */
  isSessionExpired(sessionId: string): boolean {
    try {
      const data = localStorage.getItem(`${this.SESSION_KEY}_${sessionId}`);
      if (!data) return true;

      const sessionData = JSON.parse(data) as SessionData;
      const lastActivity = new Date(sessionData.last_activity);
      const now = new Date();
      const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

      return diffHours > this.SESSION_TTL_HOURS;
    } catch (error) {
      console.error('Failed to check session expiry:', error);
      return true;
    }
  }

  /**
   * Save protocol data for current session
   *
   * @param protocolData Protocol data to save
   */
  saveProtocolData(protocolData: Record<string, any>): void {
    try {
      const currentSessionId = this.getCurrentSessionId();
      if (!currentSessionId) {
        console.warn('No active session to save protocol data');
        return;
      }

      // Update session data with new protocol data
      this.saveSessionData(currentSessionId, { protocol_data: protocolData });

      // Also save separately for quick access
      localStorage.setItem(this.PROTOCOL_KEY, JSON.stringify(protocolData));

      console.log('Protocol data saved');
    } catch (error) {
      console.error('Failed to save protocol data:', error);
    }
  }

  /**
   * Get protocol data for current session
   *
   * @returns Protocol data or empty object if none found
   */
  getProtocolData(): Record<string, any> {
    try {
      const currentSessionId = this.getCurrentSessionId();
      if (currentSessionId) {
        const sessionData = this.getSessionData(currentSessionId);
        if (sessionData?.protocol_data) {
          return sessionData.protocol_data;
        }
      }

      // Fallback to separate storage
      const data = localStorage.getItem(this.PROTOCOL_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get protocol data:', error);
      return {};
    }
  }

  /**
   * Cache validation result for performance
   *
   * @param protocolData Protocol data that was validated
   * @param result Validation result to cache
   */
  cacheValidationResult(protocolData: Record<string, any>, result: ValidationResult): void {
    try {
      const protocolHash = this.generateHash(protocolData);
      const cacheEntry: ValidationCacheEntry = {
        result,
        cached_at: new Date().toISOString(),
        protocol_hash: protocolHash
      };

      const cacheKey = `${this.VALIDATION_CACHE_KEY}_${protocolHash}`;
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

      // Clean up old cache entries
      this.cleanupOldCacheEntries();

      console.log('Validation result cached');
    } catch (error) {
      console.error('Failed to cache validation result:', error);
    }
  }

  /**
   * Get cached validation result if available and fresh
   *
   * @param protocolData Protocol data to check cache for
   * @returns Cached validation result or null if not found/expired
   */
  getCachedValidationResult(protocolData: Record<string, any>): ValidationResult | null {
    try {
      const protocolHash = this.generateHash(protocolData);
      const cacheKey = `${this.VALIDATION_CACHE_KEY}_${protocolHash}`;
      const data = localStorage.getItem(cacheKey);

      if (!data) return null;

      const cacheEntry = JSON.parse(data) as ValidationCacheEntry;

      // Check if cache is still fresh
      const cachedAt = new Date(cacheEntry.cached_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - cachedAt.getTime()) / (1000 * 60);

      if (diffMinutes > this.CACHE_TTL_MINUTES) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cacheEntry.result;
    } catch (error) {
      console.error('Failed to get cached validation result:', error);
      return null;
    }
  }

  /**
   * Add validation request to offline queue
   *
   * @param requestData Validation request data to queue
   */
  queueOfflineValidation(requestData: any): void {
    try {
      const queue = this.getOfflineQueue();
      const queueItem: OfflineValidationQueue = {
        id: this.generateId(),
        request_data: requestData,
        timestamp: new Date().toISOString(),
        retry_count: 0
      };

      queue.push(queueItem);
      localStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue));

      console.log('Validation request queued for offline processing');
    } catch (error) {
      console.error('Failed to queue offline validation:', error);
    }
  }

  /**
   * Get offline validation queue
   *
   * @returns Array of queued validation requests
   */
  getOfflineQueue(): OfflineValidationQueue[] {
    try {
      const data = localStorage.getItem(this.OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline queue:', error);
      return [];
    }
  }

  /**
   * Clear offline validation queue
   */
  clearOfflineQueue(): void {
    try {
      localStorage.removeItem(this.OFFLINE_QUEUE_KEY);
      console.log('Offline validation queue cleared');
    } catch (error) {
      console.error('Failed to clear offline queue:', error);
    }
  }

  /**
   * Save validation history for session
   *
   * @param sessionId Session ID
   * @param history Array of validation history entries
   */
  saveValidationHistory(sessionId: string, history: any[]): void {
    try {
      const historyKey = `${this.VALIDATION_HISTORY_KEY}_${sessionId}`;
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save validation history:', error);
    }
  }

  /**
   * Get validation history for session
   *
   * @param sessionId Session ID
   * @returns Array of validation history entries
   */
  getValidationHistory(sessionId: string): any[] {
    try {
      const historyKey = `${this.VALIDATION_HISTORY_KEY}_${sessionId}`;
      const data = localStorage.getItem(historyKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get validation history:', error);
      return [];
    }
  }

  /**
   * Perform basic local validation (for offline mode)
   *
   * @param protocolData Protocol data to validate locally
   * @param schemaType Schema type to validate against
   * @returns Array of basic validation errors
   */
  validateLocally(protocolData: Record<string, any>, schemaType: string): any[] {
    const errors: any[] = [];

    try {
      // Basic validation rules for offline mode
      if (!protocolData.title || protocolData.title.trim() === '') {
        errors.push({
          field_path: '$.title',
          message: 'Title is required',
          error_code: 'REQUIRED_FIELD_MISSING',
          severity: 'error'
        });
      }

      if (protocolData.duration !== undefined && protocolData.duration < 0) {
        errors.push({
          field_path: '$.duration',
          message: 'Duration must be a positive number',
          error_code: 'NUMBER_NEGATIVE_INVALID',
          severity: 'error'
        });
      }

      // Schema-specific local validation
      if (schemaType === 'musical_analysis') {
        if (protocolData.tempo !== undefined && (protocolData.tempo < 1 || protocolData.tempo > 300)) {
          errors.push({
            field_path: '$.tempo',
            message: 'Tempo must be between 1 and 300 BPM',
            error_code: 'MUSICAL_TEMPO_INVALID',
            severity: 'error'
          });
        }
      }

    } catch (error) {
      console.error('Local validation failed:', error);
    }

    return errors;
  }

  /**
   * Clear all session data
   */
  clearSession(): void {
    try {
      const currentSessionId = this.getCurrentSessionId();
      if (currentSessionId) {
        this.clearSessionData(currentSessionId);
      }

      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.PROTOCOL_KEY);

      console.log('Session cleared');
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  /**
   * Clear session data for specific session
   *
   * @param sessionId Session ID to clear
   */
  clearSessionData(sessionId: string): void {
    try {
      localStorage.removeItem(`${this.SESSION_KEY}_${sessionId}`);
      localStorage.removeItem(`${this.VALIDATION_HISTORY_KEY}_${sessionId}`);
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }

  /**
   * Clear memory state (for testing browser refresh scenarios)
   */
  clearMemoryState(): void {
    // This method is primarily for testing purposes
    // In a real implementation, you might clear any in-memory caches here
    console.log('Memory state cleared (simulating browser refresh)');
  }

  /**
   * Get validation cache for session
   *
   * @param sessionId Session ID
   * @returns Validation cache object
   */
  getValidationCache(sessionId: string): Record<string, any> {
    try {
      // Return cache entries for this session
      const cache: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.VALIDATION_CACHE_KEY)) {
          const data = localStorage.getItem(key);
          if (data) {
            const entry = JSON.parse(data) as ValidationCacheEntry;
            cache[entry.protocol_hash] = entry.result;
          }
        }
      }
      return cache;
    } catch (error) {
      console.error('Failed to get validation cache:', error);
      return {};
    }
  }

  private generateHash(data: Record<string, any>): string {
    // Simple hash function for protocol data
    const str = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private cleanupOldCacheEntries(): void {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.VALIDATION_CACHE_KEY)) {
          const data = localStorage.getItem(key);
          if (data) {
            const entry = JSON.parse(data) as ValidationCacheEntry;
            const cachedAt = new Date(entry.cached_at);
            const now = new Date();
            const diffMinutes = (now.getTime() - cachedAt.getTime()) / (1000 * 60);

            if (diffMinutes > this.CACHE_TTL_MINUTES) {
              keysToRemove.push(key);
            }
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} old cache entries`);
      }
    } catch (error) {
      console.error('Failed to cleanup old cache entries:', error);
    }
  }
}