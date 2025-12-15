import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
// ELIMINAMOS: import { ScrollArea } from '@/components/ui/scroll-area'

import StatsCards from '@/components/reports/StatsCards'
import SalesChart from '@/components/reports/SalesChart'
import TopProducts from '@/components/reports/TopProducts'
import ReportFilters from '@/components/reports/ReportFilters'
import SalesHistoryTable from '@/components/reports/SalesHistoryTable'

export default function Reports() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header Fijo */}
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

        {/* Barra de Filtros */}
        <ReportFilters />
      </div>

      <Separator className="bg-border/60" />

      {/* ÁREA DE SCROLL (Cambio a nativo para igualar a Ventas/Productos) */}
      {/* Usamos 'flex-1 overflow-y-auto' en lugar de <ScrollArea> */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6 pb-20">
          {/* Sección 1: KPIs */}
          <section className="space-y-4">
            <StatsCards />
          </section>

          {/* Sección 2: Gráficos */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <SalesChart />
            <TopProducts />
          </section>

          {/* Sección 3: Historial */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Movimientos de Caja
              </h3>
            </div>
            <SalesHistoryTable />
          </section>
        </div>
      </div>
    </div>
  )
}
