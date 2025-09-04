#!/usr/bin/env bash
set -euo pipefail

echo "🚀 GDPR Hub Lite CI/CD Pipeline"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
PASS=0
FAIL=0

# Test function
test_step() {
    local name="$1"
    local command="$2"
    
    echo -n "Testing $name... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS+1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAIL=$((FAIL+1))
    fi
}

# Test function with output
test_step_with_output() {
    local name="$1"
    local command="$2"
    
    echo -e "${BLUE}Testing $name...${NC}"
    echo "Command: $command"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS=$((PASS+1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAIL=$((FAIL+1))
    fi
    echo ""
}

echo "1. Code Quality Checks"
echo "----------------------"

# Backend linting
test_step "Backend Linting" "cd backend && source venv/bin/activate && ruff check ."

# Backend type checking
test_step "Backend Type Checking" "cd backend && source venv/bin/activate && mypy app/"

# Frontend linting
test_step "Frontend Linting" "cd frontend && npm run lint"

# Frontend type checking
test_step "Frontend Type Checking" "cd frontend && npm run type-check"

echo ""
echo "2. Unit Tests"
echo "-------------"

# Backend tests
test_step "Backend Tests" "cd backend && source venv/bin/activate && pytest tests/ -v"

# Frontend tests
test_step "Frontend Tests" "cd frontend && npm test -- --passWithNoTests"

echo ""
echo "3. Backend Startup Test"
echo "----------------------"

# Start backend
echo -e "${BLUE}Starting backend...${NC}"
cd backend
source venv/bin/activate
export REDIS_URL=redis://127.0.0.1:6379/0
export SHOPIFY_API_SECRET=dev_secret
export DOWNLOAD_TOKEN_SECRET=dev_download_secret

# Start backend in background
uvicorn app.main:app --host 127.0.0.1 --port 9011 --reload > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test backend health
test_step "Backend Health" "curl -fsS http://127.0.0.1:9011/healthz >/dev/null"

echo ""
echo "4. Webhook Tests"
echo "---------------"

test_step_with_output "Shopify Webhook HMAC" "cd backend && source venv/bin/activate && python tools/test_shopify_webhook.py"

echo ""
echo "5. Celery Tests"
echo "--------------"

# Test Celery ping
test_step "Celery Ping" "celery -A app.celery_app.celery_app inspect ping >/dev/null"

# Test Celery registered tasks
test_step "Celery Registered Tasks" "celery -A app.celery_app.celery_app inspect registered >/dev/null"

# Test Celery task publishing
test_step_with_output "Celery Task Publishing" "cd backend && source venv/bin/activate && python tools/celery_publish_check.py"

echo ""
echo "6. Download Tests"
echo "----------------"

# Test JWT token generation
test_step "JWT Token Generation" "cd backend && source venv/bin/activate && python tools/make_fake_token.py >/dev/null"

# Test download endpoint
TOKEN=$(cd backend && source venv/bin/activate && python tools/make_fake_token.py 2>/dev/null)
test_step "Download Endpoint" "curl -fsS http://127.0.0.1:9011/api/v1/downloads/$TOKEN >/dev/null"

echo ""
echo "7. Frontend Smoke Test"
echo "--------------------"

# Start frontend
echo -e "${BLUE}Starting frontend...${NC}"
cd ../frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 10

# Test frontend health
test_step "Frontend Health" "curl -fsS http://127.0.0.1:3001/api/healthz >/dev/null"

# Test frontend proxy
test_step "Frontend Proxy" "curl -fsS http://127.0.0.1:3001/api/downloads/$TOKEN >/dev/null"

echo ""
echo "8. Security Tests"
echo "---------------"

# Test security headers
test_step "Security Headers" "curl -s -I http://127.0.0.1:3001 | grep -E '(X-Frame-Options|Content-Security-Policy)' >/dev/null"

# Test rate limiting
test_step "Rate Limiting" "for i in {1..11}; do curl -s -w '%{http_code}' http://127.0.0.1:9011/api/v1/downloads/test -o /dev/null | grep -q '429' && break; done"

echo ""
echo "9. Integration Tests"
echo "------------------"

# Test request ID correlation
RID="CI-TEST-$(date +%s)"
test_step "Request ID Correlation" "curl -s -I http://127.0.0.1:3001/api/healthz -H 'x-request-id: $RID' | grep 'x-request-id' >/dev/null"

# Test end-to-end flow
test_step_with_output "End-to-End Flow" "cd ../backend && source venv/bin/activate && python tools/test_end_to_end.py"

echo ""
echo "10. Performance Tests"
echo "-------------------"

# Test webhook performance
test_step_with_output "Webhook Performance" "cd backend && source venv/bin/activate && python tools/test_webhook_performance.py"

# Test export generation
test_step_with_output "Export Performance" "cd backend && source venv/bin/activate && python tools/test_export_performance.py"

echo ""
echo "11. Cleanup"
echo "-----------"

# Stop services
echo -e "${BLUE}Stopping services...${NC}"
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true

# Wait for cleanup
sleep 2

echo ""
echo "📊 CI/CD Results"
echo "==============="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
echo "TOTAL: $((PASS + FAIL))"

if [[ $FAIL -eq 0 ]]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}🚀 READY FOR PRODUCTION DEPLOYMENT${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}⚠️  Please fix the failing tests before deployment${NC}"
    exit 1
fi
