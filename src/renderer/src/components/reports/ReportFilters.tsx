import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type FilterType = 'today' | 'yesterday' | 'week' | 'fortnight' | 'month' | 'custom'

export const FILTER_LABELS: Record<FilterType, string> = {
  today: 'Hoy',
  yesterday: 'Ayer',
  week: 'Esta Semana',
  fortnight: 'Quincena',
  month: 'Este Mes',
  custom: 'Personalizado'
}

export default function ReportFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('today')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })

  // Efecto para calcular las fechas cuando cambia el filtro
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
        end = new Date(start)
        break
      case 'week':
        // Asumimos Lunes como primer día
        const day = today.getDay()
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) // ajustar si es domingo
        start.setDate(diff)
        end.setDate(start.getDate() + 6)
        break
      case 'fortnight':
        // 1ra (1-15) o 2da (16-Fin)
        if (today.getDate() <= 15) {
          start.setDate(1)
          end.setDate(15)
        } else {
          start.setDate(16)
          end = new Date(today.getFullYear(), today.getMonth() + 1, 0) // Último día del mes
        }
        break
      case 'month':
        start.setDate(1)
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'custom':
        // No calculamos, dejamos que el usuario elija
        return
    }

    // Formateamos a YYYY-MM-DD para los inputs nativos
    setDateRange({
      start: formatDateInput(start),
      end: formatDateInput(end)
    })
  }, [activeFilter])

  // Helper para formato YYYY-MM-DD (requerido por input type="date")
  const formatDateInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Helper para formato legible (DD/MM/YYYY) para mostrar en texto
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 w-full">
      {/* Grupo de Botones */}
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
          label="Semana"
          isActive={activeFilter === 'week'}
          onClick={() => setActiveFilter('week')}
        />
        <FilterButton
          label="Quincena"
          isActive={activeFilter === 'fortnight'}
          onClick={() => setActiveFilter('fortnight')}
        />
        <FilterButton
          label="Mes"
          isActive={activeFilter === 'month'}
          onClick={() => setActiveFilter('month')}
        />
        <FilterButton
          label="Rango"
          isActive={activeFilter === 'custom'}
          onClick={() => setActiveFilter('custom')}
        />
      </div>

      {/* Visualización de Fechas (Siempre visible) */}
      <div className="flex items-center gap-3 ml-auto bg-muted/30 p-1.5 rounded-lg border animate-in fade-in slide-in-from-right-4">
        {/* Icono decorativo */}
        <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center border shadow-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Inputs o Texto */}
        {activeFilter === 'custom' ? (
          // MODO EDICIÓN: Inputs activos
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="h-8 w-32 text-xs bg-background"
            />
            <span className="text-muted-foreground text-xs">
              <ArrowRight className="h-3 w-3" />
            </span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="h-8 w-32 text-xs bg-background"
            />
          </div>
        ) : (
          // MODO LECTURA: Mostramos el rango calculado
          <div className="flex items-center gap-3 px-2">
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                Desde
              </span>
              <span className="text-sm font-medium tabular-nums">
                {formatDateDisplay(dateRange.start)}
              </span>
            </div>
            <div className="h-6 w-px bg-border mx-1" /> {/* Separador vertical */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                Hasta
              </span>
              <span className="text-sm font-medium tabular-nums">
                {formatDateDisplay(dateRange.end)}
              </span>
            </div>
          </div>
        )}
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
          : 'text-muted-foreground hover:text-foreground hover:border-primary/50 bg-background'
      )}
    >
      {label}
    </Button>
  )
}
