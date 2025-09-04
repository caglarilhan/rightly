#!/usr/bin/env bash
set -euo pipefail

FE="${FE:-http://127.0.0.1:3001}"
BE="${BE:-http://127.0.0.1:9011}"

echo "FE: $FE | BE: $BE (60s smoke)"
start=$(date +%s)

pass=0 fail=0

check() {
	local name="$1" url="$2"
	code=$(curl -sS -o /dev/null -w "%{http_code}" "$url" || echo "000")
	if [[ "$code" =~ ^2|3[0-9]$ ]]; then
		echo "✅ $name $code"
		pass=$((pass+1))
	else
		echo "⚠️  $name $code"
		fail=$((fail+1))
	fi
}

while (( $(date +%s) - start < 60 )); do
	check "FE /api/healthz" "$FE/api/healthz"
	check "BE /healthz"    "$BE/healthz"
	sleep 5
done

echo "---"
echo "PASS=$pass  FAIL=$fail"
[[ $fail -eq 0 ]] && exit 0 || exit 1


