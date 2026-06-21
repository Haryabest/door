-- Удалить проекты портфолио с временными blob: URL (не работают вне сессии браузера).
DELETE FROM portfolio_items
WHERE image LIKE 'blob:%';
