import { ShoppingCart, BrushCleaning } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CartHeaderProps {
  totalItems: number
  onClear?: () => void // Opcional: Para limpiar carrito en el futuro
}

export default function CartHeader({ totalItems, onClear }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
      {/* Título e Icono */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">Orden Actual</h2>
      </div>

      {/* Acciones derecha */}
      <div className="flex items-center gap-2">
        {totalItems > 0 && (
          <Badge
            variant="secondary"
            className="px-2 py-0.5 text-xs font-semibold bg-muted text-foreground hover:bg-muted"
          >
            {totalItems} items
          </Badge>
        )}

        {totalItems > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Vaciar carrito"
            onClick={onClear}
          >
            <BrushCleaning className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
