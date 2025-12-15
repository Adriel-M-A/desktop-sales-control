import { ShoppingCart, Package, Settings } from 'lucide-react'
import { title } from 'process'

export const menuConfig = [
  {
    title: 'Puntos de venta',
    icon: ShoppingCart,
    href: '/points-of-sale'
  },
  { title: 'Productos', icon: Package, href: '/products' },
  {
    title: 'Configuración',
    icon: Settings,
    href: '/settings'
  }
]
