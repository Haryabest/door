-- Site content (same defaults as frontend fallbacks)
INSERT INTO site_content (key, data) VALUES
(
  'home',
  '{
    "hero": {
      "title": "От А до Я",
      "subtitle": "Премиум двери и фурнитура",
      "city": "Нижний Новгород",
      "backgroundImage": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
    },
    "features": [
      {"id": 1, "icon": "DoorOpen", "title": "Широкий ассортимент", "description": "Межкомнатные и входные двери, системы, панели, плинтуса и фурнитура"},
      {"id": 2, "icon": "Shield", "title": "Гарантия качества", "description": "Работаем только с проверенными производителями и предоставляем гарантию"},
      {"id": 3, "icon": "Award", "title": "Профессионализм", "description": "Опытные консультанты помогут подобрать идеальное решение для вас"}
    ],
    "categories": [
      {"id": 1, "title": "Межкомнатные двери", "image": "https://images.unsplash.com/photo-1765766599489-fd53df7f8724?w=1080", "category": "interior"},
      {"id": 2, "title": "Входные двери", "image": "https://images.unsplash.com/photo-1770786174932-293eaf17f919?w=1080", "category": "entrance"},
      {"id": 3, "title": "Фурнитура", "image": "https://images.unsplash.com/photo-1761353854322-96e6ab127da4?w=1080", "category": "hardware"}
    ]
  }'::jsonb
),
(
  'about',
  '{
    "aboutTitle": "«От А до Я» — Ваш надежный партнер в мире дверей",
    "aboutDescription": "Наша компания специализируется на продаже межкомнатных и входных дверей.",
    "stats": [
      {"id": 1, "icon": "Clock", "value": "10+", "label": "Лет на рынке"},
      {"id": 2, "icon": "Users", "value": "5000+", "label": "Довольных клиентов"},
      {"id": 3, "icon": "Award", "value": "500+", "label": "Моделей в каталоге"},
      {"id": 4, "icon": "ThumbsUp", "value": "100%", "label": "Гарантия качества"}
    ],
    "advantages": [
      {"id": 1, "icon": "Star", "title": "Широкий ассортимент", "description": "Более 500 моделей дверей"},
      {"id": 2, "icon": "Shield", "title": "Проверенные производители", "description": "Надежные поставщики"},
      {"id": 3, "icon": "Headphones", "title": "Профессиональная консультация", "description": "Опытные менеджеры"},
      {"id": 4, "icon": "Award", "title": "Гарантия качества", "description": "Официальная гарантия"},
      {"id": 5, "icon": "Users", "title": "Индивидуальный подход", "description": "Учитываем пожелания"},
      {"id": 6, "icon": "Truck", "title": "Удобное расположение", "description": "Шоу-румы в городе"}
    ]
  }'::jsonb
),
(
  'contacts',
  '{
    "phone": "+7 (960) 166 30-30",
    "email": "otadoya.m@mail.ru",
    "workHours": "Ежедневно с 9:00 до 20:00",
    "address": "г. Нижний Новгород",
    "locations": [
      {"id": 1, "name": "СЦ Бекетов", "address": "СЦ Бекетов, ул. Бекетова, д. 13а", "phone": "+7 (831) 200-00-01", "hours": "Ежедневно с 10:00 до 20:00", "coords": [56.2906, 44.0024]},
      {"id": 2, "name": "Салон на ул. Родионова", "address": "ул. Литвинова, 74Б", "phone": "+7 (831) 200-00-02", "hours": "Ежедневно с 09:00 до 17:00", "coords": [56.2755, 43.9803]},
      {"id": 3, "name": "Радиорынок (ГЕРЦ)", "address": "ул. Композитора Касьянова, 6Г", "phone": "+7 (831) 200-00-03", "hours": "Ежедневно с 10:00 до 19:00", "coords": [56.2636, 43.9578]}
    ]
  }'::jsonb
),
(
  'catalog',
  '{
    "categories": [
      {"id": "interior", "name": "Межкомнатные двери", "icon": "DoorOpen", "subcategories": [
        {"id": "pvh", "name": "ПВХ"}, {"id": "emal", "name": "Эмаль"}, {"id": "ecoshpon", "name": "Экошпон"}, {"id": "massiv", "name": "Массив и натуральный шпон"}
      ]},
      {"id": "entrance", "name": "Входные двери", "icon": "Home", "subcategories": [
        {"id": "flat", "name": "В квартиру"}, {"id": "house", "name": "В дом"}
      ]},
      {"id": "systems", "name": "Системы открывания", "icon": "Settings", "subcategories": []},
      {"id": "panels", "name": "Стеновые панели", "icon": "PanelLeft", "subcategories": []},
      {"id": "plinths", "name": "Плинтуса", "icon": "Square", "subcategories": []}
    ],
    "materials": ["ПВХ", "Эмаль", "Экошпон", "Массив", "Натуральный шпон"],
    "colors": [
      {"id": "white", "name": "Белый", "color": "#FFFFFF", "border": "#E5E5E5"},
      {"id": "gray", "name": "Серый", "color": "#9CA3AF", "border": "#6B7280"},
      {"id": "beige", "name": "Бежевый", "color": "#F5E6D3", "border": "#D4C4B0"},
      {"id": "brown", "name": "Коричневый", "color": "#8B4513", "border": "#6B3410"},
      {"id": "wenge", "name": "Венге", "color": "#4A3728", "border": "#2D1F15"},
      {"id": "black", "name": "Чёрный", "color": "#1F2937", "border": "#111827"}
    ]
  }'::jsonb
),
(
  'header',
  '{
    "logoTitle": "От А до Я",
    "logoSubtitle": "Двери и Фурнитура",
    "phoneText": "+7 (960) 166 30-30",
    "phoneHref": "tel:+79991234567",
    "navItems": [
      {"label": "Каталог", "path": "/catalog"},
      {"label": "Портфолио", "path": "/portfolio"},
      {"label": "О нас", "path": "/about"},
      {"label": "Контакты", "path": "/contacts"}
    ]
  }'::jsonb
),
(
  'footer',
  '{
    "logoTitle": "От А до Я",
    "logoSubtitle": "Двери и Фурнитура",
    "description": "Широкий ассортимент межкомнатных и входных дверей, фурнитуры и комплектующих. Профессиональные консультации и гарантия качества.",
    "navItems": [
      {"label": "Каталог", "path": "/catalog"},
      {"label": "Портфолио", "path": "/portfolio"},
      {"label": "О нас", "path": "/about"},
      {"label": "Контакты", "path": "/contacts"}
    ],
    "phones": [
      {"text": "+7 (960) 166 30-30", "href": "tel:+79601663030"},
      {"text": "+7 (831) 200-00-02", "href": "tel:+78312000002"},
      {"text": "+7 (831) 200-00-03", "href": "tel:+78312000003"}
    ],
    "emailText": "otadoya@mail.ru",
    "emailHref": "mailto:otadoya@mail.ru",
    "address": "СЦ Бекетов, ул. Бекетова, д. 13а",
    "copyright": "© 2026 От А до Я. Все права защищены.",
    "legalLinks": [
      {"label": "Политика конфиденциальности", "path": "/privacy"},
      {"label": "Условия использования", "path": "/terms"}
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO portfolio_items (image, title, description, sort_order) VALUES
('https://images.unsplash.com/photo-1768548273807-275b0e16fff3?w=1080', 'Квартира в современном стиле', 'Установка межкомнатных дверей с скрытым коробом', 1),
('https://images.unsplash.com/photo-1722528078553-f6d3ae8c55e7?w=1080', 'Премиум входная группа', 'Входные двери с терморазрывом', 2),
('https://images.unsplash.com/photo-1770677350521-d5fdcbd74367?w=1080', 'Коридор в классическом стиле', 'Двери из массива дуба', 3);

INSERT INTO products (name, price, old_price, description, features, material, color, image, category, slug) VALUES
('Дверь Классик', 15900, 18900, 'Надёжная межкомнатная дверь', ARRAY['ПВХ покрытие', 'Классический дизайн'], 'ПВХ', 'Белый', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400', 'interior', 'dver-klassik-pvh-belyy-1'),
('Дверь Модерн', 18500, 22000, 'Современная модель', ARRAY['Эмаль'], 'Эмаль', 'Серый', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=400', 'interior', 'dver-modern-emal-seryy-2'),
('Дверь Лофт', 21000, NULL, 'Стиль лофт', ARRAY['Экошпон'], 'Экошпон', 'Коричневый', 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400', 'interior', 'dver-loft-ekoshpon-korichnevyy-3')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO chats (user_name, unread_count) VALUES
('Иван Петров', 0),
('Анна Смирнова', 1);

INSERT INTO chat_messages (chat_id, text, is_user, created_at) VALUES
(1, 'Здравствуйте! Интересует дверь Классик', true, now() - interval '1 hour'),
(1, 'Добрый день! Да, эта модель есть в наличии.', false, now() - interval '58 minutes'),
(1, 'Подскажите, есть в наличии?', true, now() - interval '57 minutes'),
(2, 'Добрый день! Хочу заказать установку', true, now() - interval '2 hours'),
(2, 'Здравствуйте! Конечно, можем установить в любой день.', false, now() - interval '116 minutes');
