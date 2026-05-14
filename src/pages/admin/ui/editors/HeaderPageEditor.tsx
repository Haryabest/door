import { Plus, Save, Trash2 } from 'lucide-react'
import type { HeaderData, HeaderNavItem } from '@/shared/api/header'

interface HeaderPageEditorProps {
  data: HeaderData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onUpdateField: <K extends keyof HeaderData>(field: K, value: HeaderData[K]) => void
  onAddNavItem: () => void
  onUpdateNavItem: (index: number, field: keyof HeaderNavItem, value: string) => void
  onDeleteNavItem: (index: number) => void
}

export function HeaderPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onUpdateField,
  onAddNavItem,
  onUpdateNavItem,
  onDeleteNavItem,
}: HeaderPageEditorProps) {
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
        <h2 className="text-xl font-bold text-primary">Редактирование шапки сайта</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Логотип и контакты</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Название (верхняя строка)</label>
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
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Телефон (текст)</label>
            <input
              type="text"
              value={data.phoneText}
              onChange={(e) => onUpdateField('phoneText', e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              placeholder="+7 (960) 166 30-30"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Ссылка для звонка подставляется из номера автоматически (формат tel:+7…).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Пункты меню</h3>
          <button
            type="button"
            onClick={onAddNavItem}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить пункт
          </button>
        </div>

        <div className="space-y-3">
          {data.navItems.map((item, index) => (
            <div key={`header-nav-${index}`} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3 items-start p-4 border-2 border-border rounded-lg">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Название</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => onUpdateNavItem(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Каталог"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Путь</label>
                <input
                  type="text"
                  value={item.path}
                  onChange={(e) => onUpdateNavItem(index, 'path', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="/catalog"
                />
              </div>
              <button
                type="button"
                onClick={() => onDeleteNavItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end lg:self-center"
                aria-label="Удалить пункт меню"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

