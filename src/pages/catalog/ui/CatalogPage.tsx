import { useState, useMemo, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiltersContext } from '@/App'
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { Checkbox } from "@/shared/ui/checkbox"
import { ProductSkeleton } from "@/shared/ui/product-skeleton"
import { Image } from "@/shared/ui/Image"
import { BackgroundPattern } from "@/shared/ui/BackgroundPattern"
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

function normalizeFilterValue(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/ё/g, 'е')
    .replace(/[abekmhopctxy]/g, (char) => {
      const map: Record<string, string> = {
        a: 'а',
        b: 'в',
        e: 'е',
        k: 'к',
        m: 'м',
        h: 'н',
        o: 'о',
        p: 'р',
        c: 'с',
        t: 'т',
        x: 'х',
        y: 'у',
      }
      return map[char] ?? char
    })
    .replace(/\s+/g, ' ')
}

export function CatalogPage() {
  const navigate = useNavigate()
  const { setIsFiltersOpen } = useContext(FiltersContext)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [catalogData, setCatalogData] = useState<CatalogPageData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  /** Подкатегории под каждой группой в «Каталог»; true по умолчанию (раскрыто) */
  const [expandedCategorySubs, setExpandedCategorySubs] = useState<Record<string, boolean>>({})
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState({
    catalog: true,
    material: false,
    color: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const itemsPerPage = 8

  useEffect(() => {
    loadCatalogData()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    void loadProducts({
      q: debouncedSearchQuery,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      subcategories: selectedSubcategories.length > 0 ? selectedSubcategories : undefined,
      materials: selectedMaterials.length > 0 ? selectedMaterials : undefined,
      colors: selectedColors.length > 0 ? selectedColors : undefined,
    })
  }, [debouncedSearchQuery, selectedCategories, selectedSubcategories, selectedMaterials, selectedColors])

  const loadCatalogData = async () => {
    const data = await getCatalogPage()
    if (data) {
      setCatalogData(data)
    }
  }

  const loadProducts = async (params?: {
    q?: string
    categories?: string[]
    subcategories?: string[]
    materials?: string[]
    colors?: string[]
  }) => {
    setIsLoading(true)
    const data = await productsApi.getProducts(params)
    setProducts((data ?? []).map((product: any) => ({
      ...product,
      slug: generateProductSlug(product.name, product.material, product.color, product.id)
    })))
    setIsLoading(false)
  }

  const categoriesList = catalogData?.categories ?? []
  const materials = catalogData?.materials ?? []
  const colors = catalogData?.colors ?? []

  const toggleFilters = () => {
    const newState = !showFilters
    setShowFilters(newState)
    setIsFiltersOpen(newState)
  }

  const closeFilters = useCallback(() => {
    setShowFilters(false)
    setIsFiltersOpen(false)
  }, [setIsFiltersOpen])

  const toggleCatalogCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
  }

  const toggleCatalogSubcategory = (subId: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    )
  }

  const toggleCategorySublist = (catId: string) => {
    setExpandedCategorySubs((prev) => ({
      ...prev,
      [catId]: !(prev[catId] ?? true),
    }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
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
    setSelectedCategories([])
    setSelectedSubcategories([])
    setSelectedMaterials([])
    setSelectedColors([])
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setCurrentPage(1)
  }

  const selectedCount =
    selectedCategories.length +
    selectedSubcategories.length +
    selectedMaterials.length +
    selectedColors.length

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (
        searchQuery &&
        !`${product.name} ${product.material}`.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) return false
      if (selectedSubcategories.length > 0) {
        const prodSubs = product.subcategoryIds ?? []
        if (!selectedSubcategories.some((sid) => prodSubs.includes(sid))) return false
      }
      if (
        selectedMaterials.length > 0 &&
        !selectedMaterials.some((materialFilter) => {
          const productMaterial = normalizeFilterValue(product.material)
          const filterMaterial = normalizeFilterValue(materialFilter)
          return productMaterial.includes(filterMaterial) || filterMaterial.includes(productMaterial)
        })
      ) return false
      if (
        selectedColors.length > 0 &&
        !selectedColors.some((colorFilter) => {
          const productColor = normalizeFilterValue(product.color)
          const filterColor = normalizeFilterValue(colorFilter)
          return productColor.includes(filterColor) || filterColor.includes(productColor)
        })
      ) return false
      return true
    })
  }, [products, searchQuery, selectedCategories, selectedSubcategories, selectedMaterials, selectedColors])

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Сброс на первую страницу при изменении фильтров
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategories, selectedSubcategories, selectedMaterials, selectedColors])

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Каталог дверей"
        description="Каталог межкомнатных и входных дверей в Нижнем Новгороде. Подберите двери по материалу, цвету, категории и системам открывания."
        canonicalUrl="/catalog"
        image="/logo.png"
        keywords="каталог дверей, межкомнатные двери каталог, входные двери каталог, двери Нижний Новгород, купить двери каталог"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Каталог дверей',
          url: 'https://otadoya.ru/catalog',
          description: 'Каталог межкомнатных и входных дверей в Нижнем Новгороде',
        }}
      />
      <Header />
      <main className="flex-1 bg-background">
        <BackgroundPattern opacity={0.1} size={100} />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
                <motion.div
                  role="presentation"
                  className="fixed inset-0 z-[49] cursor-pointer bg-black/35"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeFilters}
                />
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
                        onClick={closeFilters} 
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
                            <div className="p-3 space-y-3 bg-background">
                              {categoriesList.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-1">
                                  Загрузка категорий…
                                </p>
                              ) : (
                                categoriesList.map((cat) => {
                                  const IconComponent = iconMap[cat.icon]
                                  const IconEl =
                                    IconComponent && typeof IconComponent !== 'string' ? (
                                      <IconComponent className="w-4 h-4 shrink-0 text-primary" />
                                    ) : null
                                  const subs = cat.subcategories ?? []
                                  const subListOpen = expandedCategorySubs[cat.id] ?? true
                                  return (
                                    <div key={cat.id} className="rounded-lg border border-border/70 overflow-hidden">
                                      <div className="flex items-stretch gap-0 min-h-[2.75rem]">
                                        <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group px-2 py-2.5 hover:bg-primary/5">
                                          <Checkbox
                                            checked={selectedCategories.includes(cat.id)}
                                            onCheckedChange={() => toggleCatalogCategory(cat.id)}
                                          />
                                          <div className="flex items-center gap-2 min-w-0 flex-1">
                                            {IconEl}
                                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                              {cat.name}
                                            </span>
                                          </div>
                                        </label>
                                        {subs.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => toggleCategorySublist(cat.id)}
                                            className="shrink-0 px-3 flex items-center justify-center border-l border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                                            aria-expanded={subListOpen}
                                            aria-label={subListOpen ? 'Скрыть подкатегории' : 'Показать подкатегории'}
                                          >
                                            <ChevronRight
                                              className={`w-5 h-5 text-primary transition-transform ${
                                                subListOpen ? 'rotate-90' : ''
                                              }`}
                                            />
                                          </button>
                                        )}
                                      </div>
                                      {subs.length > 0 && subListOpen && (
                                        <div className="border-t border-border/60 bg-muted/30 px-2 py-2 pl-4 sm:pl-8 space-y-1">
                                          {subs.map((sub) => (
                                            <label
                                              key={sub.id}
                                              className="flex items-center gap-3 cursor-pointer group py-2 px-2 rounded-md hover:bg-background/80"
                                            >
                                              <Checkbox
                                                checked={selectedSubcategories.includes(sub.id)}
                                                onCheckedChange={() => toggleCatalogSubcategory(sub.id)}
                                              />
                                              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                                {sub.name}
                                              </span>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })
                              )}
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
                              {materials.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-1">
                                  Нет материалов в каталоге (настройте в админке).
                                </p>
                              ) : (
                                materials.map((mat) => (
                                  <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                                    <Checkbox
                                      checked={selectedMaterials.includes(mat)}
                                      onCheckedChange={() => toggleMaterial(mat)}
                                    />
                                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                      {mat}
                                    </span>
                                  </label>
                                ))
                              )}
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
                              {colors.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-1">
                                  Нет цветов в каталоге (настройте в админке).
                                </p>
                              ) : (
                                <div className="grid grid-cols-3 gap-3">
                                  {colors.map((color) => (
                                    <label
                                      key={color.id ?? color.name}
                                      className="flex flex-col items-center gap-2 cursor-pointer group"
                                    >
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
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* Кнопка применения */}
                  <div className="sticky bottom-0 bg-background border-t p-4">
                    <button
                      onClick={closeFilters}
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
                    <Image
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const params = new URLSearchParams()
                        params.set('chatMessage', `Меня заинтересовала дверь «${product.name}»`)
                        params.set('leadType', 'chat_message')
                        params.set('productName', product.name)
                        params.set('productUrl', `${window.location.origin}/catalog/${product.slug}-${product.id}`)
                        navigate(`?${params.toString()}`)
                      }}
                      className="tap-click w-full py-3 px-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
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
