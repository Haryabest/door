-- Заменить jpg на webp для категорий главной.
UPDATE site_content
SET data = jsonb_set(
  data,
  '{categories}',
  (
    SELECT jsonb_agg(
      jsonb_set(elem, '{image}', '"/home-photo.webp"'::jsonb)
    )
    FROM jsonb_array_elements(data->'categories') AS elem
  )
)
WHERE key = 'home';
