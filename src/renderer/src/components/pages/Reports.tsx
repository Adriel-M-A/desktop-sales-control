import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
  const [topProducts, setTopProducts] = useState([])
  const [chartData, setChartData] = useState([])

  const loadDashboardData = async () => {
    if (!window.api) return

    try {
      const dashboardStats = await window.api.getDashboardStats()
      setStats(dashboardStats)

      const top = await window.api.getTopProducts()
      setTopProducts(top)

      const chart = await window.api.getSalesChart()
      setChartData(chart)
    } catch (error) {
      console.error('Error loading dashboard', error)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex-none p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Reportes y Estadísticas
            </h2>
            <p className="text-sm text-muted-foreground">Análisis de rendimiento financiero.</p>
          </div>
          <Button size="sm" variant="outline" className="bg-card hover:bg-muted shadow-sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>

        <ReportFilters />
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

            <SalesHistoryTable onSaleUpdated={loadDashboardData} />
          </section>
        </div>
      </div>
    </div>
  )
}
