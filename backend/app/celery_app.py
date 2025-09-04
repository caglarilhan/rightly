import os
from celery import Celery

REDIS_URL = os.environ.get("REDIS_URL", "redis://127.0.0.1:6379/0")
celery_app = Celery("gdprhub", broker=REDIS_URL, backend=REDIS_URL)

celery_app.conf.update(
	task_default_queue="celery",
	task_routes={"app.tasks.*": {"queue": "default"}},
	broker_transport_options={"visibility_timeout": 3600},
	broker_connection_retry_on_startup=True,
	worker_send_task_events=True,
	task_send_sent_event=True,
    include=["app.tasks.ops"],
)

# Optional: autodiscover within app.tasks
try:
    celery_app.autodiscover_tasks(["app.tasks"])
except Exception:
    pass

# Optional eager mode for local debugging: set CELERY_EAGER=1
if os.getenv("CELERY_EAGER") == "1":
    celery_app.conf.task_always_eager = True
    celery_app.conf.task_eager_propagates = True

from celery import Celery
from app.config import settings
import logging

# Celery app
celery_app = Celery(
    "gdpr_hub_lite",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=['app.tasks.export']
)

# Celery config
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Logging
logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def debug_task(self):
    logger.info(f'Request: {self.request!r}')

if __name__ == '__main__':
    celery_app.start()
