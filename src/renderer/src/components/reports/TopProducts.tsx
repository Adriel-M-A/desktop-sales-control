import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TopProduct {
  name: string
  sold: number
  revenue: number
}

interface TopProductsProps {
  products: TopProduct[]
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="col-span-3 bg-card shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Productos Más Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {products.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No hay datos de ventas aún.
            </div>
          ) : (
            products.map((product, index) => (
              <div key={index} className="flex items-center group">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {index + 1}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p
                    className="text-sm font-medium leading-none text-foreground truncate max-w-[150px]"
                    title={product.name}
                  >
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{product.sold} unidades vendidas</p>
                </div>
                <div className="ml-auto font-bold text-foreground">
                  ${product.revenue.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
