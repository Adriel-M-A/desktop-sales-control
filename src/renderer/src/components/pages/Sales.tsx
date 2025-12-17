import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ShoppingCart, ChevronUp, X, PlusCircle } from 'lucide-react'

// Hook
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner'

// Componentes
import Cart from '@/components/cart/Cart'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductGrid from '@/components/sales/ProductGrid'
// IMPORTANTE: Importamos el Dialog y sus tipos
import ProductDialog, { ProductFormData } from '@/components/products/ProductDialog'

import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

  // --- NUEVOS ESTADOS PARA CREACIÓN RÁPIDA ---
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [scannedCodeForNew, setScannedCodeForNew] = useState('')

  // --- CARGA DE PRODUCTOS ---
  const loadProducts = async (search = '') => {
    try {
      // @ts-ignore
      const data = await window.api.getProducts(search)
      setProducts(data)
    } catch (error) {
      console.error(error)
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

  // --- LÓGICA DE ESCÁNER ---
  const handleProductScan = async (code: string) => {
    // Si el diálogo de creación ya está abierto, no hacemos nada (el diálogo maneja sus teclas)
    if (isCreateDialogOpen) return

    const toastId = toast.loading('Buscando...')
    try {
      // @ts-ignore
      const product = await window.api.getProductByCode(code)

      if (product) {
        addToCart(product)
        toast.success(`Agregado: ${product.name}`, { id: toastId })
      } else {
        // --- AQUÍ ESTÁ LA MAGIA ---
        // Si no existe, ofrecemos crearlo con un botón en la notificación
        toast.error('Producto no encontrado', {
          id: toastId,
          description: `El código ${code} no existe en el sistema.`,
          action: {
            label: 'Crear Ahora',
            onClick: () => {
              setScannedCodeForNew(code) // Guardamos el código
              setIsCreateDialogOpen(true) // Abrimos el modal
            }
          },
          duration: 5000 // Damos 5 segundos para que decida
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de lectura', { id: toastId })
    }
  }

  // Usamos el hook (pausado si estamos creando un producto para no interferir)
  useBarcodeScanner({
    onScan: handleProductScan,
    isActive: !isCreateDialogOpen
  })

  // --- CREAR Y AGREGAR AL CARRITO ---
  const handleCreateAndAddToCart = async (values: ProductFormData) => {
    try {
      // 1. Crear el producto en BD
      // @ts-ignore
      const result = await window.api.createProduct({
        code: values.code,
        name: values.name,
        price: parseFloat(values.price)
      })

      // 2. Construir el objeto producto con el ID que nos devuelve la BD (lastInsertRowid)
      // Nota: Asumimos que result devuelve { success: true, id: 123 } o similar.
      // Si tu API no devuelve el ID, tendríamos que volver a buscarlo, pero generalmente lo devuelve.
      const newProduct: Product = {
        id: result.id || Date.now(), // Fallback si la API no devuelve ID
        code: values.code,
        name: values.name,
        price: parseFloat(values.price)
      }

      // 3. Agregar al carrito inmediatamente
      addToCart(newProduct)
      toast.success('Producto creado y agregado al carrito')

      // 4. Recargar la grilla (silenciosamente) para que aparezca en la lista
      loadProducts(searchQuery)

      // 5. Cerrar el modal (El componente Dialog lo hace, pero limpiamos estados)
      setScannedCodeForNew('')
    } catch (error: any) {
      if (error.message?.includes('UNIQUE')) {
        toast.error('Error: Ese código ya fue registrado mientras operabas')
      } else {
        toast.error('Error al crear producto')
      }
      throw error // Para que el dialog pare el spinner de carga
    }
  }

  // --- CHECKOUT ---
  const handleCheckout = async (paymentMethodOverride?: string) => {
    if (cart.length === 0) return
    const method = paymentMethodOverride || selectedPaymentMethod
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    try {
      // @ts-ignore
      const result = await window.api.createSale({
        paymentMethod: method,
        total,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      })

      if (result.success) {
        toast.success(`Venta #${result.saleId} registrada`)
        clearCart()
        setSelectedPaymentMethod('Efectivo')
        setIsMobileCartOpen(false)
      }
    } catch (error) {
      toast.error('Error al procesar la venta')
    }
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      {/* SECCIÓN PRODUCTOS */}
      <div className="flex flex-1 flex-col h-full min-w-0 min-h-0">
        <div className="flex-none p-4">
          <ProductFilter onSearch={setSearchQuery} />
        </div>
        <Separator className="flex-none bg-border/60" />
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 p-1">
          <ProductGrid products={products} onAddToCart={addToCart} />
        </div>
      </div>

      {/* SECCIÓN CARRITO (DESKTOP/TABLET) */}
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

      {/* SECCIÓN MÓVIL (SHEET) */}
      <div className="md:hidden">
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-30 shadow-up">
          <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="w-full h-14 justify-between animate-in slide-in-from-bottom-2 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground border-2 border-primary">
                        {totalItems}
                      </Badge>
                    )}
                  </div>
                  <span className="font-semibold text-base">Ver Carrito</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">${totalAmount.toLocaleString()}</span>
                  <ChevronUp className="h-5 w-5 opacity-70" />
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[100vh] p-0 rounded-none flex flex-col [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Carrito</SheetTitle>
              <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h2 className="font-bold text-lg">Tu Pedido</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileCartOpen(false)}
                  className="h-10 w-10 rounded-full hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
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

      {/* --- DIÁLOGO DE CREACIÓN RÁPIDA --- */}
      {/* Reutilizamos el mismo componente que en Products, pero conectado al Carrito */}
      <ProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAndAddToCart} // Función especial que crea y agrega al carro
        defaultCode={scannedCodeForNew} // Código que acabas de escanear
      />
    </div>
  )
}
