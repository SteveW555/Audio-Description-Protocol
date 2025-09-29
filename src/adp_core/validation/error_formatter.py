"""
Error formatting and message generation for wizard-python validation integration

Provides user-friendly error messages, suggested fixes, and proper formatting
following the clarified requirement for brief (1-2 sentences) error messages.
"""

from typing import Dict, Any, Optional
import re

from .models import ValidationError, ErrorSeverity


class ErrorFormatter:
    """
    Error message formatter for validation results

    Converts technical validation errors into user-friendly messages
    with actionable guidance, following the requirement for brief
    1-2 sentence error messages.
    """

    def __init__(self):
        """Initialize error formatter with message templates"""
        self.error_templates = {
            # Field validation errors
            'REQUIRED_FIELD_MISSING': "{{field_name}} is required.",
            'FIELD_LENGTH_INVALID': "{{field_name}} must be between {{min_length}} and {{max_length}} characters. Current length is {{current_length}}.",
            'FIELD_TYPE_INVALID': "{{field_name}} must be {{expected_type}}.",
            'FIELD_FORMAT_INVALID': "{{field_name}} format is invalid.",
            'FIELD_VALUE_INVALID': "{{field_name}} value is not valid.",

            # Numeric validation errors
            'NUMBER_TOO_SMALL': "{{field_name}} must be at least {{minimum}}. Current value is {{current_value}}.",
            'NUMBER_TOO_LARGE': "{{field_name}} must be no more than {{maximum}}. Current value is {{current_value}}.",
            'NUMBER_NEGATIVE_INVALID': "{{field_name}} must be a positive number.",

            # String validation errors
            'STRING_TOO_SHORT': "{{field_name}} is too short. Minimum length is {{min_length}} characters.",
            'STRING_TOO_LONG': "{{field_name}} is too long. Maximum length is {{max_length}} characters.",
            'STRING_PATTERN_INVALID': "{{field_name}} format is invalid.",
            'STRING_EMPTY_INVALID': "{{field_name}} cannot be empty.",

            # Array validation errors
            'ARRAY_TOO_FEW_ITEMS': "{{field_name}} must have at least {{min_items}} items.",
            'ARRAY_TOO_MANY_ITEMS': "{{field_name}} cannot have more than {{max_items}} items.",
            'ARRAY_ITEM_INVALID': "{{field_name}} contains invalid items.",

            # Object validation errors
            'OBJECT_PROPERTY_MISSING': "{{field_name}} is missing required property '{{property_name}}'.",
            'OBJECT_PROPERTY_INVALID': "{{field_name}} property '{{property_name}}' is invalid.",

            # Schema-specific errors
            'MUSICAL_TEMPO_INVALID': "Tempo must be between 1 and 300 beats per minute.",
            'MUSICAL_KEY_INVALID': "Key signature must be in format like 'C major' or 'F# minor'.",
            'MUSICAL_TIME_SIGNATURE_INVALID': "Time signature must be in format like '4/4' or '3/4'.",

            # Semantic validation errors
            'SEMANTIC_TONE_INVALID': "Emotional tone must be one of: happy, sad, neutral, energetic, calm.",
            'SEMANTIC_TAGS_EMPTY': "At least one semantic tag is required.",

            # Dataset validation errors
            'DATASET_VERSION_INVALID': "Dataset version must follow semantic versioning (e.g., '1.2.0').",
            'DATASET_ENTRIES_EMPTY': "Dataset must contain at least one entry.",

            # Taxonomy validation errors
            'TAXONOMY_VERSION_INVALID': "Taxonomy version must follow semantic versioning format.",
            'TAXONOMY_REFERENCE_INVALID': "Invalid taxonomy reference format.",

            # General validation errors
            'SCHEMA_VALIDATION_ERROR': "Validation failed against schema requirements.",
            'VALIDATION_ERROR': "An error occurred during validation.",
            'PROTOCOL_VALIDATION_ERROR': "Protocol validation failed.",
        }

        self.suggested_fixes = {
            'REQUIRED_FIELD_MISSING': "Add the {{field_name}} field to your protocol",
            'FIELD_LENGTH_INVALID': "Enter a {{field_name}} between {{min_length}} and {{max_length}} characters",
            'NUMBER_TOO_SMALL': "Enter a value of {{minimum}} or higher",
            'NUMBER_TOO_LARGE': "Enter a value of {{maximum}} or lower",
            'NUMBER_NEGATIVE_INVALID': "Enter a positive number",
            'STRING_TOO_SHORT': "Add more detail to meet the minimum length",
            'STRING_TOO_LONG': "Shorten the text to fit within {{max_length}} characters",
            'STRING_EMPTY_INVALID': "Enter some text for this field",
            'MUSICAL_TEMPO_INVALID': "Enter a tempo between 1 and 300 BPM",
            'MUSICAL_KEY_INVALID': "Use format like 'C major', 'A minor', or 'F# major'",
            'MUSICAL_TIME_SIGNATURE_INVALID': "Use format like '4/4', '3/4', or '6/8'",
            'SEMANTIC_TONE_INVALID': "Choose from: happy, sad, neutral, energetic, or calm",
            'SEMANTIC_TAGS_EMPTY': "Add at least one semantic tag to describe your content",
            'DATASET_VERSION_INVALID': "Use semantic versioning format like '1.2.0'",
            'DATASET_ENTRIES_EMPTY': "Add at least one dataset entry",
            'TAXONOMY_VERSION_INVALID': "Use semantic versioning format like '1.2.0'",
        }

    def format_error(
        self,
        error_data: Dict[str, Any],
        protocol_data: Dict[str, Any],
        schema
    ) -> ValidationError:
        """
        Format validation error with user-friendly message

        Args:
            error_data: Raw error data from validation
            protocol_data: The protocol data being validated
            schema: The validation schema being used

        Returns:
            ValidationError with formatted message and suggested fix
        """
        field_path = error_data.get('field_path', '$')
        raw_message = error_data.get('message', '')
        error_code = error_data.get('error_code', 'VALIDATION_ERROR')

        # Determine field name from path
        field_name = self._extract_field_name(field_path)

        # Generate user-friendly message
        formatted_message = self._generate_user_friendly_message(
            error_code, raw_message, field_name, field_path, protocol_data, schema
        )

        # Generate suggested fix
        suggested_fix = self._generate_suggested_fix(
            error_code, field_name, field_path, protocol_data, schema
        )

        # Ensure message is brief (1-2 sentences)
        formatted_message = self._ensure_brief_message(formatted_message)

        return ValidationError(
            field_path=field_path,
            message=formatted_message,
            error_code=error_code,
            severity=ErrorSeverity.ERROR,
            suggested_fix=suggested_fix
        )

    def _extract_field_name(self, field_path: str) -> str:
        """Extract human-readable field name from JSONPath"""
        if field_path == '$':
            return 'Protocol'

        # Remove JSONPath prefix and get last part
        field_name = field_path.replace('$.', '').split('.')[-1]

        # Convert snake_case to Title Case
        return field_name.replace('_', ' ').title()

    def _generate_user_friendly_message(
        self,
        error_code: str,
        raw_message: str,
        field_name: str,
        field_path: str,
        protocol_data: Dict[str, Any],
        schema
    ) -> str:
        """Generate user-friendly error message"""

        # Try to use predefined template
        if error_code in self.error_templates:
            template = self.error_templates[error_code]

            # Extract context for template variables
            context = self._extract_error_context(
                field_path, protocol_data, schema, raw_message
            )
            context['field_name'] = field_name

            try:
                return template.format(**context)
            except KeyError:
                # Fall back to template with just field name
                return template.replace('{{field_name}}', field_name)

        # Enhance raw message if no template available
        return self._enhance_raw_message(raw_message, field_name)

    def _extract_error_context(
        self,
        field_path: str,
        protocol_data: Dict[str, Any],
        schema,
        raw_message: str
    ) -> Dict[str, Any]:
        """Extract context information for error message templates"""
        context = {}

        # Get current field value
        current_value = self._get_field_value(protocol_data, field_path)
        if current_value is not None:
            context['current_value'] = current_value

            if isinstance(current_value, str):
                context['current_length'] = len(current_value)

        # Extract numeric constraints from schema
        schema_content = schema.schema_content
        field_schema = self._get_field_schema(schema_content, field_path)

        if field_schema:
            if 'minimum' in field_schema:
                context['minimum'] = field_schema['minimum']
            if 'maximum' in field_schema:
                context['maximum'] = field_schema['maximum']
            if 'minLength' in field_schema:
                context['min_length'] = field_schema['minLength']
            if 'maxLength' in field_schema:
                context['max_length'] = field_schema['maxLength']
            if 'minItems' in field_schema:
                context['min_items'] = field_schema['minItems']
            if 'maxItems' in field_schema:
                context['max_items'] = field_schema['maxItems']
            if 'type' in field_schema:
                context['expected_type'] = field_schema['type']

        # Extract from raw message using regex
        number_match = re.search(r'(\d+(?:\.\d+)?)', raw_message)
        if number_match:
            context.setdefault('current_value', number_match.group(1))

        return context

    def _get_field_value(self, protocol_data: Dict[str, Any], field_path: str) -> Any:
        """Get field value from protocol data using JSONPath"""
        if field_path == '$':
            return protocol_data

        try:
            path_parts = field_path.replace('$.', '').split('.')
            value = protocol_data

            for part in path_parts:
                if isinstance(value, dict) and part in value:
                    value = value[part]
                else:
                    return None

            return value
        except:
            return None

    def _get_field_schema(self, schema_content: Dict[str, Any], field_path: str) -> Optional[Dict[str, Any]]:
        """Get field-specific schema from the overall schema"""
        if field_path == '$':
            return schema_content

        try:
            field_name = field_path.replace('$.', '').split('.')[0]
            properties = schema_content.get('properties', {})
            return properties.get(field_name)
        except:
            return None

    def _enhance_raw_message(self, raw_message: str, field_name: str) -> str:
        """Enhance raw validation message for user friendliness"""
        # Replace technical terms with user-friendly equivalents
        enhanced = raw_message

        replacements = {
            'is not valid': 'is invalid',
            'does not match': 'is not in the correct format',
            'is not of type': 'must be',
            'is a required property': 'is required',
            'None is not valid': f'{field_name} is required',
        }

        for technical, friendly in replacements.items():
            enhanced = enhanced.replace(technical, friendly)

        # Ensure it starts with field name if not already
        if not enhanced.lower().startswith(field_name.lower()):
            enhanced = f"{field_name} {enhanced.lower()}"

        return enhanced

    def _generate_suggested_fix(
        self,
        error_code: str,
        field_name: str,
        field_path: str,
        protocol_data: Dict[str, Any],
        schema
    ) -> Optional[str]:
        """Generate suggested fix for the error"""

        if error_code in self.suggested_fixes:
            template = self.suggested_fixes[error_code]

            context = self._extract_error_context(
                field_path, protocol_data, schema, ''
            )
            context['field_name'] = field_name.lower()

            try:
                return template.format(**context)
            except KeyError:
                return template.replace('{{field_name}}', field_name.lower())

        # Generate generic suggested fix
        if 'required' in error_code.lower() or 'missing' in error_code.lower():
            return f"Add the {field_name.lower()} field to your protocol"
        elif 'invalid' in error_code.lower():
            return f"Check the format and value of {field_name.lower()}"
        elif 'length' in error_code.lower():
            return f"Adjust the length of {field_name.lower()}"

        return None

    def _ensure_brief_message(self, message: str) -> str:
        """Ensure message is brief (1-2 sentences maximum)"""
        # Split into sentences
        sentences = [s.strip() for s in message.split('.') if s.strip()]

        # Keep only first 2 sentences
        if len(sentences) > 2:
            sentences = sentences[:2]

        # Rejoin with periods
        return '. '.join(sentences) + '.' if sentences else message

    def format_warning_message(
        self,
        warning_code: str,
        field_name: str,
        context: Dict[str, Any] = None
    ) -> str:
        """Format warning message for non-blocking issues"""
        context = context or {}

        warning_templates = {
            'FIELD_RECOMMENDED': f"{field_name} is recommended for better protocol clarity.",
            'FIELD_TOO_LONG': f"{field_name} is quite long. Consider keeping it concise.",
            'LOW_CONFIDENCE': f"{field_name} has low confidence score. Consider reviewing the value.",
            'DEPRECATED_FIELD': f"{field_name} is deprecated. Consider using alternative fields.",
        }

        if warning_code in warning_templates:
            return warning_templates[warning_code]

        return f"{field_name} may need attention."