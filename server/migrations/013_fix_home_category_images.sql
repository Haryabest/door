-- Заменить внешние URL картинок категорий на главной локальным файлом.
UPDATE site_content
SET data = jsonb_set(
  data,
  '{categories}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN (elem->>'image') LIKE '/%' THEN elem
        ELSE jsonb_set(elem, '{image}', '"/home-photo.jpg"'::jsonb)
      END
    )
    FROM jsonb_array_elements(data->'categories') AS elem
  )
)
WHERE key = 'home'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(data->'categories') AS c
    WHERE (c->>'image') NOT LIKE '/%'
  );
