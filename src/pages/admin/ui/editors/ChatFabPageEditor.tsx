import { Save } from 'lucide-react'
import type { ChatWidgetData } from '@/shared/api/chatWidget'

interface ChatFabPageEditorProps {
  data: ChatWidgetData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onUpdateField: <K extends keyof ChatWidgetData>(field: K, value: ChatWidgetData[K]) => void
}

export function ChatFabPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onUpdateField,
}: ChatFabPageEditorProps) {
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
        <h2 className="text-xl font-bold text-primary">Кнопки связи (чат справа внизу)</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 max-w-xl">
        <p className="text-sm text-muted-foreground">
          Синяя кнопка открывает чат: рядом появляются анимированно телефон, Telegram и почта. При закрытии чата они
          скрываются. Укажите значения ниже — они сохраняются в базе.
        </p>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Телефон (для звонка)</label>
          <input
            type="text"
            value={data.phoneText}
            onChange={(e) => onUpdateField('phoneText', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="+7 (960) 166 30-30"
          />
          <p className="text-xs text-muted-foreground mt-1">Ссылка tel: формируется из номера автоматически.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Telegram</label>
          <input
            type="url"
            value={data.telegramUrl}
            onChange={(e) => onUpdateField('telegramUrl', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="https://t.me/username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Почта</label>
          <input
            type="email"
            value={data.emailText}
            onChange={(e) => onUpdateField('emailText', e.target.value)}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="info@example.ru"
          />
        </div>
      </div>
    </div>
  )
}
