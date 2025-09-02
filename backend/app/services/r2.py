import os
import boto3
from botocore.client import Config

_R2 = None

def r2_client():
    global _R2
    if _R2:
        return _R2
    _R2 = boto3.client(
        "s3",
        endpoint_url=os.getenv("R2_ENDPOINT_URL"),
        aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
        region_name=os.getenv("R2_REGION", "auto"),
        config=Config(signature_version="s3v4"),
    )
    return _R2

def presign_get_url(key: str, expires_seconds: int = 900) -> str:
    return r2_client().generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": os.getenv("R2_BUCKET"), "Key": key},
        ExpiresIn=expires_seconds,
    )


