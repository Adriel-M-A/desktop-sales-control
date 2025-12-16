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

export default function Reports() {
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

  const [currentRange, setCurrentRange] = useState<{ startDate: string; endDate: string } | null>(
    null
  )

  const loadDashboardData = async (range: { startDate: string; endDate: string }) => {
    // @ts-ignore
    if (typeof window.api === 'undefined') {
      console.warn('Reports: window.api no está definido.')
      setIsApiAvailable(false)
      return
    }

    try {
      setIsApiAvailable(true)

      const [statsData, topData, chartData] = await Promise.all([
        window.api.getDashboardStats(range),
        window.api.getTopProducts(range),
        window.api.getSalesChart(range)
      ])

      if (statsData) setStats(statsData)
      if (Array.isArray(topData)) setTopProducts(topData)
      if (Array.isArray(chartData)) setChartData(chartData)
    } catch (error) {
      console.error('Error cargando reporte:', error)
      toast.error('Error al actualizar datos del reporte')
    }
  }

  const handleFilterChange = (range: { startDate: string; endDate: string }) => {
    setCurrentRange(range)
    loadDashboardData(range)
  }

  const handleRefreshData = () => {
    if (currentRange) {
      loadDashboardData(currentRange)
    }
  }

  // Calculamos el total de filas reales (Ventas OK + Ventas Canceladas)
  const totalRowsInTable = stats.totalSales + stats.cancelledCount

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
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
          <Button size="sm" variant="outline" className="bg-card hover:bg-muted shadow-sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>

        {!isApiAvailable && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>Advertencia: No se detecta conexión con la base de datos.</span>
          </div>
        )}

        <ReportFilters onFilterChange={handleFilterChange} />
      </div>

      <Separator className="bg-border/60" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-20">
          <section className="space-y-4">
            <StatsCards stats={stats} />
          </section>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <SalesChart data={chartData} />
            <TopProducts products={topProducts} />
          </section>

          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Movimientos de Caja
              </h3>
            </div>

            {/* Pasamos el totalRows para que la paginación se vea bonita */}
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
