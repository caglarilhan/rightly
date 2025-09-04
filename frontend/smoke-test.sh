#!/bin/bash

# 🚀 Rightly Compliance - Go-Live Smoke Test
# Usage: ./smoke-test.sh [FE_URL] [BE_URL]
# Example: ./smoke-test.sh https://app.rightly.com https://api.rightly.com

set -e

FE_URL=${1:-"http://localhost:3002"}
BE_URL=${2:-"http://127.0.0.1:9011"}

echo "🔥 Rightly Compliance - Go-Live Smoke Test"
echo "Frontend: $FE_URL"
echo "Backend: $BE_URL"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    local description="$4"
    
    echo -n "Testing $name... "
    
    if response=$(curl -s -w "%{http_code}" -o /tmp/response --max-time 10 "$url" 2>/dev/null); then
        status_code="${response: -3}"
        
        if [ "$status_code" = "$expected_status" ]; then
            echo -e "${GREEN}✅ PASS${NC} ($status_code)"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
            echo "   Description: $description"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${RED}❌ ERROR${NC} (Connection failed)"
        echo "   Description: $description"
        ((TESTS_FAILED++))
    fi
}

test_health() {
    echo ""
    echo "🏥 Health Checks"
    echo "---------------"
    test_endpoint "FE Health" "$FE_URL/api/healthz" "200" "Frontend health endpoint"
    test_endpoint "BE Health" "$BE_URL/healthz" "200" "Backend health endpoint"
}

test_seo() {
    echo ""
    echo "🔍 SEO & Public Pages"
    echo "---------------------"
    test_endpoint "Robots.txt" "$FE_URL/robots.txt" "200" "Search engine robots file"
    test_endpoint "Sitemap" "$FE_URL/sitemap.xml" "200" "XML sitemap"
    test_endpoint "Homepage" "$FE_URL/" "200" "Public homepage"
    test_endpoint "Pricing" "$FE_URL/pricing" "200" "Pricing page"
    test_endpoint "Terms" "$FE_URL/terms" "200" "Terms of service"
    test_endpoint "Privacy" "$FE_URL/privacy" "200" "Privacy policy"
    test_endpoint "Security" "$FE_URL/security" "200" "Security page"
    test_endpoint "Support" "$FE_URL/support" "200" "Support page"
}

test_security() {
    echo ""
    echo "🔒 Security Headers"
    echo "------------------"
    
    # Test security headers
    headers=$(curl -s -I --max-time 10 "$FE_URL/" | grep -E "(X-Frame-Options|X-Content-Type-Options|Referrer-Policy|Content-Security-Policy)" || true)
    
    if echo "$headers" | grep -q "X-Frame-Options: DENY"; then
        echo -e "${GREEN}✅ X-Frame-Options${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ X-Frame-Options missing${NC}"
        ((TESTS_FAILED++))
    fi
    
    if echo "$headers" | grep -q "X-Content-Type-Options: nosniff"; then
        echo -e "${GREEN}✅ X-Content-Type-Options${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ X-Content-Type-Options missing${NC}"
        ((TESTS_FAILED++))
    fi
}

test_api_security() {
    echo ""
    echo "🛡️ API Security"
    echo "---------------"
    
    # Test origin guard
    test_endpoint "Origin Guard (no origin)" "$FE_URL/api/auth/magic-link" "403" "API should reject requests without origin"
    
    # Test with origin header
    if response=$(curl -s -w "%{http_code}" -o /tmp/response --max-time 10 -H "Origin: https://rightly.com" -X POST "$FE_URL/api/auth/magic-link" -d '{}' 2>/dev/null); then
        status_code="${response: -3}"
        if [ "$status_code" = "200" ] || [ "$status_code" = "401" ]; then
            echo -e "${GREEN}✅ Origin Guard (with origin)${NC} ($status_code)"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ Origin Guard (with origin)${NC} (Unexpected: $status_code)"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${RED}❌ Origin Guard (with origin)${NC} (Connection failed)"
        ((TESTS_FAILED++))
    fi
}

test_performance() {
    echo ""
    echo "⚡ Performance"
    echo "--------------"
    
    # Test response time
    start_time=$(date +%s%N)
    curl -s --max-time 10 "$FE_URL/" > /dev/null
    end_time=$(date +%s%N)
    
    response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ $response_time -lt 500 ]; then
        echo -e "${GREEN}✅ Response Time${NC} (${response_time}ms)"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠️ Response Time${NC} (${response_time}ms - slow)"
        ((TESTS_FAILED++))
    fi
}

# Run all tests
test_health
test_seo
test_security
test_api_security
test_performance

# Summary
echo ""
echo "=========================================="
echo "📊 Test Summary"
echo "=========================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Ready for production!${NC}"
    echo ""
    echo "🚀 Go-Live Checklist:"
    echo "✅ Health endpoints responding"
    echo "✅ SEO pages accessible"
    echo "✅ Security headers present"
    echo "✅ API security working"
    echo "✅ Performance acceptable"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to production"
    echo "2. Update DNS"
    echo "3. Monitor for 24 hours"
    echo "4. Check analytics"
    exit 0
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED! Fix issues before go-live.${NC}"
    exit 1
fi
