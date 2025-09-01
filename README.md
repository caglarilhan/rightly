# GDPR Hub Lite - GDPR DSAR Otomasyonu

Küçük işletmeler için GDPR DSAR (Data Subject Access Request) otomasyonu platformu.

## 🚀 Özellikler

- **Otomatik DSAR Yönetimi**: Veri erişim ve silme taleplerini otomatik işleme
- **E-ticaret Entegrasyonu**: Shopify ve WooCommerce ile tam entegrasyon
- **Güvenli Veri İşleme**: End-to-end şifreleme ve audit log'lar
- **30 Gün Kuralı**: GDPR uyumluluğu için otomatik süre takibi

## 🏗️ Mimari

- **Backend**: FastAPI (Python) - Port 9011
- **Frontend**: Next.js (React) - Port 3001
- **Shopify Plugin**: Express.js - Port 3000
- **WooCommerce Plugin**: PHP

## 📦 Kurulum

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 9011
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Shopify Plugin
```bash
cd shopify-plugin
npm install
npm run dev
```

## 🔗 Endpoints

- **Backend Health**: http://127.0.0.1:9011/healthz
- **Frontend**: http://localhost:3001
- **Shopify Plugin**: http://localhost:3000/healthz

## 📋 Sprint Planı

### ✅ Tamamlananlar
- [x] Backend (FastAPI) - Port 9011'de çalışıyor
- [x] Frontend (Next.js) - Port 3001'de çalışıyor
- [x] Shopify Plugin - Port 3000'de çalışıyor
- [x] WooCommerce Plugin - PHP tabanlı hazır
- [x] Auth Sistemi - JWT token sistemi hazır
- [x] Billing Sistemi - Stripe entegrasyonu hazır

### 🔄 Sıradaki Adımlar
- [ ] Database Migration (SQLite → PostgreSQL)
- [ ] Production Deployment (Fly.io/Render)
- [ ] Security & Compliance (HTTPS, Audit logs)
- [ ] Plugin Submission (Shopify App Store + WordPress.org)

## 🎯 Hedefler

- **MVP**: 2 hafta içinde çalışan sistem
- **Production**: 3 hafta içinde canlıya alma
- **MRR**: 90 günde €10k MRR hedefi

## 📄 Lisans

MIT License

