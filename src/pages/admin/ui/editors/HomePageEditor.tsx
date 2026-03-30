import { Save, Trash2 } from 'lucide-react'
import type { HomePageData, CategoryItem } from '@/shared/api/home'

interface HomePageEditorProps {
  data: HomePageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onDeleteFeature: (id: number) => void
  onUpdateCategory: (id: number, field: keyof CategoryItem, value: string) => void
  onDeleteCategory: (id: number) => void
  onUploadImage: (id: number, imageUrl: string) => void
}

export function HomePageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onDeleteFeature,
  onUpdateCategory,
  onDeleteCategory,
  onUploadImage,
}: HomePageEditorProps) {
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
        <h2 className="text-xl font-bold text-primary">Редактирование главной страницы</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Hero секция */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Hero секция</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Заголовок</label>
            <input
              type="text"
              value={data.hero.title}
              readOnly
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подзаголовок</label>
            <input
              type="text"
              value={data.hero.subtitle}
              readOnly
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Город</label>
            <input
              type="text"
              value={data.hero.city}
              readOnly
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Преимущества */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Преимущества</h3>
        <div className="space-y-4">
          {data.features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={feature.title}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <textarea
                  value={feature.description}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={() => onDeleteFeature(feature.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Категории */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-primary mb-4">Категории</h3>
        <div className="space-y-4">
          {data.categories.map((category) => (
            <div key={category.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="w-32 h-24 flex-shrink-0 relative">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
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
                  value={category.title}
                  onChange={(e) => onUpdateCategory(category.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={category.image}
                    onChange={(e) => onUpdateCategory(category.id, 'image', e.target.value)}
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
                          onUploadImage(category.id, imageUrl)
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-sm">Загрузить</span>
                  </label>
                </div>
              </div>
              <button
                onClick={() => onDeleteCategory(category.id)}
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
