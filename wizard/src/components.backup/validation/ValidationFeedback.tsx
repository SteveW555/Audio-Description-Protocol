/**
 * Validation feedback components for wizard interface
 *
 * Provides React components for displaying validation results with
 * proper error/warning styling and user-friendly messaging.
 */

import React from 'react';
import { ValidationResult, ValidationError, ValidationWarning } from '../../services/validation-client';

// Types for component props
interface ValidationFeedbackProps {
  result: ValidationResult | null;
  isLoading?: boolean;
  className?: string;
}

interface ValidationErrorItemProps {
  error: ValidationError;
  onFixSuggestion?: (suggestion: string) => void;
}

interface ValidationWarningItemProps {
  warning: ValidationWarning;
}

interface FieldValidationStatusProps {
  fieldPath: string;
  status: 'valid' | 'invalid' | 'pending';
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

/**
 * Main validation feedback component
 *
 * Displays comprehensive validation results including overall status,
 * errors, warnings, and field-level feedback.
 */
export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  result,
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`validation-feedback validation-loading ${className}`}>
        <div className="validation-spinner">
          <div className="spinner"></div>
          <span>Validating...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const hasErrors = result.errors.length > 0;
  const hasWarnings = result.warnings.length > 0;

  return (
    <div className={`validation-feedback ${className}`}>
      {/* Overall Status */}
      <div className={`validation-status ${result.is_valid ? 'valid' : 'invalid'}`}>
        <div className="status-indicator">
          {result.is_valid ? (
            <span className="status-icon success">✓</span>
          ) : (
            <span className="status-icon error">✗</span>
          )}
          <span className="status-text">
            {result.is_valid ? 'Valid Configuration' : 'Configuration Issues Found'}
          </span>
        </div>
        <div className="validation-summary">
          {hasErrors && (
            <span className="error-count">{result.errors.length} error{result.errors.length !== 1 ? 's' : ''}</span>
          )}
          {hasErrors && hasWarnings && <span className="separator"> • </span>}
          {hasWarnings && (
            <span className="warning-count">{result.warnings.length} warning{result.warnings.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Errors Section */}
      {hasErrors && (
        <div className="validation-errors">
          <h4 className="section-title error-title">
            <span className="section-icon">⚠️</span>
            Errors to Fix
          </h4>
          <div className="error-list">
            {result.errors.map((error, index) => (
              <ValidationErrorItem
                key={`error-${index}-${error.field_path}`}
                error={error}
              />
            ))}
          </div>
        </div>
      )}

      {/* Warnings Section */}
      {hasWarnings && (
        <div className="validation-warnings">
          <h4 className="section-title warning-title">
            <span className="section-icon">💡</span>
            Recommendations
          </h4>
          <div className="warning-list">
            {result.warnings.map((warning, index) => (
              <ValidationWarningItem
                key={`warning-${index}-${warning.field_path}`}
                warning={warning}
              />
            ))}
          </div>
        </div>
      )}

      {/* Schema Version */}
      <div className="validation-metadata">
        <small className="schema-version">
          Validated with ADP Schema v{result.schema_version}
        </small>
      </div>
    </div>
  );
};

/**
 * Individual validation error component
 *
 * Displays a single validation error with field path, message,
 * and optional suggested fix.
 */
export const ValidationErrorItem: React.FC<ValidationErrorItemProps> = ({
  error,
  onFixSuggestion
}) => {
  const handleFixClick = () => {
    if (error.suggested_fix && onFixSuggestion) {
      onFixSuggestion(error.suggested_fix);
    }
  };

  return (
    <div className="validation-error-item">
      <div className="error-header">
        <span className="field-path">{error.field_path}</span>
        <span className={`severity-badge ${error.severity}`}>
          {error.severity}
        </span>
      </div>
      <div className="error-message">
        {error.message}
      </div>
      {error.suggested_fix && (
        <div className="error-fix">
          <button
            type="button"
            className="fix-suggestion-btn"
            onClick={handleFixClick}
            title="Apply suggested fix"
          >
            💡 {error.suggested_fix}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Individual validation warning component
 *
 * Displays a single validation warning with field path and message.
 */
export const ValidationWarningItem: React.FC<ValidationWarningItemProps> = ({
  warning
}) => {
  return (
    <div className="validation-warning-item">
      <div className="warning-header">
        <span className="field-path">{warning.field_path}</span>
      </div>
      <div className="warning-message">
        {warning.message}
      </div>
    </div>
  );
};

/**
 * Field-level validation status component
 *
 * Shows validation status for a specific field with inline feedback.
 */
export const FieldValidationStatus: React.FC<FieldValidationStatusProps> = ({
  fieldPath,
  status,
  errors = [],
  warnings = []
}) => {
  const fieldErrors = errors.filter(e => e.field_path === fieldPath);
  const fieldWarnings = warnings.filter(w => w.field_path === fieldPath);

  const getStatusIcon = () => {
    switch (status) {
      case 'valid':
        return <span className="field-status-icon valid">✓</span>;
      case 'invalid':
        return <span className="field-status-icon invalid">✗</span>;
      case 'pending':
        return <span className="field-status-icon pending">⏳</span>;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    if (fieldErrors.length > 0) return 'field-invalid';
    if (fieldWarnings.length > 0) return 'field-warning';
    if (status === 'valid') return 'field-valid';
    return 'field-pending';
  };

  return (
    <div className={`field-validation-status ${getStatusClass()}`}>
      <div className="field-status-indicator">
        {getStatusIcon()}
      </div>

      {/* Field Errors */}
      {fieldErrors.length > 0 && (
        <div className="field-errors">
          {fieldErrors.map((error, index) => (
            <div key={`field-error-${index}`} className="field-error">
              <span className="field-error-message">{error.message}</span>
              {error.suggested_fix && (
                <span className="field-error-fix" title={error.suggested_fix}>
                  💡
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Field Warnings */}
      {fieldWarnings.length > 0 && (
        <div className="field-warnings">
          {fieldWarnings.map((warning, index) => (
            <div key={`field-warning-${index}`} className="field-warning">
              <span className="field-warning-message">{warning.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Validation summary component
 *
 * Provides a compact summary of validation status for overview displays.
 */
export const ValidationSummary: React.FC<{ result: ValidationResult | null }> = ({
  result
}) => {
  if (!result) {
    return <span className="validation-summary no-validation">Not validated</span>;
  }

  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;

  if (result.is_valid) {
    return (
      <span className="validation-summary valid">
        ✓ Valid
        {warningCount > 0 && (
          <span className="warning-note"> ({warningCount} warning{warningCount !== 1 ? 's' : ''})</span>
        )}
      </span>
    );
  }

  return (
    <span className="validation-summary invalid">
      ✗ {errorCount} error{errorCount !== 1 ? 's' : ''}
      {warningCount > 0 && (
        <span className="warning-note">, {warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
      )}
    </span>
  );
};

/**
 * Validation progress indicator
 *
 * Shows validation progress for multi-step or batch validation.
 */
export const ValidationProgress: React.FC<{
  current: number;
  total: number;
  currentField?: string;
}> = ({ current, total, currentField }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="validation-progress">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-text">
        <span className="progress-count">{current} of {total}</span>
        {currentField && (
          <span className="progress-field">validating {currentField}</span>
        )}
      </div>
    </div>
  );
};

// Export all components
export default ValidationFeedback;