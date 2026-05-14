import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFooter, defaultFooterData } from '@/shared/api/footer'
import { telHrefFromPhoneText } from '@/shared/lib/telHref'

export function Footer() {
  const [footerData, setFooterData] = useState(defaultFooterData)

  useEffect(() => {
    const loadFooter = async () => {
      const data = await getFooter()
      if (data) {
        setFooterData(data)
      }
    }
    loadFooter()
  }, [])

  return (
    <footer className="bg-[#0f3c65] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col mb-4">
              <Link to="/" className="text-2xl font-bold text-white hover:underline">{footerData.logoTitle}</Link>
              <span className="text-sm text-white/80">{footerData.logoSubtitle}</span>
            </div>
            <p className="text-sm text-white/80 max-w-md">
              {footerData.description}
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Навигация</h3>
            <ul className="space-y-2 text-sm">
              {footerData.navItems.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} className="text-white/80 hover:underline hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Контакты</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {footerData.phones.map((phone, index) => (
                <li key={index}>
                  <a href={telHrefFromPhoneText(phone.text)} className="hover:underline hover:text-white">
                    {phone.text}
                  </a>
                </li>
              ))}
              <li>
                <a href={footerData.emailHref} className="hover:underline hover:text-white">
                  {footerData.emailText}
                </a>
              </li>
              <li>{footerData.address}</li>
            </ul>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="border-t border-white/20 mt-8 pt-8 text-sm text-white/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>{footerData.copyright}</p>
            <div className="flex gap-6">
              {footerData.legalLinks.map((link, index) => (
                <Link key={index} to={link.path} className="hover:underline hover:text-white/80">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
