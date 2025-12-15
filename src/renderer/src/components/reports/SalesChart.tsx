import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Lun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mie', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jue', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Vie', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sab', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dom', total: Math.floor(Math.random() * 5000) + 1000 }
]

export default function SalesChart() {
  return (
    // ESTILO: Superficie blanca con borde muy sutil y sombra suave
    <Card className="col-span-4 bg-card shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Resumen Semanal</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                className="text-muted-foreground"
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              />
              <Bar
                dataKey="total"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
