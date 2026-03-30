import { Save, Plus, Trash2 } from 'lucide-react'
import type { ContactsPageData, LocationItem } from '@/shared/api/contacts'

interface ContactsPageEditorProps {
  data: ContactsPageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onAddLocation: () => void
  onUpdateLocation: (id: number, field: keyof LocationItem, value: string) => void
  onDeleteLocation: (id: number) => void
}

export function ContactsPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
}: ContactsPageEditorProps) {
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
        <h2 className="text-xl font-bold text-primary">Редактирование страницы "Контакты"</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Общая информация */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Телефон</label>
          <input
            type="text"
            value={data.phone}
            onChange={() => {}}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={() => {}}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Режим работы</label>
          <input
            type="text"
            value={data.workHours}
            onChange={() => {}}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Город</label>
          <input
            type="text"
            value={data.address}
            onChange={() => {}}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Локации */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Салоны</h3>
          <button
            onClick={onAddLocation}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-4">
          {data.locations.map((location) => (
            <div key={location.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={location.name}
                  onChange={(e) => onUpdateLocation(location.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => onUpdateLocation(location.id, 'address', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={location.phone}
                    onChange={(e) => onUpdateLocation(location.id, 'phone', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={location.hours}
                    onChange={(e) => onUpdateLocation(location.id, 'hours', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                onClick={() => onDeleteLocation(location.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
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
