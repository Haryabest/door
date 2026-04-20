import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, MessageSquare, LogOut, Plus, Trash2, Edit, X,
  Search, Send, ChevronLeft, Home, Image as ImageIcon, FileText, Settings, MapPin, PanelTop, RefreshCw,
} from 'lucide-react'
import { updateProduct, deleteProduct, productsApi, createProduct, uploadImage } from '@/shared/api/products'
import { sendMessage, getChats, markChatAsRead } from '@/shared/api/chats'
import { getAboutPage, updateAboutPage, type AboutPageData, type StatItem, type AdvantageItem } from '@/shared/api/about'
import { getContactsPage, updateContactsPage, type ContactsPageData, type LocationItem } from '@/shared/api/contacts'
import { getPortfolioPage, updatePortfolioPage, type PortfolioPageData, type PortfolioItem } from '@/shared/api/portfolio'
import {
  getHomePage,
  updateHomePage,
  type HomePageData,
  type CategoryItem,
  type FeatureItem,
  type HeroSection,
} from '@/shared/api/home'
import { getCatalogPage, updateCatalogPage, type CatalogPageData, type CatalogCategory, type CatalogColor } from '@/shared/api/catalog'
import { defaultHeaderData, getHeader, updateHeader, type HeaderData, type HeaderNavItem } from '@/shared/api/header'
import { adminLogout, adminMe } from '@/shared/api/auth'
import { getContactLeads, type ContactLead } from '@/shared/api/contactLeads'
import { transliterate } from '@/shared/lib/slug'
import {
  emptyProductForm,
  parseFeaturesText,
  type ProductFormState,
  type ProductLocal,
} from './adminProductTypes'
import { ProductEditForm } from './ProductEditForm'
import { HomePageEditor, CatalogPageEditor, PortfolioPageEditor, AboutPageEditor, ContactsPageEditor, HeaderPageEditor } from './editors'

export type { ProductFormState, ProductLocal } from './adminProductTypes'
export { emptyProductForm } from './adminProductTypes'

const SAVE_FAILED_HINT =
  'Ошибка сохранения. Выйдите и войдите снова (сессия). Для API-скриптов нужен Bearer (ADMIN_API_TOKEN) или VITE_ADMIN_API_TOKEN при сборке.'

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
  const [contactLeads, setContactLeads] = useState<ContactLead[]>([])
  const [contactLeadsLoading, setContactLeadsLoading] = useState(false)

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

  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm)

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
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        description: p.description ?? '',
        features: p.features ?? [],
        material: p.material,
        color: p.color,
        image: p.image,
        category: p.category,
        slug: p.slug,
      }))
    )
  }

  const loadChats = async () => {
    const list = await getChats()
    setChats(list)
  }

  const handleSelectChat = (chatId: number) => {
    setSelectedChat(chatId)
    void markChatAsRead(chatId).then((ok) => {
      if (ok) {
        setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)))
      }
    })
  }

  useEffect(() => {
    if (activeTab !== 'messages') return
    const timer = window.setInterval(() => {
      void getChats().then(setChats)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeTab])

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
  }

  const handleDeleteStat = (id: number) => {
    if (!aboutPage.data) return
    const updatedData = { ...aboutPage.data, stats: aboutPage.data.stats.filter(s => s.id !== id) }
    setAboutPage({ ...aboutPage, data: updatedData })
  }

  const handleUpdateStat = (id: number, field: keyof StatItem, value: string) => {
    if (!aboutPage.data) return
    const updatedStats = aboutPage.data.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
    const updatedData = { ...aboutPage.data, stats: updatedStats }
    setAboutPage({ ...aboutPage, data: updatedData })
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
  }

  const handleDeleteAdvantage = (id: number) => {
    if (!aboutPage.data) return
    const updatedData = { ...aboutPage.data, advantages: aboutPage.data.advantages.filter(a => a.id !== id) }
    setAboutPage({ ...aboutPage, data: updatedData })
  }

  const handleUpdateAdvantage = (id: number, field: keyof AdvantageItem, value: string) => {
    if (!aboutPage.data) return
    const updatedAdvantages = aboutPage.data.advantages.map(a => a.id === id ? { ...a, [field]: value } : a)
    const updatedData = { ...aboutPage.data, advantages: updatedAdvantages }
    setAboutPage({ ...aboutPage, data: updatedData })
  }

  const handleUpdateHero = (field: keyof HeroSection, value: string) => {
    if (!homePage.data) return
    setHomePage({
      ...homePage,
      data: { ...homePage.data, hero: { ...homePage.data.hero, [field]: value } },
    })
  }

  const handleUpdateFeatureHome = (id: number, field: keyof FeatureItem, value: string) => {
    if (!homePage.data) return
    setHomePage({
      ...homePage,
      data: {
        ...homePage.data,
        features: homePage.data.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
      },
    })
  }

  const handleUpdateCategoryHome = (id: number, field: keyof CategoryItem, value: string) => {
    if (!homePage.data) return
    const updatedCategories = homePage.data.categories.map(c => c.id === id ? { ...c, [field]: value } : c)
    const updatedData = { ...homePage.data, categories: updatedCategories }
    setHomePage({ ...homePage, data: updatedData })
  }

  const handleDeleteCategoryHome = (id: number) => {
    if (!homePage.data) return
    const updatedData = { ...homePage.data, categories: homePage.data.categories.filter(c => c.id !== id) }
    setHomePage({ ...homePage, data: updatedData })
  }

  const handleUploadImageHome = async (id: number, file: File) => {
    const url = await uploadImage(file)
    if (!url) {
      alert('Не удалось загрузить изображение')
      return
    }
    handleUpdateCategoryHome(id, 'image', url)
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
  }

  const handleDeleteLocation = (id: number) => {
    if (!contactsPage.data) return
    const updatedData = { ...contactsPage.data, locations: contactsPage.data.locations.filter(l => l.id !== id) }
    setContactsPage({ ...contactsPage, data: updatedData })
  }

  const handleUpdateLocation = (id: number, field: keyof LocationItem, value: string) => {
    if (!contactsPage.data) return
    const updatedLocations = contactsPage.data.locations.map(l => l.id === id ? { ...l, [field]: value } : l)
    const updatedData = { ...contactsPage.data, locations: updatedLocations }
    setContactsPage({ ...contactsPage, data: updatedData })
  }

  const refreshContactLeads = useCallback(async () => {
    setContactLeadsLoading(true)
    const items = await getContactLeads()
    setContactLeads(items)
    setContactLeadsLoading(false)
  }, [])

  useEffect(() => {
    if (!authChecked || activeTab !== 'pages' || activePage !== 'contacts') return
    void refreshContactLeads()
  }, [authChecked, activeTab, activePage, refreshContactLeads])

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
  }

  const handleDeletePortfolioItem = (id: number) => {
    if (!portfolioPage.data) return
    const updatedData = { ...portfolioPage.data, items: portfolioPage.data.items.filter(i => i.id !== id) }
    setPortfolioPage({ ...portfolioPage, data: updatedData })
  }

  const handleUpdatePortfolioItem = (id: number, field: keyof PortfolioItem, value: string) => {
    if (!portfolioPage.data) return
    const updatedItems = portfolioPage.data.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    const updatedData = { ...portfolioPage.data, items: updatedItems }
    setPortfolioPage({ ...portfolioPage, data: updatedData })
  }

  const handleUploadImagePortfolio = (id: number, imageUrl: string) => {
    if (!portfolioPage.data) return
    const updatedItems = portfolioPage.data.items.map(i => i.id === id ? { ...i, image: imageUrl } : i)
    const updatedData = { ...portfolioPage.data, items: updatedItems }
    setPortfolioPage({ ...portfolioPage, data: updatedData })
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
  }

  const handleDeleteCategoryCatalog = (id: string) => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, categories: catalogPage.data.categories.filter(c => c.id !== id) }
    setCatalogPage({ ...catalogPage, data: updatedData })
  }

  const handleUpdateCategoryCatalog = (id: string, field: keyof CatalogCategory, value: string) => {
    if (!catalogPage.data) return
    const updatedCategories = catalogPage.data.categories.map(c => c.id === id ? { ...c, [field]: value } : c)
    const updatedData = { ...catalogPage.data, categories: updatedCategories }
    setCatalogPage({ ...catalogPage, data: updatedData })
  }

  const handleAddMaterial = () => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, materials: [...catalogPage.data.materials, 'Новый материал'] }
    setCatalogPage({ ...catalogPage, data: updatedData })
  }

  const handleDeleteMaterial = (index: number) => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, materials: catalogPage.data.materials.filter((_, i) => i !== index) }
    setCatalogPage({ ...catalogPage, data: updatedData })
  }

  const handleUpdateMaterial = (index: number, value: string) => {
    if (!catalogPage.data) return
    const updatedMaterials = [...catalogPage.data.materials]
    updatedMaterials[index] = value
    const updatedData = { ...catalogPage.data, materials: updatedMaterials }
    setCatalogPage({ ...catalogPage, data: updatedData })
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
  }

  const handleDeleteColor = (id: string) => {
    if (!catalogPage.data) return
    const updatedData = { ...catalogPage.data, colors: catalogPage.data.colors.filter(c => c.id !== id) }
    setCatalogPage({ ...catalogPage, data: updatedData })
  }

  const handleUpdateColor = (id: string, field: keyof CatalogColor, value: string) => {
    if (!catalogPage.data) return
    const updatedColors = catalogPage.data.colors.map(c => c.id === id ? { ...c, [field]: value } : c)
    const updatedData = { ...catalogPage.data, colors: updatedColors }
    setCatalogPage({ ...catalogPage, data: updatedData })
  }

  // CRUD товаров
  const handleAddProduct = async () => {
    if (!productForm.name?.trim()) {
      alert('Укажите название товара')
      return
    }
    const price = 0
    const oldPrice: number | null = null
    let imageUrl = (productForm.image ?? '').trim()
    if (productForm.file) {
      const up = await uploadImage(productForm.file)
      if (!up) {
        alert('Не удалось загрузить изображение')
        return
      }
      imageUrl = up
    }
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      alert('Укажите URL изображения или загрузите файл')
      return
    }
    const features = parseFeaturesText(productForm.featuresText)
    const base = transliterate(`${productForm.name}-${productForm.material}-${productForm.color}`).slice(0, 400) || 'product'
    const slugDraft = productForm.slug?.trim()
    const slug = (slugDraft || `${base}-${Date.now()}`).slice(0, 500)
    const created = await createProduct({
      name: productForm.name!,
      price,
      oldPrice,
      description: productForm.description?.trim() || undefined,
      features,
      material: productForm.material || '—',
      color: productForm.color || '—',
      image: imageUrl,
      category: productForm.category || 'interior',
      slug,
    })
    if (!created) {
      alert(SAVE_FAILED_HINT)
      return
    }
    setProducts([
      ...products,
      {
        id: created.id,
        name: created.name,
        price: created.price,
        oldPrice: created.oldPrice ?? null,
        description: created.description ?? '',
        features: created.features ?? [],
        material: created.material,
        color: created.color,
        image: created.image,
        category: created.category,
        slug: created.slug,
      },
    ])
    setIsEditing(false)
    setProductForm(emptyProductForm())
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    const success = await deleteProduct(id)

    if (success) {
      setProducts(products.filter((p) => p.id !== id))
    } else {
      alert('Не удалось удалить товар. Проверьте сессию и права.')
    }
  }

  const handleEditProduct = (product: ProductLocal) => {
    setProductForm({
      ...product,
      featuresText: product.features?.join('\n') ?? '',
      file: undefined,
    })
    setIsEditing(true)
  }

  const handleUpdateProduct = async () => {
    if (!productForm.id) return

    const price = Number(productForm.price)
    if (!Number.isFinite(price) || price < 0) {
      alert('Укажите корректную цену')
      return
    }
    let oldPrice: number | null = null
    if (productForm.oldPrice !== undefined && productForm.oldPrice !== null) {
      const o = Number(productForm.oldPrice)
      if (Number.isFinite(o) && o >= 0) oldPrice = o
    }
    let imageUrl = (productForm.image ?? '').trim()
    if (productForm.file) {
      const up = await uploadImage(productForm.file)
      if (!up) {
        alert('Не удалось загрузить изображение')
        return
      }
      imageUrl = up
    }
    if (!imageUrl || imageUrl.startsWith('blob:')) {
      alert('Укажите URL изображения или загрузите файл')
      return
    }
    const features = parseFeaturesText(productForm.featuresText)
    const slug = (productForm.slug?.trim() || 'product').slice(0, 500)
    if (!slug) {
      alert('Укажите slug (латиница, дефисы)')
      return
    }

    const updated = await updateProduct(productForm.id, {
      name: productForm.name || '',
      price,
      oldPrice,
      description: productForm.description?.trim() || undefined,
      features,
      material: productForm.material || '',
      color: productForm.color || '',
      image: imageUrl,
      category: productForm.category || 'interior',
      slug,
    })

    if (updated) {
      setProducts(
        products.map((p) =>
          p.id === productForm.id
            ? {
                id: updated.id,
                name: updated.name,
                price: updated.price,
                oldPrice: updated.oldPrice ?? null,
                description: updated.description ?? '',
                features: updated.features ?? [],
                material: updated.material,
                color: updated.color,
                image: updated.image,
                category: updated.category,
                slug: updated.slug,
              }
            : p
        )
      )
    } else {
      alert(SAVE_FAILED_HINT)
    }

    setIsEditing(false)
    setProductForm(emptyProductForm())
  }

  // Отправка сообщения
  const handleSendMessage = async (chatId: number, text: string) => {
    const newMessage = await sendMessage(chatId, text)

    if (newMessage) {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat
          return {
            ...chat,
            unread: 0,
            messages: [...chat.messages, newMessage],
            lastMessage: text,
          }
        })
      )
    } else {
      alert('Не удалось отправить сообщение')
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
    <div className="admin-click-zone min-h-screen bg-gray-50">
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
                  setProductForm(emptyProductForm())
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </td>
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
                onUpdateHero={handleUpdateHero}
                onUpdateFeature={handleUpdateFeatureHome}
                onDeleteFeature={(id) => {
                  if (!homePage.data) return
                  const updatedData = { ...homePage.data, features: homePage.data.features.filter(f => f.id !== id) }
                  setHomePage({ ...homePage, data: updatedData })
                }}
                onUpdateCategory={handleUpdateCategoryHome}
                onDeleteCategory={handleDeleteCategoryHome}
                onUploadCategoryImage={handleUploadImageHome}
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
              <div className="space-y-8">
                <ContactsPageEditor
                  data={contactsPage.data}
                  isLoading={contactsPage.isLoading}
                  isSaving={contactsPage.isSaving}
                  onSave={handleSaveContactsPage}
                  onAddLocation={handleAddLocation}
                  onUpdateLocation={handleUpdateLocation}
                  onDeleteLocation={handleDeleteLocation}
                />
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-bold text-primary">Заявки с формы на сайте</h2>
                    <button
                      type="button"
                      onClick={() => void refreshContactLeads()}
                      disabled={contactLeadsLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-gray-50 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${contactLeadsLoading ? 'animate-spin' : ''}`} />
                      Обновить
                    </button>
                  </div>
                  {contactLeadsLoading && contactLeads.length === 0 ? (
                    <p className="px-6 py-8 text-muted-foreground text-center">Загрузка…</p>
                  ) : contactLeads.length === 0 ? (
                    <p className="px-6 py-8 text-muted-foreground text-center">Пока нет заявок</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Дата</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Имя</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Телефон</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Сообщение</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {contactLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50 align-top">
                              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                {new Date(lead.createdAt).toLocaleString('ru-RU', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td className="px-4 py-3 font-medium">{lead.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                                  {lead.phone}
                                </a>
                              </td>
                              <td className="px-4 py-3 break-all max-w-[180px]">
                                {lead.email ? (
                                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                                    {lead.email}
                                  </a>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td className="px-4 py-3 max-w-md whitespace-pre-wrap">{lead.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
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
                    type="button"
                    onClick={() => handleSelectChat(chat.id)}
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
            onClick={() => {
              setIsEditing(false)
              setProductForm(emptyProductForm())
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 pointer-events-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">
                  {productForm.id ? 'Редактировать' : 'Добавить товар'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setProductForm(emptyProductForm())
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductEditForm
                productForm={productForm}
                setProductForm={setProductForm}
                onCancel={() => {
                  setIsEditing(false)
                  setProductForm(emptyProductForm())
                }}
                onSubmit={productForm.id ? handleUpdateProduct : handleAddProduct}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
