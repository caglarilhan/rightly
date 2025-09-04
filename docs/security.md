# Security - GDPR Hub Lite

## Overview

GDPR Hub Lite, DSAR'ları otomatikleştirirken veri minimizasyonu uygular. Tüm veri işleme operasyonları güvenlik ve gizlilik standartlarına uygun şekilde tasarlanmıştır.

## Encryption

### Transport Security
- **TLS 1.2+**: Tüm veri iletişimi TLS ile şifrelenir
- **Certificate Pinning**: SSL sertifika doğrulaması
- **HSTS**: HTTP Strict Transport Security aktif

### Data at Rest
- **AES-256**: Export dosyaları AES-256 ile şifrelenir
- **Key Management**: AWS KMS veya benzeri KMS kullanımı
- **30-Day Retention**: Export'lar 30 gün sonra otomatik silinir

## Access Control

### Role-Based Access Control (RBAC)
- **Admin**: Tam sistem yönetimi
- **Manager**: DSAR işlemleri ve raporlar
- **Viewer**: Salt okuma erişimi

### Audit Logging
- **All Access**: Tüm erişimler AuditEvent tablosunda loglanır
- **Immutable Logs**: Log'lar değiştirilemez (append-only)
- **12-Month Retention**: Audit log'ları 12 ay saklanır

## Data Storage

### Infrastructure
- **EU Data Residency**: Veri yerleşimi seçeneği (GDPR uyumlu)
- **Cloudflare R2**: S3 uyumlu object storage
- **PostgreSQL**: ACID uyumlu veritabanı
- **Redis**: Session ve cache yönetimi

### Data Minimization
- **Purpose Limitation**: Sadece DSAR işlemi için veri toplanır
- **Retention Policy**: 30 gün export, 12 ay log
- **Anonymization**: Gereksiz PII alanları anonimleştirilir

## Compliance

### GDPR Compliance
- **Data Subject Rights**: Erişim, silme, taşınabilirlik
- **Consent Management**: Açık rıza yönetimi
- **DPIA Ready**: Data Protection Impact Assessment hazırlığı

### Certifications
- **SOC2 Preparation**: Güvenlik kontrolleri hazır
- **GDPR Ready**: Avrupa veri koruma düzenlemelerine uyum
- **ISO 27001**: Bilgi güvenliği standartları

## Incident Response

### Security Incidents
- **24-48h SLA**: Güvenlik olaylarına yanıt süresi
- **Automated Alerts**: Anormal aktivite tespiti
- **Incident Playbook**: Standart müdahale prosedürleri

### Data Breach Response
- **72h Notification**: GDPR Art.33/34 uyumlu bildirim
- **Forensic Analysis**: Olay analizi ve kanıt toplama
- **Customer Notification**: Etkilenen müşterilere bildirim

## Contact

### Security Questions
- **Email**: security@gdpr-hub-lite.com
- **Response Time**: 24-48 saat
- **Encryption**: PGP key available

### Vulnerability Reports
- **Responsible Disclosure**: Güvenlik açıkları için
- **Bug Bounty**: Qualifying vulnerabilities
- **Security Updates**: Otomatik güvenlik güncellemeleri

## Transparency

### Open Source Components
- **Dependency Audit**: Güvenlik açığı taraması
- **License Compliance**: Açık kaynak lisans uyumluluğu
- **Vulnerability Scanning**: Düzenli güvenlik taraması

### Third-Party Services
- **Subprocessors**: R2/S3, PostHog, SendGrid
- **Data Processing Agreements**: Tüm alt işlemcilerle DPA
- **Audit Rights**: Müşteri denetim hakları
