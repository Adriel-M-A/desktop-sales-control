import { DollarSign, CreditCard, TrendingUp, Ban, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card' // Eliminamos CardHeader y CardTitle que no usaremos
import { cn } from '@/lib/utils'

export default function StatsCards() {
  // Clases comunes para las tarjetas: Blanco, sombra suave, borde muy sutil.
  const cardClasses = 'bg-card shadow-sm border-border/50 transition-shadow hover:shadow-md'

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. INGRESOS TOTALES */}
      <Card className={cardClasses}>
        <CardContent className="p-6 flex items-center gap-4">
          {/* Icono Grande */}
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <DollarSign className="h-6 w-6" />
          </div>
          {/* Contenido */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
            <div className="text-2xl font-bold text-foreground">$45,231.89</div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> 20.1%
              </span>
              <span className="text-muted-foreground ml-1.5 font-normal">vs periodo anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. VENTAS REALIZADAS */}
      <Card className={cardClasses}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ventas Realizadas</p>
            <div className="text-2xl font-bold text-foreground">142</div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> 12%
              </span>
              <span className="text-muted-foreground ml-1.5 font-normal">vs periodo anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. TICKET PROMEDIO */}
      <Card className={cardClasses}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
            <div className="text-2xl font-bold text-foreground">$3,185</div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-red-600 flex items-center gap-0.5">
                <ArrowDownRight className="h-3 w-3" /> 2.5%
              </span>
              <span className="text-muted-foreground ml-1.5 font-normal">vs periodo anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. VENTAS CANCELADAS */}
      <Card
        className={cn(
          cardClasses,
          'bg-red-50/30 border-red-100/50 dark:bg-red-900/10 dark:border-red-900/30'
        )}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
            <Ban className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-600/80">Ventas Canceladas</p>
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="flex items-center text-xs mt-1 font-normal text-red-600/70">
              Total: $12,500 anulados
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
