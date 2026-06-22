-- Разные картинки категорий на главной (вместо одного home-photo.webp).
UPDATE site_content
SET data = jsonb_set(
  data,
  '{categories}',
  '[
    {"id": 1, "title": "Межкомнатные двери", "image": "/categories/interior.avif", "category": "interior"},
    {"id": 2, "title": "Входные двери", "image": "/categories/entrance.avif", "category": "entrance"},
    {"id": 3, "title": "Фурнитура", "image": "/categories/hardware.avif", "category": "hardware"}
  ]'::jsonb
)
WHERE key = 'home';
