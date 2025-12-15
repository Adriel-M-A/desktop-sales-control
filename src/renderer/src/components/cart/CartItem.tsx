import { Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CartItemProps {
  name: string
  price: number
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export default function CartItem({
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove
}: CartItemProps) {
  const total = price * quantity

  return (
    <div className="group grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      {/* COLUMNA 1: Información del Producto */}
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="truncate text-sm font-semibold text-foreground leading-tight" title={name}>
          {name}
        </span>
        <div className="flex items-baseline gap-2 text-xs">
          <span className="font-bold text-primary">${total.toLocaleString()}</span>
          {quantity > 1 && (
            <span className="text-muted-foreground/80">(${price.toLocaleString()} un.)</span>
          )}
        </div>
      </div>

      {/* COLUMNA 2: Contador "Pastilla" */}
      <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 h-8">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-foreground hover:bg-background hover:shadow-sm"
          onClick={onDecrease}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center text-xs font-bold tabular-nums text-foreground">
          {quantity}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-foreground hover:bg-background hover:shadow-sm"
          onClick={onIncrease}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* COLUMNA 3: Eliminar */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
