import { useState, useEffect, useRef } from 'react'
import { Plus, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import ProductsTable, { Product } from '@/components/products/ProductsTable'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductDialog, { ProductFormData } from '@/components/products/ProductDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 15

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])

  // Estados para el Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ProductFormData | null>(null)
  const [scannedCodeForNew, setScannedCodeForNew] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  // Buffer para el escáner global
  const barcodeBuffer = useRef('')
  const lastKeyTime = useRef(Date.now())

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

  // --- LÓGICA DE ESCÁNER GLOBAL ---
  useEffect(() => {
    const handleGlobalScan = async (e: KeyboardEvent) => {
      // Si el modal está abierto o escribimos en un input, ignorar
      if (isDialogOpen) return
      if (document.activeElement instanceof HTMLInputElement) return

      // Buffer de tiempo (velocidad de escáner)
      const currentTime = Date.now()
      if (currentTime - lastKeyTime.current > 100) {
        barcodeBuffer.current = ''
      }
      lastKeyTime.current = currentTime

      if (e.key === 'Enter') {
        const code = barcodeBuffer.current.trim()

        if (code.length > 0) {
          // Guardamos el ID de la notificación
          const toastId = toast.loading('Procesando código...')

          try {
            // @ts-ignore
            const existing = await window.api.getProductByCode(code)

            if (existing) {
              // EXISTE -> MODO EDICIÓN (Actualizamos el toast a Success)
              toast.success('Producto encontrado', { id: toastId })

              setProductToEdit({
                id: existing.id,
                code: existing.code,
                name: existing.name,
                price: existing.price
              })
              setScannedCodeForNew('')
              setIsDialogOpen(true)
            } else {
              // NO EXISTE -> MODO CREACIÓN (Actualizamos el toast a Info)
              toast.info('Código nuevo detectado', { id: toastId })

              setProductToEdit(null)
              setScannedCodeForNew(code)
              setIsDialogOpen(true)
            }
          } catch (error) {
            console.error(error)
            // Error -> Actualizamos el toast a Error
            toast.error('Error al leer código', { id: toastId })
          }
        }
        barcodeBuffer.current = ''
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key
      }
    }

    window.addEventListener('keydown', handleGlobalScan)
    return () => window.removeEventListener('keydown', handleGlobalScan)
  }, [isDialogOpen])

  // --- CRUD HANDLERS ---

  const handleOpenCreate = () => {
    setProductToEdit(null)
    setScannedCodeForNew('')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (id: number) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      setProductToEdit({
        id: product.id,
        code: product.code,
        name: product.name,
        price: product.price.toString()
      })
      setScannedCodeForNew('')
      setIsDialogOpen(true)
    }
  }

  const handleSaveProduct = async (values: ProductFormData) => {
    try {
      if (productToEdit && values.id) {
        // ACTUALIZAR
        // @ts-ignore
        await window.api.updateProduct(values.id, {
          name: values.name,
          price: parseFloat(values.price)
        })
        toast.success('Producto actualizado correctamente')
      } else {
        // CREAR
        // @ts-ignore
        await window.api.createProduct({
          code: values.code,
          name: values.name,
          price: parseFloat(values.price)
        })
        toast.success('Producto creado correctamente')
      }
      loadProducts(searchQuery, showInactive)
    } catch (error: any) {
      if (error.message?.includes('UNIQUE')) {
        toast.error('Error: El código ya existe')
      } else {
        toast.error('Error al guardar')
      }
      throw error // Re-lanza para que el dialog sepa que falló y pare el spinner
    }
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
          onClick={handleOpenCreate}
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
          onEdit={handleOpenEdit}
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
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSaveProduct}
        productToEdit={productToEdit} // Pasa el producto a editar
        defaultCode={scannedCodeForNew} // Pasa el código nuevo escaneado
      />
    </div>
  )
}
