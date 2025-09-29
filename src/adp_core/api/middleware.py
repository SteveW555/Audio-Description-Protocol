"""
Middleware for wizard-python validation integration

Provides CORS handling, error processing, request logging, and security
middleware for the FastAPI validation service.
"""

import time
import logging
from typing import Callable
from uuid import uuid4

from fastapi import Request, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

# Configure logging
logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Request logging middleware

    Logs all incoming requests with timing information and correlation IDs
    for debugging and monitoring purposes.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Process request with logging"""

        # Generate correlation ID for request tracking
        correlation_id = str(uuid4())[:8]
        request.state.correlation_id = correlation_id

        # Log request start
        start_time = time.time()
        logger.info(
            f"[{correlation_id}] {request.method} {request.url.path} - "
            f"Client: {request.client.host if request.client else 'unknown'}"
        )

        # Process request
        try:
            response = await call_next(request)

            # Log successful response
            duration = time.time() - start_time
            logger.info(
                f"[{correlation_id}] {response.status_code} - "
                f"Duration: {duration:.3f}s"
            )

            # Add correlation ID to response headers
            response.headers["X-Correlation-ID"] = correlation_id

            return response

        except Exception as e:
            # Log error
            duration = time.time() - start_time
            logger.error(
                f"[{correlation_id}] Error: {str(e)} - "
                f"Duration: {duration:.3f}s",
                exc_info=True
            )

            # Return error response
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred",
                    "correlation_id": correlation_id
                },
                headers={"X-Correlation-ID": correlation_id}
            )


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """
    Global error handling middleware

    Catches unhandled exceptions and formats them into consistent
    JSON error responses following the API contract.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Process request with error handling"""

        try:
            return await call_next(request)

        except HTTPException:
            # Re-raise HTTP exceptions (handled by FastAPI)
            raise

        except ValueError as e:
            # Handle validation errors
            correlation_id = getattr(request.state, 'correlation_id', 'unknown')
            logger.warning(f"[{correlation_id}] Validation error: {str(e)}")

            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "error": "VALIDATION_ERROR",
                    "message": str(e),
                    "correlation_id": correlation_id
                }
            )

        except RuntimeError as e:
            # Handle service errors
            correlation_id = getattr(request.state, 'correlation_id', 'unknown')
            logger.error(f"[{correlation_id}] Service error: {str(e)}")

            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={
                    "error": "SERVICE_UNAVAILABLE",
                    "message": "Service is temporarily unavailable",
                    "correlation_id": correlation_id
                }
            )

        except Exception as e:
            # Handle unexpected errors
            correlation_id = getattr(request.state, 'correlation_id', 'unknown')
            logger.error(
                f"[{correlation_id}] Unexpected error: {str(e)}",
                exc_info=True
            )

            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred",
                    "correlation_id": correlation_id
                }
            )


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Security headers middleware

    Adds security headers to all responses for basic protection
    against common web vulnerabilities.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        """Process request and add security headers"""

        response = await call_next(request)

        # Add security headers
        response.headers.update({
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Content-Security-Policy": "default-src 'self'",
        })

        return response


def setup_cors_middleware(app) -> None:
    """
    Configure CORS middleware for wizard interface communication

    Sets up CORS to allow the TypeScript wizard interface to communicate
    with the Python validation API following security best practices.

    Args:
        app: FastAPI application instance
    """

    # Configure CORS for wizard interface
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",  # React development server
            "http://localhost:8080",  # Alternative dev server
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8080",
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Accept",
            "Accept-Language",
            "Content-Language",
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "X-Correlation-ID",
        ],
        expose_headers=[
            "X-Correlation-ID",
            "X-Total-Count",
        ],
        max_age=600,  # Cache preflight requests for 10 minutes
    )


def setup_middleware(app) -> None:
    """
    Setup all middleware for the FastAPI application

    Configures middleware in the correct order for proper request/response
    processing including CORS, logging, error handling, and security.

    Args:
        app: FastAPI application instance
    """

    # Add middleware in reverse order (last added = first executed)

    # 1. Security headers (closest to response)
    app.add_middleware(SecurityHeadersMiddleware)

    # 2. Error handling
    app.add_middleware(ErrorHandlingMiddleware)

    # 3. Request logging
    app.add_middleware(RequestLoggingMiddleware)

    # 4. CORS (closest to request)
    setup_cors_middleware(app)

    logger.info("Middleware configured successfully")


# Custom exception handlers
async def validation_exception_handler(request: Request, exc: ValueError) -> JSONResponse:
    """Handle validation exceptions"""
    correlation_id = getattr(request.state, 'correlation_id', 'unknown')

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "VALIDATION_FAILED",
            "message": str(exc),
            "correlation_id": correlation_id
        }
    )


async def service_exception_handler(request: Request, exc: RuntimeError) -> JSONResponse:
    """Handle service exceptions"""
    correlation_id = getattr(request.state, 'correlation_id', 'unknown')

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "error": "SERVICE_ERROR",
            "message": "Service is temporarily unavailable",
            "correlation_id": correlation_id
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle HTTP exceptions with consistent format"""
    correlation_id = getattr(request.state, 'correlation_id', 'unknown')

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP_ERROR",
            "message": exc.detail,
            "correlation_id": correlation_id
        }
    )