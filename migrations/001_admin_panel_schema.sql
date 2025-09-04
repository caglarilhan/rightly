-- Admin Panel v0 - RBAC + Impersonation + Audit Schema
-- PostgreSQL migration for multi-tenant admin system

-- 1) Organizations (tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email CITEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_org ON users(org_id);

-- 3) Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- null = global
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(org_id, name)
);

-- 4) Permissions (sabit seed + genişletilebilir)
CREATE TABLE permissions (
  key TEXT PRIMARY KEY,            -- "admin.users.read", "admin.users.write" ...
  resource TEXT NOT NULL,          -- "users","roles","flags","audit","billing"
  action TEXT NOT NULL             -- "read","write","impersonate","toggle","view"
);

-- 5) Role ↔ Permission (N:N)
CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  perm_key TEXT NOT NULL REFERENCES permissions(key) ON DELETE CASCADE,
  PRIMARY KEY (role_id, perm_key)
);

-- 6) User ↔ Role (N:N)
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- 7) Feature Flags (org + global)
CREATE TABLE feature_flags (
  key TEXT PRIMARY KEY,                  -- "ai_copilot","admin_panel","war_room"
  description TEXT
);
CREATE TABLE org_feature_flags (
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  flag_key TEXT NOT NULL REFERENCES feature_flags(key) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY(org_id, flag_key)
);

-- 8) Impersonation Sessions (TTL + reason)
CREATE TABLE impersonation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  ip_hash TEXT,                             -- isteğe bağlı: IP pinning
  user_agent_hash TEXT,                     -- isteğe bağlı: UA pinning
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_impersonation_admin ON impersonation_sessions(admin_user_id);
CREATE INDEX idx_impersonation_target ON impersonation_sessions(target_user_id);

-- 9) Audit Events (yüksek sinyalli kanıt)
CREATE TABLE audit_events (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  acting_as_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- impersonation
  severity TEXT NOT NULL DEFAULT 'INFO',                          -- INFO|WARN|HIGH
  action TEXT NOT NULL,                                           -- "user.role.update", "admin.impersonate.start"
  resource TEXT,                                                  -- "users","roles","flags"
  details JSONB,                                                  -- ek bağlam
  ip TEXT,
  user_agent TEXT,
  request_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_org_time ON audit_events(org_id, created_at DESC);

-- Seed Data
INSERT INTO permissions (key, resource, action) VALUES
  ('admin.users.read', 'users', 'read'),
  ('admin.users.write', 'users', 'write'),
  ('admin.users.impersonate', 'users', 'impersonate'),
  ('admin.roles.read', 'roles', 'read'),
  ('admin.roles.write', 'roles', 'write'),
  ('admin.flags.read', 'flags', 'read'),
  ('admin.flags.toggle', 'flags', 'toggle'),
  ('admin.audit.view', 'audit', 'view'),
  ('admin.billing.view', 'billing', 'view'),
  ('admin.health.view', 'health', 'view');

-- Default roles
INSERT INTO roles (id, name, description) VALUES
  (gen_random_uuid(), 'Admin', 'Full system access'),
  (gen_random_uuid(), 'Analyst', 'Read access + audit view'),
  (gen_random_uuid(), 'Support', 'Limited user management');

-- Feature flags
INSERT INTO feature_flags (key, description) VALUES
  ('admin_panel', 'Admin panel access'),
  ('ai_copilot', 'AI assistant features'),
  ('war_room', 'Launch day war room'),
  ('advanced_analytics', 'Advanced analytics dashboard');
