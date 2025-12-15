// ... imports anteriores
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import StatsCards from '@/components/reports/StatsCards'
import SalesChart from '@/components/reports/SalesChart'
import TopProducts from '@/components/reports/TopProducts'
import ReportFilters from '@/components/reports/ReportFilters'
import SalesHistoryTable from '@/components/reports/SalesHistoryTable'

export default function Reports() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header Fijo con más espacio vertical */}
      <div className="flex-none p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Reportes y Estadísticas</h2>
            <p className="text-sm text-muted-foreground">Análisis de rendimiento financiero.</p>
          </div>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>

        {/* Barra de Filtros (Rediseñada) */}
        <ReportFilters />
      </div>

      <Separator />

      {/* Área Scrollable */}
      <ScrollArea className="flex-1 bg-muted/5">
        <div className="p-6 space-y-8 pb-20">
          {/* Métricas Generales */}
          <section className="space-y-4">
            <StatsCards />
          </section>

          {/* Gráficos */}
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <SalesChart />
            <TopProducts />
          </section>

          {/* Historial */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Movimientos de Caja
              </h3>
            </div>
            <SalesHistoryTable />
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
