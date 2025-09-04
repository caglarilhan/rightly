# Go-Live Runbook - GDPR Hub Lite

## T-7: Dondurma ve Güvenlik

### Release Freeze
- [ ] Ana branch'a yalnız hotfix commit'leri
- [ ] Feature branch'ları freeze
- [ ] Production deployment pipeline test

### Secret Rotasyonu
```bash
# Production secret store'a taşı
SHOPIFY_API_SECRET=prod_webhook_secret_rotated
DOWNLOAD_TOKEN_SECRET=prod_download_secret_rotated
S3_ACCESS_KEY_ID=prod_s3_key_rotated
S3_SECRET_ACCESS_KEY=prod_s3_secret_rotated
```

### CORS/Origin Whitelist
```javascript
// next.config.js
const allowedOrigins = [
  'https://app.gdpr-hub-lite.com',
  'https://gdpr-hub-lite.com'
];
```

### Security Headers Verification
```bash
# CSP/HSTS/Frame-Options kontrol
curl -I https://app.gdpr-hub-lite.com | grep -E "(X-Frame-Options|Content-Security-Policy|Strict-Transport-Security)"
```

### Backup Strategy
- [ ] PostgreSQL günlük snapshot (RPO=15dk)
- [ ] R2/S3 bucket backup
- [ ] Restore dry-run test
- [ ] Backup verification: `SELECT COUNT(*) FROM audit_events;`

### Legal Pages
- [ ] DPA sayfası footer'da erişilebilir
- [ ] Privacy Policy güncel
- [ ] Terms of Service güncel
- [ ] E-imza akışı hazır

## T-1: Kalite Kapıları

### Migration Dry-Run
```bash
# Alembic migration test
alembic upgrade --sql
# Prisma migration test (eğer kullanılıyorsa)
npx prisma migrate diff
```

### Shopify Webhook Self-Test
```bash
# Valid HMAC → 200
python tools/test_shopify_webhook.py
# Expected: valid=200, invalid=401, dedup=200
```

### Celery Canlılık Testi
```bash
# Worker ping
celery -A app.celery_app.celery_app inspect ping
# Registered tasks
celery -A app.celery_app.celery_app inspect registered
# Active tasks (should be 0)
celery -A app.celery_app.celery_app inspect active
# Queue confirmation
celery -A app.celery_app.celery_app inspect stats
```

### Presigned URL Test
```bash
# Clock-skew toleransı test
python tools/make_fake_token.py > /tmp/tkn
curl -fsS "http://127.0.0.1:9011/api/v1/downloads/$(cat /tmp/tkn)" -o /dev/null
# NTP sync kontrol
ntpdate -q pool.ntp.org
```

### Rate-Limit Test
```bash
# Auth rate-limit (60 rpm)
for i in {1..65}; do curl -s http://127.0.0.1:9011/auth/login; done
# Requests rate-limit (30 rpm)
for i in {1..35}; do curl -s http://127.0.0.1:9011/api/v1/requests; done
# Downloads rate-limit (10 rpm)
for i in {1..15}; do curl -s http://127.0.0.1:9011/api/v1/downloads/token; done
```

## T-0: Yayın

### Blue/Green Deployment
```bash
# Green environment'ı hazırla
docker-compose -f docker-compose.prod.yml up -d green
# 1% trafik yönlendir
# 5 dakika bekle, hata oranı < %1, P95 < 400ms
# %100 trafik yönlendir
```

### Feature Flags
```bash
# Stripe connector kapalı
FEATURE_STRIPE_CONNECTOR=false
# Gmail/Drive connector kapalı
FEATURE_GMAIL_DRIVE_CONNECTOR=false
# Agency workspace kapalı
FEATURE_AGENCY_WORKSPACE=false
```

### Status Page
- [ ] "All systems operational"
- [ ] Version note: "v1.0.0 - GDPR DSAR Automation"
- [ ] Monitoring dashboard aktif

## T+1: Erken Uyarı

### Error Budget
```bash
# 5xx oranı <%0.5 (1. gün)
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "5xx_rate"
```

### Webhook SLO
- [ ] P95 end-to-end < 800ms
- [ ] Başarısız webhook < %0.2
- [ ] Webhook queue depth < 10

### Export SLO
- [ ] Package task P95 < 5 dk
- [ ] S3 hataları < %0.5
- [ ] Export success rate > %99.5

## T+7: Sertleştirme Turu

### Audit Örneklem
```bash
# 10 rastgele DSAR için AuditEvent zinciri
SELECT request_id, event_type, created_at, details 
FROM audit_events 
WHERE event_type = 'package_created' 
ORDER BY RANDOM() LIMIT 10;

# ZIP SHA256 doğrulaması
python tools/verify_export_sha256.py
```

### Cleanup Verification
```bash
# 7 günde cleanup job çalışmış mı?
SELECT COUNT(*) FROM audit_events 
WHERE event_type = 'cleanup_completed' 
AND created_at > NOW() - INTERVAL '7 days';

# 30 günlük silme politikası manuel tetikle
celery -A app.celery_app.celery_app call app.tasks.cleanup_exports
```

### Listing KPI
- [ ] App Store: view→install→activation oranı
- [ ] WordPress.org: indirme→aktif site oranı
- [ ] Conversion rate tracking

## T+30: Sağlamlaştırma ve Büyüme

### NPS & Churn
- [ ] İlk 30 gün NPS prompt (<10 müşteri)
- [ ] Churn ≤ %10
- [ ] Customer feedback analysis

### Fiyatlandırma A/B Test
- [ ] Pro=€49 anchor test (3 hafta)
- [ ] CR ve ARPU karşılaştırma
- [ ] Pricing optimization

## Rollback Plan

### Emergency Rollback
```bash
# Son başarılı imaja dön
docker-compose -f docker-compose.prod.yml down
docker tag gdpr-hub-lite:previous gdpr-hub-lite:latest
docker-compose -f docker-compose.prod.yml up -d

# Database rollback
alembic downgrade -1
```

### Kill-Switch
```bash
# Webhook tüketimini durdur
FEATURE_WEBHOOK_PROCESSING=false
# Maintenance mode
MAINTENANCE_MODE=true
```
