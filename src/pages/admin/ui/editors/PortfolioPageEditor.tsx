import { Save, Plus, Trash2 } from 'lucide-react'
import type { PortfolioPageData, PortfolioItem } from '@/shared/api/portfolio'

interface PortfolioPageEditorProps {
  data: PortfolioPageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onAddItem: () => void
  onUpdateItem: (id: number, field: keyof PortfolioItem, value: string) => void
  onDeleteItem: (id: number) => void
  onUploadImage: (id: number, imageUrl: string) => void
}

export function PortfolioPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onUploadImage,
}: PortfolioPageEditorProps) {
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
        <h2 className="text-xl font-bold text-primary">Редактирование портфолио</h2>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Проекты</h3>
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="w-32 h-24 flex-shrink-0 relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-400">Нет фото</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => onUpdateItem(item.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={item.image}
                    onChange={(e) => onUpdateItem(item.id, 'image', e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <label className="flex items-center justify-center px-4 py-2 border-2 border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const imageUrl = URL.createObjectURL(file)
                          onUploadImage(item.id, imageUrl)
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-sm">Загрузить</span>
                  </label>
                </div>
              </div>
              <button
                onClick={() => onDeleteItem(item.id)}
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
