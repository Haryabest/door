-- Extensions for search (optional; safe if unavailable in managed PG)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  old_price NUMERIC(12, 2),
  description TEXT,
  features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  material TEXT NOT NULL,
  color TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);

CREATE TABLE portfolio_items (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portfolio_sort ON portfolio_items (sort_order, id);

-- CMS blobs: home, about, contacts, catalog, header
CREATE TABLE site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  unread_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  chat_id INT NOT NULL REFERENCES chats (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_user BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_chat ON chat_messages (chat_id, created_at);

CREATE OR REPLACE FUNCTION set_updated_at_products()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at_products();
