import { DollarSign, CreditCard, TrendingUp, Ban, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function StatsCards() {
  // NOTA: Estos textos de comparación deberían venir vía props en el futuro
  // basados en el filtro seleccionado en el padre.

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. INGRESOS TOTALES */}
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ingresos Totales
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <div className="flex items-center text-xs mt-1">
            <span className="text-green-600 font-bold flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +20.1%
            </span>
            <span className="text-muted-foreground">vs periodo anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. CANTIDAD DE VENTAS */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ventas Realizadas
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
            <CreditCard className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">142</div>
          <div className="flex items-center text-xs mt-1">
            <span className="text-green-600 font-bold flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12%
            </span>
            <span className="text-muted-foreground">vs periodo anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. TICKET PROMEDIO (Métrica clave de ventas) */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ticket Promedio
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$3,185</div>
          <div className="flex items-center text-xs mt-1">
            <span className="text-red-600 font-bold flex items-center mr-1">
              <ArrowDownRight className="h-3 w-3 mr-0.5" /> -2.5%
            </span>
            <span className="text-muted-foreground">vs periodo anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. VENTAS CANCELADAS (Control) */}
      <Card className="shadow-sm bg-red-50/30 border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-600/80">Ventas Canceladas</CardTitle>
          <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
            <Ban className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">3</div>
          <div className="flex items-center text-xs mt-1">
            <span className="text-muted-foreground">Total: $12,500 anulados</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
