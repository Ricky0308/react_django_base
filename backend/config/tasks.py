import logging

from celery import shared_task

logger = logging.getLogger("common")


@shared_task(name="config.tasks.test_periodic_task")
def test_periodic_task():
    """
    Simple periodic task for verifying Celery/Beat wiring.
    """
    logger.info("Running test_periodic_task", extra={"task": "test_periodic_task"})
    return "ok"

