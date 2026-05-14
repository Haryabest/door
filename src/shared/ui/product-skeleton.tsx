export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Изображение */}
      <div className="aspect-[3/4] bg-gray-200" />
      
      {/* Информация */}
      <div className="p-4 space-y-3">
        {/* Название */}
        <div className="h-6 bg-gray-200 rounded w-full" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />

        {/* Материал */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        {/* Кнопка */}
        <div className="h-12 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  )
}
