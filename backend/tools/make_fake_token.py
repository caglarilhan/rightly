#!/usr/bin/env python3
"""Fake JWT token generator - CI/CD için"""
import os, jwt, time

DL_SECRET = os.environ.get("DOWNLOAD_TOKEN_SECRET", "dev_download_secret")

def make_fake_token():
	key = "exports/ACC1/REQ_DEMO.zip"
	token = jwt.encode(
		{"k": key, "exp": int(time.time()) + 600},
		DL_SECRET,
		algorithm="HS256"
	)
	print(token)

if __name__ == "__main__":
	make_fake_token()
