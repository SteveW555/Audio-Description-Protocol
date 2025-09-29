"""
Validation service coordinator for wizard-python validation integration

Central coordinator that orchestrates validation requests, schema loading,
session management, and error formatting for the wizard interface.
"""

from typing import Dict, Any, List, Optional
from uuid import UUID
import asyncio
from datetime import datetime

from .models import (
    ValidationRequest, ValidationResult, ValidationError, ValidationWarning,
    SchemaType, ValidationMode, ErrorSeverity
)
from .schema_loader import SchemaLoader
from .session_manager import SessionManager
from .error_formatter import ErrorFormatter
from .performance import (
    validation_cache, performance_monitor, validation_pool,
    optimize_for_field_validation, batch_validation_optimization
)


class ValidationService:
    """
    Central validation service coordinator

    Orchestrates all validation operations including schema loading,
    session management, protocol validation, and error formatting
    following the clarified requirements.
    """

    def __init__(self):
        """Initialize validation service with all required components"""
        self.schema_loader = SchemaLoader()
        self.session_manager = SessionManager()
        self.error_formatter = ErrorFormatter()

    @performance_monitor.track_validation_time('protocol_validation')
    @optimize_for_field_validation
    async def validate_protocol(self, request: ValidationRequest) -> ValidationResult:
        """
        Validate protocol data according to request specifications

        Args:
            request: ValidationRequest with protocol data and parameters

        Returns:
            ValidationResult with validation outcome and detailed feedback

        Raises:
            ValueError: If session is invalid or expired
            RuntimeError: If schema loading fails
        """
        # Check cache first for performance
        cached_result = validation_cache.get_validation_result(
            request.protocol_data,
            request.schema_type,
            request.validation_mode,
            request.field_path
        )
        if cached_result:
            return cached_result

        # Verify session exists and is valid
        session = self.session_manager.get_session(request.session_id)
        if not session:
            raise ValueError(f"Invalid or expired session: {request.session_id}")

        # Load appropriate schema with caching
        schema = validation_cache.get_schema(request.schema_type, session.validation_rules_version)
        if not schema:
            schema = self.schema_loader.get_schema(request.schema_type)
            if not schema:
                raise RuntimeError(f"Schema not available: {request.schema_type}")
            validation_cache.put_schema(request.schema_type, session.validation_rules_version, schema)

        # Perform validation
        start_time = datetime.utcnow()

        if request.validation_mode == ValidationMode.FIELD:
            validation_result = await self._validate_field(
                request.protocol_data,
                request.field_path,
                schema,
                session
            )
        elif request.validation_mode == ValidationMode.FULL:
            validation_result = await self._validate_full_protocol(
                request.protocol_data,
                schema,
                session
            )
        else:  # ValidationMode.QUICK
            validation_result = await self._validate_quick(
                request.protocol_data,
                schema,
                session
            )

        # Add processing metadata
        validation_result.processed_at = datetime.utcnow()
        validation_result.schema_version = session.validation_rules_version

        # Cache result in performance cache
        validation_cache.put_validation_result(
            request.protocol_data,
            request.schema_type,
            request.validation_mode,
            validation_result,
            request.field_path
        )

        # Also cache in session for backward compatibility
        if request.validation_mode == ValidationMode.FULL:
            session.cache_validation_result(request.protocol_data, validation_result.dict())

        # Update session activity
        session.update_activity()

        return validation_result

    async def _validate_field(
        self,
        protocol_data: Dict[str, Any],
        field_path: Optional[str],
        schema,
        session
    ) -> ValidationResult:
        """
        Validate specific field in protocol data

        Args:
            protocol_data: Protocol data to validate
            field_path: JSONPath to specific field
            schema: ValidationSchema to use
            session: UserSession for context

        Returns:
            ValidationResult focused on the specified field
        """
        errors = []
        warnings = []
        field_results = {}

        try:
            # Extract field value using JSONPath
            field_value = self._extract_field_value(protocol_data, field_path)
            field_name = field_path.replace('$.', '') if field_path else 'root'

            # Validate field against schema
            field_errors = schema.validate_protocol_data(protocol_data)

            # Filter errors for this specific field
            field_specific_errors = [
                error for error in field_errors
                if error.get('field_path') == field_path or not field_path
            ]

            # Format errors with user-friendly messages
            for error_data in field_specific_errors:
                formatted_error = self.error_formatter.format_error(
                    error_data, protocol_data, schema
                )
                errors.append(formatted_error)

            # Determine field status
            field_results[field_name] = 'invalid' if field_specific_errors else 'valid'

            # Check for warnings (non-blocking issues)
            field_warnings = self._check_field_warnings(protocol_data, field_path, schema)
            warnings.extend(field_warnings)

        except Exception as e:
            # Handle validation errors gracefully
            error = ValidationError(
                field_path=field_path or '$',
                message=f"Validation failed: {str(e)}",
                error_code="VALIDATION_ERROR",
                severity=ErrorSeverity.ERROR
            )
            errors.append(error)
            field_results[field_path.replace('$.', '') if field_path else 'root'] = 'invalid'

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            field_results=field_results,
            schema_version=session.validation_rules_version
        )

    async def _validate_full_protocol(
        self,
        protocol_data: Dict[str, Any],
        schema,
        session
    ) -> ValidationResult:
        """
        Validate entire protocol against schema

        Args:
            protocol_data: Complete protocol data to validate
            schema: ValidationSchema to use
            session: UserSession for context

        Returns:
            ValidationResult with comprehensive validation assessment
        """
        errors = []
        warnings = []
        field_results = {}

        try:
            # Validate against JSON schema
            schema_errors = schema.validate_protocol_data(protocol_data)

            # Format all errors with brief, user-friendly messages
            for error_data in schema_errors:
                formatted_error = self.error_formatter.format_error(
                    error_data, protocol_data, schema
                )
                errors.append(formatted_error)

            # Generate field-level status map
            field_results = self._generate_field_status_map(
                protocol_data, schema_errors, schema
            )

            # Check for warnings across all fields
            warnings = self._check_protocol_warnings(protocol_data, schema)

            # Validate taxonomy compliance (constitutional requirement)
            taxonomy_errors = self._validate_taxonomy_requirements(protocol_data, schema)
            errors.extend(taxonomy_errors)

        except Exception as e:
            # Handle validation service errors
            error = ValidationError(
                field_path='$',
                message=f"Protocol validation failed: {str(e)}",
                error_code="PROTOCOL_VALIDATION_ERROR",
                severity=ErrorSeverity.ERROR
            )
            errors.append(error)

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            field_results=field_results,
            schema_version=session.validation_rules_version
        )

    async def _validate_quick(
        self,
        protocol_data: Dict[str, Any],
        schema,
        session
    ) -> ValidationResult:
        """
        Quick validation focusing on critical errors only

        Args:
            protocol_data: Protocol data to validate
            schema: ValidationSchema to use
            session: UserSession for context

        Returns:
            ValidationResult with quick validation assessment
        """
        # Quick validation only checks required fields and basic types
        errors = []
        field_results = {}

        try:
            # Check required fields from schema
            schema_content = schema.schema_content
            required_fields = schema_content.get('required', [])

            for field in required_fields:
                if field not in protocol_data:
                    error = ValidationError(
                        field_path=f'$.{field}',
                        message=f"{field.replace('_', ' ').title()} is required.",
                        error_code="REQUIRED_FIELD_MISSING",
                        severity=ErrorSeverity.ERROR,
                        suggested_fix=f"Add the {field} field to your protocol"
                    )
                    errors.append(error)
                    field_results[field] = 'invalid'
                else:
                    field_results[field] = 'valid'

        except Exception as e:
            error = ValidationError(
                field_path='$',
                message=f"Quick validation failed: {str(e)}",
                error_code="QUICK_VALIDATION_ERROR",
                severity=ErrorSeverity.ERROR
            )
            errors.append(error)

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=[],
            field_results=field_results,
            schema_version=session.validation_rules_version
        )

    def _extract_field_value(self, protocol_data: Dict[str, Any], field_path: Optional[str]) -> Any:
        """Extract field value using JSONPath"""
        if not field_path or field_path == '$':
            return protocol_data

        # Simple JSONPath implementation for basic paths
        path_parts = field_path.replace('$.', '').split('.')
        value = protocol_data

        for part in path_parts:
            if isinstance(value, dict) and part in value:
                value = value[part]
            else:
                return None

        return value

    def _generate_field_status_map(
        self,
        protocol_data: Dict[str, Any],
        errors: List[Dict[str, Any]],
        schema
    ) -> Dict[str, str]:
        """Generate field-level validation status map"""
        field_results = {}
        error_fields = {error.get('field_path', '').replace('$.', '') for error in errors}

        # Mark all top-level fields
        for field in protocol_data.keys():
            field_results[field] = 'invalid' if field in error_fields else 'valid'

        # Mark required fields that might be missing
        schema_content = schema.schema_content
        required_fields = schema_content.get('required', [])

        for field in required_fields:
            if field not in field_results:
                field_results[field] = 'invalid'

        return field_results

    def _check_field_warnings(
        self,
        protocol_data: Dict[str, Any],
        field_path: Optional[str],
        schema
    ) -> List[ValidationWarning]:
        """Check for field-specific warnings"""
        warnings = []

        # Example: Check for recommended but not required fields
        if field_path == '$.description':
            description = self._extract_field_value(protocol_data, field_path)
            if not description or (isinstance(description, str) and len(description.strip()) == 0):
                warning = ValidationWarning(
                    field_path=field_path,
                    message="Description is recommended for better protocol clarity.",
                    warning_code="FIELD_RECOMMENDED"
                )
                warnings.append(warning)

        return warnings

    def _check_protocol_warnings(
        self,
        protocol_data: Dict[str, Any],
        schema
    ) -> List[ValidationWarning]:
        """Check for protocol-wide warnings"""
        warnings = []

        # Example: Check for unusually long descriptions
        description = protocol_data.get('description', '')
        if isinstance(description, str) and len(description) > 500:
            warning = ValidationWarning(
                field_path='$.description',
                message="Description is quite long. Consider keeping it concise.",
                warning_code="FIELD_TOO_LONG"
            )
            warnings.append(warning)

        return warnings

    def _validate_taxonomy_requirements(
        self,
        protocol_data: Dict[str, Any],
        schema
    ) -> List[ValidationError]:
        """Validate taxonomy compliance (constitutional requirement)"""
        errors = []

        # Check taxonomy version format if present
        taxonomy_version = protocol_data.get('taxonomy_version')
        if taxonomy_version and not self._is_valid_semantic_version(taxonomy_version):
            error = ValidationError(
                field_path='$.taxonomy_version',
                message='Taxonomy version must follow semantic versioning format.',
                error_code='TAXONOMY_VERSION_INVALID',
                severity=ErrorSeverity.ERROR,
                suggested_fix='Use format like "1.2.0"'
            )
            errors.append(error)

        return errors

    def _is_valid_semantic_version(self, version: str) -> bool:
        """Check if version follows semantic versioning"""
        import re
        pattern = r'^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?(?:\+[a-zA-Z0-9-]+)?$'
        return bool(re.match(pattern, version))

    async def get_available_schemas(self) -> List[Dict[str, str]]:
        """
        Get list of available validation schemas

        Returns:
            List of schema information dictionaries
        """
        schemas = self.schema_loader.get_all_schemas()

        return [
            {
                'schema_id': schema.schema_id,
                'version': schema.version,
                'description': schema.description
            }
            for schema in schemas
        ]

    async def create_session(self) -> Dict[str, Any]:
        """
        Create new validation session

        Returns:
            Session information dictionary
        """
        session = self.session_manager.create_session()

        return {
            'session_id': str(session.session_id),
            'validation_rules_version': session.validation_rules_version,
            'created_at': session.created_at.isoformat()
        }