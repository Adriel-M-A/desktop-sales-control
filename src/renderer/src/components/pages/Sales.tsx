import { useState, useEffect } from 'react'
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

  const loadProducts = async (search = '') => {
    try {
      const data = await window.api.getProducts(search)
      setProducts(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadProducts(searchQuery)
  }, [searchQuery])

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
      <div className="flex flex-1 flex-col h-full min-w-0 min-h-0">
        <div className="flex-none p-4">
          <ProductFilter onSearch={setSearchQuery} />
        </div>

        <Separator className="flex-none bg-border/60" />

        <ProductGrid products={products} onAddToCart={addToCart} />
      </div>

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
