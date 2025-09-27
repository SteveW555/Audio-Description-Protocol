"""
<!--
AUDIO DESCRIPTION PROTOCOL (ADP) CORE FRAMEWORK
==============================================================================
FILE PURPOSE:
    Main package initialization for the Audio Description Protocol framework.
    This file exposes the core ADP library interface and establishes the
    foundational namespace for all ADP functionality.

WHAT HAPPENS HERE:
    1. Defines the package version for semantic versioning
    2. Sets up the main ADP namespace for importing
    3. Provides package-level documentation and metadata
    4. Acts as the entry point for all ADP core functionality

ARCHITECTURAL ROLE:
    - Root namespace for the entire ADP framework
    - Version management and package metadata storage
    - Primary import interface for external users
    - Foundation for the spec-driven audio description system

DEPENDENCIES:
    None (pure Python package initialization)

USAGE PATTERNS:
    import adp_core
    from adp_core import models, validation
    from adp_core.models import Annotation, DictionaryEntry
==============================================================================
-->
"""

"""Audio Description Protocol (ADP) Framework.

A spec-driven framework for describing musical audio clips with text
to enable human-AI interoperability.
"""

__version__ = "0.1.0"