import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-[#0f3c65] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col mb-4">
              <Link to="/" className="text-2xl font-bold text-white hover:underline">От А до Я</Link>
              <span className="text-sm text-white/80">Двери и Фурнитура</span>
            </div>
            <p className="text-sm text-white/80 max-w-md">
              Широкий ассортимент межкомнатных и входных дверей, фурнитуры и комплектующих. 
              Профессиональные консультации и гарантия качества.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/catalog" className="text-white/80 hover:underline hover:text-white">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-white/80 hover:underline hover:text-white">
                  Портфолио
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:underline hover:text-white">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-white/80 hover:underline hover:text-white">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Контакты</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="tel:+79601663030" className="hover:underline hover:text-white">
                  +7 (960) 166 30-30
                </a>
              </li>
              <li>
                <a href="tel:+78312000002" className="hover:underline hover:text-white">
                  +7 (831) 200-00-02
                </a>
              </li>
              <li>
                <a href="tel:+78312000003" className="hover:underline hover:text-white">
                  +7 (831) 200-00-03
                </a>
              </li>
              <li>
                <a href="mailto:info@doors.ru" className="hover:underline hover:text-white">
                  otadoya@mail.ru
                </a>
              </li>
              <li>СЦ Бекетов, ул. Бекетова, д. 13а</li>
            </ul>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="border-t border-white/20 mt-8 pt-8 text-sm text-white/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 От А до Я. Все права защищены.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:underline hover:text-white/80">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="hover:underline hover:text-white/80">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
