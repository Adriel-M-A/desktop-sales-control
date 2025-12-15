import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Dashboard() {
  // Función simple para lanzar la notificación
  const handleTestNotification = () => {
    toast.success('¡Operación exitosa!', {
      description: 'Los datos se han guardado correctamente en la base de datos.',
      action: {
        label: 'Deshacer',
        onClick: () => console.log('Deshacer clickeado')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {/* Al hacer clic, lanza la toast */}
        <Button onClick={handleTestNotification}>Probar Notificación</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <span className="text-muted-foreground">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% del mes pasado</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
