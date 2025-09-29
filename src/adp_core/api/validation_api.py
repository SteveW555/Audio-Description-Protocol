"""
FastAPI endpoints for wizard-python validation integration

Implements REST API endpoints for validation requests following the
OpenAPI contract specification with proper error handling and response formatting.
"""

from typing import List, Dict, Any
from uuid import UUID
import logging

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse

from ..validation.models import ValidationRequest, ValidationResult
from ..validation.service import ValidationService

# Configure logging
logger = logging.getLogger(__name__)

# Create API router
router = APIRouter(prefix="/api/v1", tags=["validation"])

# Dependency to get validation service
def get_validation_service() -> ValidationService:
    """Dependency to provide ValidationService instance"""
    return ValidationService()


@router.post(
    "/validation/validate",
    response_model=ValidationResult,
    status_code=status.HTTP_200_OK,
    summary="Validate protocol data",
    description="Validates protocol configuration against ADP schemas with field-level or full validation",
    response_description="Validation completed successfully"
)
async def validate_protocol(
    request: ValidationRequest,
    validation_service: ValidationService = Depends(get_validation_service)
) -> ValidationResult:
    """
    POST /validation/validate endpoint implementation

    Validates protocol data against specified ADP schema with support for
    field-level and full validation modes following clarified requirements.

    Args:
        request: ValidationRequest containing protocol data and validation parameters
        validation_service: Injected ValidationService instance

    Returns:
        ValidationResult with validation outcome and detailed feedback

    Raises:
        HTTPException: 400 for invalid requests, 422 for validation errors, 503 for service issues
    """
    try:
        logger.info(
            f"Validation request received: schema={request.schema_type}, "
            f"mode={request.validation_mode}, session={request.session_id}"
        )

        # Validate the protocol data
        result = await validation_service.validate_protocol(request)

        logger.info(
            f"Validation completed: valid={result.is_valid}, "
            f"errors={len(result.errors)}, warnings={len(result.warnings)}"
        )

        return result

    except ValueError as e:
        # Session validation or request parameter errors
        logger.warning(f"Invalid validation request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "INVALID_REQUEST",
                "message": str(e)
            }
        )

    except RuntimeError as e:
        # Service unavailable (schema loading failures, etc.)
        logger.error(f"Validation service error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "SERVICE_UNAVAILABLE",
                "message": "Validation service is temporarily unavailable"
            }
        )

    except Exception as e:
        # Unexpected errors
        logger.error(f"Unexpected validation error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "INTERNAL_ERROR",
                "message": "An unexpected error occurred during validation"
            }
        )


@router.get(
    "/validation/schemas",
    response_model=List[Dict[str, str]],
    status_code=status.HTTP_200_OK,
    summary="Get available validation schemas",
    description="Returns list of available ADP schemas and their versions",
    response_description="List of available schemas"
)
async def get_schemas(
    validation_service: ValidationService = Depends(get_validation_service)
) -> List[Dict[str, str]]:
    """
    GET /validation/schemas endpoint implementation

    Returns list of available ADP validation schemas including all required
    schema types (core, musical_analysis, semantic_attributes, dataset_manifest)
    with full taxonomy support as clarified in requirements.

    Args:
        validation_service: Injected ValidationService instance

    Returns:
        List of schema information dictionaries

    Raises:
        HTTPException: 503 for service issues
    """
    try:
        logger.info("Schema list request received")

        schemas = await validation_service.get_available_schemas()

        logger.info(f"Returning {len(schemas)} available schemas")

        return schemas

    except Exception as e:
        logger.error(f"Error retrieving schemas: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "SERVICE_UNAVAILABLE",
                "message": "Schema service is temporarily unavailable"
            }
        )


@router.post(
    "/validation/session",
    response_model=Dict[str, Any],
    status_code=status.HTTP_201_CREATED,
    summary="Create validation session",
    description="Creates a new validation session with locked schema rules",
    response_description="Session created successfully"
)
async def create_session(
    validation_service: ValidationService = Depends(get_validation_service)
) -> Dict[str, Any]:
    """
    POST /validation/session endpoint implementation

    Creates a new validation session with locked validation rules version
    following the clarified requirement for session-scoped rule consistency.

    Args:
        validation_service: Injected ValidationService instance

    Returns:
        Session information dictionary with session_id, validation_rules_version, created_at

    Raises:
        HTTPException: 503 for service issues
    """
    try:
        logger.info("Session creation request received")

        session_info = await validation_service.create_session()

        logger.info(f"Session created: {session_info['session_id']}")

        return session_info

    except Exception as e:
        logger.error(f"Error creating session: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "SERVICE_UNAVAILABLE",
                "message": "Session service is temporarily unavailable"
            }
        )


# Health check endpoint for monitoring
@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Returns API health status",
    include_in_schema=False  # Don't include in OpenAPI spec
)
async def health_check() -> Dict[str, str]:
    """Health check endpoint for monitoring and load balancers"""
    return {
        "status": "healthy",
        "service": "adp-validation-api",
        "version": "1.0.0"
    }


# Performance metrics endpoint for monitoring
@router.get(
    "/metrics",
    status_code=status.HTTP_200_OK,
    summary="Performance metrics",
    description="Returns performance and cache statistics",
    include_in_schema=False  # Don't include in OpenAPI spec
)
async def get_metrics() -> Dict[str, Any]:
    """Performance metrics endpoint for monitoring and optimization"""
    from ..validation.performance import get_performance_report
    return get_performance_report()


