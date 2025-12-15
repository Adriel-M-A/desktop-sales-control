import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, PackagePlus } from 'lucide-react'
import ProductsTable, { Product } from '@/components/products/ProductsTable'
import ProductFilter from '@/components/sales/ProductFilter' // Reutilizamos el filtro
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Mock Data Generada (50 productos para probar paginación)
const MOCK_DATA: Product[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  code: `779${Math.floor(Math.random() * 1000000000)}`, // Código de barras simulado
  name: `Producto de Ejemplo ${i + 1} - Descripción`,
  price: Math.floor(Math.random() * 50000) + 1000,
  isActive: i % 5 !== 0 // Algunos inactivos
}))

const ITEMS_PER_PAGE = 15

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>(MOCK_DATA)
  // Estado para el término de búsqueda (en una app real conectarías esto al ProductFilter)

  // LOGICA DE FILTRADO Y PAGINACIÓN
  // Nota: En una app real, el filtrado debería reiniciar la página a 1
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // HANDLERS (Simulados)
  const handleEdit = (id: number) => console.log('Modificar', id)
  const handleToggle = (id: number) => {
    // Simulación de cambio de estado optimista
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }
  const handleDelete = (id: number) => console.log('Eliminar', id)
  const handleCreate = () => console.log('Crear Nuevo Producto')

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-hidden">
      {/* 1. Header de la Página */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario de Productos</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu catálogo, precios y stock.</p>
        </div>

        {/* Botones de Acción Principal */}
        <div className="flex gap-2">
          {/* Botón para crear uno */}
          <Button onClick={handleCreate} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>

          {/* Botón opcional para carga masiva u otra acción */}
          <Button variant="outline" size="icon" title="Carga Masiva / Varios">
            <PackagePlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* 2. Barra de Herramientas (Filtros) */}
      <div className="flex items-center p-4 gap-4 bg-muted/5">
        <div className="w-full max-w-sm">
          {/* Reutilizamos el filtro visualmente, aunque la lógica de búsqueda
              iría conectada aquí mediante props en el futuro */}
          <ProductFilter />
        </div>
        {/* Aquí podrías agregar filtros extra (Select de Categorías, Estado, etc.) */}
      </div>

      {/* 3. Tabla con Scroll */}
      <div className="flex-1 overflow-auto p-6 pt-0">
        <ProductsTable
          products={currentProducts}
          onEdit={handleEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* 4. Footer con Paginación */}
      <div className="flex items-center justify-between border-t border-border bg-background p-4">
        <div className="text-sm text-muted-foreground">
          Mostrando <strong>{startIndex + 1}</strong> a{' '}
          <strong>{Math.min(startIndex + ITEMS_PER_PAGE, products.length)}</strong> de{' '}
          <strong>{products.length}</strong> productos
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <div className="text-sm font-medium px-2">
            Página {currentPage} de {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
