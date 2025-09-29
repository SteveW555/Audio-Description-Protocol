"""
Offline validation queue implementation

Provides robust offline validation capabilities with request queuing,
automatic retry logic, and synchronization when connectivity returns.
"""

import asyncio
import time
import logging
import json
from typing import Dict, Any, List, Optional, Callable
from dataclasses import dataclass, asdict
from enum import Enum
from datetime import datetime, timedelta
import threading
from pathlib import Path

# Configure logging
logger = logging.getLogger(__name__)


class QueuedRequestStatus(str, Enum):
    """Status of queued validation requests"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    EXPIRED = "expired"


@dataclass
class QueuedValidationRequest:
    """
    Queued validation request with metadata

    Represents a validation request that was made while offline
    and needs to be processed when connectivity returns.
    """
    id: str
    request_data: Dict[str, Any]
    session_id: str
    timestamp: str
    retry_count: int = 0
    max_retries: int = 3
    status: QueuedRequestStatus = QueuedRequestStatus.PENDING
    last_attempt: Optional[str] = None
    error_message: Optional[str] = None
    expires_at: Optional[str] = None

    def __post_init__(self):
        """Set expiration time if not provided"""
        if self.expires_at is None:
            # Expire after 24 hours
            expire_time = datetime.fromisoformat(self.timestamp) + timedelta(hours=24)
            self.expires_at = expire_time.isoformat()

    def is_expired(self) -> bool:
        """Check if request has expired"""
        if not self.expires_at:
            return False

        expire_time = datetime.fromisoformat(self.expires_at)
        return datetime.utcnow() > expire_time

    def can_retry(self) -> bool:
        """Check if request can be retried"""
        return (
            self.retry_count < self.max_retries and
            not self.is_expired() and
            self.status in [QueuedRequestStatus.PENDING, QueuedRequestStatus.FAILED]
        )

    def mark_processing(self):
        """Mark request as currently being processed"""
        self.status = QueuedRequestStatus.PROCESSING
        self.last_attempt = datetime.utcnow().isoformat()

    def mark_completed(self):
        """Mark request as successfully completed"""
        self.status = QueuedRequestStatus.COMPLETED

    def mark_failed(self, error_message: str):
        """Mark request as failed with error message"""
        self.status = QueuedRequestStatus.FAILED
        self.error_message = error_message
        self.retry_count += 1

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'QueuedValidationRequest':
        """Create from dictionary"""
        return cls(**data)


class OfflineValidationQueue:
    """
    Offline validation queue manager

    Manages queued validation requests with persistent storage,
    automatic retry logic, and batch processing capabilities.
    """

    def __init__(self, storage_path: Optional[str] = None):
        """
        Initialize offline queue manager

        Args:
            storage_path: Path to persistent storage file (optional)
        """
        self.storage_path = storage_path or "offline_validation_queue.json"
        self.queue: Dict[str, QueuedValidationRequest] = {}
        self.processing_callbacks: List[Callable] = []
        self.lock = threading.RLock()
        self.is_processing = False
        self.max_queue_size = 1000
        self.load_from_storage()

    def add_request(
        self,
        request_id: str,
        request_data: Dict[str, Any],
        session_id: str,
        max_retries: int = 3
    ) -> bool:
        """
        Add validation request to offline queue

        Args:
            request_id: Unique identifier for the request
            request_data: Validation request data
            session_id: Session identifier
            max_retries: Maximum retry attempts

        Returns:
            True if request was added, False if queue is full
        """
        with self.lock:
            if len(self.queue) >= self.max_queue_size:
                logger.warning(f"Offline queue is full ({self.max_queue_size}), rejecting request")
                return False

            if request_id in self.queue:
                logger.info(f"Updating existing queued request: {request_id}")

            queued_request = QueuedValidationRequest(
                id=request_id,
                request_data=request_data,
                session_id=session_id,
                timestamp=datetime.utcnow().isoformat(),
                max_retries=max_retries
            )

            self.queue[request_id] = queued_request
            self._save_to_storage()

            logger.info(f"Added request to offline queue: {request_id}")
            return True

    def get_pending_requests(self) -> List[QueuedValidationRequest]:
        """Get all pending requests that can be processed"""
        with self.lock:
            pending = []
            for request in self.queue.values():
                if request.can_retry():
                    pending.append(request)
                elif request.is_expired():
                    request.status = QueuedRequestStatus.EXPIRED

            # Sort by timestamp (oldest first)
            pending.sort(key=lambda r: r.timestamp)
            return pending

    def get_request(self, request_id: str) -> Optional[QueuedValidationRequest]:
        """Get specific request by ID"""
        with self.lock:
            return self.queue.get(request_id)

    def update_request_status(
        self,
        request_id: str,
        status: QueuedRequestStatus,
        error_message: Optional[str] = None
    ) -> bool:
        """
        Update request status

        Args:
            request_id: Request identifier
            status: New status
            error_message: Error message if failed

        Returns:
            True if request was updated, False if not found
        """
        with self.lock:
            request = self.queue.get(request_id)
            if not request:
                return False

            if status == QueuedRequestStatus.PROCESSING:
                request.mark_processing()
            elif status == QueuedRequestStatus.COMPLETED:
                request.mark_completed()
            elif status == QueuedRequestStatus.FAILED:
                request.mark_failed(error_message or "Unknown error")

            self._save_to_storage()
            return True

    def remove_request(self, request_id: str) -> bool:
        """
        Remove request from queue

        Args:
            request_id: Request identifier

        Returns:
            True if request was removed, False if not found
        """
        with self.lock:
            if request_id in self.queue:
                del self.queue[request_id]
                self._save_to_storage()
                logger.info(f"Removed request from queue: {request_id}")
                return True
            return False

    def cleanup_completed_and_expired(self) -> Dict[str, int]:
        """
        Clean up completed and expired requests

        Returns:
            Dictionary with cleanup statistics
        """
        with self.lock:
            initial_count = len(self.queue)
            completed_count = 0
            expired_count = 0
            failed_count = 0

            requests_to_remove = []

            for request_id, request in self.queue.items():
                if request.status == QueuedRequestStatus.COMPLETED:
                    requests_to_remove.append(request_id)
                    completed_count += 1
                elif request.is_expired():
                    requests_to_remove.append(request_id)
                    expired_count += 1
                elif (request.status == QueuedRequestStatus.FAILED and
                      not request.can_retry()):
                    requests_to_remove.append(request_id)
                    failed_count += 1

            for request_id in requests_to_remove:
                del self.queue[request_id]

            if requests_to_remove:
                self._save_to_storage()

            stats = {
                "initial_count": initial_count,
                "completed_removed": completed_count,
                "expired_removed": expired_count,
                "failed_removed": failed_count,
                "total_removed": len(requests_to_remove),
                "remaining_count": len(self.queue)
            }

            logger.info(f"Queue cleanup: {stats}")
            return stats

    def get_queue_statistics(self) -> Dict[str, Any]:
        """Get queue statistics"""
        with self.lock:
            stats = {
                "total_requests": len(self.queue),
                "pending": 0,
                "processing": 0,
                "completed": 0,
                "failed": 0,
                "expired": 0
            }

            for request in self.queue.values():
                if request.is_expired():
                    stats["expired"] += 1
                else:
                    stats[request.status] += 1

            return stats

    def register_processing_callback(self, callback: Callable):
        """Register callback to be notified when processing starts"""
        self.processing_callbacks.append(callback)

    async def process_queue(self, validation_client) -> Dict[str, Any]:
        """
        Process all pending requests in the queue

        Args:
            validation_client: Client to use for validation requests

        Returns:
            Processing statistics
        """
        if self.is_processing:
            logger.info("Queue processing already in progress")
            return {"status": "already_processing"}

        self.is_processing = True

        try:
            # Notify callbacks
            for callback in self.processing_callbacks:
                try:
                    callback()
                except Exception as e:
                    logger.error(f"Processing callback error: {e}")

            pending_requests = self.get_pending_requests()
            if not pending_requests:
                logger.info("No pending requests to process")
                return {"status": "no_pending_requests", "processed": 0}

            logger.info(f"Processing {len(pending_requests)} queued requests")

            processed = 0
            successful = 0
            failed = 0

            for request in pending_requests:
                try:
                    # Mark as processing
                    self.update_request_status(request.id, QueuedRequestStatus.PROCESSING)

                    # Import ValidationRequest here to avoid circular imports
                    from .models import ValidationRequest

                    # Create validation request
                    validation_request = ValidationRequest(**request.request_data)

                    # Attempt validation
                    result = await validation_client.validateProtocol(validation_request)

                    # Mark as completed
                    self.update_request_status(request.id, QueuedRequestStatus.COMPLETED)
                    successful += 1

                    logger.info(f"Successfully processed queued request: {request.id}")

                except Exception as e:
                    error_msg = str(e)
                    logger.error(f"Failed to process queued request {request.id}: {error_msg}")

                    # Mark as failed
                    self.update_request_status(request.id, QueuedRequestStatus.FAILED, error_msg)
                    failed += 1

                processed += 1

                # Small delay between requests to avoid overwhelming the service
                await asyncio.sleep(0.1)

            # Clean up completed requests
            cleanup_stats = self.cleanup_completed_and_expired()

            stats = {
                "status": "completed",
                "processed": processed,
                "successful": successful,
                "failed": failed,
                "cleanup_stats": cleanup_stats
            }

            logger.info(f"Queue processing completed: {stats}")
            return stats

        finally:
            self.is_processing = False

    def load_from_storage(self):
        """Load queue from persistent storage"""
        try:
            if not Path(self.storage_path).exists():
                logger.info("No existing offline queue storage found")
                return

            with open(self.storage_path, 'r') as f:
                data = json.load(f)

            self.queue = {}
            for request_data in data.get("requests", []):
                request = QueuedValidationRequest.from_dict(request_data)
                self.queue[request.id] = request

            logger.info(f"Loaded {len(self.queue)} requests from offline queue storage")

        except Exception as e:
            logger.error(f"Failed to load offline queue from storage: {e}")
            self.queue = {}

    def _save_to_storage(self):
        """Save queue to persistent storage"""
        try:
            data = {
                "requests": [request.to_dict() for request in self.queue.values()],
                "saved_at": datetime.utcnow().isoformat()
            }

            # Ensure directory exists
            Path(self.storage_path).parent.mkdir(parents=True, exist_ok=True)

            with open(self.storage_path, 'w') as f:
                json.dump(data, f, indent=2)

        except Exception as e:
            logger.error(f"Failed to save offline queue to storage: {e}")

    def clear_queue(self):
        """Clear all requests from queue"""
        with self.lock:
            self.queue.clear()
            self._save_to_storage()
            logger.info("Cleared offline validation queue")


class ConnectivityMonitor:
    """
    Monitor network connectivity and trigger queue processing

    Automatically detects when connectivity returns and processes
    the offline validation queue.
    """

    def __init__(self, offline_queue: OfflineValidationQueue, validation_client):
        """
        Initialize connectivity monitor

        Args:
            offline_queue: Queue to process when connectivity returns
            validation_client: Client to use for validation
        """
        self.offline_queue = offline_queue
        self.validation_client = validation_client
        self.is_online = True
        self.monitoring = False
        self.check_interval = 30  # seconds
        self.connectivity_callbacks: List[Callable] = []

    def register_connectivity_callback(self, callback: Callable):
        """Register callback for connectivity changes"""
        self.connectivity_callbacks.append(callback)

    async def check_connectivity(self) -> bool:
        """
        Check if validation service is online

        Returns:
            True if service is accessible, False otherwise
        """
        try:
            online = await self.validation_client.checkServiceHealth()
            return online
        except Exception:
            return False

    async def start_monitoring(self):
        """Start connectivity monitoring"""
        if self.monitoring:
            logger.info("Connectivity monitoring already started")
            return

        self.monitoring = True
        logger.info("Starting connectivity monitoring")

        while self.monitoring:
            try:
                current_online = await self.check_connectivity()

                # Detect connectivity change
                if current_online != self.is_online:
                    logger.info(f"Connectivity changed: {'online' if current_online else 'offline'}")

                    self.is_online = current_online

                    # Notify callbacks
                    for callback in self.connectivity_callbacks:
                        try:
                            callback(current_online)
                        except Exception as e:
                            logger.error(f"Connectivity callback error: {e}")

                    # If back online, process queue
                    if current_online:
                        await self._handle_back_online()

                await asyncio.sleep(self.check_interval)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Connectivity monitoring error: {e}")
                await asyncio.sleep(self.check_interval)

        logger.info("Connectivity monitoring stopped")

    def stop_monitoring(self):
        """Stop connectivity monitoring"""
        self.monitoring = False

    async def _handle_back_online(self):
        """Handle when connectivity returns"""
        logger.info("Connectivity restored, processing offline queue")

        try:
            stats = await self.offline_queue.process_queue(self.validation_client)
            logger.info(f"Offline queue processed: {stats}")
        except Exception as e:
            logger.error(f"Failed to process offline queue: {e}")


# Global offline queue instance
offline_queue = OfflineValidationQueue()


def get_offline_queue() -> OfflineValidationQueue:
    """Get global offline queue instance"""
    return offline_queue


async def initialize_offline_capabilities(validation_client) -> ConnectivityMonitor:
    """
    Initialize offline capabilities with connectivity monitoring

    Args:
        validation_client: Validation client to use

    Returns:
        Connectivity monitor instance
    """
    monitor = ConnectivityMonitor(offline_queue, validation_client)

    # Start monitoring in background
    asyncio.create_task(monitor.start_monitoring())

    logger.info("Offline validation capabilities initialized")
    return monitor