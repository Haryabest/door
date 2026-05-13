import { useCallback, useState } from 'react'
import { Save, Plus, Trash2, MapPin } from 'lucide-react'
import type { ContactsPageData, LocationItem } from '@/shared/api/contacts'
import { geocodeAddress } from '@/shared/api/geocode'

interface ContactsPageEditorProps {
  data: ContactsPageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onUpdateGeneral: (field: 'phone' | 'email' | 'workHours' | 'address', value: string) => void
  onAddLocation: () => void
  onUpdateLocation: (id: number, field: keyof LocationItem, value: string) => void
  onUpdateLocationCoords: (id: number, coordIndex: 0 | 1, value: string) => void
  onSetLocationCoords: (id: number, coords: [number, number]) => void
  onDeleteLocation: (id: number) => void
}

export function ContactsPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onUpdateGeneral,
  onAddLocation,
  onUpdateLocation,
  onUpdateLocationCoords,
  onSetLocationCoords,
  onDeleteLocation,
}: ContactsPageEditorProps) {
  const [geocodingId, setGeocodingId] = useState<number | null>(null)
  const [geocodeHint, setGeocodeHint] = useState<Record<number, string>>({})

  const buildGeocodeQuery = useCallback(
    (location: LocationItem) => {
      const parts = [data.address?.trim(), location.address?.trim()].filter(Boolean)
      return parts.join(', ')
    },
    [data.address]
  )

  const resolveCoordsForLocation = useCallback(
    async (locationId: number) => {
      const location = data.locations.find((l) => l.id === locationId)
      if (!location) return
      const q = buildGeocodeQuery(location)
      if (q.length < 4) {
        setGeocodeHint((h) => ({ ...h, [locationId]: 'Заполните город (выше) и адрес магазина' }))
        return
      }
      setGeocodeHint((h) => {
        const next = { ...h }
        delete next[locationId]
        return next
      })
      setGeocodingId(locationId)
      const res = await geocodeAddress(q)
      setGeocodingId(null)
      if (res) {
        onSetLocationCoords(locationId, [res.lat, res.lng])
      } else {
        setGeocodeHint((h) => ({
          ...h,
          [locationId]:
            'Не удалось найти координаты. Уточните адрес или введите широту и долготу вручную.',
        }))
      }
    },
    [data.locations, buildGeocodeQuery, onSetLocationCoords]
  )

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Редактирование страницы "Контакты"</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Общая информация */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Телефон</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => onUpdateGeneral('phone', e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onUpdateGeneral('email', e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Режим работы</label>
          <input
            type="text"
            value={data.workHours}
            onChange={(e) => onUpdateGeneral('workHours', e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Город</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => onUpdateGeneral('address', e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Учитывается вместе с адресом магазина при автоподстановке координат на карте (страница
            контактов).
          </p>
        </div>
      </div>

      {/* Локации */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Наши магазины на карте</h3>
          <button
            type="button"
            onClick={onAddLocation}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-4">
          {data.locations.map((location) => (
            <div key={location.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={location.name}
                  onChange={(e) => onUpdateLocation(location.id, 'name', e.target.value)}
                  placeholder="Название точки"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => onUpdateLocation(location.id, 'address', e.target.value)}
                  onBlur={() => void resolveCoordsForLocation(location.id)}
                  placeholder="Адрес магазина (улица, дом)"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                />
                {geocodeHint[location.id] && (
                  <p className="text-xs text-amber-700">{geocodeHint[location.id]}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={location.phone}
                    onChange={(e) => onUpdateLocation(location.id, 'phone', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={location.hours}
                    onChange={(e) => onUpdateLocation(location.id, 'hours', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <input
                      type="text"
                      value={String(location.coords[0] ?? '')}
                      onChange={(e) => onUpdateLocationCoords(location.id, 0, e.target.value)}
                      placeholder="Широта (lat)"
                      className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={String(location.coords[1] ?? '')}
                      onChange={(e) => onUpdateLocationCoords(location.id, 1, e.target.value)}
                      placeholder="Долгота (lng)"
                      className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={geocodingId === location.id}
                    onClick={() => void resolveCoordsForLocation(location.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 shrink-0"
                  >
                    <MapPin className="w-4 h-4" />
                    {geocodingId === location.id ? 'Поиск…' : 'По адресу'}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDeleteLocation(location.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
