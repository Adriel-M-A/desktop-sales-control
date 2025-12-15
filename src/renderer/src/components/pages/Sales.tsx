import Cart from '@/components/cart/Cart'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductGrid from '@/components/sales/ProductGrid'
import { Separator } from '@/components/ui/separator'

export default function Sales() {
  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* COLUMNA IZQUIERDA: Layout y Filtros */}
      <div className="flex flex-1 flex-col h-full min-w-0 min-h-0">
        {/* Header Fijo */}
        <div className="flex-none p-4">
          <ProductFilter />
        </div>

        <Separator className="flex-none" />

        {/* Grilla Modularizada */}
        <ProductGrid />
      </div>

      {/* COLUMNA DERECHA: Carrito */}
      <aside className="hidden md:flex w-[450px] flex-col h-full border-l border-border bg-card shadow-xl z-10 overflow-hidden">
        <Cart />
      </aside>
    </div>
  )
}
