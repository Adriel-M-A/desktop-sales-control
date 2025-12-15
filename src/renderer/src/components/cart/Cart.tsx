import { CreditCard, Banknote, ArrowRightLeft } from 'lucide-react'
import CartItem from './CartItem'
import CartHeader from './CartHeader'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function Cart() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header Estándar */}
      <CartHeader totalItems={3} />

      {/* Lista de Items */}
      <ScrollArea className="flex-1 bg-muted/10">
        <div className="flex flex-col gap-3 p-4">
          <CartItem
            name="Auriculares Bluetooth Pro"
            price={12000}
            quantity={1}
            onIncrease={() => {}}
            onDecrease={() => {}}
            onRemove={() => {}}
          />
          <CartItem
            name="Cable USB-C"
            price={1500}
            quantity={5}
            onIncrease={() => {}}
            onDecrease={() => {}}
            onRemove={() => {}}
          />
          {/* Más items... */}
        </div>
      </ScrollArea>

      <Separator />

      {/* SECCIÓN DE TOTALES Y PAGO */}
      <div className="bg-background p-5 space-y-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)] z-10">
        {/* Solo Total a Pagar (Sin subtotal ni IVA) */}
        <div className="flex justify-between items-center py-1">
          <span className="text-lg font-semibold text-foreground">Total a Pagar</span>
          <span className="text-3xl font-bold text-primary tracking-tight">$18.150</span>
        </div>

        {/* Métodos de Pago */}
        <div className="grid grid-cols-3 gap-2">
          {/* Opción 1: Efectivo */}
          <Button
            variant="outline"
            className="flex flex-col h-14 gap-1 border-input hover:bg-muted/50 hover:border-primary/50 transition-all"
          >
            <Banknote className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Efectivo</span>
          </Button>

          {/* Opción 2: Tarjeta */}
          <Button
            variant="outline"
            className="flex flex-col h-14 gap-1 border-input hover:bg-muted/50 hover:border-primary/50 transition-all"
          >
            <CreditCard className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Tarjeta</span>
          </Button>

          {/* Opción 3: Transferencia (Actualizada) */}
          <Button
            variant="outline"
            className="flex flex-col h-14 gap-1 border-input hover:bg-muted/50 hover:border-primary/50 transition-all"
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Transferencia</span>
          </Button>
        </div>

        {/* Botón de Confirmación */}
        <Button className="w-full h-11 text-base font-semibold shadow-md" size="lg">
          Confirmar Venta
        </Button>
      </div>
    </div>
  )
}
