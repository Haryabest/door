import { useState, useMemo } from 'react'
import { Header } from "@/widgets/Header"
import { Footer } from "@/widgets/Footer"
import { Checkbox } from "@/shared/ui/checkbox"
import { AccordionItem } from "@/shared/ui/accordion"
import { Filter, X, Search, ChevronRight, DoorOpen, Home, Settings, PanelLeft, Square } from 'lucide-react'

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
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all')
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const products = [
    { id: 1, name: "Дверь Классик", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400", category: "interior", subcategory: "pvh", material: "ПВХ", color: "Белый", price: 15900 },
    { id: 2, name: "Дверь Модерн", image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=400", category: "interior", subcategory: "emal", material: "Эмаль", color: "Серый", price: 18500 },
    { id: 3, name: "Дверь Лофт", image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400", category: "interior", subcategory: "ecoshpon", material: "Экошпон", color: "Коричневый", price: 21000 },
    { id: 4, name: "Дверь Сканди", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400", category: "interior", subcategory: "massiv", material: "Массив", color: "Белый", price: 17200 },
    { id: 5, name: "Дверь Неоклассика", image: "https://images.unsplash.com/photo-1506306465497-6a840848fcab?w=400", category: "interior", subcategory: "emal", material: "Эмаль", color: "Бежевый", price: 24900 },
    { id: 6, name: "Дверь Хай-тек", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", category: "interior", subcategory: "pvh", material: "ПВХ", color: "Чёрный", price: 26500 },
    { id: 7, name: "Дверь Прованс", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400", category: "interior", subcategory: "massiv", material: "Натуральный шпон", color: "Бежевый", price: 19800 },
    { id: 8, name: "Дверь Минимализм", image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=400", category: "interior", subcategory: "ecoshpon", material: "Экошпон", color: "Серый", price: 22300 },
    { id: 9, name: "Дверь Арт-деко", image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400", category: "interior", subcategory: "emal", material: "Эмаль", color: "Венге", price: 31500 },
    { id: 10, name: "Дверь Эко", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400", category: "interior", subcategory: "ecoshpon", material: "Экошпон", color: "Белый", price: 16700 },
    { id: 11, name: "Дверь Стандарт", image: "https://images.unsplash.com/photo-1506306465497-6a840848fcab?w=400", category: "interior", subcategory: "pvh", material: "ПВХ", color: "Бежевый", price: 12900 },
    { id: 12, name: "Дверь Люкс", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", category: "interior", subcategory: "massiv", material: "Массив дуба", color: "Венге", price: 45900 },
  ]

  const materials = ["ПВХ", "Эмаль", "Экошпон", "Массив", "Натуральный шпон"]
  const colors = [
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
  }

  const selectedCount = selectedMaterials.length + selectedColors.length + (selectedCategory !== 'all' ? 1 : 0)

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Поиск по названию
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Фильтр по категории
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false
      }
      // Фильтр по подкатегории
      if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
        return false
      }
      // Фильтр по материалу
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(product.material)) {
        return false
      }
      // Фильтр по цвету
      if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
        return false
      }
      // Фильтр по цене
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }
      return true
    })
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedMaterials, selectedColors, priceRange])

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
      <Header />
      <main className="flex-1 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Фильтры - десктоп */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold text-primary">Фильтры</h2>
                    </div>
                    {selectedCount > 0 && (
                      <button 
                        onClick={resetFilters}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Сбросить
                      </button>
                    )}
                  </div>

                  {/* Категории каталога */}
                  <div className="space-y-2 mb-6">
                    <h3 className="font-medium text-primary">Каталог</h3>
                    <nav className="space-y-1">
                      {catalogCategories.map((cat) => (
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
                              <cat.icon className="w-4 h-4" />
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
                            <div className="ml-6 mt-1 space-y-1">
                              {cat.subcategories.map((subcat) => (
                                <button
                                  key={subcat.id}
                                  onClick={() => toggleSubcategory(subcat.id)}
                                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                    selectedSubcategory === subcat.id
                                      ? 'bg-primary/20 text-primary font-medium'
                                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                  }`}
                                >
                                  {subcat.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </nav>
                  </div>

                  {/* Аккордеон фильтров */}
                  <div className="space-y-1">
                    <AccordionItem title="Материал">
                      <div className="space-y-2">
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
                    </AccordionItem>

                    <AccordionItem title="Цвет">
                      <div className="space-y-3">
                        {colors.map((color) => (
                          <label key={color.name} className="flex items-center gap-3 cursor-pointer group">
                            <button
                              type="button"
                              onClick={() => toggleColor(color.name)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
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
                                <svg className="w-3 h-3 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <polyline points="20 6 9 17 4 12" strokeWidth="3" />
                                </svg>
                              )}
                            </button>
                            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{color.name}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionItem>

                    <AccordionItem title="Цена">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="От"
                          />
                          <span className="text-muted-foreground">—</span>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="До"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0 ₽</span>
                          <span>50 000 ₽</span>
                        </div>
                      </div>
                    </AccordionItem>
                  </div>
                </div>
              </div>
            </aside>

            {/* Основной контент */}
            <div className="flex-1">
              {/* Мобильная кнопка фильтров */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-border rounded-lg text-primary font-medium"
                >
                  <Filter className="w-5 h-5" />
                  Фильтры{selectedCount > 0 && ` (${selectedCount})`}
                </button>
              </div>

              {/* Мобильные фильтры */}
              {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
                  <div className="absolute right-0 top-0 h-full w-80 bg-background p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-primary">Фильтры</h2>
                      <button onClick={() => setShowFilters(false)} className="text-primary">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Копия фильтров для мобильных */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-primary mb-3">Категория</h3>
                        <div className="space-y-2">
                          {catalogCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => toggleCategory(cat.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                                selectedCategory === cat.id
                                  ? 'bg-primary text-background'
                                  : 'bg-white border border-border'
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Поиск и количество товаров */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск дверей..."
                    className="w-full pl-9 pr-4 py-2 border-2 border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Сетка товаров - фиксируем 4 колонки для стабильности */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Изображение */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Информация о товаре */}
                      <div className="p-4">
                        {/* Название */}
                        <h3 className="font-medium text-primary mb-2 line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        
                        {/* Материал */}
                        <p className="text-sm text-muted-foreground mb-4">
                          {product.material}
                        </p>

                        {/* Кнопка */}
                        <button className="w-full py-3 px-4 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity">
                          Узнать цену
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Пустое состояние - показываем невидимые карточки для сохранения структуры
                  <>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={`empty-${index}`} className="invisible">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                          <div className="aspect-[3/4] bg-gray-100" />
                          <div className="p-4">
                            <div className="h-6 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                            <div className="h-12 bg-gray-200 rounded-lg w-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Сообщение по центру */}
                    <div className="col-span-full flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <p className="text-xl text-muted-foreground mb-4">Товары не найдены</p>
                        <button 
                          onClick={resetFilters}
                          className="px-6 py-2 bg-primary text-background rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Сбросить фильтры
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {/* Добавляем пустые ячейки для стабильности сетки */}
                {paginatedProducts.length > 0 && paginatedProducts.length < 8 && (
                  <>
                    {Array.from({ length: 8 - paginatedProducts.length }).map((_, index) => (
                      <div key={`placeholder-${index}`} className="invisible">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                          <div className="aspect-[3/4] bg-gray-100" />
                          <div className="p-4">
                            <div className="h-6 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                            <div className="h-12 bg-gray-200 rounded-lg w-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
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
                    className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
