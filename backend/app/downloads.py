import os, jwt, boto3
from fastapi import APIRouter, HTTPException
from starlette.responses import PlainTextResponse

router = APIRouter(prefix="/api/v1/downloads", tags=["downloads"])

DL_SECRET   = os.environ.get("DOWNLOAD_TOKEN_SECRET", "dev_download_secret")
S3_BUCKET   = os.environ.get("S3_BUCKET", "gdpr-hub-lite")
S3_REGION   = os.environ.get("S3_REGION", "eu-central-1")
S3_ENDPOINT = os.environ.get("S3_ENDPOINT_URL")
AWS_KEY     = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SEC     = os.environ.get("AWS_SECRET_ACCESS_KEY")

def s3():
	return boto3.client(
		"s3",
		region_name=S3_REGION,
		aws_access_key_id=AWS_KEY,
		aws_secret_access_key=AWS_SEC,
		endpoint_url=S3_ENDPOINT,
	)

@router.get("/{token}")
def get_presigned(token: str):
	try:
		payload = jwt.decode(token, DL_SECRET, algorithms=["HS256"])
	except jwt.ExpiredSignatureError:
		raise HTTPException(401, "token_expired")
	except Exception:
		raise HTTPException(403, "bad_token")

	key = payload.get("k")
	if not key or not key.startswith("exports/"):
		raise HTTPException(400, "bad_key")

	# Mock S3 presigned URL (gerçek S3/R2 env'leri yoksa)
	try:
		url = s3().generate_presigned_url(
			ClientMethod="get_object",
			Params={"Bucket": S3_BUCKET, "Key": key},
			ExpiresIn=120,
		)
	except Exception as e:
		# Mock URL döndür
		url = f"https://mock-s3.example.com/{S3_BUCKET}/{key}?expires=120"
	
	return PlainTextResponse(url, status_code=200)


