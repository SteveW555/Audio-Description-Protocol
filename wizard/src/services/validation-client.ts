/**
 * Validation client wrapper for wizard-python validation integration
 *
 * Provides a TypeScript interface to the Python validation API with
 * proper error handling, retry logic, and offline fallback support.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Types for validation requests and responses
export interface ValidationRequest {
  protocol_data: Record<string, any>;
  schema_type: 'core' | 'musical_analysis' | 'semantic_attributes' | 'dataset_manifest';
  field_path?: string;
  session_id: string;
  validation_mode: 'field' | 'full' | 'quick';
}

export interface ValidationError {
  field_path: string;
  message: string;
  error_code: string;
  severity: 'error' | 'warning';
  suggested_fix?: string;
}

export interface ValidationWarning {
  field_path: string;
  message: string;
  warning_code: string;
}

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  field_results: Record<string, 'valid' | 'invalid' | 'pending'>;
  processed_at: string;
  schema_version: string;
}

export interface SchemaInfo {
  schema_id: string;
  version: string;
  description: string;
}

export interface SessionInfo {
  session_id: string;
  validation_rules_version: string;
  created_at: string;
}

export interface ApiError {
  error: string;
  message: string;
  correlation_id?: string;
}

/**
 * Validation client for communicating with Python validation API
 *
 * Provides high-level interface for validation operations with proper
 * error handling, offline support, and retry logic.
 */
export class ValidationClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private isOnline: boolean = true;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor(baseUrl: string = 'http://localhost:8000/api/v1') {
    this.baseUrl = baseUrl;

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Setup response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleApiError(error)
    );

    // Setup request interceptor for correlation tracking
    this.client.interceptors.request.use((config) => {
      config.headers['X-Correlation-ID'] = this.generateCorrelationId();
      return config;
    });
  }

  /**
   * Validate protocol data against specified schema
   *
   * @param request Validation request parameters
   * @returns Promise resolving to validation result
   * @throws Error if validation service is unavailable and offline mode fails
   */
  async validateProtocol(request: ValidationRequest): Promise<ValidationResult> {
    try {
      const response = await this.client.post<ValidationResult>('/validation/validate', request);
      this.markOnline();
      return response.data;
    } catch (error) {
      if (this.isNetworkError(error)) {
        this.markOffline();
        throw new Error('Validation service is offline. Please continue working - your data will be validated when the service returns.');
      }
      throw this.formatError(error);
    }
  }

  /**
   * Get list of available validation schemas
   *
   * @returns Promise resolving to array of schema information
   * @throws Error if schemas cannot be retrieved
   */
  async getAvailableSchemas(): Promise<SchemaInfo[]> {
    try {
      const response = await this.client.get<SchemaInfo[]>('/validation/schemas');
      this.markOnline();
      return response.data;
    } catch (error) {
      if (this.isNetworkError(error)) {
        this.markOffline();
        // Return cached schemas or default set
        return this.getDefaultSchemas();
      }
      throw this.formatError(error);
    }
  }

  /**
   * Create a new validation session
   *
   * @returns Promise resolving to session information
   * @throws Error if session cannot be created
   */
  async createSession(): Promise<SessionInfo> {
    try {
      const response = await this.client.post<SessionInfo>('/validation/session');
      this.markOnline();
      return response.data;
    } catch (error) {
      if (this.isNetworkError(error)) {
        this.markOffline();
        // Generate offline session
        return this.createOfflineSession();
      }
      throw this.formatError(error);
    }
  }

  /**
   * Check if validation service is online
   *
   * @returns Promise resolving to true if service is available
   */
  async checkServiceHealth(): Promise<boolean> {
    try {
      await this.client.get('/health');
      this.markOnline();
      return true;
    } catch (error) {
      this.markOffline();
      return false;
    }
  }

  /**
   * Get current online status
   *
   * @returns True if service is online, false otherwise
   */
  isServiceOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Validate protocol with retry logic
   *
   * @param request Validation request parameters
   * @param maxRetries Maximum number of retry attempts
   * @returns Promise resolving to validation result
   */
  async validateWithRetry(
    request: ValidationRequest,
    maxRetries: number = this.retryAttempts
  ): Promise<ValidationResult> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.validateProtocol(request);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries && this.isRetryableError(error)) {
          await this.delay(this.retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }
        break;
      }
    }

    throw lastError!;
  }

  private handleApiError(error: AxiosError): Promise<never> {
    if (error.response) {
      // Server responded with error status
      const apiError = error.response.data as ApiError;
      throw new Error(apiError.message || 'Validation request failed');
    } else if (error.request) {
      // Request made but no response received
      this.markOffline();
      throw new Error('Unable to connect to validation service');
    } else {
      // Something else happened
      throw new Error('Validation request configuration error');
    }
  }

  private formatError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    return new Error('An unexpected validation error occurred');
  }

  private isNetworkError(error: any): boolean {
    return (
      error.code === 'ECONNREFUSED' ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'ENOTFOUND' ||
      !error.response
    );
  }

  private isRetryableError(error: any): boolean {
    if (this.isNetworkError(error)) {
      return true;
    }

    if (error.response) {
      const status = error.response.status;
      return status >= 500 || status === 429; // Server errors or rate limiting
    }

    return false;
  }

  private markOnline(): void {
    if (!this.isOnline) {
      this.isOnline = true;
      console.log('Validation service is back online');
    }
  }

  private markOffline(): void {
    if (this.isOnline) {
      this.isOnline = false;
      console.warn('Validation service is offline');
    }
  }

  private generateCorrelationId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getDefaultSchemas(): SchemaInfo[] {
    return [
      {
        schema_id: 'core',
        version: '1.2.0',
        description: 'Core Audio Description Protocol schema with taxonomy support'
      },
      {
        schema_id: 'musical_analysis',
        version: '1.2.0',
        description: 'Musical analysis schema with tempo, key, and time signature taxonomy support'
      },
      {
        schema_id: 'semantic_attributes',
        version: '1.2.0',
        description: 'Semantic attributes schema with emotional and genre taxonomy support'
      },
      {
        schema_id: 'dataset_manifest',
        version: '1.2.0',
        description: 'Dataset manifest schema with versioning and entry taxonomy support'
      }
    ];
  }

  private createOfflineSession(): SessionInfo {
    return {
      session_id: this.generateCorrelationId() + '-offline',
      validation_rules_version: '1.2.0',
      created_at: new Date().toISOString()
    };
  }
}

/**
 * Create a validation client instance with default configuration
 *
 * @param baseUrl Optional base URL for the validation API
 * @returns Configured ValidationClient instance
 */
export function createValidationClient(baseUrl?: string): ValidationClient {
  return new ValidationClient(baseUrl);
}

/**
 * Default validation client instance
 * Can be imported and used directly for simple use cases
 */
export const validationClient = createValidationClient();