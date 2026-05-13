-- Страховка для БД, где не выполнились прошлые DROP price (иначе INSERT товара без price даёт not_null).
ALTER TABLE products DROP COLUMN IF EXISTS old_price;
ALTER TABLE products DROP COLUMN IF EXISTS price;
