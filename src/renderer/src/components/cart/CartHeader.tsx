import { ShoppingCart } from 'lucide-react'

interface CartHeaderProps {
  totalItems: number
}

export default function CartHeader({ totalItems }: CartHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between px-4 bg-card text-card-foreground border-b border-border/40">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold tracking-tight">Carrito Actual</span>
      </div>
      <div className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
        {totalItems} items
      </div>
    </div>
  )
}
