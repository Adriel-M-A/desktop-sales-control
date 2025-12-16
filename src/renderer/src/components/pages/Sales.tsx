import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import Cart from '@/components/cart/Cart'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductGrid from '@/components/sales/ProductGrid'
import { Separator } from '@/components/ui/separator'

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
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo')

  // Buffer para almacenar las teclas del escáner temporalmente
  const barcodeBuffer = useRef('')
  const lastKeyTime = useRef(Date.now())

  // --- CARGA DE PRODUCTOS (Grilla) ---
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

  // --- LÓGICA DE ESCANEO INVISIBLE (GLOBAL) ---
  useEffect(() => {
    const handleGlobalKeyDown = async (e: KeyboardEvent) => {
      // 1. Calculamos tiempo entre teclas para saber si es escáner o humano
      const currentTime = Date.now()
      const timeDiff = currentTime - lastKeyTime.current
      lastKeyTime.current = currentTime

      // Si pasa mucho tiempo (ej: más de 100ms) entre teclas, reiniciamos el buffer
      // (Asumimos que el escáner escribe muy rápido)
      if (timeDiff > 100) {
        barcodeBuffer.current = ''
      }

      // 2. Si es ENTER, intentamos procesar el código acumulado
      if (e.key === 'Enter') {
        const code = barcodeBuffer.current

        if (code.length > 0) {
          // Intentamos buscar el producto
          try {
            // @ts-ignore
            const product = await window.api.getProductByCode(code)

            if (product) {
              // ¡ÉXITO! Lo encontramos, lo agregamos al carrito
              addToCart(product)
              toast.success(`Escaneado: ${product.name}`)

              // Opcional: Si el foco estaba en el buscador, limpiamos el buscador
              // para que no quede el número escrito ahí molestando.
              if (document.activeElement instanceof HTMLInputElement) {
                document.activeElement.value = ''
                // Disparamos evento de cambio para que React se entere (si fuera necesario)
                setSearchQuery('')
              }
            }
            // Nota: Si no encuentra producto, no hacemos nada (silencioso)
            // para no molestar si el usuario estaba simplemente dando Enter en otro lado.
          } catch (error) {
            console.error('Error scanning:', error)
          }
        }

        // Limpiamos buffer después del Enter
        barcodeBuffer.current = ''
        return
      }

      // 3. Si es una tecla imprimible (letra o número), la guardamos en el buffer
      if (e.key.length === 1) {
        barcodeBuffer.current += e.key
      }
    }

    // Activamos el listener
    window.addEventListener('keydown', handleGlobalKeyDown)

    // Limpieza al salir de la página
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, []) // El array vacío asegura que el listener se crea una sola vez,
  // pero ojo: addToCart debe ser estable o usarse dentro de setProducts/setCart

  // --- PROCESAR VENTA ---
  const handleCheckout = async () => {
    if (cart.length === 0) return

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    try {
      const saleData = {
        paymentMethod: selectedPaymentMethod,
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
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al procesar la venta')
    }
  }

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* SECCIÓN PRINCIPAL: FILTROS + GRILLA */}
      <div className="flex flex-1 flex-col h-full min-w-0 min-h-0">
        <div className="flex-none p-4">
          <ProductFilter onSearch={setSearchQuery} />
        </div>

        <Separator className="flex-none bg-border/60" />

        <ProductGrid products={products} onAddToCart={addToCart} />
      </div>

      {/* SECCIÓN LATERAL: CARRITO */}
      <aside className="hidden md:flex w-[450px] flex-col h-full border-l border-border bg-card shadow-xl z-20 overflow-hidden">
        <Cart
          items={cart}
          selectedPaymentMethod={selectedPaymentMethod}
          onSelectPaymentMethod={setSelectedPaymentMethod}
          onIncrease={(id) => updateQuantity(id, 1)}
          onDecrease={(id) => updateQuantity(id, -1)}
          onRemove={removeFromCart}
          onClear={clearCart}
          onCheckout={handleCheckout}
        />
      </aside>
    </div>
  )
}
