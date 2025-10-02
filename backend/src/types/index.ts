/**
 * Backend Type Definitions for AI Phrase Generation
 */

export interface AIGenerationRequest {
  wizardData: WizardData;
  sessionId: string;
  requestId: string;
}

export interface WizardData {
  genre?: {
    primary?: string;
    secondary?: string[];
    subgenres?: string[];
  };
  mood?: string[];
  energy?: string[];
  texture?: string[];
  instrumentation?: Array<{
    instrument: string;
    role: string;
    descriptors?: string[];
    prominence?: number;
  }>;
  vocals?: {
    presence: string;
    gender?: string;
    style?: string;
    language?: string;
    descriptors?: string[];
  };
  bpm?: number;
  // Explicitly exclude music theory fields per FR-002
  // key, scale, chords are NOT included
}

export interface AIGenerationResponse {
  phrase: string;
  confidence: number;
  tokensUsed: number;
  costUSD: number;
  requestId: string;
  timestamp: string;
}

export interface RateLimitState {
  minuteTimestamps: number[];
  hourTimestamps: number[];
  concurrentRequests: number;
}

export interface CostState {
  sessionCosts: Map<string, number>;
  dailyCosts: { [date: string]: number };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  wordCount?: number;
  hasInappropriateContent?: boolean;
}

export interface EmailNotification {
  to: string;
  subject: string;
  text: string;
  limitType: 'rate' | 'cost';
  details: {
    limit: number;
    current: number;
    threshold: number;
    sessionId?: string;
    timestamp: string;
  };
}

export interface RateLimitInfo {
  allowed: boolean;
  limitType?: 'minute' | 'hour' | 'concurrent';
  current?: number;
  limit?: number;
  retryAfter?: number;
}

export interface CostLimitInfo {
  allowed: boolean;
  limitType?: 'session' | 'daily';
  current?: number;
  limit?: number;
  remaining?: number;
}

export type ErrorClassification = 'retryable' | 'terminal';

export interface ClassifiedError {
  classification: ErrorClassification;
  originalError: Error;
  statusCode?: number;
  message: string;
}
