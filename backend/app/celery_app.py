from celery import Celery
from app.core.config import settings
import logging

# Celery app
celery_app = Celery(
    "gdpr_hub_lite",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=['app.tasks']
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
