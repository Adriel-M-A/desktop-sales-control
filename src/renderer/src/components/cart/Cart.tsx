// src/renderer/src/components/cart/Cart.tsx
import { CreditCard, Banknote, ArrowRightLeft } from 'lucide-react'
import CartItem from './CartItem'
import CartHeader from './CartHeader'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

/**
 * Propiedades del componente Cart actualizadas para soportar
 * funciones asíncronas y el parámetro opcional de la versión móvil.
 */
interface CartProps {
  items: any[]
  selectedPaymentMethod: string
  onSelectPaymentMethod: (method: string) => void
  onIncrease: (id: number) => void
  onDecrease: (id: number) => void
  onRemove: (id: number) => void
  onClear: () => void
  // CORRECCIÓN: Se añade el parámetro opcional 'method' y se permite retorno Promise o void
  onCheckout: (method?: string) => void | Promise<void>
}

export default function Cart({
  items,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckout
}: CartProps): React.ReactElement {
  // Cálculo del total de la venta
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Cabecera con contador de items y botón de vaciado */}
      <CartHeader totalItems={items.length} onClear={onClear} />

      {/* Area deslizable para los items del carrito */}
      <ScrollArea className="flex-1 bg-muted/20">
        <div className="flex flex-col gap-3 p-4">
          {items.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              El carrito está vacío.
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onIncrease={() => onIncrease(item.id)}
                onDecrease={() => onDecrease(item.id)}
                onRemove={() => onRemove(item.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Footer del Carrito: Total, Métodos de Pago y Confirmación */}
      <div className="bg-card p-5 space-y-5 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-10">
        {/* Visualización del Total */}
        <div className="flex justify-between items-center py-1">
          <span className="text-lg font-semibold text-foreground">Total a Pagar</span>
          <span className="text-3xl font-bold text-primary tracking-tight">
            ${total.toLocaleString()}
          </span>
        </div>

        {/* Selector de Método de Pago */}
        <div className="grid grid-cols-3 gap-2">
          {/* Opción Efectivo */}
          <Button
            variant={selectedPaymentMethod === 'Efectivo' ? 'default' : 'outline'}
            onClick={() => onSelectPaymentMethod('Efectivo')}
            className={cn(
              'flex flex-col h-14 gap-1 transition-all no-drag',
              selectedPaymentMethod !== 'Efectivo' &&
                'border-input text-muted-foreground hover:bg-primary/5 hover:border-primary hover:text-primary'
            )}
          >
            <Banknote className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Efectivo</span>
          </Button>

          {/* Opción Tarjeta */}
          <Button
            variant={selectedPaymentMethod === 'Tarjeta' ? 'default' : 'outline'}
            onClick={() => onSelectPaymentMethod('Tarjeta')}
            className={cn(
              'flex flex-col h-14 gap-1 transition-all no-drag',
              selectedPaymentMethod !== 'Tarjeta' &&
                'border-input text-muted-foreground hover:bg-primary/5 hover:border-primary hover:text-primary'
            )}
          >
            <CreditCard className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Tarjeta</span>
          </Button>

          {/* Opción Transferencia */}
          <Button
            variant={selectedPaymentMethod === 'Transferencia' ? 'default' : 'outline'}
            onClick={() => onSelectPaymentMethod('Transferencia')}
            className={cn(
              'flex flex-col h-14 gap-1 transition-all no-drag',
              selectedPaymentMethod !== 'Transferencia' &&
                'border-input text-muted-foreground hover:bg-primary/5 hover:border-primary hover:text-primary'
            )}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Transf.</span>
          </Button>
        </div>

        {/* Botón Principal de Checkout */}
        <Button
          className="w-full h-12 text-base font-bold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground no-drag"
          size="lg"
          disabled={items.length === 0}
          // Llamamos a onCheckout sin parámetros (usará el método seleccionado arriba)
          onClick={() => onCheckout()}
        >
          Confirmar Venta
        </Button>
      </div>
    </div>
  )
}
