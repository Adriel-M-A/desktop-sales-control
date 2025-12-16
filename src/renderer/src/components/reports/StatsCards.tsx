import { DollarSign, CreditCard, TrendingUp, Ban } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Stats {
  totalIncome: number
  totalSales: number
  averageTicket: number
  cancelledCount: number
  cancelledAmount: number
}

interface StatsCardsProps {
  stats: Stats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cardClasses = 'bg-card shadow-sm border-border/50 transition-shadow hover:shadow-md'

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className={cardClasses}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
            <div className="text-2xl font-bold text-foreground">
              ${stats.totalIncome.toLocaleString()}
            </div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-muted-foreground font-normal">Ventas completadas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardClasses}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ventas Realizadas</p>
            <div className="text-2xl font-bold text-foreground">{stats.totalSales}</div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-muted-foreground font-normal">Operaciones exitosas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardClasses}>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ticket Promedio</p>
            <div className="text-2xl font-bold text-foreground">
              ${Math.round(stats.averageTicket).toLocaleString()}
            </div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-muted-foreground font-normal">Por venta</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <div className="text-2xl font-bold text-red-600">{stats.cancelledCount}</div>
            <div className="flex items-center text-xs mt-1 font-normal text-red-600/70">
              Perdido: ${stats.cancelledAmount.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
