import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type FilterType = 'today' | 'yesterday' | 'week' | 'month' | 'custom'

interface ReportFiltersProps {
  onFilterChange: (range: { startDate: string; endDate: string }) => void
}

// Función auxiliar robusta para formatear fecha a YYYY-MM-DD
// Evita problemas de zona horaria y localización
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('today')

  // Usamos la función segura para inicializar
  const todayStr = formatDate(new Date())
  const [dateRange, setDateRange] = useState({ start: todayStr, end: todayStr })

  useEffect(() => {
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch (activeFilter) {
      case 'today':
        // Start y End son hoy
        break
      case 'yesterday':
        start.setDate(today.getDate() - 1)
        end.setDate(today.getDate() - 1)
        break
      case 'week':
        // Últimos 7 días
        start.setDate(today.getDate() - 6)
        break
      case 'month':
        // Primer día del mes actual
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case 'custom':
        // No modificamos automáticamente
        return
    }

    const newRange = { start: formatDate(start), end: formatDate(end) }
    setDateRange(newRange)

    // Notificamos al padre
    onFilterChange({ startDate: newRange.start, endDate: newRange.end })
  }, [activeFilter])

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange, [type]: value }
    setDateRange(newRange)

    if (activeFilter === 'custom') {
      onFilterChange({ startDate: newRange.start, endDate: newRange.end })
    }
  }

  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 w-full">
      <div className="flex flex-wrap items-center gap-2">
        <FilterButton
          label="Hoy"
          isActive={activeFilter === 'today'}
          onClick={() => setActiveFilter('today')}
        />
        <FilterButton
          label="Ayer"
          isActive={activeFilter === 'yesterday'}
          onClick={() => setActiveFilter('yesterday')}
        />
        <FilterButton
          label="Últimos 7 días"
          isActive={activeFilter === 'week'}
          onClick={() => setActiveFilter('week')}
        />
        <FilterButton
          label="Este Mes"
          isActive={activeFilter === 'month'}
          onClick={() => setActiveFilter('month')}
        />
        <FilterButton
          label="Personalizado"
          isActive={activeFilter === 'custom'}
          onClick={() => setActiveFilter('custom')}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto bg-muted/40 p-1.5 rounded-lg border border-border/50 animate-in fade-in slide-in-from-right-4">
        <div className="h-8 w-8 rounded-md bg-card flex items-center justify-center border shadow-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleCustomDateChange('start', e.target.value)}
            disabled={activeFilter !== 'custom'}
            className="h-8 w-32 text-xs bg-card border-input focus:border-primary shadow-sm"
          />
          <span className="text-muted-foreground text-xs">
            <ArrowRight className="h-3 w-3" />
          </span>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleCustomDateChange('end', e.target.value)}
            disabled={activeFilter !== 'custom'}
            className="h-8 w-32 text-xs bg-card border-input focus:border-primary shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}

function FilterButton({
  label,
  isActive,
  onClick
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={cn(
        'h-8 px-3 text-xs font-medium transition-all shadow-sm',
        isActive
          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md ring-1 ring-primary ring-offset-1'
          : 'text-muted-foreground hover:text-foreground hover:border-primary/50 bg-card border-border'
      )}
    >
      {label}
    </Button>
  )
}
