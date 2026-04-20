import type { Dispatch, SetStateAction } from 'react'
import { Save, X } from 'lucide-react'
import type { ProductFormState } from './adminProductTypes'
import { PRODUCT_CATEGORIES } from './adminProductTypes'

interface ProductEditFormProps {
  productForm: ProductFormState
  setProductForm: Dispatch<SetStateAction<ProductFormState>>
  onCancel: () => void
  onSubmit: () => void
}

export function ProductEditForm({
  productForm,
  setProductForm,
  onCancel,
  onSubmit,
}: ProductEditFormProps) {
  const isEdit = Boolean(productForm.id)

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Название</label>
        <input
          type="text"
          value={productForm.name ?? ''}
          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          placeholder="Дверь Классик"
        />
      </div>
      {isEdit && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Цена, ₽</label>
            <input
              type="number"
              min={0}
              step={100}
              value={productForm.price === undefined || productForm.price === null ? '' : productForm.price}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  price: e.target.value === '' ? 0 : Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Старая цена (опц.)</label>
            <input
              type="number"
              min={0}
              step={100}
              value={
                productForm.oldPrice === undefined || productForm.oldPrice === null ? '' : productForm.oldPrice
              }
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  oldPrice: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Категория</label>
          <select
            value={productForm.category ?? 'interior'}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Slug (URL)</label>
          <input
            type="text"
            value={productForm.slug ?? ''}
            onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
            placeholder="авто, если пусто при создании"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Описание</label>
        <textarea
          value={productForm.description ?? ''}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-y"
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
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-y font-mono text-sm"
          placeholder={'Строка 1\nСтрока 2'}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Материал</label>
          <input
            type="text"
            value={productForm.material ?? ''}
            onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            placeholder="ПВХ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Цвет</label>
          <input
            type="text"
            value={productForm.color ?? ''}
            onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            placeholder="Белый"
          />
        </div>
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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
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
          {isEdit ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  )
}
