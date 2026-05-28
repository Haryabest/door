import { useCallback, useState } from 'react'
import { Save, Plus, Trash2, MapPin } from 'lucide-react'
import type {
  ContactFormBlock,
  ContactsPageData,
  GeneralInfoBlock,
  LocationItem,
} from '@/shared/api/contacts'
import { geocodeAddress } from '@/shared/api/geocode'

interface ContactsPageEditorProps {
  data: ContactsPageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onUpdateAddress: (value: string) => void
  onUpdateContactForm: <K extends keyof ContactFormBlock>(field: K, value: ContactFormBlock[K]) => void
  onUpdateGeneralInfo: <K extends keyof GeneralInfoBlock>(field: K, value: GeneralInfoBlock[K]) => void
  onAddGeneralInfoPhone: () => void
  onUpdateGeneralInfoPhone: (id: number, field: 'label' | 'value', value: string) => void
  onDeleteGeneralInfoPhone: (id: number) => void
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
  onUpdateAddress,
  onUpdateContactForm,
  onUpdateGeneralInfo,
  onAddGeneralInfoPhone,
  onUpdateGeneralInfoPhone,
  onDeleteGeneralInfoPhone,
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
        setGeocodeHint((h) => ({ ...h, [locationId]: 'Заполните город (ниже) и адрес магазина' }))
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

      {/* Блок «Свяжитесь с нами» */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-primary">Свяжитесь с нами</h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Заголовок блока</label>
          <input
            type="text"
            value={data.contactForm.title}
            onChange={(e) => onUpdateContactForm('title', e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подпись поля «Имя»</label>
            <input
              type="text"
              value={data.contactForm.nameLabel}
              onChange={(e) => onUpdateContactForm('nameLabel', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подсказка в поле «Имя»</label>
            <input
              type="text"
              value={data.contactForm.namePlaceholder}
              onChange={(e) => onUpdateContactForm('namePlaceholder', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подпись поля «Телефон»</label>
            <input
              type="text"
              value={data.contactForm.phoneLabel}
              onChange={(e) => onUpdateContactForm('phoneLabel', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подсказка в поле «Телефон»</label>
            <input
              type="text"
              value={data.contactForm.phonePlaceholder}
              onChange={(e) => onUpdateContactForm('phonePlaceholder', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подпись поля «Email»</label>
            <input
              type="text"
              value={data.contactForm.emailLabel}
              onChange={(e) => onUpdateContactForm('emailLabel', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подсказка в поле «Email»</label>
            <input
              type="text"
              value={data.contactForm.emailPlaceholder}
              onChange={(e) => onUpdateContactForm('emailPlaceholder', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подпись поля «Сообщение»</label>
            <input
              type="text"
              value={data.contactForm.messageLabel}
              onChange={(e) => onUpdateContactForm('messageLabel', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подсказка в поле «Сообщение»</label>
            <input
              type="text"
              value={data.contactForm.messagePlaceholder}
              onChange={(e) => onUpdateContactForm('messagePlaceholder', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Текст кнопки отправки</label>
            <input
              type="text"
              value={data.contactForm.submitButton}
              onChange={(e) => onUpdateContactForm('submitButton', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Текст кнопки при отправке</label>
            <input
              type="text"
              value={data.contactForm.submittingButton}
              onChange={(e) => onUpdateContactForm('submittingButton', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Сообщение об успешной отправке</label>
          <textarea
            value={data.contactForm.successMessage}
            onChange={(e) => onUpdateContactForm('successMessage', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground resize-none"
          />
        </div>
      </div>

      {/* Блок «Общая информация» */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-primary">Общая информация</h3>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Заголовок блока</label>
          <input
            type="text"
            value={data.generalInfo.title}
            onChange={(e) => onUpdateGeneralInfo('title', e.target.value)}
            autoComplete="off"
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-foreground">Телефоны</label>
            <button
              type="button"
              onClick={onAddGeneralInfoPhone}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>
          <div className="space-y-3">
            {data.generalInfo.phones.map((phone) => (
              <div key={phone.id} className="flex items-start gap-3 p-3 border-2 border-border rounded-lg">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={phone.label}
                    onChange={(e) => onUpdateGeneralInfoPhone(phone.id, 'label', e.target.value)}
                    placeholder="Подпись"
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={phone.value}
                    onChange={(e) => onUpdateGeneralInfoPhone(phone.id, 'value', e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteGeneralInfoPhone(phone.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Ссылка tel: подставляется из номера автоматически.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подпись Email</label>
            <input
              type="text"
              value={data.generalInfo.emailLabel}
              onChange={(e) => onUpdateGeneralInfo('emailLabel', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              value={data.generalInfo.email}
              onChange={(e) => onUpdateGeneralInfo('email', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Подпись режима работы</label>
            <input
              type="text"
              value={data.generalInfo.workHoursLabel}
              onChange={(e) => onUpdateGeneralInfo('workHoursLabel', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Режим работы</label>
            <input
              type="text"
              value={data.generalInfo.workHours}
              onChange={(e) => onUpdateGeneralInfo('workHours', e.target.value)}
              autoComplete="off"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary bg-white text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Город для геокодирования */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Город</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => onUpdateAddress(e.target.value)}
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
