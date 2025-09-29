# Data Model: Wizard-Python Validation Integration

**Feature**: 003-integrate-wizard-interface
**Date**: 2025-09-29

## Core Entities

### ValidationRequest
Represents a request to validate protocol data from the wizard interface.

**Attributes**:
- `protocol_data` (object): The user's protocol configuration from wizard
- `schema_type` (string): Type of ADP schema to validate against (core, musical_analysis, semantic_attributes, dataset_manifest)
- `field_path` (string, optional): Specific field path for field-level validation
- `session_id` (string): Session identifier for rule versioning
- `validation_mode` (enum): full | field | quick

**Validation Rules**:
- protocol_data must be valid JSON object
- schema_type must be one of supported ADP schema types
- field_path must follow JSONPath syntax when provided
- session_id must be UUID format

**State Transitions**:
- Created → Queued → Processing → Completed/Failed

### ValidationResult
Contains the outcome of validation with detailed feedback for the wizard interface.

**Attributes**:
- `is_valid` (boolean): Overall validation status
- `errors` (ValidationError[]): List of validation errors found
- `warnings` (ValidationWarning[]): Non-blocking validation warnings
- `field_results` (object): Field-level validation status map
- `processed_at` (datetime): When validation was completed
- `schema_version` (string): Version of schema used for validation

**Relationships**:
- One-to-one with ValidationRequest
- Contains multiple ValidationError/Warning entities

### ValidationError
Represents a specific validation failure.

**Attributes**:
- `field_path` (string): JSONPath to the failing field
- `message` (string): Brief, user-friendly error message (1-2 sentences)
- `error_code` (string): Machine-readable error identifier
- `severity` (enum): error | warning
- `suggested_fix` (string, optional): Actionable guidance for correction

**Validation Rules**:
- message must be 1-2 sentences maximum
- field_path must be valid JSONPath
- error_code must follow ADP error taxonomy

### UserSession
Maintains validation state and configuration during wizard interaction.

**Attributes**:
- `session_id` (string): Unique session identifier
- `validation_rules_version` (string): Version of validation rules active for this session
- `protocol_state` (object): Current wizard protocol configuration
- `validation_cache` (object): Cached validation results for performance
- `created_at` (datetime): Session start time
- `last_activity` (datetime): Last validation or update time

**Lifecycle**:
- Sessions expire after 24 hours of inactivity
- Validation rules remain locked to session creation version
- Protocol state persists across wizard navigation

**State Transitions**:
- Created → Active → Idle → Expired

### ValidationSchema
Represents ADP schema definitions used for validation.

**Attributes**:
- `schema_id` (string): Unique identifier for schema type
- `version` (string): Schema version (semantic versioning)
- `schema_content` (object): The JSON schema definition
- `taxonomy_rules` (object): Additional taxonomy validation rules
- `cached_at` (datetime): When schema was loaded/cached

**Relationships**:
- Referenced by ValidationRequest for schema selection
- Multiple versions can exist concurrently

## Data Flow

1. **Wizard Field Change** → ValidationRequest created with field_path
2. **ValidationRequest** → Schema loading and validation processing
3. **Validation Processing** → ValidationResult generated
4. **ValidationResult** → Sent to wizard for UI feedback
5. **UserSession** → Updated with latest protocol state and validation cache

## Integration Points

### Wizard Interface
- Sends validation requests on field blur events
- Receives ValidationResult for UI updates
- Maintains local protocol state synchronized with UserSession
- Handles offline mode when validation service unavailable

### Python Validation Framework
- Loads ADP schemas and taxonomy rules
- Processes ValidationRequest using appropriate schema
- Returns structured ValidationResult
- Manages schema caching and session persistence

## Error Handling

### Service Unavailable
- Wizard stores protocol data locally
- Validation requests queued for service return
- User can continue wizard workflow
- Clear indication of offline validation status

### Invalid Schema
- Fallback to basic JSON validation
- Error logged for schema maintenance
- User warned about reduced validation capability

### Malformed Request
- 400 Bad Request with specific error details
- Request structure validation before processing
- Clear error messages for debugging