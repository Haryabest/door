-- Полная очистка каталога товаров и вкладки «Портфолио» в админке.
-- Необратимо: все строки удаляются, счётчики id сбрасываются.
-- Файлы в server/uploads/ эта миграция не трогает.

TRUNCATE TABLE products RESTART IDENTITY;

TRUNCATE TABLE portfolio_items RESTART IDENTITY;
