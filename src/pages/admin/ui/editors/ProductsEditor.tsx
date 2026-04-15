import { Plus, Trash2, Edit, Search } from 'lucide-react'
import type { ProductLocal, ProductFormState } from '../adminProductTypes'
import { ProductEditForm } from '../ProductEditForm'

interface ProductsEditorProps {
  products: ProductLocal[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddProduct: () => void
  onEditProduct: (product: ProductLocal) => void
  onDeleteProduct: (id: number) => void
  isEditing: boolean
  productForm: ProductFormState
  onProductFormChange: (form: ProductFormState) => void
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
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Управление товарами</h2>
        <button
          type="button"
          onClick={onAddProduct}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Добавить товар
        </button>
      </div>

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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Фото</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">{product.price.toLocaleString('ru-RU')} ₽</td>
                  <td className="px-6 py-4">{product.material}</td>
                  <td className="px-6 py-4">{product.color}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
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

      {isEditing && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={onCancelEdit} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <ProductEditForm
                productForm={productForm}
                setProductForm={(action) => {
                  if (typeof action === 'function') {
                    onProductFormChange(action(productForm))
                  } else {
                    onProductFormChange(action)
                  }
                }}
                onCancel={onCancelEdit}
                onSubmit={onSaveProduct}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
