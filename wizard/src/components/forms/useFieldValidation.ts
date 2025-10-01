/**
 * Form field validation hooks for wizard interface
 *
 * Provides React hooks for real-time field validation with debouncing,
 * caching, and offline support integration.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ValidationResult, ValidationRequest, ValidationError, ValidationWarning } from '../../services/validation-client';
import { SessionStorageManager } from '../../services/session-storage';

// Types for validation hooks
export interface FieldValidationState {
  isValid: boolean;
  isValidating: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  status: 'valid' | 'invalid' | 'pending' | 'not-validated';
  lastValidated?: Date;
}

export interface ValidationHookOptions {
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  enableCaching?: boolean;
  schemaType: 'core' | 'musical_analysis' | 'semantic_attributes' | 'dataset_manifest';
  sessionId?: string;
}

export interface FormValidationState {
  isValid: boolean;
  isValidating: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  errorCount: number;
  warningCount: number;
  fieldStates: Record<string, FieldValidationState>;
  fullValidationResult?: ValidationResult;
}

/**
 * Hook for validating a single form field with real-time feedback
 *
 * Provides debounced validation with caching and offline support.
 */
export function useFieldValidation(
  fieldPath: string,
  value: any,
  protocolData: Record<string, any>,
  options: ValidationHookOptions
): FieldValidationState {
  const [state, setState] = useState<FieldValidationState>({
    isValid: true,
    isValidating: false,
    errors: [],
    warnings: [],
    status: 'not-validated'
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<any>(value);
  const sessionStorage = useRef(new SessionStorageManager());

  const {
    debounceMs = 300,
    validateOnChange = true,
    enableCaching = true,
    schemaType,
    sessionId
  } = options;

  /**
   * Perform field validation
   */
  const validateField = useCallback(async (
    fieldValue: any,
    protocolDataSnapshot: Record<string, any>
  ) => {
    try {
      setState(prev => ({ ...prev, isValidating: true, status: 'pending' }));

      // Check cache first if enabled
      if (enableCaching) {
        const cachedResult = sessionStorage.current.getCachedValidationResult(protocolDataSnapshot);
        if (cachedResult) {
          const fieldErrors = cachedResult.errors.filter(e => e.field_path === fieldPath);
          const fieldWarnings = cachedResult.warnings.filter(w => w.field_path === fieldPath);

          setState({
            isValid: fieldErrors.length === 0,
            isValidating: false,
            errors: fieldErrors,
            warnings: fieldWarnings,
            status: fieldErrors.length === 0 ? 'valid' : 'invalid',
            lastValidated: new Date()
          });
          return;
        }
      }

      // Prepare validation request
      const request: ValidationRequest = {
        protocol_data: protocolDataSnapshot,
        schema_type: schemaType,
        field_path: fieldPath,
        session_id: sessionId || 'default-session',
        validation_mode: 'field'
      };

      // Import validation client dynamically to avoid circular dependencies
      const { validationClient } = await import('../../services/validation-client');

      // Perform validation
      const result = await validationClient.validateProtocol(request);

      // Cache result if enabled
      if (enableCaching) {
        sessionStorage.current.cacheValidationResult(protocolDataSnapshot, result);
      }

      // Extract field-specific results
      const fieldErrors = result.errors.filter(e => e.field_path === fieldPath);
      const fieldWarnings = result.warnings.filter(w => w.field_path === fieldPath);

      setState({
        isValid: fieldErrors.length === 0,
        isValidating: false,
        errors: fieldErrors,
        warnings: fieldWarnings,
        status: fieldErrors.length === 0 ? 'valid' : 'invalid',
        lastValidated: new Date()
      });

    } catch (error) {
      console.error('Field validation failed:', error);

      // Try local validation as fallback
      const localErrors = sessionStorage.current.validateLocally(protocolDataSnapshot, schemaType);
      const fieldLocalErrors = localErrors.filter(e => e.field_path === fieldPath);

      setState({
        isValid: fieldLocalErrors.length === 0,
        isValidating: false,
        errors: fieldLocalErrors,
        warnings: [],
        status: fieldLocalErrors.length === 0 ? 'valid' : 'invalid',
        lastValidated: new Date()
      });
    }
  }, [fieldPath, schemaType, sessionId, enableCaching]);

  /**
   * Debounced validation trigger
   */
  const triggerValidation = useCallback((
    fieldValue: any,
    protocolDataSnapshot: Record<string, any>
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      validateField(fieldValue, protocolDataSnapshot);
    }, debounceMs);
  }, [validateField, debounceMs]);

  /**
   * Effect to handle value changes
   */
  useEffect(() => {
    if (validateOnChange && value !== lastValueRef.current) {
      lastValueRef.current = value;
      triggerValidation(value, protocolData);
    }
  }, [value, protocolData, validateOnChange, triggerValidation]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return state;
}

/**
 * Hook for validating entire form with field-level tracking
 *
 * Provides comprehensive form validation state management.
 */
export function useFormValidation(
  protocolData: Record<string, any>,
  options: ValidationHookOptions
): FormValidationState & {
  validateField: (fieldPath: string) => Promise<void>;
  validateForm: () => Promise<ValidationResult>;
  clearValidation: () => void;
  getFieldState: (fieldPath: string) => FieldValidationState;
} {
  const [formState, setFormState] = useState<FormValidationState>({
    isValid: true,
    isValidating: false,
    hasErrors: false,
    hasWarnings: false,
    errorCount: 0,
    warningCount: 0,
    fieldStates: {}
  });

  const sessionStorage = useRef(new SessionStorageManager());
  const validationRef = useRef<{ current?: ValidationResult }>({});

  const { schemaType, sessionId } = options;

  /**
   * Update form state based on field states
   */
  const updateFormState = useCallback((fieldStates: Record<string, FieldValidationState>, fullResult?: ValidationResult) => {
    const allErrors = Object.values(fieldStates).flatMap(fs => fs.errors);
    const allWarnings = Object.values(fieldStates).flatMap(fs => fs.warnings);
    const isValidating = Object.values(fieldStates).some(fs => fs.isValidating);
    const hasErrors = allErrors.length > 0;
    const isValid = !hasErrors && !isValidating;

    setFormState({
      isValid,
      isValidating,
      hasErrors,
      hasWarnings: allWarnings.length > 0,
      errorCount: allErrors.length,
      warningCount: allWarnings.length,
      fieldStates,
      fullValidationResult: fullResult
    });
  }, []);

  /**
   * Validate specific field
   */
  const validateField = useCallback(async (fieldPath: string) => {
    try {
      setFormState(prev => {
        const existingFieldState = prev.fieldStates[fieldPath];
        return {
          ...prev,
          fieldStates: {
            ...prev.fieldStates,
            [fieldPath]: existingFieldState
              ? {
                  ...existingFieldState,
                  isValidating: true,
                  status: 'pending',
                }
              : {
                  isValid: false,
                  isValidating: true,
                  errors: [],
                  warnings: [],
                  status: 'pending',
                },
          },
        };
      });

      const request: ValidationRequest = {
        protocol_data: protocolData,
        schema_type: schemaType,
        field_path: fieldPath,
        session_id: sessionId || 'default-session',
        validation_mode: 'field'
      };

      const { validationClient } = await import('../../services/validation-client');
      const result = await validationClient.validateProtocol(request);

      const fieldErrors = result.errors.filter(e => e.field_path === fieldPath);
      const fieldWarnings = result.warnings.filter(w => w.field_path === fieldPath);

      const newFieldState: FieldValidationState = {
        isValid: fieldErrors.length === 0,
        isValidating: false,
        errors: fieldErrors,
        warnings: fieldWarnings,
        status: fieldErrors.length === 0 ? 'valid' : 'invalid',
        lastValidated: new Date()
      };

      const newFieldStates = {
        ...formState.fieldStates,
        [fieldPath]: newFieldState
      };

      updateFormState(newFieldStates);

    } catch (error) {
      console.error(`Field validation failed for ${fieldPath}:`, error);

      // Set error state
      const errorState: FieldValidationState = {
        isValid: false,
        isValidating: false,
        errors: [{
          field_path: fieldPath,
          message: 'Validation temporarily unavailable',
          error_code: 'VALIDATION_UNAVAILABLE',
          severity: 'error' as const
        }],
        warnings: [],
        status: 'invalid'
      };

      const newFieldStates = {
        ...formState.fieldStates,
        [fieldPath]: errorState
      };

      updateFormState(newFieldStates);
    }
  }, [protocolData, schemaType, sessionId, formState.fieldStates, updateFormState]);

  /**
   * Validate entire form
   */
  const validateForm = useCallback(async (): Promise<ValidationResult> => {
    try {
      setFormState(prev => ({ ...prev, isValidating: true }));

      const request: ValidationRequest = {
        protocol_data: protocolData,
        schema_type: schemaType,
        session_id: sessionId || 'default-session',
        validation_mode: 'full'
      };

      const { validationClient } = await import('../../services/validation-client');
      const result = await validationClient.validateProtocol(request);

      validationRef.current.current = result;

      // Update field states based on full validation
      const newFieldStates: Record<string, FieldValidationState> = {};

      Object.keys(result.field_results).forEach(fieldPath => {
        const fieldErrors = result.errors.filter(e => e.field_path === fieldPath);
        const fieldWarnings = result.warnings.filter(w => w.field_path === fieldPath);
        const fieldStatus = result.field_results[fieldPath];

        newFieldStates[fieldPath] = {
          isValid: fieldErrors.length === 0,
          isValidating: false,
          errors: fieldErrors,
          warnings: fieldWarnings,
          status: fieldStatus as 'valid' | 'invalid' | 'pending',
          lastValidated: new Date()
        };
      });

      updateFormState(newFieldStates, result);
      return result;

    } catch (error) {
      console.error('Form validation failed:', error);
      setFormState(prev => ({ ...prev, isValidating: false }));
      throw error;
    }
  }, [protocolData, schemaType, sessionId, updateFormState]);

  /**
   * Clear all validation state
   */
  const clearValidation = useCallback(() => {
    setFormState({
      isValid: true,
      isValidating: false,
      hasErrors: false,
      hasWarnings: false,
      errorCount: 0,
      warningCount: 0,
      fieldStates: {}
    });
    validationRef.current.current = undefined;
  }, []);

  /**
   * Get validation state for specific field
   */
  const getFieldState = useCallback((fieldPath: string): FieldValidationState => {
    return formState.fieldStates[fieldPath] || {
      isValid: true,
      isValidating: false,
      errors: [],
      warnings: [],
      status: 'not-validated'
    };
  }, [formState.fieldStates]);

  return {
    ...formState,
    validateField,
    validateForm,
    clearValidation,
    getFieldState
  };
}

/**
 * Hook for real-time field validation with blur validation
 *
 * Combines change and blur validation for optimal UX.
 */
export function useFieldValidationWithBlur(
  fieldPath: string,
  value: any,
  protocolData: Record<string, any>,
  options: ValidationHookOptions
) {
  const fieldValidation = useFieldValidation(fieldPath, value, protocolData, options);

  const handleBlur = useCallback(async () => {
    if (options.validateOnBlur && fieldValidation.status === 'not-validated') {
      // Trigger immediate validation on blur if field hasn't been validated
      const { validationClient } = await import('../../services/validation-client');

      try {
        const request: ValidationRequest = {
          protocol_data: protocolData,
          schema_type: options.schemaType,
          field_path: fieldPath,
          session_id: options.sessionId || 'default-session',
          validation_mode: 'field'
        };

        await validationClient.validateProtocol(request);
      } catch (error) {
        console.error('Blur validation failed:', error);
      }
    }
  }, [fieldPath, protocolData, options, fieldValidation.status]);

  return {
    ...fieldValidation,
    handleBlur
  };
}

/**
 * Hook for batch field validation
 *
 * Validates multiple fields efficiently in a single request.
 */
export function useBatchFieldValidation(
  fieldPaths: string[],
  protocolData: Record<string, any>,
  options: ValidationHookOptions
) {
  const [batchState, setBatchState] = useState<{
    isValidating: boolean;
    results: Record<string, FieldValidationState>;
    progress: { current: number; total: number };
  }>({
    isValidating: false,
    results: {},
    progress: { current: 0, total: fieldPaths.length }
  });

  const validateBatch = useCallback(async () => {
    setBatchState(prev => ({ ...prev, isValidating: true, progress: { current: 0, total: fieldPaths.length } }));

    try {
      const { validationClient } = await import('../../services/validation-client');
      const results: Record<string, FieldValidationState> = {};

      // Validate each field
      for (let i = 0; i < fieldPaths.length; i++) {
        const fieldPath = fieldPaths[i];

        setBatchState(prev => ({
          ...prev,
          progress: { current: i + 1, total: fieldPaths.length }
        }));

        try {
          const request: ValidationRequest = {
            protocol_data: protocolData,
            schema_type: options.schemaType,
            field_path: fieldPath,
            session_id: options.sessionId || 'default-session',
            validation_mode: 'field'
          };

          const result = await validationClient.validateProtocol(request);
          const fieldErrors = result.errors.filter(e => e.field_path === fieldPath);
          const fieldWarnings = result.warnings.filter(w => w.field_path === fieldPath);

          results[fieldPath] = {
            isValid: fieldErrors.length === 0,
            isValidating: false,
            errors: fieldErrors,
            warnings: fieldWarnings,
            status: fieldErrors.length === 0 ? 'valid' : 'invalid',
            lastValidated: new Date()
          };

        } catch (error) {
          console.error(`Batch validation failed for ${fieldPath}:`, error);
          results[fieldPath] = {
            isValid: false,
            isValidating: false,
            errors: [{
              field_path: fieldPath,
              message: 'Validation failed',
              error_code: 'VALIDATION_FAILED',
              severity: 'error' as const
            }],
            warnings: [],
            status: 'invalid'
          };
        }
      }

      setBatchState({
        isValidating: false,
        results,
        progress: { current: fieldPaths.length, total: fieldPaths.length }
      });

    } catch (error) {
      console.error('Batch validation failed:', error);
      setBatchState(prev => ({ ...prev, isValidating: false }));
    }
  }, [fieldPaths, protocolData, options]);

  return {
    ...batchState,
    validateBatch
  };
}
