import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Trash2, ShoppingCart, ScanBarcode, Banknote, CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function PosSection() {
  const [cart, setCart] = useState<any[]>([])
  const [barcode, setBarcode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingSale, setIsProcessingSale] = useState(false)

  // Referencia para mantener el foco siempre en el input
  const inputRef = useRef<HTMLInputElement>(null)

  // 1. LÓGICA DE ESCANEO
  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!barcode.trim()) return

      setIsLoading(true)
      try {
        // @ts-ignore
        const product = await window.api.getProductByCode(barcode.trim())

        if (product) {
          addToCart(product)
          setBarcode('') // Limpiamos input para el siguiente producto
          toast.success(`Agregado: ${product.name}`)
        } else {
          toast.error('Producto no encontrado', {
            description: `El código ${barcode} no existe en la base de datos.`
          })
          setBarcode('') // Limpiamos aunque falle para seguir escaneando
        }
      } catch (error) {
        console.error(error)
        toast.error('Error al buscar el producto')
      } finally {
        setIsLoading(false)
      }
    }
  }

  // 2. GESTIÓN DEL CARRITO
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) {
        // Si ya existe, sumamos 1 a la cantidad
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1, subtotal: (p.quantity + 1) * p.price }
            : p
        )
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prev, { ...product, quantity: 1, subtotal: product.price }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id))
    // Recuperar el foco después de borrar
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // 3. FINALIZAR VENTA (COBRAR)
  const handleCheckout = async (paymentMethod: string) => {
    if (cart.length === 0) return

    setIsProcessingSale(true)
    try {
      const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0)

      const saleData = {
        paymentMethod,
        items: cart, // Enviamos el carrito completo
        total: totalAmount
      }

      // @ts-ignore
      await window.api.createSale(saleData)

      toast.success(`Venta registrada - ${paymentMethod}`)
      setCart([]) // Vaciar carrito
      setBarcode('')

      // Re-enfocar para la siguiente venta inmediata
      setTimeout(() => inputRef.current?.focus(), 100)
    } catch (error) {
      console.error(error)
      toast.error('Error al procesar la venta')
    } finally {
      setIsProcessingSale(false)
    }
  }

  // Auto-focus: Mantener el cursor en el escáner
  useEffect(() => {
    inputRef.current?.focus()

    // Opcional: Re-enfocar si el usuario hace clic en el fondo
    const handleClick = (e: MouseEvent) => {
      // Solo enfocar si el clic no fue en un botón o input diferente
      if ((e.target as HTMLElement).tagName === 'DIV') {
        inputRef.current?.focus()
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const total = cart.reduce((acc, item) => acc + item.subtotal, 0)

  return (
    <div className="flex h-full gap-4 p-6 bg-background">
      {/* --- COLUMNA IZQUIERDA: ESCÁNER Y LISTA --- */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* INPUT DE ESCANEO */}
        <Card className="border-primary/50 shadow-sm bg-muted/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full animate-pulse">
              <ScanBarcode className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                Escanear producto
              </label>
              <Input
                ref={inputRef}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleScan}
                disabled={isLoading || isProcessingSale}
                placeholder="Escanea el código de barras o escribe el número..."
                className="text-lg font-mono h-12 mt-1 border-primary/30 focus-visible:ring-primary shadow-inner bg-background"
                autoFocus
                autoComplete="off"
              />
            </div>
          </CardContent>
        </Card>

        {/* TABLA DE PRODUCTOS */}
        <div className="border rounded-md flex-1 bg-card overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="bg-muted sticky top-0">
                <TableRow>
                  <TableHead className="w-[60%]">Producto</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-center">Cant.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <ShoppingCart className="h-16 w-16 mb-4" />
                        <p className="text-lg font-medium">El carrito está vacío</p>
                        <p className="text-sm">Escanea un producto para comenzar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item) => (
                    <TableRow
                      key={item.id}
                      className="animate-in slide-in-from-left-2 duration-200"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {item.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${item.price.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        ${item.subtotal.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: RESUMEN Y COBRO --- */}
      <Card className="w-[350px] h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-l shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Resumen de Venta</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-6 pt-0">
          <div className="flex-1 space-y-6 py-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Artículos diferentes</span>
                <span className="font-medium">{cart.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unidades totales</span>
                <span className="font-medium">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
            </div>

            <div className="p-4 bg-background rounded-lg border border-dashed text-center space-y-1">
              <span className="text-sm text-muted-foreground uppercase tracking-widest">
                Total a Pagar
              </span>
              <div className="text-4xl font-extrabold text-primary tracking-tight">
                ${total.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Seleccione método de pago
            </p>

            <Button
              size="lg"
              className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md transition-all hover:scale-[1.02]"
              disabled={cart.length === 0 || isProcessingSale}
              onClick={() => handleCheckout('Efectivo')}
            >
              {isProcessingSale ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Banknote className="mr-2 h-5 w-5" />
              )}
              Efectivo
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 border-primary/20 hover:bg-primary/5 hover:text-primary"
                disabled={cart.length === 0 || isProcessingSale}
                onClick={() => handleCheckout('Tarjeta')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Tarjeta
              </Button>
              <Button
                variant="outline"
                className="h-12 border-primary/20 hover:bg-primary/5 hover:text-primary"
                disabled={cart.length === 0 || isProcessingSale}
                onClick={() => handleCheckout('Transferencia')}
              >
                Transferencia
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
