import { type Dispatch, type SetStateAction, useState } from 'react'
import { Save, X, Plus } from 'lucide-react'
import type { CatalogPageData } from '@/shared/api/catalog'
import type { ProductFormState, AddCatalogColorPayload } from './adminProductTypes'

interface ProductEditFormProps {
  productForm: ProductFormState
  setProductForm: Dispatch<SetStateAction<ProductFormState>>
  catalogData: CatalogPageData | null
  catalogLoading: boolean
  onAddCatalogMaterial: (name: string) => Promise<boolean>
  onAddCatalogColor: (payload: AddCatalogColorPayload) => Promise<boolean>
  onAddCatalogCategory: (name: string) => Promise<boolean>
  onCancel: () => void
  onSubmit: () => void
}

export function ProductEditForm({
  productForm,
  setProductForm,
  catalogData,
  catalogLoading,
  onAddCatalogMaterial,
  onAddCatalogColor,
  onAddCatalogCategory,
  onCancel,
  onSubmit,
}: ProductEditFormProps) {
  const categories = catalogData?.categories ?? []
  const materials = catalogData?.materials ?? []
  const colors = catalogData?.colors ?? []

  const [newColorOpen, setNewColorOpen] = useState(false)
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#94A3B8')

  const submitNewCatalogColor = async () => {
    const ok = await onAddCatalogColor({ name: newColorName.trim(), color: newColorHex })
    if (ok) {
      setNewColorOpen(false)
      setNewColorName('')
      setNewColorHex('#94A3B8')
    }
  }

  const promptAndAdd = async (label: string, fn: (name: string) => Promise<boolean>) => {
    const name = window.prompt(`Название (${label})`)
    if (!name?.trim()) return
    const ok = await fn(name.trim())
    if (!ok) return
  }

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Название</label>
        <input
          type="text"
          value={productForm.name ?? ''}
          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
          placeholder="Дверь Классик"
        />
      </div>

      {catalogLoading ? (
        <p className="text-sm text-muted-foreground">Загрузка данных каталога…</p>
      ) : !catalogData ? (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Нет данных каталога. Откройте вкладку «Страницы» → «Каталог» и дождитесь загрузки.
        </p>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">Категория</label>
              <button
                type="button"
                onClick={() => void promptAndAdd('категория', onAddCatalogCategory)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                Добавить в каталог
              </button>
            </div>
            <select
              value={productForm.category ?? ''}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            >
              {categories.length === 0 ? (
                <option value="">— нет категорий —</option>
              ) : (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">Материал</label>
              <button
                type="button"
                onClick={() => void promptAndAdd('материал', onAddCatalogMaterial)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                Добавить в каталог
              </button>
            </div>
            <select
              value={productForm.material ?? ''}
              onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            >
              {materials.length === 0 ? (
                <option value="">— нет материалов —</option>
              ) : (
                materials.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">Цвет</label>
              <button
                type="button"
                onClick={() => setNewColorOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                Добавить в каталог
              </button>
            </div>
            {newColorOpen && (
              <div className="mb-3 p-3 border-2 border-gray-200 rounded-lg space-y-3 bg-gray-50">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Название цвета</label>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Например: Графит"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white text-sm text-foreground"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-sm font-medium text-foreground shrink-0">Цвет</label>
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border-2 border-gray-300 bg-white p-0.5"
                    title="Выберите цвет"
                  />
                  <code className="text-xs text-muted-foreground">{newColorHex}</code>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void submitNewCatalogColor()}
                    disabled={!newColorName.trim()}
                    className="flex-1 py-2 bg-primary text-background text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Сохранить в каталог
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewColorOpen(false)
                      setNewColorName('')
                      setNewColorHex('#94A3B8')
                    }}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm hover:bg-gray-100"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
            <select
              value={productForm.color ?? ''}
              onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            >
              {colors.length === 0 ? (
                <option value="">— нет цветов —</option>
              ) : (
                colors.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Описание</label>
        <textarea
          value={productForm.description ?? ''}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-y bg-white text-foreground"
          placeholder="Краткое описание для карточки"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Особенности (каждая с новой строки)
        </label>
        <textarea
          value={productForm.featuresText ?? ''}
          onChange={(e) => setProductForm({ ...productForm, featuresText: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-y font-mono text-sm bg-white text-foreground"
          placeholder={'Строка 1\nСтрока 2'}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Фото товара</label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setProductForm({
                    ...productForm,
                    file,
                    image: URL.createObjectURL(file),
                  })
                }
              }}
              className="hidden"
            />
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Загрузить с компьютера</p>
              <p className="text-xs text-gray-500">PNG, JPG до 5MB</p>
            </div>
          </label>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="text-sm text-gray-500">или</span>
            </div>
            <div className="relative border-t border-gray-300" />
          </div>
          <input
            type="url"
            value={productForm.image ?? ''}
            onChange={(e) => setProductForm({ ...productForm, image: e.target.value, file: undefined })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            placeholder="https://..."
          />
          {productForm.image && (
            <div className="relative">
              <img src={productForm.image} alt="Предпросмотр" className="w-full h-48 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setProductForm({ ...productForm, image: '', file: undefined })}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex-1 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {productForm.id ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  )
}
