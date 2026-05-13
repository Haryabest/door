import { Plus, Save, Trash2 } from 'lucide-react'
import type { FooterData, FooterLinkItem, FooterPhoneItem } from '@/shared/api/footer'

interface FooterPageEditorProps {
  data: FooterData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onUpdateField: <K extends keyof FooterData>(field: K, value: FooterData[K]) => void
  onAddNavItem: () => void
  onUpdateNavItem: (index: number, field: keyof FooterLinkItem, value: string) => void
  onDeleteNavItem: (index: number) => void
  onAddPhone: () => void
  onUpdatePhone: (index: number, field: keyof FooterPhoneItem, value: string) => void
  onDeletePhone: (index: number) => void
  onAddLegalLink: () => void
  onUpdateLegalLink: (index: number, field: keyof FooterLinkItem, value: string) => void
  onDeleteLegalLink: (index: number) => void
}

export function FooterPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onUpdateField,
  onAddNavItem,
  onUpdateNavItem,
  onDeleteNavItem,
  onAddPhone,
  onUpdatePhone,
  onDeletePhone,
  onAddLegalLink,
  onUpdateLegalLink,
  onDeleteLegalLink,
}: FooterPageEditorProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Редактирование футера сайта</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-primary">Основные данные</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Логотип (верхняя строка)</label>
            <input
              type="text"
              value={data.logoTitle}
              onChange={(e) => onUpdateField('logoTitle', e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подзаголовок</label>
            <input
              type="text"
              value={data.logoSubtitle}
              onChange={(e) => onUpdateField('logoSubtitle', e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Описание</label>
          <textarea
            value={data.description}
            onChange={(e) => onUpdateField('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email (текст)</label>
            <input
              type="text"
              value={data.emailText}
              onChange={(e) => onUpdateField('emailText', e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email (ссылка)</label>
            <input
              type="text"
              value={data.emailHref}
              onChange={(e) => onUpdateField('emailHref', e.target.value)}
              placeholder="mailto:example@mail.ru"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Адрес</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => onUpdateField('address', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Копирайт</label>
          <input
            type="text"
            value={data.copyright}
            onChange={(e) => onUpdateField('copyright', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Навигация</h3>
          <button type="button" onClick={onAddNavItem} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-3">
          {data.navItems.map((item, index) => (
            <div key={`footer-nav-${index}`} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3 p-4 border-2 border-border rounded-lg">
              <input
                type="text"
                value={item.label}
                onChange={(e) => onUpdateNavItem(index, 'label', e.target.value)}
                placeholder="Название"
                className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={item.path}
                onChange={(e) => onUpdateNavItem(index, 'path', e.target.value)}
                placeholder="/catalog"
                className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <button type="button" onClick={() => onDeleteNavItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Телефоны</h3>
          <button type="button" onClick={onAddPhone} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-3">
          {data.phones.map((item, index) => (
            <div key={`footer-phone-${index}`} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3 p-4 border-2 border-border rounded-lg">
              <input
                type="text"
                value={item.text}
                onChange={(e) => onUpdatePhone(index, 'text', e.target.value)}
                placeholder="+7 (960) 166 30-30"
                className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => onUpdatePhone(index, 'href', e.target.value)}
                placeholder="tel:+79601663030"
                className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <button type="button" onClick={() => onDeletePhone(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Юридические ссылки</h3>
          <button type="button" onClick={onAddLegalLink} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-3">
          {data.legalLinks.map((item, index) => (
            <div key={`footer-legal-${index}`} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3 p-4 border-2 border-border rounded-lg">
              <input
                type="text"
                value={item.label}
                onChange={(e) => onUpdateLegalLink(index, 'label', e.target.value)}
                placeholder="Название"
                className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={item.path}
                onChange={(e) => onUpdateLegalLink(index, 'path', e.target.value)}
                placeholder="/privacy"
                className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <button type="button" onClick={() => onDeleteLegalLink(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
