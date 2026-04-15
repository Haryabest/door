-- Секрет для доступа к чату с сайта (не только по угадыванию id)
ALTER TABLE chats ADD COLUMN IF NOT EXISTS client_token TEXT;

UPDATE chats SET client_token = gen_random_uuid()::text WHERE client_token IS NULL;

ALTER TABLE chats ALTER COLUMN client_token SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_chats_client_token ON chats (client_token);
