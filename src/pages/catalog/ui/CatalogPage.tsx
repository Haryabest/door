import { useState, useMemo, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiltersContext } from '@/App'
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { Checkbox } from "@/shared/ui/checkbox"
import { ProductSkeleton } from "@/shared/ui/product-skeleton"
import { Filter, X, Search, ChevronRight, DoorOpen, Home, Settings, PanelLeft, Square } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from "@/shared/ui/SEO"
import { productsApi } from "@/shared/api/products"
import type { Product } from "@/shared/api/products"
import { getCatalogPage, type CatalogPageData } from "@/shared/api/catalog"
import { generateProductSlug } from "@/shared/lib/slug"

const iconMap: Record<string, any> = {
  'DoorOpen': DoorOpen,
  'Home': Home,
  'Settings': Settings,
  'PanelLeft': PanelLeft,
  'Square': Square,
}

// Категории каталога
const catalogCategories = [
  {
    id: 'interior',
    name: 'Межкомнатные двери',
    icon: DoorOpen,
    subcategories: [
      { id: 'pvh', name: 'ПВХ' },
      { id: 'emal', name: 'Эмаль' },
      { id: 'ecoshpon', name: 'Экошпон' },
      { id: 'massiv', name: 'Массив и натуральный шпон' },
    ],
  },
  {
    id: 'entrance',
    name: 'Входные двери',
    icon: Home,
    subcategories: [
      { id: 'flat', name: 'В квартиру' },
      { id: 'house', name: 'В дом' },
    ],
  },
  {
    id: 'systems',
    name: 'Системы открывания',
    icon: Settings,
    subcategories: [],
  },
  {
    id: 'panels',
    name: 'Стеновые панели',
    icon: PanelLeft,
    subcategories: [],
  },
  {
    id: 'plinths',
    name: 'Плинтуса',
    icon: Square,
    subcategories: [],
  },
]

export function CatalogPage() {
  const navigate = useNavigate()
  const { setIsFiltersOpen } = useContext(FiltersContext)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [catalogData, setCatalogData] = useState<CatalogPageData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all')
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedSections, setExpandedSections] = useState({
    catalog: true,
    material: false,
    color: false,
    price: false,
  })
  const itemsPerPage = 8

  useEffect(() => {
    loadCatalogData()
    loadProducts()
  }, [])

  const loadCatalogData = async () => {
    const data = await getCatalogPage()
    if (data) {
      setCatalogData(data)
    }
  }

  const loadProducts = async () => {
    setIsLoading(true)
    const data = await productsApi.getProducts()
    if (data && data.length > 0) {
      setProducts(data.map((product: any) => ({
        ...product,
        slug: generateProductSlug(product.name, product.material, product.color, product.id)
      })))
    } else {
      // Тестовые данные
      setProducts([
        { id: 1, slug: 'dver-klassik-pvh-belyy-1', name: "Дверь Классик", price: 15900, oldPrice: 18900, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400", category: "interior", material: "ПВХ", color: "Белый" },
        { id: 2, slug: 'dver-modern-emal-seryy-2', name: "Дверь Модерн", price: 18500, oldPrice: 22000, image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=400", category: "interior", material: "Эмаль", color: "Серый" },
        { id: 3, slug: 'dver-loft-ekoshpon-korichnevyy-3', name: "Дверь Лофт", price: 21000, oldPrice: null, image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400", category: "interior", material: "Экошпон", color: "Коричневый" },
        { id: 4, slug: 'dver-skandi-massiv-belyy-4', name: "Дверь Сканди", price: 17200, oldPrice: 19500, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400", category: "interior", material: "Массив", color: "Белый" },
        { id: 5, slug: 'dver-neoklassika-emal-bezhevyy-5', name: "Дверь Неоклассика", price: 24900, oldPrice: 29900, image: "https://images.unsplash.com/photo-1506306465497-6a840848fcab?w=400", category: "interior", material: "Эмаль", color: "Бежевый" },
        { id: 6, slug: 'dver-khay-tek-pvh-chernyy-6', name: "Дверь Хай-тек", price: 26500, oldPrice: null, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", category: "interior", material: "ПВХ", color: "Чёрный" },
        { id: 7, slug: 'dver-provans-naturalnyy-shpon-bezhevyy-7', name: "Дверь Прованс", price: 19800, oldPrice: 23000, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400", category: "interior", material: "Натуральный шпон", color: "Бежевый" },
        { id: 8, slug: 'dver-minimalizm-ekoshpon-seryy-8', name: "Дверь Минимализм", price: 22300, oldPrice: null, image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=400", category: "interior", material: "Экошпон", color: "Серый" },
        { id: 9, slug: 'dver-art-deko-emal-venge-9', name: "Дверь Арт-деко", price: 31500, oldPrice: 38000, image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400", category: "interior", material: "Эмаль", color: "Венге" },
        { id: 10, slug: 'dver-eko-ekoshpon-belyy-10', name: "Дверь Эко", price: 16700, oldPrice: 18900, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400", category: "interior", material: "Экошпон", color: "Белый" },
        { id: 11, slug: 'dver-standart-pvh-bezhevyy-11', name: "Дверь Стандарт", price: 12900, oldPrice: null, image: "https://images.unsplash.com/photo-1506306465497-6a840848fcab?w=400", category: "interior", material: "ПВХ", color: "Бежевый" },
        { id: 12, slug: 'dver-lyuks-massiv-duba-venge-12', name: "Дверь Люкс", price: 45900, oldPrice: 55000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", category: "interior", material: "Массив дуба", color: "Венге" },
      ])
    }
    setIsLoading(false)
  }

  const toggleFilters = () => {
    const newState = !showFilters
    setShowFilters(newState)
    setIsFiltersOpen(newState)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const materials = catalogData?.materials || ["ПВХ", "Эмаль", "Экошпон", "Массив", "Натуральный шпон"]
  const colors = catalogData?.colors || [
    { name: "Белый", color: "#FFFFFF", border: "#E5E5E5" },
    { name: "Серый", color: "#9CA3AF", border: "#6B7280" },
    { name: "Бежевый", color: "#F5E6D3", border: "#D4C4B0" },
    { name: "Коричневый", color: "#8B4513", border: "#6B3410" },
    { name: "Венге", color: "#4A3728", border: "#2D1F15" },
    { name: "Чёрный", color: "#1F2937", border: "#111827" }
  ]

  const toggleCategory = (cat: string) => {
    setSelectedCategory(cat)
    setSelectedSubcategory('all')
  }

  const toggleSubcategory = (subcat: string) => {
    setSelectedSubcategory(subcat)
  }

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials(prev => 
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedSubcategory('all')
    setSelectedMaterials([])
    setSelectedColors([])
    setPriceRange([0, 50000])
    productsApi.getProducts().then(data => {
      setProducts(data)
    })
  }

  const selectedCount = selectedMaterials.length + selectedColors.length + (selectedCategory !== 'all' ? 1 : 0) + (selectedSubcategory !== 'all' ? 1 : 0)

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) return false
      if (selectedColors.length > 0 && !selectedColors.includes(product.color)) return false
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false
      return true
    })
  }, [searchQuery, selectedCategory, selectedMaterials, selectedColors, priceRange])

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Сброс на первую страницу при изменении фильтров
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedMaterials, selectedColors])

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Каталог"
        description="Каталог дверей: межкомнатные, входные, системы открывания. Более 500 моделей дверей по выгодным ценам в Нижнем Новгороде."
      />
      <Header />
      <main className="flex-1 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Поиск и кнопка фильтров */}
          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск дверей..."
                className="w-full pl-9 pr-4 py-3 border-2 border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-4">

              <motion.button
                onClick={toggleFilters}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCount > 0
                    ? 'bg-primary text-background'
                    : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-background'
                }`}
              >
                <Filter className="w-5 h-5" />
                Фильтры
                {selectedCount > 0 && <span className="w-5 h-5 bg-background/20 rounded-full text-xs flex items-center justify-center">{selectedCount}</span>}
              </motion.button>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'border-primary bg-primary text-background'
                      : 'border-border bg-white text-primary hover:border-primary'
                  }`}
                  title="Плитка"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'border-primary bg-primary text-background'
                      : 'border-border bg-white text-primary hover:border-primary'
                  }`}
                  title="Список"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Модальное окно фильтров */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Панель фильтров */}
                <motion.div
                  className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl overflow-y-auto"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary">Фильтры</h2>
                    <div className="flex items-center gap-2">
                      {selectedCount > 0 && (
                        <button
                          onClick={resetFilters}
                          className="text-sm text-primary hover:underline cursor-pointer"
                        >
                          Сбросить
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setShowFilters(false)
                          setIsFiltersOpen(false)
                        }} 
                        className="text-primary p-2 cursor-pointer"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Категории каталога */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection('catalog')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-secondary hover:bg-accent transition-colors cursor-pointer"
                      >
                        <span className="font-medium text-primary">Каталог</span>
                        <ChevronRight className={`w-5 h-5 text-primary transition-transform ${
                          expandedSections.catalog ? 'rotate-90' : ''
                        }`} />
                      </button>
                      <AnimatePresence>
                        {expandedSections.catalog && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-1 bg-background">
                              {(catalogData?.categories || catalogCategories).map((cat: any) => (
                                <div key={cat.id}>
                                  <button
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                      selectedCategory === cat.id
                                        ? 'bg-primary text-background font-medium'
                                        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {(() => {
                                        const IconComponent = iconMap[cat.icon] || cat.icon
                                        return typeof IconComponent === 'string' ? null : <IconComponent className="w-4 h-4" />
                                      })()}
                                      {cat.name}
                                    </div>
                                    {cat.subcategories.length > 0 && (
                                      <ChevronRight className={`w-4 h-4 transition-transform ${
                                        selectedCategory === cat.id ? 'rotate-90' : ''
                                      }`} />
                                    )}
                                  </button>

                                  {/* Подкатегории */}
                                  {cat.subcategories.length > 0 && selectedCategory === cat.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="ml-6 mt-2 space-y-1">
                                        {cat.subcategories.map((subcat: any) => (
                                          <button
                                            key={subcat.id}
                                            onClick={() => toggleSubcategory(subcat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                              selectedSubcategory === subcat.id
                                                ? 'bg-primary/20 text-primary font-medium'
                                                : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                            }`}
                                          >
                                            {subcat.name}
                                          </button>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Материал */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection('material')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-secondary hover:bg-accent transition-colors cursor-pointer"
                      >
                        <span className="font-medium text-primary">Материал</span>
                        <ChevronRight className={`w-5 h-5 text-primary transition-transform ${
                          expandedSections.material ? 'rotate-90' : ''
                        }`} />
                      </button>
                      <AnimatePresence>
                        {expandedSections.material && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2 bg-background">
                              {materials.map((mat) => (
                                <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                                  <Checkbox
                                    checked={selectedMaterials.includes(mat)}
                                    onCheckedChange={() => toggleMaterial(mat)}
                                  />
                                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{mat}</span>
                                </label>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Цвет */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection('color')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-secondary hover:bg-accent transition-colors cursor-pointer"
                      >
                        <span className="font-medium text-primary">Цвет</span>
                        <ChevronRight className={`w-5 h-5 text-primary transition-transform ${
                          expandedSections.color ? 'rotate-90' : ''
                        }`} />
                      </button>
                      <AnimatePresence>
                        {expandedSections.color && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 bg-background">
                              <div className="grid grid-cols-3 gap-3">
                                {colors.map((color) => (
                                  <label key={color.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <button
                                      type="button"
                                      onClick={() => toggleColor(color.name)}
                                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                                        selectedColors.includes(color.name)
                                          ? 'ring-2 ring-primary ring-offset-2'
                                          : ''
                                      }`}
                                      style={{ 
                                        backgroundColor: color.color,
                                        borderColor: color.border
                                      }}
                                    >
                                      {selectedColors.includes(color.name) && (
                                        <svg className="w-4 h-4 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <polyline points="20 6 9 17 4 12" strokeWidth="3" />
                                        </svg>
                                      )}
                                    </button>
                                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">{color.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* Кнопка применения */}
                  <div className="sticky bottom-0 bg-background border-t p-4">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Показать {filteredProducts.length} товаров
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Сетка товаров */}
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {isLoading ? (
              // Скелетоны при загрузке
              Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/catalog/${product.slug}-${product.id}`)}
                  className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden bg-gray-100 ${
                    viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[3/4]'
                  }`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className={`p-4 ${
                    viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''
                  }`}>
                    <h3 className="font-medium text-primary mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.material}
                    </p>
                    <button className="w-full py-3 px-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                      Узнать цену
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-xl text-muted-foreground mb-4">Товары не найдены</p>
                  <button 
                    onClick={resetFilters}
                    className="px-6 py-2 bg-primary text-background rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-primary text-background'
                      : 'border-2 border-primary text-primary hover:bg-primary hover:text-background'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
