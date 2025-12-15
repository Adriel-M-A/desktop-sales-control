import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductsTable, { Product } from '@/components/products/ProductsTable'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductDialog from '@/components/products/ProductDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// ... (MOCK_DATA se mantiene igual) ...
const MOCK_DATA: Product[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  code: `779${Math.floor(Math.random() * 1000000000)}`,
  name: `Producto de Ejemplo ${i + 1}`,
  price: Math.floor(Math.random() * 50000) + 1000,
  isActive: i % 5 !== 0
}))

const ITEMS_PER_PAGE = 15

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>(MOCK_DATA)

  // Estado solo para el diálogo simple
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Paginación
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Handlers
  const handleEdit = (id: number) => console.log('Modificar', id)
  const handleToggle = (id: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }
  const handleDelete = (id: number) => console.log('Eliminar', id)

  // Handler de Creación (Ahora soporta múltiples llamadas consecutivas)
  const handleCreateProduct = (values: { code: string; name: string; price: number }) => {
    const newProduct: Product = {
      id: Date.now() + Math.random(), // ID único simple
      ...values,
      isActive: true
    }

    // Agregamos al principio
    setProducts((prev) => [newProduct, ...prev])
    toast.success('Producto guardado')
  }

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario de Productos</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu catálogo con sus precios.</p>
        </div>

        {/* Botón Único de Creación */}
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Separator />

      <div className="flex items-center p-4 gap-4 bg-muted/5">
        <div className="w-full max-w-sm">
          <ProductFilter />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 pt-0">
        <ProductsTable
          products={currentProducts}
          onEdit={handleEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      <div className="flex items-center justify-between border-t border-border bg-background p-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, products.length)} de{' '}
          {products.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <div className="text-sm font-medium px-2">Página {currentPage}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Diálogo */}
      <ProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProduct}
      />
    </div>
  )
}
