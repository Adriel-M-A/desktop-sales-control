import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area' // <--- IMPORTAMOS ESTO

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
    <Card className="col-span-3 bg-card shadow-sm border-border/50 flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex justify-between items-center">
          <span>Top 10 Productos</span>
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
            Por unidades vendidas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {' '}
        {/* Quitamos padding para que el scroll llegue al borde */}
        {/* ALTURA FIJA Y SCROLL AREA */}
        <ScrollArea className="h-[350px] px-6">
          <div className="space-y-6 py-4 pr-4">
            {' '}
            {/* Padding interno para el contenido */}
            {products.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-12 flex flex-col items-center gap-2">
                <span>📉</span>
                <span>No hay datos de ventas en este período.</span>
              </div>
            ) : (
              products.map((product, index) => (
                <div key={index} className="flex items-center group">
                  {/* Avatar con el número de ranking */}
                  <Avatar className="h-9 w-9 border border-border shadow-sm">
                    <AvatarFallback
                      className={`text-xs font-bold transition-colors ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : index === 1
                            ? 'bg-gray-100 text-gray-700 border-gray-200'
                            : index === 2
                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                              : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      }`}
                    >
                      #{index + 1}
                    </AvatarFallback>
                  </Avatar>

                  <div className="ml-4 space-y-1 flex-1 min-w-0">
                    {' '}
                    {/* min-w-0 ayuda al truncate */}
                    <p
                      className="text-sm font-medium leading-none text-foreground truncate"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold text-foreground/80">{product.sold}</span>{' '}
                      vendidos
                    </p>
                  </div>

                  <div className="ml-auto font-bold text-foreground tabular-nums text-sm">
                    ${product.revenue.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
