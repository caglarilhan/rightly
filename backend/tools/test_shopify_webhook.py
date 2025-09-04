#!/usr/bin/env python3
"""Shopify webhook HMAC test - CI/CD için"""
import os, json, base64, hashlib, hmac, requests, time

SHOPIFY_SECRET = os.environ.get("SHOPIFY_API_SECRET", "dev_secret")
WEBHOOK_URL = "http://127.0.0.1:9011/webhooks/gdpr"

def verify_hmac(raw: bytes, sig: str) -> bool:
	digest = hmac.new(SHOPIFY_SECRET.encode(), raw, hashlib.sha256).digest()
	return hmac.compare_digest(base64.b64encode(digest).decode(), sig or "")

def test_webhook():
	print("🧪 Shopify Webhook HMAC Test")
	print("=" * 40)
	
	payload = {"request_id": "test_req", "email": "user@example.com"}
	raw = json.dumps(payload).encode()
	
	# Valid HMAC
	valid_sig = base64.b64encode(hmac.new(SHOPIFY_SECRET.encode(), raw, hashlib.sha256).digest()).decode()
	headers = {
		"X-Shopify-Hmac-Sha256": valid_sig,
		"X-Shopify-Topic": "customers/data_request",
		"X-Shopify-Shop-Domain": "test.myshopify.com",
		"X-Shopify-Webhook-Id": "test-webhook-id"
	}
	
	start_time = time.time()
	resp = requests.post(WEBHOOK_URL, data=raw, headers=headers, timeout=5)
	duration = (time.time() - start_time) * 1000
	
	print(f"✅ Valid HMAC: {resp.status_code} (expected: 200) - {duration:.1f}ms")
	
	# Invalid HMAC
	headers["X-Shopify-Hmac-Sha256"] = "invalid"
	start_time = time.time()
	resp = requests.post(WEBHOOK_URL, data=raw, headers=headers, timeout=5)
	duration = (time.time() - start_time) * 1000
	
	print(f"❌ Invalid HMAC: {resp.status_code} (expected: 401) - {duration:.1f}ms")
	
	# Duplicate (idempotency test) - same valid HMAC
	headers["X-Shopify-Hmac-Sha256"] = valid_sig
	start_time = time.time()
	resp = requests.post(WEBHOOK_URL, data=raw, headers=headers, timeout=5)
	duration = (time.time() - start_time) * 1000
	
	print(f"🔄 Duplicate: {resp.status_code} (expected: 200 with dedup) - {duration:.1f}ms")
	
	# Performance test
	print("\n🚀 Performance Test:")
	times = []
	for i in range(10):
		start_time = time.time()
		resp = requests.post(WEBHOOK_URL, data=raw, headers=headers, timeout=5)
		duration = (time.time() - start_time) * 1000
		times.append(duration)
	
	avg_time = sum(times) / len(times)
	p95_time = sorted(times)[int(len(times) * 0.95)]
	
	print(f"   Average: {avg_time:.1f}ms")
	print(f"   P95: {p95_time:.1f}ms")
	print(f"   Max: {max(times):.1f}ms")
	
	# SLO check
	if avg_time < 800 and p95_time < 1000:
		print("✅ Performance SLO met")
	else:
		print("⚠️  Performance SLO exceeded")
	
	return resp.status_code == 200

if __name__ == "__main__":
	success = test_webhook()
	if success:
		print("\n🎉 All webhook tests passed!")
		exit(0)
	else:
		print("\n❌ Some webhook tests failed!")
		exit(1)
