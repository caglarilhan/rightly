from app.celery_app import celery_app


@celery_app.task(name="app.tasks.export_dsar")
def export_dsar_task(request_id: int) -> dict:
    # Basit mock: gerçek implementasyon R2/local export üretir
    return {"ok": True, "bundle_key": f"exports/request_{request_id}.zip"}


