import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, MessageSquare, LogOut, Plus, Trash2, Edit, Save, X,
  Search, Send, ChevronLeft, Home, Image as ImageIcon, FileText, Settings, MapPin, PanelTop
} from 'lucide-react'
import { updateProduct, deleteProduct, productsApi } from '@/shared/api/products'
import { sendMessage, getChats } from '@/shared/api/chats'
import { getAboutPage, updateAboutPage, type AboutPageData, type StatItem, type AdvantageItem } from '@/shared/api/about'
import { getContactsPage, updateContactsPage, type ContactsPageData, type LocationItem } from '@/shared/api/contacts'
import { getPortfolioPage, updatePortfolioPage, type PortfolioPageData, type PortfolioItem } from '@/shared/api/portfolio'
import { getHomePage, updateHomePage, type HomePageData, type CategoryItem } from '@/shared/api/home'
import { getCatalogPage, updateCatalogPage, type CatalogPageData, type CatalogCategory, type CatalogColor } from '@/shared/api/catalog'
import { defaultHeaderData, getHeader, updateHeader, type HeaderData, type HeaderNavItem } from '@/shared/api/header'
import { adminLogout, adminMe } from '@/shared/api/auth'
import { HomePageEditor, CatalogPageEditor, PortfolioPageEditor, AboutPageEditor, ContactsPageEditor, HeaderPageEditor } from './editors'

const SAVE_FAILED_HINT =
  'Ошибка сохранения. Выйдите и войдите снова (сессия). Для API-скриптов нужен Bearer (ADMIN_API_TOKEN) или VITE_ADMIN_API_TOKEN при сборке.'

// Типы
export interface ProductLocal {
  id: number
  name: string
  material: string
  color: string
  image: string
}

export interface MessageLocal {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export interface ChatLocal {
  id: number
  userName: string
  lastMessage: string
  messages: MessageLocal[]
  unread: number
}

// Для страницы О нас
interface AboutPageState {
  isLoading: boolean
  isSaving: boolean
  data: AboutPageData | null
}

// Для страницы Контакты
interface ContactsPageState {
  isLoading: boolean
  isSaving: boolean
  data: ContactsPageData | null
}

// Для страницы Портфолио
interface PortfolioPageState {
  isLoading: boolean
  isSaving: boolean
  data: PortfolioPageData | null
}

// Для главной страницы
interface HomePageState {
  isLoading: boolean
  isSaving: boolean
  data: HomePageData | null
}

// Для страницы Каталог
interface CatalogPageState {
  isLoading: boolean
  isSaving: boolean
  data: CatalogPageData | null
}

// Для шапки сайта
interface HeaderPageState {
  isLoading: boolean
  isSaving: boolean
  data: HeaderData | null
}

export function AdminPage() {
  const navigate = useNavigate()
  const [authChecked, setAuthChecked] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'pages' | 'messages'>('products')
  const [activePage, setActivePage] = useState<'home' | 'catalog' | 'portfolio' | 'about' | 'contacts' | 'header'>('home')
  const [products, setProducts] = useState<ProductLocal[]>([])
  const [chats, setChats] = useState<ChatLocal[]>([])
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Страница "О нас"
  const [aboutPage, setAboutPage] = useState<AboutPageState>({
    isLoading: false,
    isSaving: false,
    data: null
  })

  // Страница "Контакты"
  const [contactsPage, setContactsPage] = useState<ContactsPageState>({
    isLoading: false,
    isSaving: false,
    data: null
  })

  // Страница "Портфолио"
  const [portfolioPage, setPortfolioPage] = useState<PortfolioPageState>({
    isLoading: false,
    isSaving: false,
    data: null
  })

  // Главная страница
  const [homePage, setHomePage] = useState<HomePageState>({
    isLoading: false,
    isSaving: false,
    data: null
  })

  // Страница "Каталог"
  const [catalogPage, setCatalogPage] = useState<CatalogPageState>({
    isLoading: false,
    isSaving: false,
    data: null
  })

  // Шапка сайта
  const [headerPage, setHeaderPage] = useState<HeaderPageState>({
    isLoading: false,
    isSaving: false,
    data: null,
  })

  // Форма товара
  const [productForm, setProductForm] = useState<Partial<ProductLocal> & { file?: File }>({
    name: '',
    material: '',
    color: '',
    image: ''
  })

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const ok = await adminMe()
      if (cancelled) return
      if (!ok) {
        navigate('/admin-login', { replace: true })
        return
      }
      setAuthChecked(true)
    })()
    return () => {
      cancelled = true
    }
  }, [navigate])

  // Загрузка данных из БД после проверки сессии
  useEffect(() => {
    if (!authChecked) return
    loadProducts()
    loadChats()
    loadAboutPage()
    loadContactsPage()
    loadPortfolioPage()
    loadHomePage()
    loadCatalogPage()
    loadHeaderPage()
  }, [authChecked])

  const loadProducts = async () => {
    const list = await productsApi.getProducts()
    setProducts(
      list.map((p) => ({
        id: p.id,
        name: p.name,
        material: p.material,
        color: p.color,
        image: p.image,
      }))
    )
  }

  const loadChats = async () => {
    const list = await getChats()
    setChats(list)
  }

  const loadAboutPage = async () => {
    setAboutPage({ ...aboutPage, isLoading: true })
    const data = await getAboutPage()
    if (data) {
      setAboutPage({ isLoading: false, isSaving: false, data })
    }
  }

  const handleSaveAboutPage = async () => {
    if (!aboutPage.data) return
    setAboutPage({ ...aboutPage, isSaving: true })
    console.log('PUT /api/pages/about', aboutPage.data)
    const updated = await updateAboutPage(aboutPage.data)
    if (updated) {
      setAboutPage({ isLoading: false, isSaving: false, data: updated })
      alert('Страница "О нас" сохранена!')
    } else {
      setAboutPage({ ...aboutPage, isSaving: false })
      alert(SAVE_FAILED_HINT)
    }
  }

  const handleAddStat = () => {
    if (!aboutPage.data) return
    const newStat: StatItem = {
      id: Date.now(),
      icon: 'Clock',
      value: 'Новое',
      label: 'Описание'
    }
    const updatedData = { ...aboutPage.data, stats: [...aboutPage.data.stats, newStat] }
    setAboutPage({ ...aboutPage, data: updatedData })
    console.log('POST /api/pages/about/stats', newStat)
  }

  const handleDeleteStat = (id: number) => {
    if (!aboutPage.data) return
    const updatedData = { ...aboutPage.data, stats: aboutPage.data.stats.filter(s => s.id !== id) }
    setAboutPage({ ...aboutPage, data: updatedData })
    console.log('DELETE /api/pages/about/stats', id)
  }

  const handleUpdateStat = (id: number, field: keyof StatItem, value: string) => {
    if (!aboutPage.data) return
    const updatedStats = aboutPage.data.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
    const updatedData = { ...aboutPage.data, stats: updatedStats }
    setAboutPage({ ...aboutPage, data: updatedData })
    console.log('PUT /api/pages/about/stats', id, field, value)
  }

  const handleAddAdvantage = () => {
    if (!aboutPage.data) return
    const newAdvantage: AdvantageItem = {
      id: Date.now(),
      icon: 'Star',
      title: 'Новое преимущество',
      description: 'Описание преимущества'
    }
    const updatedData = { ...aboutPage.data, advantages: [...aboutPage.data.advantages, newAdvantage] }
    setAboutPage({ ...aboutPage, data: updatedData })
    console.log('POST /api/pages/about/advantages', newAdvantage)
  }

  const handleDeleteAdvantage = (id: number) => {
    if (!aboutPage.data) return
    const updatedData = { ...aboutPage.data, advantages: aboutPage.data.advantages.filter(a => a.id !== id) }
    setAboutPage({ ...aboutPage, data: updatedData })
    console.log('DELETE /api/pages/about/advantages', id)
  }

  const handleUpdateAdvantage = (id: number, field: keyof AdvantageItem, value: string) => {
    if (!aboutPage.data) return
    const updatedAdvantages = aboutPage.data.advantages.map(a => a.id === id ? { ...a, [field]: value } : a)
    const updatedData = { ...aboutPage.data, advantages: updatedAdvantages }
    setAboutPage({ ...aboutPage, data: updatedData })
    console.log('PUT /api/pages/about/advantages', id, field, value)
  }

  const handleUpdateCategoryHome = (id: number, field: keyof CategoryItem, value: string) => {
    if (!homePage.data) return
    const updatedCategories = homePage.data.categories.map(c => c.id === id ? { ...c, [field]: value } : c)
    const updatedData = { ...homePage.data, categories: updatedCategories }
    setHomePage({ ...homePage, data: updatedData })
    console.log('PUT /api/pages/home/categories', id, field, value)
  }

  const handleDeleteCategoryHome = (id: number) => {
    if (!homePage.data) return
    const updatedData = { ...homePage.data, categories: homePage.data.categories.filter(c => c.id !== id) }
    setHomePage({ ...homePage, data: updatedData })
    console.log('DELETE /api/pages/home/categories', id)
  }

  const handleUploadImageHome = (id: number, imageUrl: string) => {
    if (!homePage.data) return
    const updatedCategories = homePage.data.categories.map(c => c.id === id ? { ...c, image: imageUrl } : c)
    const updatedData = { ...homePage.data, categories: updatedCategories }
    setHomePage({ ...homePage, data: updatedData })
    console.log('POST /api/upload', imageUrl)
  }

  const loadContactsPage = async () => {
    setContactsPage({ ...contactsPage, isLoading: true })
    const data = await getContactsPage()
    if (data) {
      setContactsPage({ isLoading: false, isSaving: false, data })
    }
  }

  const handleSaveContactsPage = async () => {
    if (!contactsPage.data) return
    setContactsPage({ ...contactsPage, isSaving: true })
    console.log('PUT /api/pages/contacts', contactsPage.data)
    const updated = await updateContactsPage(contactsPage.data)
    if (updated) {
      setContactsPage({ isLoading: false, isSaving: false, data: updated })
      alert('Страница "Контакты" сохранена!')
    } else {
      setContactsPage({ ...contactsPage, isSaving: false })
      alert(SAVE_FAILED_HINT)
    }
  }

  const handleAddLocation = () => {
    if (!contactsPage.data) return
    const newLocation: LocationItem = {
      id: Date.now(),
      name: 'Новый салон',
      address: 'Адрес',
      phone: '+7 (___) ___-__-__',
      hours: 'Ежедневно с 10:00 до 20:00',
      coords: [56.2906, 44.0024]
    }
    const updatedData = { ...contactsPage.data, locations: [...contactsPage.data.locations, newLocation] }
    setContactsPage({ ...contactsPage, data: updatedData })
    console.log('POST /api/pages/contacts/locations', newLocation)
  }

  const handleDeleteLocation = (id: number) => {
    if (!contactsPage.data) return
    const updatedData = { ...contactsPage.data, locations: contactsPage.data.locations.filter(l => l.id !== id) }
    setContactsPage({ ...contactsPage, data: updatedData })
    console.log('DELETE /api/pages/contacts/locations', id)
  }

  const handleUpdateLocation = (id: number, field: keyof LocationItem, value: string) => {
    if (!contactsPage.data) return
    const updatedLocations = contactsPage.data.locations.map(l => l.id === id ? { ...l, [field]: value } : l)
    const updatedData = { ...contactsPage.data, locations: updatedLocations }
    setContactsPage({ ...contactsPage, data: updatedData })
    console.log('PUT /api/pages/contacts/locations', id, field, value)
  }

  const loadPortfolioPage = async () => {
    setPortfolioPage({ ...portfolioPage, isLoading: true })
    const data = await getPortfolioPage()
    if (data) {
      setPortfolioPage({ isLoading: false, isSaving: false, data })
    }
  }

  const handleSavePortfolioPage = async () => {
    if (!portfolioPage.data) return
    setPortfolioPage({ ...portfolioPage, isSaving: true })
    console.log('PUT /api/pages/portfolio', portfolioPage.data)
    const updated = await updatePortfolioPage(portfolioPage.data)
    if (updated) {
      setPortfolioPage({ isLoading: false, isSaving: false, data: updated })
      alert('Страница "Портфолио" сохранена!')
    } else {
      setPortfolioPage({ ...portfolioPage, isSaving: false })
      alert(SAVE_FAILED_HINT)
    }
  }

  const handleAddPortfolioItem = () => {
    if (!portfolioPage.data) return
    const newItem: PortfolioItem = {
      id: Date.now(),
      image: '',
      title: 'Новый проект',
      description: 'Описание проекта'
    }
    const updatedData = { ...portfolioPage.data, items: [...portfolioPage.data.items, newItem] }
    setPortfolioPage({ ...portfolioPage, data: updatedData })
    console.log('POST /api/pages/portfolio/items', newItem)
  }

  const handleDeletePortfolioItem = (id: number) => {
    if (!portfolioPage.data) return
    const updatedData = { ...portfolioPage.data, items: portfolioPage.data.items.filter(i => i.id !== id) }
    setPortfolioPage({ ...portfolioPage, data: updatedData })
    console.log('DELETE /api/pages/portfolio/items', id)
  }

  const handleUpdatePortfolioItem = (id: number, field: keyof PortfolioItem, value: string) => {
    if (!portfolioPage.data) return
    const updatedItems = portfolioPage.data.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    const updatedData = { ...portfolioPage.data, items: updatedItems }
    setPortfolioPage({ ...portfolioPage, data: updatedData })
    console.log('PUT /api/pages/portfolio/items', id, field, value)
  }

  const handleUploadImagePortfolio = (id: number, imageUrl: string) => {
    if (!portfolioPage.data) return
    const updatedItems = portfolioPage.data.items.map(i => i.id === id ? { ...i, image: imageUrl } : i)
    const updatedData = { ...portfolioPage.data, items: updatedItems }
    setPortfolioPage({ ...portfolioPage, data: updatedData })
    console.log('POST /api/upload', imageUrl)
  }

  const loadHomePage = async () => {
    setHomePage({ ...homePage, isLoading: true })
    const data = await getHomePage()
    if (data) {
      setHomePage({ isLoading: false, isSaving: false, data })
    }
  }

  const handleSaveHomePage = async () => {
    if (!homePage.data) return
    setHomePage({ ...homePage, isSaving: true })
    console.log('PUT /api/pages/home', homePage.data)
    const updated = await updateHomePage(homePage.data)
    if (updated) {
      setHomePage({ isLoading: false, isSaving: false, data: updated })
      alert('Главная страница сохранена!')
    } else {
      setHomePage({ ...homePage, isSaving: false })
      alert(SAVE_FAILED_HINT)
    }
  }

  const loadCatalogPage = async () => {
    setCatalogPage({ ...catalogPage, isLoading: true })
    const data = await getCatalogPage()
    if (data) {
      setCatalogPage({ isLoading: false, isSaving: false, data })
    }
  }

  const handleSaveCatalogPage = async () => {
    if (!catalogPage.data) return
    setCatalogPage({ ...catalogPage, isSaving: true })
    console.log('PUT /api/pages/catalog', catalogPage.data)
    const updated = await updateCatalogPage(catalogPage.data)
    if (updated) {
      setCatalogPage({ isLoading: false, isSaving: false, data: updated })
      alert('Страница "Каталог" сохранена!')
    } else {
      setCatalogPage({ ...catalogPage, isSaving: false })
      alert(SAVE_FAILED_HINT)
    }
  }

  const loadHeaderPage = async () => {
    setHeaderPage((prev) => ({ ...prev, isLoading: true }))
    const data = await getHeader()
    setHeaderPage({ isLoading: false, isSaving: false, data: data ?? defaultHeaderData })
  }

  const handleSaveHeaderPage = async () => {
    if (!headerPage.data) return
    setHeaderPage((prev) => ({ ...prev, isSaving: true }))
    console.log('PUT /api/widgets/header', headerPage.data)
    const updated = await updateHeader(headerPage.data)
    if (updated) {
      setHeaderPage({ isLoading: false, isSaving: false, data: updated })
      alert('Шапка сохранена!')
    } else {
      setHeaderPage((prev) => ({ ...prev, isSaving: false }))
      alert(SAVE_FAILED_HINT)
    }
  }

  const handleUpdateHeaderField = <K extends keyof HeaderData>(field: K, value: HeaderData[K]) => {
    if (!headerPage.data) return
    setHeaderPage((prev) => ({
      ...prev,
      data: prev.data ? { ...prev.data, [field]: value } : prev.data,
    }))
  }

  const handleAddHeaderNavItem = () => {
    if (!headerPage.data) return
    const next: HeaderNavItem = { label: 'Новый пункт', path: '/' }
    setHeaderPage((prev) => ({
      ...prev,
      data: prev.data ? { ...prev.data, navItems: [...prev.data.navItems, next] } : prev.data,
    }))
  }

  const handleUpdateHeaderNavItem = (index: number, field: keyof HeaderNavItem, value: string) => {
    if (!headerPage.data) return
    setHeaderPage((prev) => ({
      ...prev,
      data: prev.data
        ? {
            ...prev.data,
            navItems: prev.data.navItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
          }
        : prev.data,
    }))
  }

  const handleDeleteHeaderNavItem = (index: number) => {
    if (!headerPage.data) return
    setHeaderPage((prev) => ({
      ...prev,
      data: prev.data ? { ...prev.data, navItems: prev.data.navItems.filter((_, i) => i !== index) } : prev.data,
    }))
  }

  const handleAddCategoryCatalog = () => {
    if (!catalogPage.data) return
    const newCategory: CatalogCategory = {
      id: `cat-${Date.now()}`,
      name: 'Новая категория',
      icon: 'DoorOpen',
      subcategories: []
    }
    const updatedData = { ...catalogPage.data, categories: [...catalogPage.data.categories, newCategory] }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('POST /api/pages/catalog/categories', newCategory)
  }

  const handleDeleteCategoryCatalog = (id: string) => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, categories: catalogPage.data.categories.filter(c => c.id !== id) }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('DELETE /api/pages/catalog/categories', id)
  }

  const handleUpdateCategoryCatalog = (id: string, field: keyof CatalogCategory, value: string) => {
    if (!catalogPage.data) return
    const updatedCategories = catalogPage.data.categories.map(c => c.id === id ? { ...c, [field]: value } : c)
    const updatedData = { ...catalogPage.data, categories: updatedCategories }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('PUT /api/pages/catalog/categories', id, field, value)
  }

  const handleAddMaterial = () => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, materials: [...catalogPage.data.materials, 'Новый материал'] }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('POST /api/pages/catalog/materials', 'Новый материал')
  }

  const handleDeleteMaterial = (index: number) => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, materials: catalogPage.data.materials.filter((_, i) => i !== index) }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('DELETE /api/pages/catalog/materials', index)
  }

  const handleUpdateMaterial = (index: number, value: string) => {
    if (!catalogPage.data) return
    const updatedMaterials = [...catalogPage.data.materials]
    updatedMaterials[index] = value
    const updatedData = { ...catalogPage.data, materials: updatedMaterials }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('PUT /api/pages/catalog/materials', index, value)
  }

  const handleAddColor = () => {
    if (!catalogPage.data) return
    const newColor: CatalogColor = {
      id: `color-${Date.now()}`,
      name: 'Новый цвет',
      color: '#000000',
      border: '#000000'
    }
    const updatedData = { ...catalogPage.data, colors: [...catalogPage.data.colors, newColor] }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('POST /api/pages/catalog/colors', newColor)
  }

  const handleDeleteColor = (id: string) => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, colors: catalogPage.data.colors.filter(c => c.id !== id) }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('DELETE /api/pages/catalog/colors', id)
  }

  const handleUpdateColor = (id: string, field: keyof CatalogColor, value: string) => {
    if (!catalogPage.data) return
    const updatedColors = catalogPage.data.colors.map(c => c.id === id ? { ...c, [field]: value } : c)
    const updatedData = { ...catalogPage.data, colors: updatedColors }
    setCatalogPage({ ...catalogPage, data: updatedData })
    console.log('PUT /api/pages/catalog/colors', id, field, value)
  }

  // CRUD товаров
  const handleAddProduct = async () => {
    let imageUrl = productForm.image

    // Если есть файл, загружаем его
    if (productForm.file) {
      console.log('POST /api/upload', productForm.file)
      imageUrl = URL.createObjectURL(productForm.file)
    }

    // Реальный запрос на создание
    console.log('POST /api/products', { ...productForm, image: imageUrl })
    // Для демо добавляем локально
    setProducts([...products, {
      ...productForm,
      image: imageUrl,
      id: Date.now(),
      price: 0,
      category: 'interior',
      slug: ''
    } as ProductLocal])

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

    let imageUrl = productForm.image

    // Если есть файл, загружаем его
    if (productForm.file) {
      console.log('POST /api/upload', productForm.file)
      imageUrl = URL.createObjectURL(productForm.file)
    }

    // Реальный запрос на обновление
    console.log('PUT /api/products', productForm.id, { ...productForm, image: imageUrl })
    const updated = await updateProduct(productForm.id, {
      name: productForm.name || '',
      material: productForm.material || '',
      color: productForm.color || '',
      image: imageUrl || ''
    })

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

  // Выход
  const handleLogout = async () => {
    await adminLogout()
    navigate('/')
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-muted-foreground">
        Проверка сессии…
      </div>
    )
  }

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
        <div className="flex gap-2 mb-6 border-b pb-2">
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
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pages'
                ? 'bg-primary text-background'
                : 'bg-white text-foreground hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            Страницы
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-primary text-background'
                : 'bg-white text-foreground hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Мессенджер
          </button>
        </div>

        {/* Товары */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Управление товарами</h2>
              <button
                onClick={() => {
                  setProductForm({ name: '', material: '', color: '', image: '', file: undefined })
                  setIsEditing(true)
                }}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
          </div>
        )}

        {/* Страницы */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setActivePage('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activePage === 'home'
                    ? 'bg-primary text-background'
                    : 'bg-white text-foreground hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Главная (Hero)
              </button>
              <button
                onClick={() => setActivePage('catalog')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activePage === 'catalog'
                    ? 'bg-primary text-background'
                    : 'bg-white text-foreground hover:bg-gray-100'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                Каталог
              </button>
              <button
                onClick={() => setActivePage('portfolio')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activePage === 'portfolio'
                    ? 'bg-primary text-background'
                    : 'bg-white text-foreground hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                Портфолио
              </button>
              <button
                onClick={() => setActivePage('about')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activePage === 'about'
                    ? 'bg-primary text-background'
                    : 'bg-white text-foreground hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                О нас
              </button>
              <button
                onClick={() => setActivePage('contacts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activePage === 'contacts'
                    ? 'bg-primary text-background'
                    : 'bg-white text-foreground hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-5 h-5" />
                Контакты
              </button>
              <button
                onClick={() => setActivePage('header')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activePage === 'header'
                    ? 'bg-primary text-background'
                    : 'bg-white text-foreground hover:bg-gray-100'
                }`}
              >
                <PanelTop className="w-5 h-5" />
                Шапка
              </button>
            </div>

            {/* Редаактор главной страницы */}
            {activePage === 'home' && homePage.data && (
              <HomePageEditor
                data={homePage.data}
                isLoading={homePage.isLoading}
                isSaving={homePage.isSaving}
                onSave={handleSaveHomePage}
                onDeleteFeature={(id) => {
                  if (!homePage.data) return
                  const updatedData = { ...homePage.data, features: homePage.data.features.filter(f => f.id !== id) }
                  setHomePage({ ...homePage, data: updatedData })
                  console.log('DELETE /api/pages/home/features', id)
                }}
                onUpdateCategory={handleUpdateCategoryHome}
                onDeleteCategory={handleDeleteCategoryHome}
                onUploadImage={handleUploadImageHome}
              />
            )}

            {/* Редактор каталога */}
            {activePage === 'catalog' && catalogPage.data && (
              <CatalogPageEditor
                data={catalogPage.data}
                isLoading={catalogPage.isLoading}
                isSaving={catalogPage.isSaving}
                onSave={handleSaveCatalogPage}
                onAddCategory={handleAddCategoryCatalog}
                onUpdateCategory={handleUpdateCategoryCatalog}
                onDeleteCategory={handleDeleteCategoryCatalog}
                onAddMaterial={handleAddMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onAddColor={handleAddColor}
                onUpdateColor={handleUpdateColor}
                onDeleteColor={handleDeleteColor}
              />
            )}

            {/* Редактор портфолио */}
            {activePage === 'portfolio' && portfolioPage.data && (
              <PortfolioPageEditor
                data={portfolioPage.data}
                isLoading={portfolioPage.isLoading}
                isSaving={portfolioPage.isSaving}
                onSave={handleSavePortfolioPage}
                onAddItem={handleAddPortfolioItem}
                onUpdateItem={handleUpdatePortfolioItem}
                onDeleteItem={handleDeletePortfolioItem}
                onUploadImage={handleUploadImagePortfolio}
              />
            )}

            {/* Редактор О нас */}
            {activePage === 'about' && aboutPage.data && (
              <AboutPageEditor
                data={aboutPage.data}
                isLoading={aboutPage.isLoading}
                isSaving={aboutPage.isSaving}
                onSave={handleSaveAboutPage}
                onAddStat={handleAddStat}
                onUpdateStat={handleUpdateStat}
                onDeleteStat={handleDeleteStat}
                onAddAdvantage={handleAddAdvantage}
                onUpdateAdvantage={handleUpdateAdvantage}
                onDeleteAdvantage={handleDeleteAdvantage}
              />
            )}

            {/* Редактор Контакты */}
            {activePage === 'contacts' && contactsPage.data && (
              <ContactsPageEditor
                data={contactsPage.data}
                isLoading={contactsPage.isLoading}
                isSaving={contactsPage.isSaving}
                onSave={handleSaveContactsPage}
                onAddLocation={handleAddLocation}
                onUpdateLocation={handleUpdateLocation}
                onDeleteLocation={handleDeleteLocation}
              />
            )}

            {/* Редактор шапки */}
            {activePage === 'header' && headerPage.data && (
              <HeaderPageEditor
                data={headerPage.data}
                isLoading={headerPage.isLoading}
                isSaving={headerPage.isSaving}
                onSave={handleSaveHeaderPage}
                onUpdateField={handleUpdateHeaderField}
                onAddNavItem={handleAddHeaderNavItem}
                onUpdateNavItem={handleUpdateHeaderNavItem}
                onDeleteNavItem={handleDeleteHeaderNavItem}
              />
            )}
          </div>
        )}

        {/* Мессенджер */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        className={`flex ${msg.isUser ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            msg.isUser
                              ? 'bg-gray-100 text-foreground'
                              : 'bg-primary text-background'
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
          </div>
        )}
      </div>

      {/* Модальное окно добавления/редактирования */}
      {isEditing && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsEditing(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
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
          </div>
        </>
      )}
    </div>
  )
}
