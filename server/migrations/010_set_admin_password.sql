-- Смена пароля входа в /admin (таблица admin_credential, scrypt).
-- После применения старый пароль (в т.ч. admin123 из 003) больше не действует.

UPDATE admin_credential
SET
  salt = '2f1dd137e0b66c2087c2c9ba1b410fed',
  password_hash = '1b8f252338795a38a0086f62e15a45b32e1cf7816bd1f1a83f178cef3ba249ea965fbe5295be47cf7800a0fa2e9b0bcf48fbf23a2dda87b052e7d87ca6e63e84',
  updated_at = now()
WHERE id = 1;
