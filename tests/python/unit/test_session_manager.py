"""
Unit tests for session management

Tests session creation, management, caching, and lifecycle
following the clarified requirements for session-scoped validation rules.
"""

import pytest
from datetime import datetime, timedelta
from uuid import UUID, uuid4
from typing import Dict, Any
from unittest.mock import Mock, patch

from src.adp_core.validation.session_manager import SessionManager, UserSession


class TestUserSession:
    """Test UserSession model functionality"""

    @pytest.fixture
    def session_id(self) -> UUID:
        """Generate test session ID"""
        return uuid4()

    def test_create_user_session(self, session_id):
        """Test creating a new user session"""
        validation_rules_version = "1.2.0"

        session = UserSession(
            session_id=session_id,
            validation_rules_version=validation_rules_version
        )

        assert session.session_id == session_id
        assert session.validation_rules_version == validation_rules_version
        assert isinstance(session.created_at, datetime)
        assert isinstance(session.last_activity, datetime)
        assert session.validation_cache == {}
        assert session.validation_history == []

    def test_session_id_string_conversion(self):
        """Test session ID string/UUID conversion"""
        session_id_str = str(uuid4())

        session = UserSession(
            session_id=session_id_str,
            validation_rules_version="1.2.0"
        )

        assert isinstance(session.session_id, UUID)
        assert str(session.session_id) == session_id_str

    def test_is_expired_fresh_session(self, session_id):
        """Test is_expired for fresh session"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        assert not session.is_expired()

    def test_is_expired_old_session(self, session_id):
        """Test is_expired for old session"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        # Manually set old timestamp
        session.last_activity = datetime.utcnow() - timedelta(hours=25)

        assert session.is_expired()

    def test_update_activity(self, session_id):
        """Test updating session activity"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        old_activity = session.last_activity

        # Wait a small amount to ensure timestamp difference
        import time
        time.sleep(0.01)

        session.update_activity()

        assert session.last_activity > old_activity

    def test_cache_validation_result(self, session_id):
        """Test caching validation results"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        protocol_data = {"title": "Test", "duration": 120}
        validation_result = {
            "is_valid": True,
            "errors": [],
            "warnings": [],
            "field_results": {"title": "valid", "duration": "valid"}
        }

        session.cache_validation_result(protocol_data, validation_result)

        cached_result = session.get_cached_validation(protocol_data)
        assert cached_result == validation_result

    def test_cache_validation_result_with_hash_collision(self, session_id):
        """Test caching with different data that might have hash collisions"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        # Test with similar but different protocol data
        protocol_data_1 = {"title": "Test1", "duration": 120}
        protocol_data_2 = {"title": "Test2", "duration": 120}

        result_1 = {"is_valid": True, "errors": []}
        result_2 = {"is_valid": False, "errors": ["error"]}

        session.cache_validation_result(protocol_data_1, result_1)
        session.cache_validation_result(protocol_data_2, result_2)

        cached_result_1 = session.get_cached_validation(protocol_data_1)
        cached_result_2 = session.get_cached_validation(protocol_data_2)

        assert cached_result_1 == result_1
        assert cached_result_2 == result_2

    def test_get_cached_validation_miss(self, session_id):
        """Test cache miss for validation result"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        protocol_data = {"title": "Test", "duration": 120}

        cached_result = session.get_cached_validation(protocol_data)
        assert cached_result is None

    def test_add_to_validation_history(self, session_id):
        """Test adding entries to validation history"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        history_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "validation_mode": "full",
            "is_valid": True,
            "error_count": 0
        }

        session.add_to_validation_history(history_entry)

        assert len(session.validation_history) == 1
        assert session.validation_history[0] == history_entry

    def test_validation_history_limit(self, session_id):
        """Test validation history size limit"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        # Add entries up to the limit
        for i in range(110):  # More than MAX_HISTORY_SIZE (100)
            entry = {
                "timestamp": datetime.utcnow().isoformat(),
                "validation_mode": "full",
                "is_valid": True,
                "entry_number": i
            }
            session.add_to_validation_history(entry)

        # Should keep only the most recent 100 entries
        assert len(session.validation_history) == 100
        assert session.validation_history[-1]["entry_number"] == 109  # Most recent
        assert session.validation_history[0]["entry_number"] == 10   # Oldest kept

    def test_session_serialization(self, session_id):
        """Test session serialization to dict"""
        session = UserSession(
            session_id=session_id,
            validation_rules_version="1.2.0"
        )

        # Add some data
        protocol_data = {"title": "Test"}
        validation_result = {"is_valid": True}
        session.cache_validation_result(protocol_data, validation_result)

        history_entry = {"timestamp": datetime.utcnow().isoformat()}
        session.add_to_validation_history(history_entry)

        session_dict = session.to_dict()

        assert session_dict["session_id"] == str(session_id)
        assert session_dict["validation_rules_version"] == "1.2.0"
        assert "created_at" in session_dict
        assert "last_activity" in session_dict
        assert len(session_dict["validation_cache"]) == 1
        assert len(session_dict["validation_history"]) == 1


class TestSessionManager:
    """Test SessionManager functionality"""

    @pytest.fixture
    def session_manager(self):
        """Create SessionManager instance for testing"""
        return SessionManager()

    @pytest.fixture
    def mock_current_rules_version(self):
        """Mock current validation rules version"""
        return "1.2.0"

    def test_create_session(self, session_manager, mock_current_rules_version):
        """Test creating a new session"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            session_info = session_manager.create_session()

        assert "session_id" in session_info
        assert "validation_rules_version" in session_info
        assert "created_at" in session_info

        session_id = UUID(session_info["session_id"])
        assert isinstance(session_id, UUID)
        assert session_info["validation_rules_version"] == mock_current_rules_version

        # Verify session was stored
        session = session_manager.get_session(session_id)
        assert session is not None
        assert session.validation_rules_version == mock_current_rules_version

    def test_get_existing_session(self, session_manager, mock_current_rules_version):
        """Test retrieving an existing session"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            session_info = session_manager.create_session()

        session_id = UUID(session_info["session_id"])

        # Retrieve the session
        session = session_manager.get_session(session_id)

        assert session is not None
        assert session.session_id == session_id
        assert session.validation_rules_version == mock_current_rules_version

    def test_get_nonexistent_session(self, session_manager):
        """Test retrieving a non-existent session"""
        nonexistent_id = uuid4()

        session = session_manager.get_session(nonexistent_id)

        assert session is None

    def test_get_expired_session(self, session_manager, mock_current_rules_version):
        """Test retrieving an expired session"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            session_info = session_manager.create_session()

        session_id = UUID(session_info["session_id"])

        # Manually expire the session
        session = session_manager.active_sessions[session_id]
        session.last_activity = datetime.utcnow() - timedelta(hours=25)

        # Should return None for expired session
        retrieved_session = session_manager.get_session(session_id)
        assert retrieved_session is None

        # Session should be removed from active sessions
        assert session_id not in session_manager.active_sessions

    def test_session_cleanup(self, session_manager, mock_current_rules_version):
        """Test automatic cleanup of expired sessions"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            # Create multiple sessions
            session_ids = []
            for i in range(5):
                session_info = session_manager.create_session()
                session_ids.append(UUID(session_info["session_id"]))

        # Expire some sessions
        for i in range(3):
            session = session_manager.active_sessions[session_ids[i]]
            session.last_activity = datetime.utcnow() - timedelta(hours=25)

        # Run cleanup
        cleanup_stats = session_manager.cleanup_expired_sessions()

        assert cleanup_stats["sessions_cleaned"] == 3
        assert cleanup_stats["active_sessions"] == 2

        # Verify only non-expired sessions remain
        assert len(session_manager.active_sessions) == 2
        for i in range(3, 5):
            assert session_ids[i] in session_manager.active_sessions

    def test_get_session_info(self, session_manager, mock_current_rules_version):
        """Test getting session information"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            session_info = session_manager.create_session()

        session_id = UUID(session_info["session_id"])

        retrieved_info = session_manager.get_session_info(session_id)

        assert retrieved_info is not None
        assert retrieved_info["session_id"] == str(session_id)
        assert retrieved_info["validation_rules_version"] == mock_current_rules_version
        assert "created_at" in retrieved_info
        assert "last_activity" in retrieved_info
        assert "is_expired" in retrieved_info
        assert retrieved_info["is_expired"] is False

    def test_get_session_info_nonexistent(self, session_manager):
        """Test getting info for non-existent session"""
        nonexistent_id = uuid4()

        session_info = session_manager.get_session_info(nonexistent_id)

        assert session_info is None

    def test_get_active_session_count(self, session_manager, mock_current_rules_version):
        """Test getting active session count"""
        assert session_manager.get_active_session_count() == 0

        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            # Create some sessions
            for i in range(3):
                session_manager.create_session()

        assert session_manager.get_active_session_count() == 3

    def test_session_string_id_handling(self, session_manager, mock_current_rules_version):
        """Test handling string session IDs"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            session_info = session_manager.create_session()

        session_id_string = session_info["session_id"]

        # Should work with string ID
        session = session_manager.get_session(session_id_string)
        assert session is not None

        # Should also work with UUID
        session_uuid = UUID(session_id_string)
        session = session_manager.get_session(session_uuid)
        assert session is not None

    def test_invalid_session_id_format(self, session_manager):
        """Test handling invalid session ID format"""
        session = session_manager.get_session("invalid-uuid-format")
        assert session is None

    def test_session_rules_version_consistency(self, session_manager):
        """Test that sessions maintain consistent validation rules version"""
        # Mock different versions over time
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value="1.2.0"):
            session_info_1 = session_manager.create_session()

        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value="1.3.0"):
            session_info_2 = session_manager.create_session()

        # Each session should maintain its original rules version
        session_1 = session_manager.get_session(UUID(session_info_1["session_id"]))
        session_2 = session_manager.get_session(UUID(session_info_2["session_id"]))

        assert session_1.validation_rules_version == "1.2.0"
        assert session_2.validation_rules_version == "1.3.0"

    def test_concurrent_session_creation(self, session_manager, mock_current_rules_version):
        """Test concurrent session creation"""
        import threading
        import queue

        session_queue = queue.Queue()

        def create_session():
            with patch.object(session_manager, 'get_current_validation_rules_version',
                             return_value=mock_current_rules_version):
                session_info = session_manager.create_session()
                session_queue.put(session_info)

        # Create multiple threads
        threads = []
        for i in range(10):
            thread = threading.Thread(target=create_session)
            threads.append(thread)
            thread.start()

        # Wait for all threads
        for thread in threads:
            thread.join()

        # Collect all session IDs
        session_ids = set()
        while not session_queue.empty():
            session_info = session_queue.get()
            session_ids.add(session_info["session_id"])

        # All session IDs should be unique
        assert len(session_ids) == 10

        # All sessions should be retrievable
        for session_id_str in session_ids:
            session = session_manager.get_session(UUID(session_id_str))
            assert session is not None

    def test_session_cache_integration(self, session_manager, mock_current_rules_version):
        """Test session cache integration"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            session_info = session_manager.create_session()

        session_id = UUID(session_info["session_id"])
        session = session_manager.get_session(session_id)

        # Test caching through session manager
        protocol_data = {"title": "Integration Test"}
        validation_result = {"is_valid": True, "errors": []}

        session.cache_validation_result(protocol_data, validation_result)
        cached_result = session.get_cached_validation(protocol_data)

        assert cached_result == validation_result

    def test_session_history_integration(self, session_manager, mock_current_rules_version):
        """Test session history integration"""
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value=mock_current_rules_version):
            session_info = session_manager.create_session()

        session_id = UUID(session_info["session_id"])
        session = session_manager.get_session(session_id)

        # Test history through session manager
        history_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "validation_mode": "full",
            "is_valid": True
        }

        session.add_to_validation_history(history_entry)

        assert len(session.validation_history) == 1
        assert session.validation_history[0] == history_entry


class TestSessionManagerPerformance:
    """Test SessionManager performance characteristics"""

    @pytest.fixture
    def session_manager(self):
        """Create SessionManager instance for performance testing"""
        return SessionManager()

    def test_session_lookup_performance(self, session_manager):
        """Test session lookup performance with many sessions"""
        import time

        # Create many sessions
        session_ids = []
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value="1.2.0"):
            start_time = time.time()
            for i in range(1000):
                session_info = session_manager.create_session()
                session_ids.append(UUID(session_info["session_id"]))
            creation_time = time.time() - start_time

        # Test lookup performance
        start_time = time.time()
        for session_id in session_ids[:100]:  # Test 100 lookups
            session = session_manager.get_session(session_id)
            assert session is not None
        lookup_time = time.time() - start_time

        # Performance assertions
        assert creation_time < 5.0  # Should create 1000 sessions in under 5 seconds
        assert lookup_time < 0.1    # Should lookup 100 sessions in under 0.1 seconds

    def test_cleanup_performance(self, session_manager):
        """Test cleanup performance with many expired sessions"""
        import time

        # Create and expire many sessions
        with patch.object(session_manager, 'get_current_validation_rules_version',
                         return_value="1.2.0"):
            for i in range(500):
                session_info = session_manager.create_session()
                session_id = UUID(session_info["session_id"])
                # Expire every other session
                if i % 2 == 0:
                    session = session_manager.active_sessions[session_id]
                    session.last_activity = datetime.utcnow() - timedelta(hours=25)

        # Test cleanup performance
        start_time = time.time()
        cleanup_stats = session_manager.cleanup_expired_sessions()
        cleanup_time = time.time() - start_time

        assert cleanup_stats["sessions_cleaned"] == 250
        assert cleanup_stats["active_sessions"] == 250
        assert cleanup_time < 1.0  # Should cleanup 250 sessions in under 1 second


if __name__ == "__main__":
    pytest.main([__file__, "-v"])