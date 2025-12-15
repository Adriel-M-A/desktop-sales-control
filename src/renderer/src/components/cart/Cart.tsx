import { CreditCard, Banknote, ArrowRightLeft } from 'lucide-react'
import CartItem from './CartItem'
import CartHeader from './CartHeader'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function Cart() {
  return (
    <div className="flex h-full flex-col bg-card">
      {' '}
      {/* Fondo Blanco */}
      {/* Header: Blanco sobre blanco, borde sutil */}
      <CartHeader totalItems={3} />
      {/* Lista de Items: 
          Usamos 'bg-muted/20' (Gris muy pálido) para diferenciar el área de lista 
          del resto del panel blanco.
      */}
      <ScrollArea className="flex-1 bg-muted/20">
        <div className="flex flex-col gap-3 p-4">
          <CartItem
            name="Auriculares Bluetooth Pro"
            price={12000}
            quantity={1}
            onIncrease={() => {}}
            onDecrease={() => {}}
            onRemove={() => {}}
          />
          {/* ... más items */}
        </div>
      </ScrollArea>
      <Separator />
      {/* SECCIÓN DE TOTALES: Blanco puro para destacar */}
      <div className="bg-card p-5 space-y-5 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-10">
        {/* Total a Pagar: Texto PRIMARY (Azul Vibrante) */}
        <div className="flex justify-between items-center py-1">
          <span className="text-lg font-semibold text-foreground">Total a Pagar</span>
          <span className="text-3xl font-bold text-primary tracking-tight">$18.150</span>
        </div>

        {/* Métodos de Pago: Botones Outline (Borde gris, hover azul suave) */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex flex-col h-14 gap-1 border-input hover:bg-primary/5 hover:border-primary text-muted-foreground hover:text-primary transition-all"
          >
            <Banknote className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Efectivo</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-14 gap-1 border-input hover:bg-primary/5 hover:border-primary text-muted-foreground hover:text-primary transition-all"
          >
            <CreditCard className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Tarjeta</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-14 gap-1 border-input hover:bg-primary/5 hover:border-primary text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">Transf.</span>
          </Button>
        </div>

        {/* Botón Confirmar: PRIMARY Sólido (Azul) */}
        <Button
          className="w-full h-12 text-base font-bold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          Confirmar Venta
        </Button>
      </div>
    </div>
  )
}
