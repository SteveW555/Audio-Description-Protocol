"""
Session management for wizard-python validation integration

Handles user session persistence, validation rule versioning, and
state management during wizard interactions.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class UserSession(BaseModel):
    """
    Model for user session management

    Maintains validation state and configuration during wizard interaction,
    with session-scoped rule versioning and expiration handling.
    """
    session_id: UUID = Field(
        default_factory=uuid4,
        description="Unique session identifier"
    )
    validation_rules_version: str = Field(
        ...,
        description="Version of validation rules active for this session"
    )
    protocol_state: Dict[str, Any] = Field(
        default_factory=dict,
        description="Current wizard protocol configuration"
    )
    validation_cache: Dict[str, Any] = Field(
        default_factory=dict,
        description="Cached validation results for performance"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Session start time"
    )
    last_activity: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last validation or update time"
    )

    def is_expired(self, expiry_hours: int = 24) -> bool:
        """
        Check if session has expired

        Args:
            expiry_hours: Hours after which session expires (default 24)

        Returns:
            True if session is expired, False otherwise
        """
        expiry_time = self.last_activity + timedelta(hours=expiry_hours)
        return datetime.utcnow() > expiry_time

    def update_activity(self) -> None:
        """Update last activity timestamp"""
        self.last_activity = datetime.utcnow()

    def cache_validation_result(self, protocol_data: Dict[str, Any], result: Dict[str, Any]) -> None:
        """
        Cache validation result for performance

        Args:
            protocol_data: The protocol data that was validated
            result: The validation result to cache
        """
        cache_key = self._generate_cache_key(protocol_data)
        self.validation_cache[cache_key] = {
            'result': result,
            'cached_at': datetime.utcnow().isoformat(),
            'protocol_data': protocol_data
        }
        self.update_activity()

    def get_cached_validation(self, protocol_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Retrieve cached validation result if available

        Args:
            protocol_data: The protocol data to check cache for

        Returns:
            Cached validation result or None if not found
        """
        cache_key = self._generate_cache_key(protocol_data)
        cached_entry = self.validation_cache.get(cache_key)

        if cached_entry:
            # Check if cache entry is still fresh (within 5 minutes)
            cached_time = datetime.fromisoformat(cached_entry['cached_at'])
            if datetime.utcnow() - cached_time < timedelta(minutes=5):
                return cached_entry['result']
            else:
                # Remove stale cache entry
                del self.validation_cache[cache_key]

        return None

    def clear_validation_cache(self) -> None:
        """Clear all cached validation results"""
        self.validation_cache.clear()
        self.update_activity()

    def _generate_cache_key(self, protocol_data: Dict[str, Any]) -> str:
        """
        Generate a cache key for protocol data

        Args:
            protocol_data: The protocol data to generate key for

        Returns:
            Cache key string
        """
        import json
        # Sort keys for consistent cache key generation
        sorted_data = json.dumps(protocol_data, sort_keys=True)
        import hashlib
        return hashlib.md5(sorted_data.encode()).hexdigest()

    class Config:
        """Pydantic configuration"""
        schema_extra = {
            "example": {
                "session_id": "550e8400-e29b-41d4-a716-446655440000",
                "validation_rules_version": "1.2.0",
                "protocol_state": {
                    "title": "My Audio Protocol",
                    "duration": 180
                },
                "validation_cache": {},
                "created_at": "2025-09-29T10:00:00Z",
                "last_activity": "2025-09-29T10:30:00Z"
            }
        }


class SessionManager:
    """
    Manager for user session operations

    Handles session creation, persistence, expiration, and cleanup
    for the wizard validation integration.
    """

    def __init__(self):
        """Initialize session manager"""
        self._sessions: Dict[str, UserSession] = {}
        self._current_rules_version = "1.2.0"  # Current validation rules version

    def create_session(self) -> UserSession:
        """
        Create a new user session

        Returns:
            New UserSession instance locked to current validation rules
        """
        session = UserSession(
            validation_rules_version=self._current_rules_version
        )
        self._sessions[str(session.session_id)] = session
        return session

    def get_session(self, session_id: UUID) -> Optional[UserSession]:
        """
        Retrieve session by ID

        Args:
            session_id: The session ID to retrieve

        Returns:
            UserSession if found and not expired, None otherwise
        """
        session_key = str(session_id)
        session = self._sessions.get(session_key)

        if session:
            if session.is_expired():
                # Clean up expired session
                del self._sessions[session_key]
                return None
            else:
                session.update_activity()
                return session

        return None

    def update_session_protocol(self, session_id: UUID, protocol_data: Dict[str, Any]) -> bool:
        """
        Update protocol state for session

        Args:
            session_id: The session ID to update
            protocol_data: New protocol data to store

        Returns:
            True if update successful, False if session not found
        """
        session = self.get_session(session_id)
        if session:
            session.protocol_state = protocol_data
            session.update_activity()
            return True
        return False

    def cleanup_expired_sessions(self) -> int:
        """
        Remove all expired sessions

        Returns:
            Number of sessions cleaned up
        """
        expired_sessions = [
            session_id for session_id, session in self._sessions.items()
            if session.is_expired()
        ]

        for session_id in expired_sessions:
            del self._sessions[session_id]

        return len(expired_sessions)

    def get_session_count(self) -> int:
        """
        Get count of active sessions

        Returns:
            Number of active (non-expired) sessions
        """
        self.cleanup_expired_sessions()
        return len(self._sessions)

    def update_validation_rules_version(self, new_version: str) -> None:
        """
        Update the current validation rules version

        Note: This only affects new sessions. Existing sessions maintain
        their locked version for consistency.

        Args:
            new_version: New validation rules version
        """
        self._current_rules_version = new_version

    def get_current_rules_version(self) -> str:
        """
        Get current validation rules version

        Returns:
            Current validation rules version string
        """
        return self._current_rules_version