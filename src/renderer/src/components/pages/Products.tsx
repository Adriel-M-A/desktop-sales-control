import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import ProductsTable, { Product } from '@/components/products/ProductsTable'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductDialog from '@/components/products/ProductDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 15

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  const loadProducts = async (search = '', showAll = false) => {
    try {
      // @ts-ignore
      const data = await window.api.getProducts(search, showAll)

      const formattedData = data.map((p: any) => ({
        ...p,
        isActive: Boolean(p.is_active)
      }))

      setProducts(formattedData)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar productos')
    }
  }

  useEffect(() => {
    loadProducts(searchQuery, showInactive)
  }, [searchQuery, showInactive])

  const handleCreateProduct = async (values: { code: string; name: string; price: number }) => {
    try {
      // @ts-ignore
      await window.api.createProduct(values)
      toast.success('Producto guardado correctamente')
      loadProducts(searchQuery, showInactive)
    } catch (error: any) {
      if (error.message?.includes('UNIQUE')) {
        toast.error('Error: El código ya existe')
      } else {
        toast.error('Error al guardar')
      }
    }
  }

  const handleEdit = (id: number) => {
    toast.info('Edición próximamente')
  }

  const handleDelete = async (id: number) => {
    try {
      // @ts-ignore
      await window.api.deleteProduct(id)
      toast.success('Producto desactivado')
      loadProducts(searchQuery, showInactive)
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  const handleToggle = async (id: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    try {
      // @ts-ignore
      await window.api.toggleProductStatus(id, !product.isActive)
      toast.success(product.isActive ? 'Producto desactivado' : 'Producto reactivado')
      loadProducts(searchQuery, showInactive)
    } catch (error) {
      toast.error('Error al cambiar estado')
    }
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Catálogo de Productos
          </h1>
          <p className="text-sm text-muted-foreground">Gestiona tu catálogo y precios.</p>
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex items-center px-6 py-4 gap-4 justify-between">
        <div className="w-full max-w-sm">
          <ProductFilter onSearch={(val) => setSearchQuery(val)} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInactive(!showInactive)}
            className={`gap-2 transition-all ${showInactive ? 'bg-primary/10 border-primary text-primary' : 'bg-card text-muted-foreground'}`}
          >
            {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showInactive ? 'Ocultar Inactivos' : 'Ver Inactivos'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <ProductsTable
          products={currentProducts}
          onEdit={handleEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDelete}
        />

        {products.length > 0 && (
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
        )}
      </div>

      <ProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProduct}
      />
    </div>
  )
}
