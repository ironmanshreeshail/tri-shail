CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  goal TEXT,
  message TEXT,
  consent_at TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);
CREATE INDEX IF NOT EXISTS enquiries_created_at ON enquiries (created_at);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS rate_limits_expiry ON rate_limits (expires_at);
