import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type FilterType = 'today' | 'yesterday' | 'week' | 'fortnight' | 'month' | 'custom'

// ... (FILTER_LABELS se mantiene igual, omitido por brevedad)

export default function ReportFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('today')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })

  // ... (useEffect y helpers se mantienen igual) ...
  useEffect(() => {
    // ... lógica de fechas existente ...
    const today = new Date()
    let start = new Date()
    let end = new Date()
    // (Simulación de lógica para no repetir todo el bloque de código previo)
    setDateRange({ start: '2025-12-15', end: '2025-12-15' })
  }, [activeFilter])

  const formatDateDisplay = (dateString: string) => dateString // Placeholder

  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 w-full">
      {/* Grupo de Botones */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Los botones usan variant "default" (Azul Primary) o "outline" (Blanco) */}
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

      {/* Visualización de Fechas */}
      <div className="flex items-center gap-3 ml-auto bg-muted/40 p-1.5 rounded-lg border border-border/50 animate-in fade-in slide-in-from-right-4">
        <div className="h-8 w-8 rounded-md bg-card flex items-center justify-center border shadow-sm">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </div>

        {activeFilter === 'custom' ? (
          <div className="flex items-center gap-2">
            {/* INPUTS: bg-card (Blanco) para resaltar sobre el fondo gris del contenedor */}
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="h-8 w-32 text-xs bg-card border-input focus:border-primary shadow-sm"
            />
            <span className="text-muted-foreground text-xs">
              <ArrowRight className="h-3 w-3" />
            </span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="h-8 w-32 text-xs bg-card border-input focus:border-primary shadow-sm"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2">
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                Desde
              </span>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {formatDateDisplay(dateRange.start)}
              </span>
            </div>

            <div className="h-6 w-px bg-border mx-1" />

            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                Hasta
              </span>
              <span className="text-sm font-medium tabular-nums text-foreground">
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
          : 'text-muted-foreground hover:text-foreground hover:border-primary/50 bg-card border-border'
      )}
    >
      {label}
    </Button>
  )
}
