import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, MessageSquare, LogOut, Plus, Trash2, Edit, Save, X,
  Search, Send, ChevronLeft
} from 'lucide-react'
import { createProduct, updateProduct, deleteProduct } from '@/shared/api/products'
import { sendMessage } from '@/shared/api/chats'

// Типы (дублируем для локального использования, в идеале импортировать из API)
interface ProductLocal {
  id: number
  name: string
  material: string
  color: string
  image: string
}

interface MessageLocal {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatLocal {
  id: number
  userName: string
  lastMessage: string
  messages: MessageLocal[]
  unread: number
}

export function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'products' | 'messages'>('products')
  const [products, setProducts] = useState<ProductLocal[]>([])
  const [chats, setChats] = useState<ChatLocal[]>([])
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Форма товара
  const [productForm, setProductForm] = useState<Partial<ProductLocal> & { file?: File }>({
    name: '',
    material: '',
    color: '',
    image: ''
  })

  // Проверка авторизации
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      navigate('/admin-login')
    }
  }, [navigate])

  // Загрузка данных из БД
  useEffect(() => {
    loadProducts()
    loadChats()
  }, [])

  const loadProducts = async () => {
    // Реальный запрос к БД
    console.log('GET /api/products')
    
    // Тестовые данные
    setProducts([
      { id: 1, name: "Дверь Классик", material: "ПВХ", color: "Белый", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400" },
      { id: 2, name: "Дверь Модерн", material: "Эмаль", color: "Серый", image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=400" },
    ])
  }

  const loadChats = async () => {
    // Реальный запрос к БД
    console.log('GET /api/chats')
    
    // Тестовые данные
    setChats([
      {
        id: 1,
        userName: "Иван Петров",
        lastMessage: "Сколько стоит доставка?",
        unread: 2,
        messages: [
          { id: 1, text: "Здравствуйте! Интересует дверь Классик", isUser: true, timestamp: new Date() },
          { id: 2, text: "Подскажите, есть в наличии?", isUser: true, timestamp: new Date() },
          { id: 3, text: "Сколько стоит доставка?", isUser: true, timestamp: new Date() },
        ]
      },
      {
        id: 2,
        userName: "Анна Смирнова",
        lastMessage: "Когда можно посмотреть?",
        unread: 0,
        messages: [
          { id: 1, text: "Добрый день! Хочу заказать установку", isUser: true, timestamp: new Date() },
          { id: 2, text: "Когда можно посмотреть каталог?", isUser: true, timestamp: new Date() },
        ]
      },
    ])
  }

  // Выход
  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/')
  }

  // CRUD товаров
  const handleAddProduct = async () => {
    let imageUrl = productForm.image
    
    // Если есть файл, загружаем его
    if (productForm.file) {
      console.log('POST /api/upload', productForm.file)
      // Реальный запрос на загрузку
      // imageUrl = await uploadImage(productForm.file)
      imageUrl = URL.createObjectURL(productForm.file)
    }
    
    // Реальный запрос на создание
    console.log('POST /api/products', { ...productForm, image: imageUrl })
    const newProduct = await createProduct({ 
      name: productForm.name || '',
      material: productForm.material || '',
      color: productForm.color || '',
      image: imageUrl || '',
      price: 0,
      category: 'interior',
      slug: ''
    })
    
    if (newProduct) {
      setProducts([...products, newProduct])
    } else {
      // Для демо добавляем локально
      setProducts([...products, { 
        ...productForm, 
        image: imageUrl,
        id: Date.now() 
      } as ProductLocal])
    }
    
    setIsEditing(false)
    setProductForm({ name: '', material: '', color: '', image: '', file: undefined })
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return
    
    // Реальный запрос на удаление
    console.log('DELETE /api/products', id)
    const success = await deleteProduct(id)
    
    if (success) {
      setProducts(products.filter(p => p.id !== id))
    } else {
      // Для демо удаляем локально
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleEditProduct = (product: ProductLocal) => {
    setProductForm(product)
    setIsEditing(true)
  }

  const handleUpdateProduct = async () => {
    if (!productForm.id) return
    
    // Реальный запрос на обновление
    console.log('PUT /api/products', productForm.id, productForm)
    const updated = await updateProduct(productForm.id, productForm)
    
    if (updated) {
      setProducts(products.map(p => p.id === productForm.id ? updated : p))
    } else {
      // Для демо обновляем локально
      setProducts(products.map(p => p.id === productForm.id ? { ...p, ...productForm } as ProductLocal : p))
    }
    
    setIsEditing(false)
    setProductForm({ name: '', material: '', color: '', image: '', file: undefined })
  }

  // Отправка сообщения
  const handleSendMessage = async (chatId: number, text: string) => {
    // Реальный запрос на отправку
    console.log('POST /api/chats', chatId, text)
    const newMessage = await sendMessage(chatId, text)
    
    if (newMessage) {
      setChats(chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: text
          }
        }
        return chat
      }))
    } else {
      // Для демо добавляем локально
      setChats(chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, {
              id: Date.now(),
              text,
              isUser: false,
              timestamp: new Date()
            }],
            lastMessage: text
          }
        }
        return chat
      }))
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-primary">Админ-панель</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-primary text-background'
                : 'bg-white text-foreground hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5" />
            Товары
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'messages'
                ? 'bg-primary text-background'
                : 'bg-white text-foreground hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Мессенджер
            {chats.reduce((sum, c) => sum + c.unread, 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {chats.reduce((sum, c) => sum + c.unread, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Товары */}
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Поиск и кнопка */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск товаров..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-5 h-5" />
                  Добавить
                </button>
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
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Мессенджер */}
        <AnimatePresence mode="wait">
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Список чатов */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-primary">Чаты</h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedChat === chat.id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{chat.userName}</p>
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Окно чата */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="p-4 border-b">
                      <h2 className="font-semibold text-primary">
                        {chats.find(c => c.id === selectedChat)?.userName}
                      </h2>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
                      {chats.find(c => c.id === selectedChat)?.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              msg.isUser
                                ? 'bg-primary text-background'
                                : 'bg-gray-100 text-foreground'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          const form = e.target as HTMLFormElement
                          const input = form.elements.namedItem('message') as HTMLInputElement
                          if (input.value.trim()) {
                            handleSendMessage(selectedChat, input.value)
                            input.value = ''
                          }
                        }}
                        className="flex gap-2"
                      >
                        <input
                          name="message"
                          type="text"
                          placeholder="Введите сообщение..."
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-primary text-background rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Выберите чат для начала общения
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Модальное окно добавления/редактирования */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsEditing(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary">
                    {productForm.id ? 'Редактировать' : 'Добавить товар'}
                  </h2>
                  <button
                    onClick={() => setIsEditing(false)}
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
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
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
                        onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                        placeholder="ПВХ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Цвет</label>
                      <input
                        type="text"
                        value={productForm.color}
                        onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
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
                              setProductForm({ 
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
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value, file: undefined })}
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
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={productForm.id ? handleUpdateProduct : handleAddProduct}
                      className="flex-1 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {productForm.id ? 'Сохранить' : 'Добавить'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
