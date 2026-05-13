-- Убираем цену из карточки товара (остаются только атрибуты и описание)
ALTER TABLE products DROP COLUMN IF EXISTS old_price;
ALTER TABLE products DROP COLUMN IF EXISTS price;
