import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TopProducts() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Item 1 */}
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>01</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Auriculares Pro</p>
              <p className="text-xs text-muted-foreground">Audio / Tecnología</p>
            </div>
            <div className="ml-auto font-medium">+$1,999.00</div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>02</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Teclado Mecánico</p>
              <p className="text-xs text-muted-foreground">Periféricos</p>
            </div>
            <div className="ml-auto font-medium">+$299.00</div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>03</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Monitor 24"</p>
              <p className="text-xs text-muted-foreground">Monitores</p>
            </div>
            <div className="ml-auto font-medium">+$99.00</div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>04</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Mouse Gamer</p>
              <p className="text-xs text-muted-foreground">Periféricos</p>
            </div>
            <div className="ml-auto font-medium">+$150.00</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
