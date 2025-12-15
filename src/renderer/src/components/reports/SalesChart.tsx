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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Resumen Semanal</CardTitle>
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
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              {/* Usamos 'fill' con una clase de color primario o un hex directo */}
              <Bar
                dataKey="total"
                fill="currentColor"
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
