import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ShoppingCart, ChevronUp, X } from 'lucide-react'
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner'
import Cart from '@/components/cart/Cart'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductGrid from '@/components/sales/ProductGrid'
import ProductDialog, { ProductFormData } from '@/components/products/ProductDialog'

import { Product } from '@/components/products/ProductsTable'

import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CartItem extends Product {
  quantity: number
}

export default function Sales(): React.ReactElement {
  // --- ESTADOS ---
  // Forzamos el uso de la interfaz importada
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo')
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [scannedCodeForNew, setScannedCodeForNew] = useState('')

  // --- CARGA DE PRODUCTOS ---
  const loadProducts = async (search = ''): Promise<void> => {
    try {
      const data = await window.api.products.getAll({ search })

      // Mapeo riguroso para asegurar que isActive exista
      const formattedData: Product[] = data.map((p: any) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        price: p.price,
        isActive: Boolean(p.is_active ?? p.isActive ?? true)
      }))

      setProducts(formattedData)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      toast.error('Error al conectar con la base de datos')
    }
  }

  useEffect(() => {
    loadProducts(searchQuery)
  }, [searchQuery])

  // --- LÓGICA DEL CARRITO ---
  const addToCart = (product: Product): void => {
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

  // ... (removeFromCart, updateQuantity, clearCart se mantienen igual)
  const removeFromCart = (id: number): void => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number): void => {
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

  const clearCart = (): void => setCart([])

  // --- LÓGICA DE ESCÁNER ---
  const handleProductScan = async (code: string): Promise<void> => {
    if (isCreateDialogOpen) return

    const toastId = toast.loading('Buscando...')
    try {
      const product = await window.api.products.getByCode(code)

      if (product) {
        // Formateo manual para asegurar isActive antes de enviar a addToCart
        const validatedProduct: Product = {
          id: product.id,
          code: product.code,
          name: product.name,
          price: product.price,
          isActive: Boolean(product.is_active ?? product.isActive ?? true)
        }
        addToCart(validatedProduct)
        toast.success(`Agregado: ${validatedProduct.name}`, { id: toastId })
      } else {
        toast.error('Producto no encontrado', {
          id: toastId,
          description: `El código ${code} no existe.`,
          action: {
            label: 'Crear Ahora',
            onClick: () => {
              setScannedCodeForNew(code)
              setIsCreateDialogOpen(true)
            }
          },
          duration: 5000
        })
      }
    } catch (error) {
      toast.error('Error de lectura', { id: toastId })
    }
  }

  useBarcodeScanner({
    onScan: handleProductScan,
    isActive: !isCreateDialogOpen
  })

  const handleCreateAndAddToCart = async (values: ProductFormData): Promise<void> => {
    try {
      const result = await window.api.products.create({
        code: values.code,
        name: values.name,
        price: parseFloat(values.price)
      })

      const newProduct: Product = {
        id: result.lastInsertRowid || Date.now(),
        code: values.code,
        name: values.name,
        price: parseFloat(values.price),
        isActive: true // Requerido por la interfaz oficial
      }

      addToCart(newProduct)
      toast.success('Producto creado y agregado al carrito')
      loadProducts(searchQuery)
      setScannedCodeForNew('')
    } catch (error: any) {
      toast.error('Error al crear producto')
      throw error
    }
  }

  const handleCheckout = async (paymentMethodOverride?: string): Promise<void> => {
    if (cart.length === 0) return
    const method = paymentMethodOverride || selectedPaymentMethod
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    try {
      const result = await window.api.sales.create({
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
        toast.success(`Venta registrada`)
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
      <div className="flex flex-1 flex-col h-full min-w-0">
        <div className="flex-none p-4">
          <ProductFilter onSearch={setSearchQuery} />
        </div>
        <Separator className="flex-none bg-border/60" />
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 p-1 internally-scrollable">
          <ProductGrid products={products} onAddToCart={addToCart} />
        </div>
      </div>

      <aside className="hidden md:flex w-[320px] lg:w-[420px] flex-col h-full border-l border-border bg-card shadow-xl z-20 overflow-hidden">
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
      </aside>

      {/* VERSIÓN MÓVIL (SHEET) */}
      <div className="md:hidden">
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-30">
          <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="w-full h-14 justify-between shadow-md no-drag">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                        {totalItems}
                      </Badge>
                    )}
                  </div>
                  <span className="font-semibold">Ver Carrito</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">${totalAmount.toLocaleString()}</span>
                  <ChevronUp className="h-5 w-5 opacity-70" />
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[100vh] p-0 flex flex-col [&>button]:hidden">
              <SheetTitle className="sr-only">Carrito de Ventas</SheetTitle>
              <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h2 className="font-bold text-lg">Tu Pedido</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileCartOpen(false)}
                  className="rounded-full no-drag"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
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

      <ProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAndAddToCart}
        defaultCode={scannedCodeForNew}
      />
    </div>
  )
}
