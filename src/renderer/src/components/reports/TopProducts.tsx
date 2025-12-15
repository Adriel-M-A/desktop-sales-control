import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TopProducts() {
  return (
    // ESTILO: Superficie blanca con borde muy sutil y sombra suave
    <Card className="col-span-3 bg-card shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Productos Más Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Item 1 */}
          <div className="flex items-center group">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                01
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">Auriculares Pro</p>
              <p className="text-xs text-muted-foreground">Audio / Tecnología</p>
            </div>
            <div className="ml-auto font-bold text-foreground">+$1,999.00</div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center group">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                02
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">Teclado Mecánico</p>
              <p className="text-xs text-muted-foreground">Periféricos</p>
            </div>
            <div className="ml-auto font-bold text-foreground">+$299.00</div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center group">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                03
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">Monitor 24"</p>
              <p className="text-xs text-muted-foreground">Monitores</p>
            </div>
            <div className="ml-auto font-bold text-foreground">+$99.00</div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center group">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                04
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">Mouse Gamer</p>
              <p className="text-xs text-muted-foreground">Periféricos</p>
            </div>
            <div className="ml-auto font-bold text-foreground">+$150.00</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
