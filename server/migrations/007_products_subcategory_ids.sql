-- Подкатегории товара (id из JSON каталога страницы «Каталог»)
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_ids TEXT[] NOT NULL DEFAULT '{}';
