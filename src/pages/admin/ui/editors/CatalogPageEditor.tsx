import { Save, Plus, Trash2, DoorOpen, Home, Settings, PanelLeft, Square, type LucideIcon } from 'lucide-react'
import type { CatalogPageData, CatalogCategory, CatalogColor, CatalogSubcategory } from '@/shared/api/catalog'

const categoryIconOptions: Array<{ value: CatalogCategory['icon']; Icon: LucideIcon }> = [
  { value: 'DoorOpen', Icon: DoorOpen },
  { value: 'Home', Icon: Home },
  { value: 'Settings', Icon: Settings },
  { value: 'PanelLeft', Icon: PanelLeft },
  { value: 'Square', Icon: Square },
]

interface CatalogPageEditorProps {
  data: CatalogPageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onAddCategory: () => void
  onUpdateCategory: (id: string, field: keyof CatalogCategory, value: string) => void
  onDeleteCategory: (id: string) => void
  onAddSubcategory: (categoryId: string) => void
  onUpdateSubcategory: (categoryId: string, subId: string, name: string) => void
  onDeleteSubcategory: (categoryId: string, subId: string) => void
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
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
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
          {data.categories.map((category) => {
            const subs: CatalogSubcategory[] = category.subcategories ?? []
            return (
              <div key={category.id} className="p-4 border-2 border-border rounded-lg space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-medium text-muted-foreground">Название категории</label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => onUpdateCategory(category.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                    <label className="block text-xs font-medium text-muted-foreground pt-1">Иконка</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryIconOptions.map(({ value, Icon }) => (
                        <button
                          key={value}
                          type="button"
                          title={value}
                          onClick={() => onUpdateCategory(category.id, 'icon', value)}
                          className={`flex items-center justify-center px-3 py-2 border-2 rounded-lg transition-colors ${
                            category.icon === value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-primary">Подкатегории</span>
                    <button
                      type="button"
                      onClick={() => onAddSubcategory(category.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить
                    </button>
                  </div>
                  {subs.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Добавьте подкатегории — они появятся в фильтрах каталога и при выборе товара.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {subs.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => onUpdateSubcategory(category.id, sub.id, e.target.value)}
                            placeholder="Название подкатегории"
                            className="flex-1 min-w-0 px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                          />
                          <code className="hidden sm:block text-[10px] text-muted-foreground shrink-0 max-w-[96px] truncate" title={`id: ${sub.id}`}>
                            {sub.id}
                          </code>
                          <button
                            type="button"
                            onClick={() => onDeleteSubcategory(category.id, sub.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            aria-label="Удалить подкатегорию"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
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
