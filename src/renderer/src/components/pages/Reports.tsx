import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Importamos los componentes, pero NO los usaremos todavía
import StatsCards from '@/components/reports/StatsCards'
import SalesChart from '@/components/reports/SalesChart'
import TopProducts from '@/components/reports/TopProducts'
import ReportFilters from '@/components/reports/ReportFilters'
import SalesHistoryTable from '@/components/reports/SalesHistoryTable'

export default function Reports() {
  // 1. Dejamos los estados iniciales (esto no rompe nada)
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalSales: 0,
    averageTicket: 0,
    cancelledCount: 0,
    cancelledAmount: 0
  })
  const [topProducts, setTopProducts] = useState([])
  const [chartData, setChartData] = useState([])

  // ---------------------------------------------------------
  // ZONA DE PRUEBAS: Todo esto está comentado para que NO falle
  // ---------------------------------------------------------

  /* const loadDashboardData = async () => {
    try {
      console.log("Intentando llamar a getDashboardStats...")
      const dashboardStats = await window.api.getDashboardStats()
      console.log("Stats recibidos:", dashboardStats)
      setStats(dashboardStats)

      const top = await window.api.getTopProducts()
      setTopProducts(top)

      const chart = await window.api.getSalesChart()
      setChartData(chart)
    } catch (error) {
      console.error("Error cargando dashboard:", error)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])
  */

  // ---------------------------------------------------------
  // DIAGNÓSTICO FINAL: Esto es lo único que se ejecutará
  // ---------------------------------------------------------
  console.log('--- REPORTE DE DEBUG ---')
  console.log('¿Existe window.api?', window.api)
  if (window.api) {
    console.log('¿Existe getDashboardStats?', window.api.getDashboardStats)
  }
  // ---------------------------------------------------------

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex-none p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Reportes (MODO SEGURO)
            </h2>
            <p className="text-sm text-muted-foreground">Si ves esto, el renderizado funciona.</p>
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-20">
          <div className="p-4 border border-dashed border-red-500 rounded bg-red-50 dark:bg-red-900/10">
            <h3 className="text-red-600 font-bold">ZONA COMENTADA</h3>
            <p className="text-sm text-red-500">
              Aquí deberían ir los gráficos y tablas, pero están ocultos.
            </p>
          </div>

          {/* <section className="space-y-4">
            <StatsCards stats={stats} />
          </section>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <SalesChart data={chartData} />
            <TopProducts products={topProducts} />
          </section>

          <section className="space-y-4 pt-4">
            <SalesHistoryTable onSaleUpdated={loadDashboardData} />
          </section> 
          */}
        </div>
      </div>
    </div>
  )
}
