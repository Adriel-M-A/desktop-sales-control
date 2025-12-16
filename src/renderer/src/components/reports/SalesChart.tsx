import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface SalesChartProps {
  data: { date: string; total: number }[]
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="col-span-4 bg-card shadow-sm border-border/50 flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Ingresos (Últimos 7 días)
        </CardTitle>
      </CardHeader>

      {/* Usamos p-0 para tener control total de la altura, igual que en TopProducts */}
      <CardContent className="p-0 flex-1">
        <div className="h-[350px] w-full px-4 pb-4">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
              <span>📊</span>
              <span>No hay datos suficientes para el gráfico.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => {
                    // Formateamos la fecha para que ocupe menos espacio (ej: 01/10)
                    if (!value) return ''
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  className="text-muted-foreground"
                  width={60}
                />
                <Tooltip
                  cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: 'hsl(var(--foreground))'
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ingresos']}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
