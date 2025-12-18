import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner'
import ProductsTable, { Product } from '@/components/products/ProductsTable'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductDialog, { ProductFormData } from '@/components/products/ProductDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const ITEMS_PER_PAGE = 15

export default function Products(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])

  // Estados para el Modal de Producto
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<any | null>(null)
  const [scannedCodeForNew, setScannedCodeForNew] = useState('')

  // Estados de Filtro
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  /**
   * Carga los productos usando la nueva API modularizada.
   * @param search Término de búsqueda.
   * @param showAll Booleano para incluir productos inactivos.
   */
  const loadProducts = async (search = '', showAll = false): Promise<void> => {
    try {
      // Cambio: de api.getProducts a api.products.getAll
      const data = await window.api.products.getAll({
        search,
        includeInactive: showAll
      })

      const formattedData = data.map((p: any) => ({
        ...p,
        isActive: Boolean(p.is_active)
      }))

      setProducts(formattedData)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      toast.error('Error al cargar la lista de productos')
    }
  }

  // Recargar productos cuando cambian los filtros
  useEffect(() => {
    loadProducts(searchQuery, showInactive)
  }, [searchQuery, showInactive])

  /**
   * Lógica de Escáner Global:
   * Si el código existe, abre el modal para editar. Si no, para crear.
   */
  const handleGlobalScan = async (code: string): Promise<void> => {
    const toastId = toast.loading('Procesando código...')
    try {
      // Cambio: de api.getProductByCode a api.products.getByCode
      const existing = await window.api.products.getByCode(code)

      if (existing) {
        toast.success('Producto encontrado', { id: toastId })
        setProductToEdit(existing)
        setScannedCodeForNew('')
        setIsDialogOpen(true)
      } else {
        toast.info('Código nuevo detectado', { id: toastId })
        setProductToEdit(null)
        setScannedCodeForNew(code)
        setIsDialogOpen(true)
      }
    } catch (error) {
      toast.error('Error de lectura', { id: toastId })
    }
  }

  // Activamos el escáner solo cuando el modal no está interfiriendo
  useBarcodeScanner({
    onScan: handleGlobalScan,
    isActive: !isDialogOpen
  })

  // --- HANDLERS DE ACCIONES ---

  const handleOpenCreate = (): void => {
    setProductToEdit(null)
    setScannedCodeForNew('')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (id: number): void => {
    const product = products.find((p) => p.id === id)
    if (product) {
      setProductToEdit(product)
      setScannedCodeForNew('')
      setIsDialogOpen(true)
    }
  }

  const handleSaveProduct = async (values: ProductFormData): Promise<void> => {
    try {
      if (productToEdit && productToEdit.id) {
        await window.api.products.update({
          id: productToEdit.id,
          name: values.name,
          price: parseFloat(values.price)
        })
        toast.success('Producto actualizado correctamente')
      } else {
        await window.api.products.create({
          code: values.code,
          name: values.name,
          price: parseFloat(values.price)
        })
        toast.success('Producto creado correctamente')
      }
      loadProducts(searchQuery, showInactive)
    } catch (error: any) {
      if (error.message?.includes('UNIQUE')) {
        toast.error('El código de barras ya existe')
      } else {
        toast.error('Error al guardar el producto')
      }
      throw error
    }
  }

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await window.api.products.delete(id)
      toast.success('Producto desactivado (eliminación lógica)')
      loadProducts(searchQuery, showInactive)
    } catch (error) {
      toast.error('Error al eliminar el producto')
    }
  }

  const handleToggle = async (id: number): Promise<void> => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    try {
      await window.api.products.toggleStatus(id, !product.isActive)
      toast.success('Estado del producto actualizado')
      loadProducts(searchQuery, showInactive)
    } catch (error) {
      toast.error('Error al cambiar el estado')
    }
  }

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-hidden">
      {/* Cabecera de la Página */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Catálogo</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu inventario de productos.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 shadow-md no-drag">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <Separator className="bg-border/60" />

      {/* Filtros y Herramientas */}
      <div className="flex items-center px-6 py-4 gap-4 justify-between">
        <div className="w-full max-w-sm">
          <ProductFilter
            onSearch={(val) => {
              setSearchQuery(val)
              setCurrentPage(1)
            }}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInactive(!showInactive)}
          className={`gap-2 no-drag ${showInactive ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
        >
          {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {showInactive ? 'Ocultar Inactivos' : 'Ver Inactivos'}
        </Button>
      </div>

      {/* Tabla de Resultados */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <ProductsTable
          products={currentProducts}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDelete}
        />

        {/* Controles de Paginación */}
        {products.length > 0 && (
          <div className="flex items-center justify-between py-4 border-t border-border/40 mt-4">
            <span className="text-xs text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, products.length)} de{' '}
              {products.length} productos
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="no-drag"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium px-3 py-1 border rounded bg-muted/30">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="no-drag"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Diálogo Modular de Producto */}
      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSaveProduct}
        product={productToEdit}
        defaultCode={scannedCodeForNew}
      />
    </div>
  )
}
