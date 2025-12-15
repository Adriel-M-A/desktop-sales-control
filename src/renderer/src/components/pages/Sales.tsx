import Cart from '@/components/cart/Cart'
import ProductFilter from '@/components/sales/ProductFilter'
import { Separator } from '@/components/ui/separator'

export default function Sales() {
  return (
    <div className="flex h-full bg-background">
      {/* COLUMNA IZQUIERDA: Área principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header simplificado: Solo el Filtro Full Width */}
        <div className="p-4">
          <ProductFilter />
        </div>

        <Separator />

        {/* Grid de Productos */}
        <div className="flex-1 overflow-auto p-4 bg-muted/5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {/* Renderizado de productos de ejemplo */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center p-4 hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-full bg-muted group-hover:bg-primary/10 mb-3" />
                <span className="font-medium text-sm">Producto {i + 1}</span>
                <span className="text-xs text-muted-foreground">$1.200</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: Carrito (Mantenemos el ancho de 450px) */}
      <aside className="hidden md:flex w-[450px] flex-col border-l border-border bg-card shadow-xl z-10">
        <Cart />
      </aside>
    </div>
  )
}
