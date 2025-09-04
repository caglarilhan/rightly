#!/usr/bin/env python3
"""Celery publish check - CI/CD için"""
import os, time
from app.tasks.ops import discover

def test_celery_publish():
	"""Celery task publish test - worker'ın alıp almadığını kontrol et"""
	try:
		# Task'ı publish et
		task = discover.apply_async(
			("REQ_CI", "demo.myshopify.com", "user@example.com", {}),
			queue="celery"
		)
		print(f"Task published: {task.id}")
		
		# Worker'ın almasını bekle (max 10s)
		for i in range(10):
			if task.ready():
				print("Task completed successfully")
				return True
			time.sleep(1)
		
		print("Task timeout - worker may not be running")
		return False
		
	except Exception as e:
		print(f"Celery error: {e}")
		return False

if __name__ == "__main__":
	success = test_celery_publish()
	exit(0 if success else 1)
