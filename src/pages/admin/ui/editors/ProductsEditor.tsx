import { Save, Plus, Trash2, Edit, X, Search } from 'lucide-react'
import type { ProductLocal } from '@/pages/admin/ui/AdminPage'

interface ProductsEditorProps {
  products: ProductLocal[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddProduct: () => void
  onEditProduct: (product: ProductLocal) => void
  onDeleteProduct: (id: number) => void
  isEditing: boolean
  productForm: Partial<ProductLocal> & { file?: File }
  onProductFormChange: (form: Partial<ProductLocal> & { file?: File }) => void
  onSaveProduct: () => void
  onCancelEdit: () => void
}

export function ProductsEditor({
  products,
  searchQuery,
  onSearchChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  isEditing,
  productForm,
  onProductFormChange,
  onSaveProduct,
  onCancelEdit,
}: ProductsEditorProps) {
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Управление товарами</h2>
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Добавить товар
        </button>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск товаров..."
          className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Таблица товаров */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Фото</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Материал</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цвет</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.material}</td>
                  <td className="px-6 py-4">{product.color}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно добавления/редактирования */}
      {isEditing && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onCancelEdit}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">
                  {productForm.id ? 'Редактировать' : 'Добавить товар'}
                </h2>
                <button
                  onClick={onCancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Название</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => onProductFormChange({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Дверь Классик"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Материал</label>
                    <input
                      type="text"
                      value={productForm.material}
                      onChange={(e) => onProductFormChange({ ...productForm, material: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="ПВХ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Цвет</label>
                    <input
                      type="text"
                      value={productForm.color}
                      onChange={(e) => onProductFormChange({ ...productForm, color: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Белый"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Фото товара</label>
                  <div className="space-y-3">
                    {/* Загрузка файла */}
                    <label className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            onProductFormChange({
                              ...productForm,
                              file,
                              image: URL.createObjectURL(file)
                            })
                          }
                        }}
                        className="hidden"
                      />
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Загрузить с компьютера</p>
                        <p className="text-xs text-gray-500">PNG, JPG до 5MB</p>
                      </div>
                    </label>

                    {/* Или URL */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="text-sm text-gray-500">или</span>
                      </div>
                      <div className="relative border-t border-gray-300"></div>
                    </div>

                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => onProductFormChange({ ...productForm, image: e.target.value, file: undefined })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="https://..."
                    />

                    {/* Предпросмотр */}
                    {productForm.image && (
                      <div className="relative">
                        <img
                          src={productForm.image}
                          alt="Предпросмотр"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => onProductFormChange({ ...productForm, image: '', file: undefined })}
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
                    onClick={onCancelEdit}
                    className="flex-1 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={onSaveProduct}
                    className="flex-1 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {productForm.id ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
