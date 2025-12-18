import { useState } from 'react'
import { Download, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

import StatsCards from '@/components/reports/StatsCards'
import SalesChart from '@/components/reports/SalesChart'
import TopProducts from '@/components/reports/TopProducts'
import ReportFilters from '@/components/reports/ReportFilters'
import SalesHistoryTable from '@/components/reports/SalesHistoryTable'

/**
 * Página de Reportes y Estadísticas.
 * Muestra indicadores clave (KPIs), gráficos de evolución y el historial detallado.
 */
export default function Reports(): React.ReactElement {
  // Estado para los contadores y valores monetarios de las tarjetas superiores
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalSales: 0,
    averageTicket: 0,
    cancelledCount: 0,
    cancelledAmount: 0
  })

  const [topProducts, setTopProducts] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [isApiAvailable, setIsApiAvailable] = useState(true)

  // Rango de fechas seleccionado actualmente por los filtros
  const [currentRange, setCurrentRange] = useState<{ startDate: string; endDate: string } | null>(
    null
  )

  /**
   * Carga los datos analíticos desde el backend modularizado.
   * Utiliza el dominio 'stats' definido en el preload.
   */
  const loadDashboardData = async (range: {
    startDate: string
    endDate: string
  }): Promise<void> => {
    // Verificación de seguridad para la API inyectada
    if (typeof window.api === 'undefined') {
      console.warn('Reports: window.api no está definido.')
      setIsApiAvailable(false)
      return
    }

    try {
      setIsApiAvailable(true)

      // Ejecución en paralelo de las consultas de estadísticas para optimizar tiempo de respuesta
      const [statsData, topData, chartData] = await Promise.all([
        window.api.stats.getDashboard(range),
        window.api.stats.getTopProducts(range),
        window.api.stats.getChart(range)
      ])

      if (statsData) setStats(statsData)
      if (Array.isArray(topData)) setTopProducts(topData)
      if (Array.isArray(chartData)) setChartData(chartData)
    } catch (error) {
      console.error('Error cargando reporte:', error)
      toast.error('Error al actualizar datos del reporte')
    }
  }

  /**
   * Manejador para el cambio de filtros (Hoy, Ayer, Mes, etc.)
   */
  const handleFilterChange = (range: { startDate: string; endDate: string }): void => {
    setCurrentRange(range)
    loadDashboardData(range)
  }

  /**
   * Refresca los datos del dashboard manteniendo el rango actual
   */
  const handleRefreshData = (): void => {
    if (currentRange) {
      loadDashboardData(currentRange)
    }
  }

  // Calculamos el total de filas reales (Ventas OK + Ventas Canceladas) para la paginación de la tabla
  const totalRowsInTable = stats.totalSales + stats.cancelledCount

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Cabecera y Filtros */}
      <div className="flex-none p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Reportes y Estadísticas
            </h2>
            <p className="text-sm text-muted-foreground">
              Análisis de rendimiento financiero en tiempo real.
            </p>
          </div>
          <Button size="sm" variant="outline" className="bg-card hover:bg-muted shadow-sm no-drag">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>

        {!isApiAvailable && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm border border-red-200 animate-pulse">
            <AlertCircle className="h-4 w-4" />
            <span>Advertencia: No se detecta conexión con el servicio de datos principal.</span>
          </div>
        )}

        <ReportFilters onFilterChange={handleFilterChange} />
      </div>

      <Separator className="bg-border/60" />

      {/* Cuerpo del Reporte: Scrollable */}
      <div className="flex-1 overflow-y-auto scroll-smooth internally-scrollable">
        <div className="p-6 space-y-6 pb-20">
          {/* Fila 1: Tarjetas de Resumen Numérico */}
          <section className="space-y-4">
            <StatsCards stats={stats} />
          </section>

          {/* Fila 2: Gráfico y Ranking de Productos */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <SalesChart data={chartData} />
            <TopProducts products={topProducts} />
          </section>

          {/* Fila 3: Listado de Movimientos (Ventas e Historial) */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Movimientos de Caja
              </h3>
            </div>

            <SalesHistoryTable
              dateRange={currentRange}
              onSaleUpdated={handleRefreshData}
              totalRows={totalRowsInTable}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
