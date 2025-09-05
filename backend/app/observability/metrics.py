"""
Metrics collection utilities
"""
from typing import Dict, Any, Optional
import time
from functools import wraps
import logging

logger = logging.getLogger(__name__)

class MetricsCollector:
    """Simple metrics collector"""
    
    def __init__(self):
        self.metrics: Dict[str, Any] = {}
    
    def increment_counter(self, name: str, value: int = 1, labels: Optional[Dict[str, str]] = None) -> None:
        """Increment a counter metric"""
        key = self._build_key(name, labels)
        self.metrics[key] = self.metrics.get(key, 0) + value
        logger.info(f"Counter {name} incremented by {value}", extra={"metric": name, "value": value, "labels": labels})
    
    def set_gauge(self, name: str, value: float, labels: Optional[Dict[str, str]] = None) -> None:
        """Set a gauge metric"""
        key = self._build_key(name, labels)
        self.metrics[key] = value
        logger.info(f"Gauge {name} set to {value}", extra={"metric": name, "value": value, "labels": labels})
    
    def record_histogram(self, name: str, value: float, labels: Optional[Dict[str, str]] = None) -> None:
        """Record a histogram value"""
        key = self._build_key(name, labels)
        if key not in self.metrics:
            self.metrics[key] = []
        self.metrics[key].append(value)
        logger.info(f"Histogram {name} recorded {value}", extra={"metric": name, "value": value, "labels": labels})
    
    def _build_key(self, name: str, labels: Optional[Dict[str, str]]) -> str:
        """Build metric key with labels"""
        if not labels:
            return name
        label_str = ",".join([f"{k}={v}" for k, v in labels.items()])
        return f"{name}{{{label_str}}}"
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get all metrics"""
        return self.metrics.copy()
    
    def clear_metrics(self) -> None:
        """Clear all metrics"""
        self.metrics.clear()

# Global metrics collector
metrics = MetricsCollector()

def track_request_duration(func):
    """Decorator to track request duration"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = (time.time() - start_time) * 1000  # Convert to milliseconds
            metrics.record_histogram("request_duration_ms", duration)
            return result
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            metrics.record_histogram("request_duration_ms", duration)
            metrics.increment_counter("request_errors_total")
            raise
    return wrapper

def track_breach_events():
    """Track breach-related metrics"""
    metrics.increment_counter("breach_events_total")
    metrics.increment_counter("breach_events_by_type", labels={"type": "created"})

def track_consent_events():
    """Track consent-related metrics"""
    metrics.increment_counter("consent_events_total")
    metrics.increment_counter("consent_events_by_type", labels={"type": "opt_in"})

def track_export_jobs():
    """Track export job metrics"""
    metrics.increment_counter("export_jobs_total")
    metrics.increment_counter("export_jobs_by_status", labels={"status": "started"})

def track_dpia_assessments():
    """Track DPIA assessment metrics"""
    metrics.increment_counter("dpia_assessments_total")
    metrics.increment_counter("dpia_assessments_by_status", labels={"status": "completed"})

def get_health_metrics() -> Dict[str, Any]:
    """Get health-related metrics"""
    return {
        "breach_events_total": metrics.metrics.get("breach_events_total", 0),
        "consent_events_total": metrics.metrics.get("consent_events_total", 0),
        "export_jobs_total": metrics.metrics.get("export_jobs_total", 0),
        "dpia_assessments_total": metrics.metrics.get("dpia_assessments_total", 0),
        "request_errors_total": metrics.metrics.get("request_errors_total", 0),
    }
