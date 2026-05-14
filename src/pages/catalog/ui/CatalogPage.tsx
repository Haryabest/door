import { useState, useMemo, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiltersContext } from '@/App'
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { ProductSkeleton } from "@/shared/ui/product-skeleton"
import { Image } from "@/shared/ui/Image"
import { BackgroundPattern } from "@/shared/ui/BackgroundPattern"
import {
  Filter,
  X,
  Search,
  DoorOpen,
  Home,
  Settings,
  PanelLeft,
  Square,
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from "@/shared/ui/SEO"
import { productsApi } from "@/shared/api/products"
import type { Product } from "@/shared/api/products"
import { getCatalogPage, type CatalogPageData } from "@/shared/api/catalog"
import { generateProductSlug } from "@/shared/lib/slug"
import {
  formatProductCategoryCaption,
  formatProductSubcategoriesLine,
} from '@/shared/lib/formatProductCatalogLabels'
import { cn } from '@/shared/lib/utils'

const iconMap: Record<string, any> = {
  'DoorOpen': DoorOpen,
  'Home': Home,
  'Settings': Settings,
  'PanelLeft': PanelLeft,
  'Square': Square,
}

function filterRowSelectedClass(active: boolean, extra?: string, opts?: { inFlexRow?: boolean }) {
  return cn(
    opts?.inFlexRow ? 'flex-1 min-w-0' : 'w-full min-w-0',
    'rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150',
    active
      ? 'bg-primary/15 text-primary font-semibold'
      : 'text-foreground hover:bg-muted/35',
    extra
  )
}

/** Кнопки «Сбросить» в панели: подчёркивание при наведении, без заливки */
const filterDrawerResetLinkClass =
  'text-sm text-primary cursor-pointer bg-transparent underline-offset-4 decoration-primary/60 hover:underline'

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
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  /** Подкатегории видны только после клика по родителю; по умолчанию свёрнуто */
  const [expandedCategorySubs, setExpandedCategorySubs] = useState<Record<string, boolean>>({})
  /** Раскрытие блока каталог / материал / цвет по умолчанию: только «Каталог» */
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

  /** Категория без подкатегорий: включаем/выключаем фильтр по категории */
  const toggleLeafCatalogCategoryFilter = (catId: string) => {
    const subsOfCat = categoriesList.find((c) => c.id === catId)?.subcategories ?? []
    if (subsOfCat.length > 0) return

    const isSelected = selectedCategories.includes(catId)
    if (isSelected) {
      setSelectedCategories((prev) => prev.filter((id) => id !== catId))
      return
    }

    setExpandedSections((sec) => ({ ...sec, catalog: true }))
    setSelectedCategories((prev) => [...prev, catId])
  }

  /** Родитель с подкатегориями: клик — открыть/закрыть список. Каталог: можно включить несколько категорий; при первом добавлении категории её подварианты из фильтра снимаются (весь класс целиком); при сворачивании списка фильтр и подсветка по этой ветке сбрасываются. */
  const toggleParentCategoryOpenAndFilter = (catId: string) => {
    const cat = categoriesList.find((c) => c.id === catId)
    const subs = cat?.subcategories ?? []
    if (subs.length === 0) {
      toggleLeafCatalogCategoryFilter(catId)
      return
    }

    const subIdsSet = new Set(subs.map((s) => s.id))
    const wasOpen = expandedCategorySubs[catId] ?? false
    setExpandedSections((sec) => ({ ...sec, catalog: true }))

    if (!wasOpen) {
      setExpandedCategorySubs((prev) => ({ ...prev, [catId]: true }))
      const alreadySelected = selectedCategories.includes(catId)
      setSelectedCategories((prev) => (alreadySelected ? prev : [...prev, catId]))
      if (!alreadySelected) {
        setSelectedSubcategories((prev) => prev.filter((sid) => !subIdsSet.has(sid)))
      }
      return
    }

    setExpandedCategorySubs((prev) => ({ ...prev, [catId]: false }))
    // При сворачивании блока подкатегорий убираем подсветку и сам фильтр по этой ветке
    setSelectedCategories((prev) => prev.filter((id) => id !== catId))
    setSelectedSubcategories((prev) => prev.filter((sid) => !subIdsSet.has(sid)))
  }

  const toggleCatalogSubcategory = (subId: string, categoryId: string) => {
    setSelectedSubcategories((prev) => {
      const adding = !prev.includes(subId)
      const next = adding ? [...prev, subId] : prev.filter((id) => id !== subId)

      if (adding) {
        setExpandedSections((s) => ({ ...s, catalog: true }))
        setSelectedCategories((cats) =>
          cats.includes(categoryId) ? cats : [...cats, categoryId]
        )
      } else {
        // После снятия всех подкатегорий родительская категория остаётся в фильтре (режим «вся категория»), как после «Сбросить» у строки категории
      }

      return next
    })
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
    setExpandedCategorySubs({})
    setSelectedMaterials([])
    setSelectedColors([])
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setCurrentPage(1)
  }

  const resetColorSectionFilters = useCallback(() => {
    setSelectedColors([])
  }, [])

  const resetCatalogSectionFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedSubcategories([])
    setExpandedCategorySubs({})
  }, [])

  const resetMaterialSectionFilters = useCallback(() => {
    setSelectedMaterials([])
  }, [])

  const catalogSectionHasSelection =
    selectedCategories.length > 0 || selectedSubcategories.length > 0

  const resetSubcategoriesForCategory = useCallback(
    (categoryId: string) => {
      const subsOfCat = categoriesList.find((c) => c.id === categoryId)?.subcategories ?? []
      const subIdsSet = new Set(subsOfCat.map((s) => s.id))
      setSelectedSubcategories((prev) => prev.filter((sid) => !subIdsSet.has(sid)))
      // Родительская категория остаётся в фильтре (показываются все товары категории), сбрасываются только подпункты
      setSelectedCategories((cats) =>
        cats.includes(categoryId) ? cats : [...cats, categoryId]
      )
      setExpandedCategorySubs((prev) => ({ ...prev, [categoryId]: true }))
      setExpandedSections((s) => ({ ...s, catalog: true }))
    },
    [categoriesList]
  )

  const selectedCount =
    selectedCategories.length +
    selectedSubcategories.length +
    selectedMaterials.length +
    selectedColors.length

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    const categoryIdsRefinedBySub = new Set<string>()
    if (selectedSubcategories.length > 0) {
      for (const sid of selectedSubcategories) {
        const parent = categoriesList.find((c) => c.subcategories?.some((s) => s.id === sid))
        if (parent) categoryIdsRefinedBySub.add(parent.id)
      }
    }

    return products.filter(product => {
      if (
        debouncedSearchQuery &&
        !`${product.name} ${product.material}`
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      ) return false
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) return false
      if (
        selectedSubcategories.length > 0 &&
        categoryIdsRefinedBySub.has(product.category)
      ) {
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
  }, [
    products,
    debouncedSearchQuery,
    selectedCategories,
    selectedSubcategories,
    selectedMaterials,
    selectedColors,
    categoriesList,
  ])

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Сброс на первую страницу при изменении фильтров
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, selectedCategories, selectedSubcategories, selectedMaterials, selectedColors])

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
                  className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l border-border/25 shadow-none overflow-y-auto"
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
                          className={filterDrawerResetLinkClass}
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

                  <div className="p-4 space-y-0">
                    {/* Категории каталога */}
                    <div className="border-b border-border/25 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center gap-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleSection('catalog')}
                          className="flex min-h-10 min-w-0 flex-1 items-center px-2 py-2 text-left transition-colors hover:bg-muted/30 rounded-lg cursor-pointer"
                          aria-expanded={expandedSections.catalog}
                          aria-label={
                            expandedSections.catalog ? 'Свернуть раздел Каталог' : 'Развернуть раздел Каталог'
                          }
                        >
                          <span className="truncate font-medium text-primary">Каталог</span>
                        </button>
                        {catalogSectionHasSelection ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              resetCatalogSectionFilters()
                            }}
                            className={cn(filterDrawerResetLinkClass, 'shrink-0')}
                          >
                            Сбросить
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggleSection('catalog')}
                          className={cn(
                            'inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/30 cursor-pointer'
                          )}
                          aria-expanded={expandedSections.catalog}
                          aria-label={
                            expandedSections.catalog ? 'Свернуть раздел Каталог' : 'Развернуть раздел Каталог'
                          }
                        >
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 transition-transform duration-200',
                              expandedSections.catalog && 'rotate-180'
                            )}
                          />
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {expandedSections.catalog && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-3 pl-1 pr-1">
                              {categoriesList.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-2">
                                  Загрузка категорий…
                                </p>
                              ) : (
                                categoriesList.map((cat) => {
                                  const IconComponent = iconMap[cat.icon]
                                  const IconEl =
                                    IconComponent && typeof IconComponent !== 'string' ? (
                                      <IconComponent className="w-4 h-4 shrink-0 opacity-70" />
                                    ) : null
                                  const subs = cat.subcategories ?? []
                                  const catSelected = selectedCategories.includes(cat.id)
                                  const subsPanelOpen = subs.length > 0 && (expandedCategorySubs[cat.id] ?? false)
                                  const isLeafCategory = subs.length === 0
                                  /** Подсветка строки категории: лист или выбрана целиком / по подпунктам */
                                  const catalogRowFiltersActive =
                                    subs.length === 0
                                      ? catSelected
                                      : catSelected || subs.some((s) => selectedSubcategories.includes(s.id))

                                  const categoryHasCatalogFilter =
                                    subs.length > 0 &&
                                    (catSelected ||
                                      subs.some((s) => selectedSubcategories.includes(s.id)))
                                  /** «Сбросить» только при выбранных подпунктах; если выбрана только родительская категория — без кнопки */
                                  const categoryShowResetSubs =
                                    subs.some((s) => selectedSubcategories.includes(s.id))

                                  return (
                                    <div key={cat.id} className="overflow-hidden rounded-lg space-y-0.5">
                                      <div className="relative z-10 flex min-w-0 items-stretch gap-2 rounded-lg bg-background">
                                        <button
                                          type="button"
                                          aria-expanded={isLeafCategory ? undefined : subsPanelOpen}
                                          onClick={() =>
                                            isLeafCategory
                                              ? toggleLeafCatalogCategoryFilter(cat.id)
                                              : toggleParentCategoryOpenAndFilter(cat.id)
                                          }
                                          className={filterRowSelectedClass(
                                            catalogRowFiltersActive,
                                            'flex min-h-[2.75rem] min-w-0 flex-1 items-center gap-2',
                                            {
                                              inFlexRow: categoryHasCatalogFilter,
                                            }
                                          )}
                                        >
                                          {IconEl && (
                                            <span
                                              className={
                                                catalogRowFiltersActive
                                                  ? 'text-primary opacity-90'
                                                  : 'text-primary/70'
                                              }
                                            >
                                              {IconEl}
                                            </span>
                                          )}
                                          <span className="truncate">{cat.name}</span>
                                        </button>
                                        {categoryShowResetSubs ? (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault()
                                              e.stopPropagation()
                                              resetSubcategoriesForCategory(cat.id)
                                            }}
                                            className={cn(filterDrawerResetLinkClass, 'shrink-0 self-center')}
                                          >
                                            Сбросить
                                          </button>
                                        ) : null}
                                      </div>
                                      {subs.length > 0 ? (
                                        <AnimatePresence initial={false}>
                                          {subsPanelOpen ? (
                                            <motion.div
                                              key={`subs-${cat.id}`}
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{
                                                duration: 0.32,
                                                ease: [0.4, 0, 0.2, 1],
                                              }}
                                              className="overflow-hidden"
                                            >
                                              <div className="pl-2 pt-1 sm:pl-4 space-y-0.5">
                                                {subs.map((sub) => {
                                                  const subSel =
                                                    selectedSubcategories.includes(sub.id)
                                                  return (
                                                    <button
                                                      key={sub.id}
                                                      type="button"
                                                      onClick={() =>
                                                        toggleCatalogSubcategory(sub.id, cat.id)
                                                      }
                                                      className={filterRowSelectedClass(subSel)}
                                                    >
                                                      {sub.name}
                                                    </button>
                                                  )
                                                })}
                                              </div>
                                            </motion.div>
                                          ) : null}
                                        </AnimatePresence>
                                      ) : null}
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
                    <div className="border-b border-border/25 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center gap-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleSection('material')}
                          className="flex min-h-10 min-w-0 flex-1 items-center px-2 py-2 text-left transition-colors hover:bg-muted/30 rounded-lg cursor-pointer"
                          aria-expanded={expandedSections.material}
                          aria-label={
                            expandedSections.material ? 'Свернуть раздел Материал' : 'Развернуть раздел Материал'
                          }
                        >
                          <span className="truncate font-medium text-primary">Материал</span>
                        </button>
                        {selectedMaterials.length > 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              resetMaterialSectionFilters()
                            }}
                            className={cn(filterDrawerResetLinkClass, 'shrink-0')}
                          >
                            Сбросить
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggleSection('material')}
                          className={cn(
                            'inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/30 cursor-pointer'
                          )}
                          aria-expanded={expandedSections.material}
                          aria-label={
                            expandedSections.material ? 'Свернуть раздел Материал' : 'Развернуть раздел Материал'
                          }
                        >
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 transition-transform duration-200',
                              expandedSections.material && 'rotate-180'
                            )}
                          />
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {expandedSections.material && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-0.5 pl-1 pr-1">
                              {materials.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-1">
                                  Нет материалов в каталоге (настройте в админке).
                                </p>
                              ) : (
                                materials.map((mat) => {
                                  const sel = selectedMaterials.includes(mat)
                                  return (
                                    <button
                                      key={mat}
                                      type="button"
                                      onClick={() => toggleMaterial(mat)}
                                      className={filterRowSelectedClass(sel)}
                                    >
                                      {mat}
                                    </button>
                                  )
                                })
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Цвет */}
                    <div className="border-b border-border/25 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex items-center gap-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleSection('color')}
                          className="flex min-h-10 min-w-0 flex-1 items-center px-2 py-2 text-left transition-colors hover:bg-muted/30 rounded-lg cursor-pointer"
                          aria-expanded={expandedSections.color}
                          aria-label={expandedSections.color ? 'Свернуть раздел Цвет' : 'Развернуть раздел Цвет'}
                        >
                          <span className="truncate font-medium text-primary">Цвет</span>
                        </button>
                        {selectedColors.length > 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              resetColorSectionFilters()
                            }}
                            className={cn(filterDrawerResetLinkClass, 'shrink-0')}
                          >
                            Сбросить
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggleSection('color')}
                          className={cn(
                            'inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/30 cursor-pointer'
                          )}
                          aria-expanded={expandedSections.color}
                          aria-label={expandedSections.color ? 'Свернуть раздел Цвет' : 'Развернуть раздел Цвет'}
                        >
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 transition-transform duration-200',
                              expandedSections.color && 'rotate-180'
                            )}
                          />
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {expandedSections.color && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 px-1 pb-1">
                              {colors.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-2 py-1">
                                  Нет цветов в каталоге (настройте в админке).
                                </p>
                              ) : (
                                <div className="grid grid-cols-3 gap-2">
                                  {colors.map((color) => {
                                    const sel = selectedColors.includes(color.name)
                                    return (
                                      <button
                                        key={color.id ?? color.name}
                                        type="button"
                                        onClick={() => toggleColor(color.name)}
                                        className={cn(
                                          'flex flex-col items-center gap-2 rounded-xl py-2.5 px-1 transition-colors duration-150',
                                          sel ? 'bg-primary/12' : 'hover:bg-muted/35'
                                        )}
                                      >
                                        <span
                                          className={cn(
                                            'w-10 h-10 rounded-full transition-transform duration-150',
                                            sel ? 'scale-105 brightness-105' : 'opacity-85'
                                          )}
                                          style={{
                                            backgroundColor: color.color,
                                          }}
                                          aria-hidden
                                        />
                                        <span
                                          className={cn(
                                            'text-xs transition-colors truncate max-w-full px-1',
                                            sel ? 'text-primary font-medium' : 'text-muted-foreground'
                                          )}
                                        >
                                          {color.name}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* Кнопка применения */}
                  <div className="sticky bottom-0 bg-background border-t border-border/20 pt-3 pb-4 px-4">
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
              paginatedProducts.map((product) => {
                const subcatsLine = formatProductSubcategoriesLine(
                  catalogData,
                  product.category,
                  product.subcategoryIds
                )
                const hasSubcats = subcatsLine !== '—'
                const categoryLabel =
                  catalogData?.categories.find((c) => c.id === product.category)?.name?.trim() ||
                  product.category ||
                  ''

                return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/catalog/${product.slug}-${product.id}`)}
                  className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    viewMode === 'list' ? 'flex' : 'flex flex-col h-full'
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
                  <div className="p-4 flex flex-col flex-1 min-h-0">
                    <div className="flex min-h-0 flex-1 flex-col">
                      <h3 className="font-medium text-primary mb-2 line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      {categoryLabel ? (
                        <p className="mb-1 line-clamp-1 text-sm text-muted-foreground">
                          {formatProductCategoryCaption(categoryLabel)}
                        </p>
                      ) : null}
                      {hasSubcats ? (
                        <p
                          className="text-sm text-muted-foreground mb-1 line-clamp-2"
                          title={subcatsLine}
                        >
                          {subcatsLine}
                        </p>
                      ) : null}
                      <p className="mb-4 text-sm text-muted-foreground">
                        <span>{product.material}</span>
                        {product.color.trim() ? (
                          <>
                            <span className="mx-1.5 text-border">·</span>
                            <span>{product.color}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
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
                      className="tap-click mt-auto w-full shrink-0 py-3 px-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Узнать цену
                    </button>
                  </div>
                </div>
                )
              })
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
