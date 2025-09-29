"""
Performance optimization utilities for validation service

Provides caching, async processing, and optimization strategies
to meet <500ms response time requirements.
"""

import asyncio
import time
import logging
from typing import Dict, Any, Optional, List, Tuple
from functools import wraps
from collections import OrderedDict
import threading
from concurrent.futures import ThreadPoolExecutor

# Configure logging
logger = logging.getLogger(__name__)


class LRUCache:
    """
    Thread-safe LRU cache implementation for validation results

    Provides fast caching with automatic expiration and size limits.
    """

    def __init__(self, max_size: int = 1000, ttl_seconds: int = 300):
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
        self.cache: OrderedDict[str, Tuple[Any, float]] = OrderedDict()
        self.lock = threading.RLock()

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        with self.lock:
            if key not in self.cache:
                return None

            value, timestamp = self.cache[key]

            # Check if expired
            if time.time() - timestamp > self.ttl_seconds:
                del self.cache[key]
                return None

            # Move to end (most recently used)
            self.cache.move_to_end(key)
            return value

    def put(self, key: str, value: Any) -> None:
        """Put value in cache with current timestamp"""
        with self.lock:
            # Remove if exists to update timestamp
            if key in self.cache:
                del self.cache[key]

            # Add new entry
            self.cache[key] = (value, time.time())

            # Evict oldest if over size limit
            while len(self.cache) > self.max_size:
                self.cache.popitem(last=False)

    def clear(self) -> None:
        """Clear all cache entries"""
        with self.lock:
            self.cache.clear()

    def size(self) -> int:
        """Get current cache size"""
        with self.lock:
            return len(self.cache)

    def cleanup_expired(self) -> int:
        """Remove expired entries and return count removed"""
        with self.lock:
            current_time = time.time()
            expired_keys = [
                key for key, (_, timestamp) in self.cache.items()
                if current_time - timestamp > self.ttl_seconds
            ]

            for key in expired_keys:
                del self.cache[key]

            return len(expired_keys)


class ValidationCache:
    """
    High-performance validation result cache

    Optimized for validation patterns with different cache strategies
    for different validation modes.
    """

    def __init__(self):
        # Different TTLs for different validation types
        self.full_validation_cache = LRUCache(max_size=500, ttl_seconds=600)  # 10 min
        self.field_validation_cache = LRUCache(max_size=2000, ttl_seconds=300)  # 5 min
        self.quick_validation_cache = LRUCache(max_size=1000, ttl_seconds=180)  # 3 min
        self.schema_cache = LRUCache(max_size=10, ttl_seconds=3600)  # 1 hour

        # Cache hit statistics
        self.stats = {
            'hits': 0,
            'misses': 0,
            'puts': 0
        }

    def _generate_cache_key(
        self,
        protocol_data: Dict[str, Any],
        schema_type: str,
        validation_mode: str,
        field_path: Optional[str] = None
    ) -> str:
        """Generate cache key for validation request"""
        import hashlib
        import json

        # Create deterministic key from request parameters
        key_data = {
            'protocol_data': protocol_data,
            'schema_type': schema_type,
            'validation_mode': validation_mode,
            'field_path': field_path
        }

        # Sort keys for deterministic JSON
        json_str = json.dumps(key_data, sort_keys=True, separators=(',', ':'))
        hash_value = hashlib.md5(json_str.encode()).hexdigest()

        return f"{validation_mode}:{schema_type}:{hash_value}"

    def get_validation_result(
        self,
        protocol_data: Dict[str, Any],
        schema_type: str,
        validation_mode: str,
        field_path: Optional[str] = None
    ) -> Optional[Any]:
        """Get cached validation result"""
        cache_key = self._generate_cache_key(protocol_data, schema_type, validation_mode, field_path)

        # Select appropriate cache
        if validation_mode == 'full':
            cache = self.full_validation_cache
        elif validation_mode == 'field':
            cache = self.field_validation_cache
        else:  # quick
            cache = self.quick_validation_cache

        result = cache.get(cache_key)

        if result is not None:
            self.stats['hits'] += 1
            logger.debug(f"Cache hit for {validation_mode} validation")
        else:
            self.stats['misses'] += 1

        return result

    def put_validation_result(
        self,
        protocol_data: Dict[str, Any],
        schema_type: str,
        validation_mode: str,
        result: Any,
        field_path: Optional[str] = None
    ) -> None:
        """Cache validation result"""
        cache_key = self._generate_cache_key(protocol_data, schema_type, validation_mode, field_path)

        # Select appropriate cache
        if validation_mode == 'full':
            cache = self.full_validation_cache
        elif validation_mode == 'field':
            cache = self.field_validation_cache
        else:  # quick
            cache = self.quick_validation_cache

        cache.put(cache_key, result)
        self.stats['puts'] += 1

    def get_schema(self, schema_type: str, version: str) -> Optional[Any]:
        """Get cached schema"""
        cache_key = f"schema:{schema_type}:{version}"
        return self.schema_cache.get(cache_key)

    def put_schema(self, schema_type: str, version: str, schema: Any) -> None:
        """Cache schema"""
        cache_key = f"schema:{schema_type}:{version}"
        self.schema_cache.put(cache_key, schema)

    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self.stats['hits'] + self.stats['misses']
        hit_rate = self.stats['hits'] / total_requests if total_requests > 0 else 0

        return {
            **self.stats,
            'hit_rate': hit_rate,
            'total_requests': total_requests,
            'cache_sizes': {
                'full_validation': self.full_validation_cache.size(),
                'field_validation': self.field_validation_cache.size(),
                'quick_validation': self.quick_validation_cache.size(),
                'schema': self.schema_cache.size()
            }
        }

    def cleanup(self) -> Dict[str, int]:
        """Clean up expired entries from all caches"""
        return {
            'full_validation_expired': self.full_validation_cache.cleanup_expired(),
            'field_validation_expired': self.field_validation_cache.cleanup_expired(),
            'quick_validation_expired': self.quick_validation_cache.cleanup_expired(),
            'schema_expired': self.schema_cache.cleanup_expired()
        }


class PerformanceMonitor:
    """
    Performance monitoring for validation operations

    Tracks response times and identifies performance bottlenecks.
    """

    def __init__(self):
        self.metrics = {
            'validation_times': [],
            'cache_times': [],
            'schema_load_times': [],
            'total_requests': 0,
            'slow_requests': 0  # > 400ms
        }

    def track_validation_time(self, operation: str):
        """Decorator to track operation timing"""
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                start_time = time.time()
                try:
                    result = await func(*args, **kwargs)
                    return result
                finally:
                    duration = (time.time() - start_time) * 1000  # ms
                    self.record_timing(operation, duration)
            return wrapper
        return decorator

    def record_timing(self, operation: str, duration_ms: float) -> None:
        """Record timing for operation"""
        self.metrics['total_requests'] += 1

        if duration_ms > 400:
            self.metrics['slow_requests'] += 1

        if operation not in self.metrics:
            self.metrics[operation] = []

        self.metrics[operation].append(duration_ms)

        # Keep only recent measurements (last 1000)
        if len(self.metrics[operation]) > 1000:
            self.metrics[operation] = self.metrics[operation][-1000:]

        # Log slow operations
        if duration_ms > 500:
            logger.warning(f"Slow {operation}: {duration_ms:.1f}ms")

    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        stats = {
            'total_requests': self.metrics['total_requests'],
            'slow_requests': self.metrics['slow_requests'],
            'slow_request_rate': (
                self.metrics['slow_requests'] / self.metrics['total_requests']
                if self.metrics['total_requests'] > 0 else 0
            )
        }

        # Calculate averages for each operation
        for operation, times in self.metrics.items():
            if isinstance(times, list) and times:
                stats[f'{operation}_avg'] = sum(times) / len(times)
                stats[f'{operation}_max'] = max(times)
                stats[f'{operation}_min'] = min(times)
                stats[f'{operation}_p95'] = sorted(times)[int(0.95 * len(times))] if len(times) > 20 else max(times)

        return stats


class AsyncValidationPool:
    """
    Async validation processing pool

    Manages concurrent validation operations for better throughput.
    """

    def __init__(self, max_workers: int = 10):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.active_tasks: Dict[str, asyncio.Task] = {}

    async def submit_validation(
        self,
        task_id: str,
        validation_func,
        *args,
        **kwargs
    ) -> Any:
        """Submit validation task to pool"""
        # Cancel existing task with same ID if exists
        if task_id in self.active_tasks:
            self.active_tasks[task_id].cancel()

        # Create new task
        loop = asyncio.get_event_loop()
        task = loop.run_in_executor(self.executor, validation_func, *args, **kwargs)
        self.active_tasks[task_id] = task

        try:
            result = await task
            return result
        finally:
            self.active_tasks.pop(task_id, None)

    def cancel_validation(self, task_id: str) -> bool:
        """Cancel validation task"""
        if task_id in self.active_tasks:
            self.active_tasks[task_id].cancel()
            return True
        return False

    def get_active_count(self) -> int:
        """Get number of active validation tasks"""
        return len(self.active_tasks)

    async def shutdown(self) -> None:
        """Shutdown the validation pool"""
        # Cancel all active tasks
        for task in self.active_tasks.values():
            task.cancel()

        # Wait for tasks to complete or timeout
        if self.active_tasks:
            await asyncio.gather(*self.active_tasks.values(), return_exceptions=True)

        self.executor.shutdown(wait=True)


# Global instances
validation_cache = ValidationCache()
performance_monitor = PerformanceMonitor()
validation_pool = AsyncValidationPool()


def optimize_for_field_validation(func):
    """Decorator to optimize field validation performance"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # Extract field path from kwargs if present
        field_path = kwargs.get('field_path')

        if field_path:
            # Field validation optimization: validate only relevant fields
            start_time = time.time()
            result = await func(*args, **kwargs)
            duration = (time.time() - start_time) * 1000

            if duration > 200:  # Log field validations over 200ms
                logger.info(f"Field validation for {field_path}: {duration:.1f}ms")

            return result
        else:
            return await func(*args, **kwargs)

    return wrapper


def batch_validation_optimization(func):
    """Decorator to optimize batch validation operations"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # For batch operations, use async processing
        if kwargs.get('batch_mode'):
            start_time = time.time()
            result = await func(*args, **kwargs)
            duration = (time.time() - start_time) * 1000

            logger.info(f"Batch validation completed in {duration:.1f}ms")
            return result
        else:
            return await func(*args, **kwargs)

    return wrapper


async def cleanup_performance_data() -> None:
    """Background task to cleanup performance data"""
    while True:
        try:
            # Cleanup expired cache entries
            cleanup_stats = validation_cache.cleanup()
            logger.debug(f"Cache cleanup: {cleanup_stats}")

            # Sleep for 5 minutes
            await asyncio.sleep(300)

        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error in performance cleanup: {e}")
            await asyncio.sleep(60)  # Sleep 1 minute on error


def get_performance_report() -> Dict[str, Any]:
    """Get comprehensive performance report"""
    return {
        'cache_stats': validation_cache.get_cache_stats(),
        'performance_stats': performance_monitor.get_performance_stats(),
        'active_validations': validation_pool.get_active_count(),
        'timestamp': time.time()
    }