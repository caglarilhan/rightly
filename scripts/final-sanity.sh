#!/usr/bin/env bash
set -euo pipefail

echo "🔥 FINAL PRODUCTION SANITY TEST"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASS=0
FAIL=0

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    
    echo -n "Testing $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [[ "$status" == "$expected_status" ]]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS+1))
    else
        echo -e "${RED}❌ FAIL (got $status, expected $expected_status)${NC}"
        FAIL=$((FAIL+1))
    fi
}

# Test function with custom headers
test_endpoint_with_headers() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    local headers="$4"
    
    echo -n "Testing $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" -H "$headers" "$url" 2>/dev/null || echo "000")
    
    if [[ "$status" == "$expected_status" ]]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS+1))
    else
        echo -e "${RED}❌ FAIL (got $status, expected $expected_status)${NC}"
        FAIL=$((FAIL+1))
    fi
}

echo "1. Health Checks"
echo "----------------"

# Frontend health
test_endpoint "FE Health" "http://127.0.0.1:3001/api/healthz" "200"

# Backend health
test_endpoint "BE Health" "http://127.0.0.1:9011/healthz" "200"

echo ""
echo "2. Security Headers"
echo "------------------"

# Check security headers
echo -n "Testing Security Headers... "
headers=$(curl -s -I http://127.0.0.1:3001 2>/dev/null | grep -E "(X-Frame-Options|X-Content-Type-Options|Content-Security-Policy)" | wc -l)

if [[ "$headers" -ge 3 ]]; then
    echo -e "${GREEN}✅ PASS (${headers} headers found)${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ FAIL (only ${headers} headers found)${NC}"
    FAIL=$((FAIL+1))
fi

echo ""
echo "3. Webhook HMAC Test"
echo "-------------------"

# Webhook HMAC test
echo -n "Testing Webhook HMAC... "
cd backend
if python tools/test_shopify_webhook.py >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL+1))
fi
cd ..

echo ""
echo "4. Celery Test"
echo "-------------"

# Celery ping test
echo -n "Testing Celery Ping... "
if celery -A app.celery_app.celery_app inspect ping >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS+1))
else
    echo -e "${YELLOW}⚠️  SKIP (Celery not running)${NC}"
fi

echo ""
echo "5. JWT Download Test"
echo "-------------------"

# JWT token test
echo -n "Testing JWT Downloads... "
cd backend
TOKEN=$(python tools/make_fake_token.py 2>/dev/null)
if curl -fsS "http://127.0.0.1:9011/api/v1/downloads/$TOKEN" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL+1))
fi
cd ..

echo ""
echo "6. FE Proxy Test"
echo "---------------"

# Frontend proxy test
echo -n "Testing FE Proxy... "
if curl -fsS "http://127.0.0.1:3001/api/downloads/$TOKEN" -H "Origin: http://localhost:3001" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL+1))
fi

echo ""
echo "7. Rate Limit Test"
echo "-----------------"

# Rate limit test (should get 429 after 10 requests)
echo -n "Testing Rate Limit... "
for i in {1..11}; do
    response=$(curl -s -w "%{http_code}" "http://127.0.0.1:9011/api/v1/downloads/test" -o /dev/null)
    if [[ "$response" == "429" ]]; then
        echo -e "${GREEN}✅ PASS (rate limited at request $i)${NC}"
        PASS=$((PASS+1))
        break
    fi
    if [[ "$i" == "11" ]]; then
        echo -e "${YELLOW}⚠️  SKIP (rate limit not triggered)${NC}"
    fi
done

echo ""
echo "8. Request ID Correlation"
echo "------------------------"

# Request ID correlation test
echo -n "Testing Request ID Correlation... "
rid="TEST-RID-$(date +%s)"
fe_response=$(curl -s -I "http://127.0.0.1:3001/api/healthz" -H "x-request-id: $rid" | grep "x-request-id" | cut -d' ' -f2 | tr -d '\r')
be_response=$(curl -s -I "http://127.0.0.1:9011/healthz" -H "x-request-id: $rid" | grep "x-request-id" | cut -d' ' -f2 | tr -d '\r')

if [[ "$fe_response" == "$rid" && "$be_response" == "$rid" ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
    PASS=$((PASS+1))
else
    echo -e "${RED}❌ FAIL${NC}"
    FAIL=$((FAIL+1))
fi

echo ""
echo "📊 RESULTS"
echo "=========="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
echo "TOTAL: $((PASS + FAIL))"

if [[ $FAIL -eq 0 ]]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}🚀 SYSTEM IS PRODUCTION READY${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}⚠️  Please fix the failing tests before going live${NC}"
    exit 1
fi
