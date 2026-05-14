INSERT INTO site_content (key, data) VALUES
(
  'chat_widget',
  '{
    "phoneText": "+7 (960) 166 30-30",
    "telegramUrl": "https://t.me/",
    "emailText": "otadoya@mail.ru"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
