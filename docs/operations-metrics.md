# Operasyon Metrikleri ve Alarmlar

## Metrik Seti (Minimum Viable Observability)

### HTTP Metrikleri
```bash
# 5xx rate
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "5xx_rate"

# P95 latency
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "p95_latency"

# Endpoints to monitor
- FE /api/* (P95 < 200ms)
- BE /healthz (P95 < 100ms)
- BE /v1/downloads/* (P95 < 300ms)
```

### Queue Metrikleri
```bash
# Celery queue depth
celery -A app.celery_app.celery_app inspect stats | grep "celery_queue_depth"

# Task runtime P95
celery -A app.celery_app.celery_app inspect stats | grep "task_runtime_p95"

# Tasks to monitor
- discover (P95 < 30s)
- package (P95 < 5min)
- erase (P95 < 60s)
```

### Webhook Metrikleri
```bash
# Webhook total
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "webhook_total"

# HMAC failures
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "webhook_hmac_fail"

# Deduplication hits
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "webhook_dedup_hit"
```

### Storage Metrikleri
```bash
# S3 upload failure rate
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "s3_upload_fail_rate"

# Total exports
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "exports_total"

# Exports older than 30 days
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "exports_older_30d"
```

### Security Metrikleri
```bash
# Rate limit throttled
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "rl_throttled_total"

# Origin guard blocked
curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "origin_guard_blocked"
```

## Alarm Eşikleri (Başlangıç)

### SEV-2 Alarmlar
```bash
# 5xx rate > 1% (5 dk)
if [ $(curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "5xx_rate" | awk '{print $2}') -gt 1 ]; then
  echo "SEV-2: 5xx rate exceeded 1%"
  # Send alert
fi

# Celery queue depth > 100 (10 dk)
if [ $(celery -A app.celery_app.celery_app inspect stats | grep "celery_queue_depth" | awk '{print $2}') -gt 100 ]; then
  echo "SEV-2: Celery queue depth exceeded 100"
  # Send alert
fi

# Task runtime P95 > 10 dk
if [ $(celery -A app.celery_app.celery_app inspect stats | grep "task_runtime_p95" | awk '{print $2}') -gt 600 ]; then
  echo "SEV-2: Task runtime P95 exceeded 10 minutes"
  # Send alert
fi

# S3 upload failure rate > 2% (15 dk)
if [ $(curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "s3_upload_fail_rate" | awk '{print $2}') -gt 2 ]; then
  echo "SEV-2: S3 upload failure rate exceeded 2%"
  # Send alert
fi
```

### SEV-3 Alarmlar
```bash
# Webhook HMAC failures > 5/5dk
if [ $(curl -s "https://app.gdpr-hub-lite.com/metrics" | grep "webhook_hmac_fail" | awk '{print $2}') -gt 5 ]; then
  echo "SEV-3: Webhook HMAC failures exceeded 5 in 5 minutes"
  # Send alert
fi
```

## Monitoring Dashboard

### Grafana Queries
```sql
-- 5xx Error Rate
SELECT rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

-- P95 Latency
SELECT histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

-- Celery Queue Depth
SELECT celery_queue_depth

-- Webhook Success Rate
SELECT rate(webhook_total[5m]) - rate(webhook_hmac_fail[5m]) / rate(webhook_total[5m]) * 100
```

### Alert Rules (Prometheus)
```yaml
groups:
- name: gdpr-hub-lite
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate detected"
      description: "5xx error rate is {{ $value }}%"

  - alert: CeleryQueueDepth
    expr: celery_queue_depth > 100
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Celery queue depth is high"
      description: "Queue depth is {{ $value }}"

  - alert: WebhookHMACFailures
    expr: rate(webhook_hmac_fail[5m]) > 5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Webhook HMAC failures detected"
      description: "{{ $value }} HMAC failures in 5 minutes"
```
