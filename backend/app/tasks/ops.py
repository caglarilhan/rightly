import os, json, csv, tempfile, zipfile, hashlib, time
from datetime import datetime
import boto3, jwt
import botocore.config as _bc
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from app.celery_app import celery_app

S3_BUCKET   = os.environ.get("S3_BUCKET", "gdpr-hub-lite")
S3_REGION   = os.environ.get("S3_REGION", "eu-central-1")
S3_ENDPOINT = os.environ.get("S3_ENDPOINT_URL")
AWS_KEY     = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SEC     = os.environ.get("AWS_SECRET_ACCESS_KEY")
DL_SECRET   = os.environ.get("DOWNLOAD_TOKEN_SECRET", "dev_download_secret")
EXPORT_RETENTION_DAYS = int(os.environ.get("EXPORT_RETENTION_DAYS", "30"))

def s3():
	_cfg = _bc.Config(
		s3={"addressing_style": "path"}, 
		signature_version="s3v4", 
		retries={"max_attempts": 5, "mode": "standard"}
	)
	return boto3.client(
		"s3",
		region_name=S3_REGION,
		aws_access_key_id=AWS_KEY,
		aws_secret_access_key=AWS_SEC,
		endpoint_url=S3_ENDPOINT,
		config=_cfg
	)

@celery_app.task(name="app.tasks.discover")
def discover(request_id: str, shop_domain: str, subject_email: str = None, payload: dict = None):
	return {"request_id": request_id, "findings": [{"source": "shopify", "objects": 3}]}

@celery_app.task(name="app.tasks.package")
def package(request_id: str, account_id: str, findings: dict):
	with tempfile.TemporaryDirectory() as tmp:
		report_pdf = f"{tmp}/report.pdf"
		data_json  = f"{tmp}/data.json"
		data_csv   = f"{tmp}/data.csv"
		bundle_zip = f"{tmp}/{request_id}.zip"

		c = canvas.Canvas(report_pdf, pagesize=A4)
		c.drawString(50, 800, "GDPR Hub Lite – Denetçi Raporu")
		c.drawString(50, 780, f"Request ID: {request_id}")
		c.drawString(50, 760, f"UTC: {datetime.utcnow().isoformat()}Z")
		c.drawString(50, 740, f"Bulgular: {json.dumps(findings)[:90]}...")
		c.drawString(50, 720, f"SLA: T+0 (başlangıç), T+7 (ara), T+14 (tam), T+28 (kapanış)")
		c.showPage(); c.save()

		with open(data_json, "w", encoding="utf-8") as f:
			json.dump(findings, f, ensure_ascii=False, indent=2)

		with open(data_csv, "w", newline="", encoding="utf-8") as f:
			w = csv.writer(f); w.writerow(["source","objects"])
			for item in findings.get("findings", []):
				w.writerow([item["source"], item["objects"]])

		with zipfile.ZipFile(bundle_zip, "w", zipfile.ZIP_DEFLATED) as z:
			z.write(report_pdf, "report.pdf")
			z.write(data_json,  "data/data.json")
			z.write(data_csv,   "data/data.csv")

		sha256 = hashlib.sha256(open(bundle_zip, "rb").read()).hexdigest()
		key = f"exports/{account_id}/{request_id}.zip"
		
		# Mock S3 upload (gerçek S3/R2 env'leri yoksa)
		try:
			s3().upload_file(bundle_zip, S3_BUCKET, key, ExtraArgs={"ContentType": "application/zip"})
		except Exception as e:
			print(f"Mock S3 upload: {key} (error: {e})")

	token = jwt.encode({"k": key, "exp": int(time.time()) + 600}, DL_SECRET, algorithm="HS256")
	result = {"key": key, "sha256": sha256, "download_token": token}
	
	# Audit event kaydet
	try:
		from app.models import AuditEvent
		from app.database import get_session
		with get_session() as sess:
			audit = AuditEvent(
				request_id=request_id,
				account_id=account_id,
				event_type="package_created",
				details=result,
				created_at=datetime.utcnow()
			)
			sess.add(audit)
			sess.commit()
	except Exception as e:
		print(f"Audit event kaydedilemedi: {e}")
	
	return result

@celery_app.task(name="app.tasks.erase")
def erase(request_id: str, shop_domain: str, payload: dict):
	return {"request_id": request_id, "erased": True}

@celery_app.task(name="app.tasks.cleanup_exports")
def cleanup_exports():
	"""Daily cleanup task - EXPORT_RETENTION_DAYS gününden eski export'ları sil"""
	from datetime import datetime, timedelta
	cutoff_date = datetime.utcnow() - timedelta(days=EXPORT_RETENTION_DAYS)
	
	try:
		# S3'ten eski dosyaları sil
		response = s3().list_objects_v2(Bucket=S3_BUCKET, Prefix="exports/")
		for obj in response.get('Contents', []):
			if obj['LastModified'].replace(tzinfo=None) < cutoff_date:
				s3().delete_object(Bucket=S3_BUCKET, Key=obj['Key'])
				print(f"Deleted old export: {obj['Key']}")
		
		# Database'den eski audit event'leri temizle
		from app.models import AuditEvent
		from app.database import get_session
		with get_session() as sess:
			deleted = sess.query(AuditEvent).filter(
				AuditEvent.created_at < cutoff_date,
				AuditEvent.event_type == "package_created"
			).delete()
			sess.commit()
			print(f"Deleted {deleted} old audit events")
			
		return {"cleaned": True, "cutoff_date": cutoff_date.isoformat()}
	except Exception as e:
		print(f"Cleanup error: {e}")
		return {"cleaned": False, "error": str(e)}


