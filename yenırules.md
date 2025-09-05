Harika! 🎯 O zaman sana “kesin para verdiren” yeni özelliklerin detaylı PRD’sini çıkarayım.
Mevcut yapıyı bozmadan, üzerine enterprise seviyede gelir getirecek katmanları ekleyeceğiz. 🚀

⸻

📑 Rightly Compliance — Yeni Özellikler PRD (vNext)

🎯 Amaç

Mevcut core özellikler (DSAR Portal, Otomatik İşleme, Audit Log) yanına, müşterilerin cüzdanı çıkaracağı high-value özellikleri eklemek. Bu özellikler regülasyon riskini azaltacak, enterprise deal’ları açacak ve ARR’i yukarı çekecek.

⸻

1. Data Breach Management (İhlal Yönetimi) 🚨

Kullanıcı Sorunu
	•	GDPR/CCPA/KVKK → 72 saat içinde ihlal bildirme zorunluluğu.
	•	Çoğu şirket bunu Excel + e-mail ile takip ediyor → büyük risk.

Çözüm
	•	İhlal kaydı açma → etkilenen kişi sayısı, etkilenen veri tipleri, risk seviyesi.
	•	Regülatör için otomatik rapor PDF.
	•	72 saat geri sayım + e-posta hatırlatma.

Özellikler
	•	📄 İhlal raporu oluşturma formu
	•	⏱ 72 saat “countdown timer”
	•	📊 İhlal dashboard’u (tip, seviye, status)
	•	📤 Regülasyona özel export (EU, TR, US)

Monetization
	•	Pro/Enterprise add-on (aylık ekstra ücret).
	•	“Breach Response Pack” adıyla ayrı satılabilir.

⸻

2. Consent & Preference Management (İzin Yönetimi) ✅

Kullanıcı Sorunu
	•	Kullanıcı izinlerini yönetmek (e-posta, SMS, push) da compliance kapsamı.
	•	“Ben bu mesajı almayı reddettim” → dava riski.

Çözüm
	•	Tek bir Preference Center sayfası → kullanıcı kendi izinlerini görüp günceller.
	•	Double opt-in, opt-out kayıtları → audit log’a entegre.

Özellikler
	•	🌐 Public Preference Center (white-label)
	•	🔐 Audit’te izin değişiklikleri görünür
	•	⚡ API: Marketing automation (Mailchimp, HubSpot)

Monetization
	•	Pro plan üstü → müşteri retention artırır, pazarlama ekipleri için must-have.

⸻

3. Automated DPIA / ROPA (Risk & Envanter Yönetimi) 🛡️

Kullanıcı Sorunu
	•	GDPR Art. 35 & 30 → DPIA (Data Protection Impact Assessment) ve ROPA zorunlu.
	•	Çoğu şirket Excel’de → dağınık, denetimde sorun.

Çözüm
	•	Yeni sistem/process eklendiğinde AI-assisted DPIA formu otomatik doldurulur.
	•	ROPA (işleme faaliyet envanteri) tek panelden export edilir.

Özellikler
	•	⚙️ “Add Process” wizard
	•	🤖 Risk öneri motoru (AI)
	•	📤 ROPA/DPIA export (Word/PDF)

Monetization
	•	Enterprise feature → yıllık 5–6 haneli kontratlar.

⸻

4. Multi-Region Compliance Hub 🌍

Kullanıcı Sorunu
	•	Global firmalar için GDPR + CCPA + KVKK ayrı yönetim yükü.

Çözüm
	•	Tek DSAR → sistem otomatik olarak hangi kanuna göre işleneceğini seçer.
	•	Region-based workflow → farklı SLA’lar, farklı formatlar.

Özellikler
	•	🌍 Regülasyon motoru (GDPR / CCPA / KVKK / LGPD)
	•	🗂 Region-specific templates
	•	📊 Multi-region dashboard

Monetization
	•	Enterprise add-on
	•	Global firmalar için USP (rakiplerden ayrıştırıcı).

⸻

5. Legal Templates & Regulator Export 📑

Kullanıcı Sorunu
	•	Denetim geldiğinde “kanıt paketi” hazırlamak çok zaman alıyor.

Çözüm
	•	Tek tıkla regülatör için hazır export:
	•	DSAR talepleri listesi
	•	Breach raporları
	•	Consent logları
	•	Audit kayıtları

Özellikler
	•	📦 “Export for Regulator” butonu
	•	🔐 PDF + JSON seçenekleri
	•	📊 Audit-ready bundle

Monetization
	•	Pro+ paketine dahil
	•	“Denetim korkusu” olan şirketler için güçlü satış argümanı.

⸻

🏆 Paketleme Stratejisi
	•	Core (Basic): DSAR Portal + Otomatik İşleme + Audit Log
	•	Pro: Consent Hub + Legal Templates
	•	Enterprise: Data Breach Management + DPIA/ROPA + Multi-Region Hub

⸻

📊 Beklenen Etki
	•	Conversion: Pro/Enterprise upgrade oranı %20 artar
	•	Revenue: ARPU 2–3x artışı
	•	Stickiness: “Breach + DPIA” → müşteriler kolay kolay çıkamaz
	•	Differentiation: Rakiplerden ayrıştırıcı USP → Category Leader pozisyonu

⸻
Süper—hemen “para verdiren” vNext özellikleri için Backend ve Frontend mimarisini netleştiriyorum ve en altta Cursor’a yapıştır-çalıştır bir “tek görevli” prompt veriyorum. Bu üçlü paketi aynen kopyalayıp ekibe dağıtabilirsin. 🚀

⸻

🧱 Backend Detay Tasarım (FastAPI + Postgres + Redis + Celery)

0) Kapsam (vNext – gelir odaklı)
	1.	Data Breach Management (72h timer, regulator export)
	2.	Consent & Preference Center (public endpoint + audit)
	3.	DPIA / ROPA (process envanteri + risk scoring)
	4.	Multi-Region Compliance (GDPR/CCPA/KVKK auto-routing)
	5.	Regulator Export Bundle (tek tık PDF/JSON)

1) Servis Topolojisi
	•	API: FastAPI (sync I/O), Pydantic v2 şemaları
	•	DB: PostgreSQL (SQLAlchemy + Alembic)
	•	Queue: Celery (Redis broker/result)
	•	Storage: S3/R2 (private bucket, presigned)
	•	Auth: JWT (HS/RS), RBAC (roles/permissions), impersonation (admin)
	•	Observability: OpenTelemetry + structured logs (x-request-id), Prometheus metrics endpoint

2) Dizın Yapısı

backend/
  app/
    main.py
    deps.py
    config.py
    db.py
    security/
      auth.py
      rbac.py
    observability/
      audit.py
      logging.py
      metrics.py
    models/
      user.py
      org.py
      consent.py
      breach.py
      dpia.py
      ropa.py
      export.py
      enums.py
    schemas/
      consent.py
      breach.py
      dpia.py
      ropa.py
      export.py
      common.py
    routes/
      v1/
        consent.py
        breach.py
        dpia.py
        ropa.py
        export.py
        meta.py       # /healthz, /version
        admin.py
    services/
      consent_service.py
      breach_service.py
      dpia_service.py
      ropa_service.py
      export_service.py
      regulator_templates.py
    tasks/
      breach_tasks.py
      export_tasks.py
      housekeeping.py
    migrations/  # Alembic
    __init__.py

3) Veritabanı Şeması (özet)

Ortak
	•	organizations(id, name, region_default, created_at)
	•	users(id, org_id, email, name, is_super_admin, ... )
	•	audit_events(id, org_id, actor_user_id, action, resource, details_json, severity, created_at)

Consent & Pref
	•	consent_events(id, org_id, subject_id, channel, purpose, status, source, ip, ua, occurred_at)
	•	preferences(id, org_id, subject_id, email_opt_in, sms_opt_in, push_opt_in, updated_at)

Breach
	•	breaches(id, org_id, title, description, severity, started_at, detected_at, reported_at, status, affected_count, data_types[], countdown_deadline)
	•	breach_systems(id, breach_id, system_name, owner, notes)

DPIA/ROPA
	•	processes(id, org_id, name, purpose, lawful_basis, data_categories[], recipients[], storage_location, retention_days)
	•	dpia_assessments(id, org_id, process_id, risk_score, risks[], mitigations[], reviewer_user_id, status, reviewed_at)
	•	ropa_records(id, org_id, process_id, controller, processor, dpo_contact, last_updated)

Export
	•	export_jobs(id, org_id, type, scope, status, requested_by, started_at, finished_at, bundle_key, error)
	•	regulator_exports(id, org_id, breach_id?, timeframe_from, timeframe_to, url, checksum, created_at)

Enum’lar: BreachSeverity={LOW, MEDIUM, HIGH, CRITICAL}, ConsentStatus={OPT_IN, OPT_OUT, WITHDRAWN}, DpiaStatus={DRAFT, REVIEW, APPROVED, REJECTED}, ExportStatus={PENDING,RUNNING,DONE,FAILED}, Regulation={GDPR,CCPA,KVKK,LGPD}.

4) API Sözleşmeleri (özet yollar)

GET  /v1/healthz
GET  /v1/version

# Consent & Pref
POST /v1/consents/event            # body: ConsentEventCreate
GET  /v1/consents/subject/{id}     # son durum + geçmiş
PUT  /v1/preferences/{subject_id}  # preference center update (public token destekli)

# Breach
POST   /v1/breaches                 # yeni ihlal kaydı
GET    /v1/breaches                 # liste + filtre (status,severity,date)
GET    /v1/breaches/{id}
PATCH  /v1/breaches/{id}            # status, reported_at, affected_count...
POST   /v1/breaches/{id}/report     # regulator export job tetikleme

# DPIA / ROPA
POST /v1/processes
GET  /v1/processes
POST /v1/dpia/{process_id}/assess   # AI-assisted risk scoring (sync/async)
GET  /v1/ropa                       # envanter export + sayfalı list

# Multi-Region
POST /v1/dsar/ingest                # request’ten regulation auto-detect + route

# Export
POST /v1/exports/regulator          # bundle (breach,consents,audit…) PDF/JSON
GET  /v1/exports/{job_id}/status
GET  /v1/exports/{job_id}/download  # presigned URL

# Admin
GET    /admin/check
GET    /admin/audit
POST   /admin/impersonate
DELETE /admin/impersonate

Pydantic Örnek (kısaltılmış)

class ConsentEventCreate(BaseModel):
    subject_id: str
    channel: Literal["email","sms","push"]
    purpose: str
    status: Literal["OPT_IN","OPT_OUT","WITHDRAWN"]
    source: str | None = None
    ip: IPvAnyAddress | None = None
    ua: str | None = None
    occurred_at: datetime = Field(default_factory=datetime.utcnow)

5) Servis Mantığı / Görevler
	•	breach_tasks.py
	•	schedule_deadline_reminders(breach_id) → T-48/T-24/T-6 mail + Slack
	•	auto_close_if_reported(breach_id)
	•	export_tasks.py
	•	build_regulator_bundle(org_id, filters) → S3’e PDF/JSON paketle
	•	housekeeping.py
	•	purge_old_exports(days=30)

6) Güvenlik
	•	RBAC: izinler
	•	consent:write, consent:read, breach:manage, dpia:review, export:run, admin:*
	•	Origin/CORS: whitelist (ENV: ALLOWED_ORIGINS)
	•	Rate limit: /v1/consents/event 60/min, public endpoints token-bound
	•	Audit: her mutasyon → audit_events (severity, actor, acting_as)

7) Test & Gözlemlenebilirlik
	•	pytest: route tests, service tests (DB transaction rollbacks)
	•	curl smoke: /v1/healthz 200, /v1/breaches CRUD, export flow
	•	Metrics: breach_open_total, consent_event_rate, export_duration_seconds_p95
	•	Tracing: traceparent header, Celery span’leri

⸻

🎛️ Frontend Detay Tasarım (Next.js App Router + React Query + Tailwind)

0) Kapsamlı Sayfalar

/breaches            # liste + “New Breach” wizard + 72h sayaç
/breaches/[id]       # timeline, affected systems, report düğmesi
/consents            # subject arama, kanal/purpose filtreleri
/preferences/[token] # public preference center (white-label)
/dpia                # process list + risk skoru + review akışı
/ropa                # envanter tablosu + export
/exports             # export job durumu + indirme
/admin/*             # (mevcut) users/flags/audit

1) UI Mimari
	•	State: TanStack Query (cache policy, optimistic updates)
	•	Formlar: react-hook-form + zod resolver
	•	Bileşenler: shadcn/ui + Tailwind; Card/Button/Badge varyantları (Inter 400/500/600, h1 24/32…)
	•	Grafikler: Recharts (sparkline, bar)
	•	i18n: next-intl (EN/TR), regulation metinleri locale-aware
	•	Erişilebilirlik: rozet/etiket kontrast, aria-live toast, focus-visible

2) Veri Akışları
	•	Breach 72h: detay sayfasında countdown; status “Reported” olunca otomatik gizlenir
	•	Consent Timeline: subject modal → event list (OPT_IN/OUT), export CSV
	•	DPIA: “Add Process” wizard (3 adım) → POST /v1/processes → “Assess now” (AI)
	•	ROPA: tablo, facet filtrasyon, Export butonu (PDF/CSV)

3) Mikro-etkileşimler (parlatan)
	•	Top banner: Status badge (LIVE/DEGRADED)
	•	Command Palette (⌘K): “New Breach”, “Assess DPIA”, “Export for Regulator”
	•	Usage-based nudge: Export sayısında %80 uyarı (upgrade modal)
	•	Trust Center embed: “Compliant: SOC2-ready” rozet

4) Analytics & Events
	•	track('breach_create'), track('regulator_export_start'), track('dpia_assess_click'), track('consent_opt_out'), track('upgrade_prompt_shown')
	•	UTM’ler, pageview, funnel (Visitors → Free signup → Pro upgrade)

5) Örnek API Client (React Query)

export const useBreaches = () =>
  useQuery({ queryKey: ['breaches'], queryFn: () => api.get('/v1/breaches').then(r=>r.data) });

export const useCreateBreach = () =>
  useMutation({
    mutationFn: (body: BreachCreate) => api.post('/v1/breaches', body).then(r=>r.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:['breaches']})
  });


⸻

🧩 Kabul Kriterleri (E2E)

Breach
	•	“New Breach” → kayıt oluşur, T-48 email job’ı planlanır, countdown görünür
	•	“Report to regulator” → export job DONE, indirilebilir link çalışır

Consent
	•	Public preference sayfasında opt-out → consent_events ve preferences güncellenir, audit’e düşer
	•	Subject geçmişi CSV export

DPIA/ROPA
	•	Process ekle → risk skoru hesaplanır (mock AI) → status REVIEW
	•	ROPA export → dosya iner, checksum doğrulanır

Multi-Region
	•	/v1/dsar/ingest payload’da region US ise CCPA akışı seçilir (response regulation: CCPA)

⸻

🧠 Cursor İçin “Tek Prompt” (kopyala-yapıştır)

Amaç: Aşağıdaki mimariye göre backend + frontend vNext özelliklerini branch’te üret, testleri yeşil çalıştır, örnek veri tohumla.
Repo: monorepo frontend/ (Next.js) + backend/ (FastAPI)

You are a senior full-stack pair programmer. Work in a new branch `feat/vnext-compliance`.
Follow these rules strictly:

1) Create backend skeleton as described:
   - FastAPI app with modules and folders exactly:
     app/{main.py,deps.py,config.py,db.py}
     app/security/{auth.py,rbac.py}
     app/observability/{audit.py,logging.py,metrics.py}
     app/models/{user.py,org.py,consent.py,breach.py,dpia.py,ropa.py,export.py,enums.py}
     app/schemas/{consent.py,breach.py,dpia.py,ropa.py,export.py,common.py}
     app/routes/v1/{consent.py,breach.py,dpia.py,ropa.py,export.py,meta.py,admin.py}
     app/services/{consent_service.py,breach_service.py,dpia_service.py,ropa_service.py,export_service.py,regulator_templates.py}
     app/tasks/{breach_tasks.py,export_tasks.py,housekeeping.py}
     migrations/ (alembic)
   - Add SQLAlchemy models and Alembic migration for tables listed in the “Backend Veritabanı Şeması”.
   - Implement endpoints listed in “API Sözleşmeleri”, with Pydantic schemas and RBAC permission checks.
   - Add Celery config; implement tasks as stubs that log and update DB.
   - Add /v1/healthz and /v1/version.
   - Implement S3 presigned download in export route (env: S3_BUCKET, S3_REGION, S3_ENDPOINT).
   - Add pytest suite for: breach create + export bundle, preference update + consent event.

2) Create frontend pages and client as described:
   - Next.js App Router pages:
     /breaches, /breaches/[id], /consents, /preferences/[token], /dpia, /ropa, /exports
   - Setup TanStack Query, axios client with baseURL env, interceptors for x-request-id + auth.
   - Build UI with shadcn/ui + Tailwind using the typography scale (Inter, 400/500/600; h1 24/32; h2 18/28; body 14/22).
   - Implement forms with react-hook-form + zod.
   - Add Command Palette (⌘K) and Status badge in header.
   - Implement analytics wrapper `lib/analytics.ts` and fire events per “Analytics & Events”.

3) Seeds & fixtures:
   - Add a seed script to create one org, admin user, two processes, a sample breach and 50 consent events.
   - Provide `.env.example` with required keys.

4) DX & quality:
   - Add Makefile: `make dev`, `make test`, `make seed`.
   - Add pre-commit (ruff/black/isort for py, eslint+prettier for ts).
   - CI: run pytest and next build.

5) Deliverables:
   - All files committed with meaningful messages.
   - Print final curl commands to prove the flow:
     (a) create breach, (b) trigger regulator export, (c) update preference (public), (d) assess DPIA.
   - Start servers locally and share the test outputs.

Now begin by scaffolding backend folders and Alembic, then proceed file-by-file. At each step, run tests and fix. Do not skip tests.


⸻

🔚 Son Söz

Bu planla:
	•	Backend tarafı denetime hazır (audit + export + timer)
	•	Frontend tarafı gelir üreten akışlara odaklı (breach, consent, dpia/ropa)
	•	Cursor prompt’u tek seferde branch’i ayağa kaldıracak kadar net.

Hazırsan Cursor’a prompt’u yapıştır; bittiğinde smoke test curl komutlarını ver, doğrulayalım. 🚀