import { Save, Plus, Trash2 } from 'lucide-react'
import type { CatalogPageData, CatalogCategory, CatalogColor } from '@/shared/api/catalog'

interface CatalogPageEditorProps {
  data: CatalogPageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onAddCategory: () => void
  onUpdateCategory: (id: string, field: keyof CatalogCategory, value: string) => void
  onDeleteCategory: (id: string) => void
  onAddMaterial: () => void
  onUpdateMaterial: (index: number, value: string) => void
  onDeleteMaterial: (index: number) => void
  onAddColor: () => void
  onUpdateColor: (id: string, field: keyof CatalogColor, value: string) => void
  onDeleteColor: (id: string) => void
}

export function CatalogPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onAddColor,
  onUpdateColor,
  onDeleteColor,
}: CatalogPageEditorProps) {
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
        <h2 className="text-xl font-bold text-primary">Редактирование каталога</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Категории */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Категории</h3>
          <button
            onClick={onAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-4">
          {data.categories.map((category) => (
            <div key={category.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => onUpdateCategory(category.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <select
                  value={category.icon}
                  onChange={(e) => onUpdateCategory(category.id, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="DoorOpen">DoorOpen</option>
                  <option value="Home">Home</option>
                  <option value="Settings">Settings</option>
                  <option value="PanelLeft">PanelLeft</option>
                  <option value="Square">Square</option>
                </select>
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

      {/* Материалы */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Материалы</h3>
          <button
            onClick={onAddMaterial}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-2">
          {data.materials.map((material, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={material}
                onChange={(e) => onUpdateMaterial(index, e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => onDeleteMaterial(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Цвета */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Цвета</h3>
          <button
            onClick={onAddColor}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-4">
          {data.colors.map((color) => (
            <div key={color.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => onUpdateColor(color.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Цвет</label>
                    <input
                      type="color"
                      value={color.color}
                      onChange={(e) => onUpdateColor(color.id, 'color', e.target.value)}
                      className="w-full h-10 border-2 border-border rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">Обводка</label>
                    <input
                      type="color"
                      value={color.border}
                      onChange={(e) => onUpdateColor(color.id, 'border', e.target.value)}
                      className="w-full h-10 border-2 border-border rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteColor(color.id)}
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
