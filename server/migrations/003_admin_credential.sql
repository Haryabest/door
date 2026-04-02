-- Единственная строка: пароль админки (scrypt), сменить после первого входа при необходимости.
-- Стартовый пароль после миграции: admin123

CREATE TABLE admin_credential (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  CONSTRAINT admin_singleton CHECK (id = 1),
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO admin_credential (id, password_hash, salt) VALUES (
  1,
  'f36818e887b9cb91880a0bedb4c321621b35b740699b84abc6e424fad5f6c634ad74ef5bf79254c65057aa900f2c52343b90864d74cd318608113c1c53d46211',
  '646f6f7261646d696e696e697430303031'
);
