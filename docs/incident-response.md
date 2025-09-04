# Incident Response Templates

## [SEV-2] DSAR Export Gecikmesi (P95>10dk)

### Etki
- DSAR kapatma süresi uzuyor
- 30 gün SLA riski düşük/orta
- Müşteri deneyimi etkileniyor

### Kök Neden Hipotez
1. Worker concurrency düşük
2. S3 hataları (403/5xx)
3. Redis bağlantı sorunları
4. Package task'ı yavaş çalışıyor

### Aksiyonlar
```bash
# 1. Worker sayısını ×2, concurrency +5
docker-compose scale worker=4
# veya
celery -A app.celery_app.celery_app worker -Q celery -l info --concurrency=10

# 2. S3 retry/backoff aç (max_attempts:5)
# app/tasks/ops.py içinde zaten var

# 3. Başarısız partileri yeniden sırala
celery -A app.celery_app.celery_app call app.tasks.retry_failed_exports

# 4. Müşterilere otomatik bilgilendirme
python scripts/notify_customers_export_delay.py
```

### Müşteri İletişim Şablonu
```
Subject: DSAR Export Gecikmesi - Düzeltildi

Merhaba,

DSAR export işleminizde teknik bir gecikme yaşandı. Sorun çözüldü ve export'unuz hazırlanıyor.

Beklenen süre: 2-3 saat
SLA: 30 gün içinde tamamlanacak

Özür dileriz,
GDPR Hub Lite Ekibi
```

### RCA (T+24h)
- [ ] Root cause analysis tamamlandı
- [ ] Prevention plan hazırlandı
- [ ] Monitoring alerts eklendi

### Önleme
- [ ] Queue auto-scale
- [ ] Package parçalı upload
- [ ] S3 health check monitoring

---

## [SEV-2] Webhook HMAC Failures

### Etki
- Shopify webhook'ları işlenmiyor
- DSAR talepleri gecikiyor
- GDPR compliance riski

### Kök Neden Hipotez
1. SHOPIFY_API_SECRET değişti
2. Clock skew (sunucu saati yanlış)
3. Webhook payload formatı değişti
4. Saldırı girişimi

### Aksiyonlar
```bash
# 1. HMAC secret kontrolü
echo $SHOPIFY_API_SECRET | wc -c
# Expected: 32+ characters

# 2. Clock sync kontrolü
ntpdate -q pool.ntp.org

# 3. Webhook log analizi
tail -f /var/log/gdpr-hub/webhook.log | grep "hmac_fail"

# 4. Manual webhook replay
python tools/replay_failed_webhooks.py
```

### Müşteri İletişim Şablonu
```
Subject: DSAR Talebiniz İşleniyor

Merhaba,

DSAR talebiniz alındı ve işleniyor. Teknik bir gecikme yaşandı ancak sorun çözüldü.

Tahmini süre: 24 saat
SLA: 30 gün içinde tamamlanacak

Teşekkürler,
GDPR Hub Lite Ekibi
```

---

## [SEV-3] Rate Limit Storm

### Etki
- API erişimi kısıtlı
- Müşteri deneyimi etkileniyor
- Potansiyel saldırı

### Aksiyonlar
```bash
# 1. Rate limit kotalarını geçici artır
redis-cli SET rate_limit:auth:limit 120  # 60→120
redis-cli SET rate_limit:requests:limit 60  # 30→60

# 2. Saldırı IP'lerini engelle
iptables -A INPUT -s ATTACK_IP -j DROP

# 3. Log sampling
tail -f /var/log/gdpr-hub/api.log | grep "429"

# 4. Monitoring dashboard kontrolü
# Grafana'da rate limit grafiklerini kontrol et
```

### Önleme
- [ ] DDoS protection
- [ ] IP whitelist
- [ ] Rate limit monitoring

---

## [SEV-1] Database Connection Issues

### Etki
- Tüm sistem çalışmıyor
- Veri kaybı riski
- Müşteri erişimi yok

### Aksiyonlar
```bash
# 1. Database health check
pg_isready -h localhost -p 5432

# 2. Connection pool kontrolü
psql -c "SELECT count(*) FROM pg_stat_activity;"

# 3. Failover (eğer varsa)
docker-compose -f docker-compose.prod.yml up -d db-replica

# 4. Emergency maintenance mode
MAINTENANCE_MODE=true
```

### Müşteri İletişim Şablonu
```
Subject: Sistem Bakımı - Kısa Süreli Kesinti

Merhaba,

Sistemimizde planlı bakım çalışması yapılıyor. 30 dakika içinde tamamen erişilebilir olacak.

Özür dileriz,
GDPR Hub Lite Ekibi
```

---

## Kill-Switch Procedures

### Emergency Stop
```bash
# Webhook tüketimini durdur
export FEATURE_WEBHOOK_PROCESSING=false

# Maintenance mode
export MAINTENANCE_MODE=true

# Queue'yu pause et
celery -A app.celery_app.celery_app control shutdown

# Load balancer'da traffic'i durdur
# nginx -s stop
```

### Rollback
```bash
# Son başarılı imaja dön
docker-compose -f docker-compose.prod.yml down
docker tag gdpr-hub-lite:previous gdpr-hub-lite:latest
docker-compose -f docker-compose.prod.yml up -d

# Database rollback
alembic downgrade -1
```
