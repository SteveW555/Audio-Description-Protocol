#!/usr/bin/env python3
"""
FastAPI server for real-time validation and taxonomy services.

Provides REST endpoints for the TypeScript wizard UI to validate annotations,
fetch taxonomy terms, and generate code in various formats.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import Dict, List, Any, Optional, Literal
import json
import yaml
from datetime import datetime

from .models.musical_annotation import MusicalAnnotation, MusicalAnalysis
from .models.annotation import Annotation, TimeRange, Label, Provenance
from .taxonomy import (
    SemanticAttributes, TaxonomyValidator, QualityCategory,
    get_mood_terms, get_energy_terms, get_texture_terms, TAXONOMY_TERMS
)


app = FastAPI(
    title="Audio Description Protocol API",
    description="Real-time validation and taxonomy services for the ADP wizard",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React/Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ValidationResult(BaseModel):
    """Validation result with errors and suggestions."""
    valid: bool
    errors: List[Dict[str, Any]] = []
    warnings: List[str] = []
    suggestions: List[str] = []


class CodeGenerationRequest(BaseModel):
    """Request for code generation in various formats."""
    data: Dict[str, Any]
    format: Literal["json", "python", "yaml", "typescript"] = "json"
    include_comments: bool = True


class CodeGenerationResult(BaseModel):
    """Generated code with metadata."""
    code: str
    format: str
    valid: bool
    errors: List[str] = []


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/api/taxonomy/{category}")
async def get_taxonomy_terms(category: QualityCategory):
    """Get all taxonomy terms for a specific category."""
    try:
        if category == QualityCategory.MOOD:
            terms = get_mood_terms()
        elif category == QualityCategory.ENERGY:
            terms = get_energy_terms()
        elif category == QualityCategory.TEXTURE:
            terms = get_texture_terms()
        else:
            raise HTTPException(status_code=400, detail="Invalid category")

        return {
            "category": category,
            "terms": [term.dict() for term in terms],
            "count": len(terms)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/taxonomy/search")
async def search_taxonomy_terms(
    query: str = Query(..., min_length=2),
    category: Optional[QualityCategory] = None,
    frequency: Optional[str] = None
):
    """Search taxonomy terms by query string."""
    try:
        matching_terms = []
        search_query = query.lower()

        for term_id, term_def in TAXONOMY_TERMS.items():
            # Search in term, description, and aliases
            matches = (
                search_query in term_def.term.lower() or
                search_query in term_def.desc.lower() or
                (term_def.aliases and any(search_query in alias.lower() for alias in term_def.aliases))
            )

            if matches:
                # Apply category filter if specified
                if category:
                    # This would require categorizing terms - simplified for now
                    pass

                # Apply frequency filter if specified
                if frequency and term_def.freq.value != frequency:
                    continue

                matching_terms.append(term_def.dict())

        return {
            "query": query,
            "results": matching_terms[:20],  # Limit results
            "total_count": len(matching_terms)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/validate/semantic-attributes")
async def validate_semantic_attributes(attributes: SemanticAttributes) -> ValidationResult:
    """Validate semantic attributes against taxonomy."""
    try:
        # Use Pydantic validation
        validated_attrs = attributes

        # Get detailed validation results
        invalid_terms = validated_attrs.validate_terms()

        errors = []
        suggestions = []

        if invalid_terms:
            for category, terms in invalid_terms.items():
                for term in terms:
                    errors.append({
                        "field": f"semantic_attributes.{category}",
                        "invalid_term": term,
                        "message": f"Invalid {category} term: '{term}'"
                    })

                    # Suggest similar terms
                    similar = find_similar_terms(term, category)
                    if similar:
                        suggestions.extend([
                            f"Did you mean '{s}' instead of '{term}'?" for s in similar[:3]
                        ])

        return ValidationResult(
            valid=len(errors) == 0,
            errors=errors,
            suggestions=suggestions
        )

    except ValidationError as e:
        return ValidationResult(
            valid=False,
            errors=[{"field": err["loc"], "message": err["msg"]} for err in e.errors()]
        )


@app.post("/api/validate/musical-analysis")
async def validate_musical_analysis(analysis: MusicalAnalysis) -> ValidationResult:
    """Validate complete musical analysis."""
    try:
        # Pydantic validation happens automatically
        validated_analysis = analysis

        warnings = []
        suggestions = []

        # Add contextual warnings
        if analysis.tempo and analysis.tempo > 200:
            warnings.append("Very high tempo detected - please verify")

        if analysis.energy and analysis.valence:
            # Check for logical consistency
            if analysis.energy > 0.8 and analysis.valence < 0.3:
                warnings.append("High energy with low valence is unusual - please verify")

        return ValidationResult(
            valid=True,
            warnings=warnings,
            suggestions=suggestions
        )

    except ValidationError as e:
        errors = []
        for err in e.errors():
            errors.append({
                "field": ".".join(str(loc) for loc in err["loc"]),
                "message": err["msg"],
                "invalid_value": err.get("input")
            })

        return ValidationResult(valid=False, errors=errors)


@app.post("/api/validate/musical-annotation")
async def validate_musical_annotation(annotation_data: Dict[str, Any]) -> ValidationResult:
    """Validate complete musical annotation."""
    try:
        # Create annotation from dict - this triggers all Pydantic validators
        annotation = MusicalAnnotation.parse_obj(annotation_data)

        return ValidationResult(valid=True)

    except ValidationError as e:
        errors = []
        for err in e.errors():
            errors.append({
                "field": ".".join(str(loc) for loc in err["loc"]),
                "message": err["msg"],
                "invalid_value": err.get("input")
            })

        return ValidationResult(valid=False, errors=errors)


@app.post("/api/generate-code")
async def generate_code(request: CodeGenerationRequest) -> CodeGenerationResult:
    """Generate code in various formats from annotation data."""
    try:
        if request.format == "json":
            code = json.dumps(request.data, indent=2)

        elif request.format == "python":
            code = generate_python_code(request.data, request.include_comments)

        elif request.format == "yaml":
            code = yaml.dump(request.data, default_flow_style=False, indent=2)

        elif request.format == "typescript":
            code = generate_typescript_code(request.data, request.include_comments)

        else:
            raise ValueError(f"Unsupported format: {request.format}")

        # Validate the generated code makes sense
        validation_errors = validate_generated_code(request.data, request.format)

        return CodeGenerationResult(
            code=code,
            format=request.format,
            valid=len(validation_errors) == 0,
            errors=validation_errors
        )

    except Exception as e:
        return CodeGenerationResult(
            code="",
            format=request.format,
            valid=False,
            errors=[str(e)]
        )


def find_similar_terms(term: str, category: str) -> List[str]:
    """Find similar taxonomy terms using simple string matching."""
    similar = []
    term_lower = term.lower()

    for term_id, term_def in TAXONOMY_TERMS.items():
        # Simple similarity: starts with same letters or contains term
        if (term_def.term.lower().startswith(term_lower[:3]) and
            term_def.term.lower() != term_lower):
            similar.append(term_def.term)
        elif term_lower in term_def.term.lower() and len(similar) < 5:
            similar.append(term_def.term)

    return similar[:5]


def generate_python_code(data: Dict[str, Any], include_comments: bool = True) -> str:
    """Generate Python code from annotation data."""
    lines = []

    if include_comments:
        lines.append("# Generated Python code for Musical Annotation")
        lines.append("from adp_core.models.musical_annotation import MusicalAnnotation, MusicalAnalysis")
        lines.append("from adp_core.taxonomy import SemanticAttributes")
        lines.append("")

    # Generate semantic attributes if present
    if "musical_analysis" in data and "semantic_attributes" in data["musical_analysis"]:
        attrs = data["musical_analysis"]["semantic_attributes"]
        lines.append("semantic_attributes = SemanticAttributes(")
        for category in ["mood", "energy", "texture"]:
            if category in attrs and attrs[category]:
                terms_str = ", ".join([f'"{term}"' for term in attrs[category]])
                lines.append(f"    {category}=[{terms_str}],")
        lines.append(")")
        lines.append("")

    # Generate musical analysis
    if "musical_analysis" in data:
        analysis = data["musical_analysis"]
        lines.append("musical_analysis = MusicalAnalysis(")

        for field, value in analysis.items():
            if field == "semantic_attributes":
                lines.append("    semantic_attributes=semantic_attributes,")
            elif value is not None:
                if isinstance(value, str):
                    lines.append(f'    {field}="{value}",')
                else:
                    lines.append(f"    {field}={value},")
        lines.append(")")

    return "\n".join(lines)


def generate_typescript_code(data: Dict[str, Any], include_comments: bool = True) -> str:
    """Generate TypeScript code from annotation data."""
    lines = []

    if include_comments:
        lines.append("// Generated TypeScript code for Musical Annotation")
        lines.append("import { MusicalAnalysis, SemanticAttributes } from './generated';")
        lines.append("")

    lines.append("const musicalAnalysis: MusicalAnalysis = {")

    if "musical_analysis" in data:
        analysis = data["musical_analysis"]
        for field, value in analysis.items():
            if value is not None:
                if isinstance(value, str):
                    lines.append(f'  {field}: "{value}",')
                elif isinstance(value, list):
                    items = ", ".join([f'"{item}"' for item in value])
                    lines.append(f"  {field}: [{items}],")
                elif isinstance(value, dict):
                    # Handle nested objects like semantic_attributes
                    lines.append(f"  {field}: {{")
                    for nested_key, nested_value in value.items():
                        if isinstance(nested_value, list):
                            items = ", ".join([f'"{item}"' for item in nested_value])
                            lines.append(f'    {nested_key}: [{items}],')
                    lines.append("  },")
                else:
                    lines.append(f"  {field}: {json.dumps(value)},")

    lines.append("};")
    return "\n".join(lines)


def validate_generated_code(data: Dict[str, Any], format: str) -> List[str]:
    """Validate that generated code represents the data correctly."""
    errors = []

    # Basic validation - could be more sophisticated
    if not data:
        errors.append("No data provided for code generation")

    if format == "python" and "musical_analysis" not in data:
        errors.append("Musical analysis data required for Python code generation")

    return errors


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)