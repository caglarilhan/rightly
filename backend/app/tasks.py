import os, json, csv, tempfile, zipfile, hashlib, time
from datetime import datetime
import boto3, jwt
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from .celery_app import celery_app

S3_BUCKET   = os.environ.get("S3_BUCKET", "gdpr-hub-lite")
S3_REGION   = os.environ.get("S3_REGION", "eu-central-1")
S3_ENDPOINT = os.environ.get("S3_ENDPOINT_URL")
AWS_KEY     = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SEC     = os.environ.get("AWS_SECRET_ACCESS_KEY")
DL_SECRET   = os.environ.get("DOWNLOAD_TOKEN_SECRET", "dev_download_secret")

def s3():
	return boto3.client(
		"s3",
		region_name=S3_REGION,
		aws_access_key_id=AWS_KEY,
		aws_secret_access_key=AWS_SEC,
		endpoint_url=S3_ENDPOINT,
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
		s3().upload_file(bundle_zip, S3_BUCKET, key, ExtraArgs={"ContentType": "application/zip"})

	token = jwt.encode({"k": key, "exp": int(time.time()) + 600}, DL_SECRET, algorithm="HS256")
	return {"key": key, "sha256": sha256, "download_token": token}

@celery_app.task(name="app.tasks.erase")
def erase(request_id: str, shop_domain: str, payload: dict):
	return {"request_id": request_id, "erased": True}


