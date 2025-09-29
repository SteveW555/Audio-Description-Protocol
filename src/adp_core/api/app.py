"""
FastAPI application setup and routing for wizard-python validation integration

Main application factory that configures FastAPI with all routes, middleware,
and dependencies for the validation service.
"""

import logging
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .validation_api import router as validation_router
from .middleware import setup_middleware, validation_exception_handler, service_exception_handler, http_exception_handler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan management

    Handles startup and shutdown events for the FastAPI application,
    including service initialization and cleanup.
    """
    # Startup
    logger.info("Starting ADP Validation API service...")

    # Initialize services here if needed
    # validation_service = ValidationService()

    logger.info("ADP Validation API service started successfully")

    yield

    # Shutdown
    logger.info("Shutting down ADP Validation API service...")

    # Cleanup services here if needed

    logger.info("ADP Validation API service shutdown complete")


def create_app() -> FastAPI:
    """
    Create and configure FastAPI application

    Factory function that creates a fully configured FastAPI application
    with all routes, middleware, and error handlers for the validation service.

    Returns:
        Configured FastAPI application instance
    """

    # Create FastAPI app with metadata
    app = FastAPI(
        title="ADP Wizard Validation API",
        description="Real-time validation service for Audio Description Protocol wizard interface",
        version="1.0.0",
        contact={
            "name": "ADP Development Team",
        },
        servers=[
            {
                "url": "http://localhost:8000/api/v1",
                "description": "Development server"
            }
        ],
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    # Setup middleware (CORS, logging, error handling, security)
    setup_middleware(app)

    # Register routers
    app.include_router(validation_router)

    # Register custom exception handlers
    app.add_exception_handler(ValueError, validation_exception_handler)
    app.add_exception_handler(RuntimeError, service_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)

    # Root endpoint
    @app.get(
        "/",
        summary="API Root",
        description="Returns API information and health status",
        response_model=Dict[str, Any]
    )
    async def root() -> Dict[str, Any]:
        """Root endpoint providing API information"""
        return {
            "service": "ADP Wizard Validation API",
            "version": "1.0.0",
            "description": "Real-time validation service for Audio Description Protocol wizard interface",
            "status": "operational",
            "endpoints": {
                "validation": "/api/v1/validation/validate",
                "schemas": "/api/v1/validation/schemas",
                "session": "/api/v1/validation/session",
                "health": "/api/v1/health",
                "docs": "/docs",
                "openapi": "/openapi.json"
            }
        }

    # API info endpoint
    @app.get(
        "/api/v1/info",
        summary="API Information",
        description="Returns detailed API information and capabilities",
        response_model=Dict[str, Any]
    )
    async def api_info() -> Dict[str, Any]:
        """API information endpoint"""
        return {
            "service": "ADP Wizard Validation API",
            "version": "1.0.0",
            "features": [
                "Real-time field validation",
                "Full protocol validation",
                "Schema-specific validation",
                "Session-scoped rule versioning",
                "Offline validation fallback support",
                "Comprehensive error reporting"
            ],
            "supported_schemas": [
                "core",
                "musical_analysis",
                "semantic_attributes",
                "dataset_manifest"
            ],
            "validation_modes": [
                "field",
                "full",
                "quick"
            ],
            "constitutional_compliance": {
                "python_pytorch_first": True,
                "json_schema_compliance": True,
                "library_first_modularity": True,
                "test_driven_delivery": True
            }
        }

    logger.info("FastAPI application created and configured")

    return app


# Create the app instance
app = create_app()


# Additional startup configuration
@app.on_event("startup")
async def startup_event():
    """Additional startup configuration"""
    logger.info("Performing additional startup configuration...")

    # Log configuration summary
    logger.info("Configuration summary:")
    logger.info(f"  - Title: {app.title}")
    logger.info(f"  - Version: {app.version}")
    logger.info(f"  - Docs URL: {app.docs_url}")
    logger.info(f"  - OpenAPI URL: {app.openapi_url}")

    logger.info("Startup configuration complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Additional shutdown tasks"""
    logger.info("Performing shutdown tasks...")

    # Add any cleanup tasks here

    logger.info("Shutdown tasks complete")


# For development server
if __name__ == "__main__":
    import uvicorn

    logger.info("Starting development server...")

    uvicorn.run(
        "src.adp_core.api.app:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )