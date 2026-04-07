import { Save, Plus, Trash2, Clock, Users, Award, ThumbsUp, Star, Shield, Headphones, Truck, type LucideIcon } from 'lucide-react'
import type { AboutPageData, StatItem, AdvantageItem } from '@/shared/api/about'

const statIconOptions: Array<{ value: StatItem['icon']; Icon: LucideIcon }> = [
  { value: 'Clock', Icon: Clock },
  { value: 'Users', Icon: Users },
  { value: 'Award', Icon: Award },
  { value: 'ThumbsUp', Icon: ThumbsUp },
]

const advantageIconOptions: Array<{ value: AdvantageItem['icon']; Icon: LucideIcon }> = [
  { value: 'Star', Icon: Star },
  { value: 'Shield', Icon: Shield },
  { value: 'Headphones', Icon: Headphones },
  { value: 'Award', Icon: Award },
  { value: 'Users', Icon: Users },
  { value: 'Truck', Icon: Truck },
]

interface AboutPageEditorProps {
  data: AboutPageData
  isLoading: boolean
  isSaving: boolean
  onSave: () => void
  onAddStat: () => void
  onUpdateStat: (id: number, field: keyof StatItem, value: string) => void
  onDeleteStat: (id: number) => void
  onAddAdvantage: () => void
  onUpdateAdvantage: (id: number, field: keyof AdvantageItem, value: string) => void
  onDeleteAdvantage: (id: number) => void
}

export function AboutPageEditor({
  data,
  isLoading,
  isSaving,
  onSave,
  onAddStat,
  onUpdateStat,
  onDeleteStat,
  onAddAdvantage,
  onUpdateAdvantage,
  onDeleteAdvantage,
}: AboutPageEditorProps) {
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
        <h2 className="text-xl font-bold text-primary">Редактирование страницы "О нас"</h2>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Основная информация */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Заголовок</label>
          <input
            type="text"
            value={data.aboutTitle}
            onChange={() => {}}
            readOnly
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Описание</label>
          <textarea
            value={data.aboutDescription}
            onChange={() => {}}
            readOnly
            rows={6}
            className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary resize-none"
          />
        </div>
      </div>

      {/* Статистика */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Статистика</h3>
          <button
            onClick={onAddStat}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.stats.map((stat) => (
            <div key={stat.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => onUpdateStat(stat.id, 'value', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Значение"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => onUpdateStat(stat.id, 'label', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Описание"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {statIconOptions.map(({ value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      title={value}
                      onClick={() => onUpdateStat(stat.id, 'icon', value)}
                      className={`flex items-center justify-center px-3 py-2 border-2 rounded-lg transition-colors ${
                        stat.icon === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onDeleteStat(stat.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Преимущества */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Преимущества</h3>
          <button
            onClick={onAddAdvantage}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>
        <div className="space-y-4">
          {data.advantages.map((advantage) => (
            <div key={advantage.id} className="flex items-start gap-4 p-4 border-2 border-border rounded-lg">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={advantage.title}
                  onChange={(e) => onUpdateAdvantage(advantage.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Заголовок"
                />
                <textarea
                  value={advantage.description}
                  onChange={(e) => onUpdateAdvantage(advantage.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                  rows={2}
                  placeholder="Описание"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {advantageIconOptions.map(({ value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      title={value}
                      onClick={() => onUpdateAdvantage(advantage.id, 'icon', value)}
                      className={`flex items-center justify-center px-3 py-2 border-2 rounded-lg transition-colors ${
                        advantage.icon === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onDeleteAdvantage(advantage.id)}
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
