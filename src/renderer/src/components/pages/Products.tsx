import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductsTable, { Product } from '@/components/products/ProductsTable'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductDialog from '@/components/products/ProductDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// ... (MOCK_DATA se mantiene igual)
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleEdit = (id: number) => console.log('Modificar', id)
  const handleToggle = (id: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }
  const handleDelete = (id: number) => console.log('Eliminar', id)

  const handleCreateProduct = (values: { code: string; name: string; price: number }) => {
    const newProduct: Product = {
      id: Date.now() + Math.random(),
      ...values,
      isActive: true
    }
    setProducts((prev) => [newProduct, ...prev])
    toast.success('Producto guardado')
  }

  return (
    // 1. LIENZO BASE: 'bg-background' (Gris Suave)
    <div className="flex h-full w-full flex-col bg-background overflow-hidden">
      {/* Header: Se integra con el fondo gris */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventario</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu catálogo y precios.</p>
        </div>

        {/* Botón Principal: Azul Vibrante (Primary) */}
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Separator className="bg-border/60" />

      {/* Barra de Filtros: Fondo gris sutil para diferenciar del contenido */}
      <div className="flex items-center px-6 py-4 gap-4">
        <div className="w-full max-w-sm">
          {/* El ProductFilter ya es blanco (bg-card), así que resalta aquí */}
          <ProductFilter />
        </div>
      </div>

      {/* Área de Contenido: Padding para dejar ver el fondo gris alrededor de la tabla */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <ProductsTable
          products={currentProducts}
          onEdit={handleEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDelete}
        />

        {/* Paginación: Integrada visualmente al pie de la tabla o flotando */}
        <div className="flex items-center justify-between py-4">
          <div className="text-xs text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, products.length)} de{' '}
            {products.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-card hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium px-2 min-w-[3rem] text-center bg-card py-1 rounded-md border shadow-sm">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-card hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
