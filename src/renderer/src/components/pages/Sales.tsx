import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { ShoppingCart, ChevronUp, X } from 'lucide-react'

// Componentes propios
import Cart from '@/components/cart/Cart'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductGrid from '@/components/sales/ProductGrid'

// Componentes UI
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Interfaces
interface Product {
  id: number
  code: string
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

export default function Sales() {
  // --- ESTADOS ---
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo')
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)

  // Buffer para el escáner
  const barcodeBuffer = useRef('')
  const lastKeyTime = useRef(Date.now())

  // --- CARGA DE DATOS ---
  const loadProducts = async (search = '') => {
    try {
      // @ts-ignore
      const data = await window.api.getProducts(search)
      setProducts(data)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar productos')
    }
  }

  useEffect(() => {
    loadProducts(searchQuery)
  }, [searchQuery])

  // --- LÓGICA DEL CARRITO ---
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : item
        }
        return item
      })
    )
  }

  const clearCart = () => setCart([])

  // --- LÓGICA DE ESCÁNER (GLOBAL) ---
  useEffect(() => {
    const handleGlobalScan = async (e: KeyboardEvent) => {
      // 1. Ignorar si el usuario escribe en el buscador
      if (document.activeElement instanceof HTMLInputElement) return

      // 2. Control de velocidad (Buffer)
      const currentTime = Date.now()
      if (currentTime - lastKeyTime.current > 100) {
        barcodeBuffer.current = ''
      }
      lastKeyTime.current = currentTime

      // 3. Procesar Enter
      if (e.key === 'Enter') {
        const code = barcodeBuffer.current.trim()

        if (code.length > 0) {
          const toastId = toast.loading('Procesando código...')
          try {
            // @ts-ignore
            const product = await window.api.getProductByCode(code)

            if (product) {
              addToCart(product)
              toast.success(`Agregado: ${product.name}`, { id: toastId })
            } else {
              toast.error('Producto no encontrado', {
                id: toastId,
                description: `El código ${code} no existe.`
              })
            }
          } catch (error) {
            console.error(error)
            toast.error('Error de lectura', { id: toastId })
          }
        }
        barcodeBuffer.current = ''
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key
      }
    }

    window.addEventListener('keydown', handleGlobalScan)
    return () => window.removeEventListener('keydown', handleGlobalScan)
  }, [])

  // --- FINALIZAR VENTA ---
  const handleCheckout = async (paymentMethodOverride?: string) => {
    if (cart.length === 0) return

    const method = paymentMethodOverride || selectedPaymentMethod
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    try {
      const saleData = {
        paymentMethod: method,
        total,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }

      // @ts-ignore
      const result = await window.api.createSale(saleData)

      if (result.success) {
        toast.success(`Venta #${result.saleId} registrada con éxito`)
        clearCart()
        setSelectedPaymentMethod('Efectivo')
        setIsMobileCartOpen(false) // Cerrar sheet móvil si está abierto
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al procesar la venta')
    }
  }

  // Cálculos para la barra móvil
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      {/* =========================================
          IZQUIERDA: PRODUCTOS (Grid)
          Ocupa todo el ancho en Móvil.
          Comparte espacio en Desktop/Tablet.
         ========================================= */}
      <div className="flex flex-1 flex-col h-full min-w-0 min-h-0">
        <div className="flex-none p-4">
          <ProductFilter onSearch={setSearchQuery} />
        </div>

        <Separator className="flex-none bg-border/60" />

        {/* pb-24 en móvil: Para que el último producto no quede tapado por la barra flotante.
           md:pb-0: En tablet/desktop no hay barra flotante.
        */}
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 p-1">
          <ProductGrid products={products} onAddToCart={addToCart} />
        </div>
      </div>

      {/* =========================================
          DERECHA: CARRITO (Panel Lateral)
          Modo Desktop/Tablet: Visible (hidden md:flex)
          Ancho adaptable: w-[320px] en Tablet, más ancho en Desktop.
         ========================================= */}
      <aside className="hidden md:flex w-[320px] lg:w-[420px] flex-col h-full border-l border-border bg-card shadow-xl z-20 overflow-hidden transition-all duration-300">
        <Cart
          items={cart}
          selectedPaymentMethod={selectedPaymentMethod}
          onSelectPaymentMethod={setSelectedPaymentMethod}
          onIncrease={(id) => updateQuantity(id, 1)}
          onDecrease={(id) => updateQuantity(id, -1)}
          onRemove={removeFromCart}
          onClear={clearCart}
          onCheckout={() => handleCheckout()}
        />
      </aside>

      {/* =========================================
          MÓVIL: BARRA FLOTANTE + SHEET
          Modo Móvil: Visible (md:hidden)
         ========================================= */}
      <div className="md:hidden">
        {/* Barra Flotante Inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="w-full h-14 justify-between animate-in slide-in-from-bottom-2 shadow-md"
              >
                {/* Lado Izquierdo: Icono + Badge */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-destructive hover:bg-destructive text-destructive-foreground border-2 border-primary">
                        {totalItems}
                      </Badge>
                    )}
                  </div>
                  <span className="font-semibold text-base">Ver Carrito</span>
                </div>

                {/* Lado Derecho: Total + Chevron */}
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">${totalAmount.toLocaleString()}</span>
                  <ChevronUp className="h-5 w-5 opacity-70" />
                </div>
              </Button>
            </SheetTrigger>

            {/* Contenido Desplegable (Sheet) */}
            <SheetContent
              side="bottom"
              className="h-[100vh] p-0 rounded-none flex flex-col [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Carrito de Compras</SheetTitle>

              {/* --- HEADER PERSONALIZADO (Cerrar) --- */}
              <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h2 className="font-bold text-lg">Tu Pedido</h2>
                </div>

                {/* Botón X grande y claro */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileCartOpen(false)}
                  className="h-10 w-10 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Reutilizamos el componente Cart */}
              <div className="flex-1 overflow-hidden bg-background">
                <Cart
                  items={cart}
                  selectedPaymentMethod={selectedPaymentMethod}
                  onSelectPaymentMethod={setSelectedPaymentMethod}
                  onIncrease={(id) => updateQuantity(id, 1)}
                  onDecrease={(id) => updateQuantity(id, -1)}
                  onRemove={removeFromCart}
                  onClear={clearCart}
                  onCheckout={(method) => handleCheckout(method)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
