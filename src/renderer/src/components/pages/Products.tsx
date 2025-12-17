import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

// Hook Personalizado
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner'

import ProductsTable, { Product } from '@/components/products/ProductsTable'
import ProductFilter from '@/components/sales/ProductFilter'
import ProductDialog, { ProductFormData } from '@/components/products/ProductDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const ITEMS_PER_PAGE = 15

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])

  // Estados Modal
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<ProductFormData | null>(null)
  const [scannedCodeForNew, setScannedCodeForNew] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  // --- CARGA ---
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

  // --- LÓGICA ESCÁNER (CON HOOK) ---
  const handleGlobalScan = async (code: string) => {
    const toastId = toast.loading('Procesando código...')
    try {
      // @ts-ignore
      const existing = await window.api.getProductByCode(code)

      if (existing) {
        // MODO EDICIÓN
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
        // MODO CREACIÓN
        toast.info('Código nuevo detectado', { id: toastId })
        setProductToEdit(null)
        setScannedCodeForNew(code)
        setIsDialogOpen(true)
      }
    } catch (error) {
      toast.error('Error de lectura', { id: toastId })
    }
  }

  // Usamos el hook, pero lo desactivamos si el modal ya está abierto
  useBarcodeScanner({
    onScan: handleGlobalScan,
    isActive: !isDialogOpen
  })

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
        // @ts-ignore
        await window.api.updateProduct(values.id, {
          name: values.name,
          price: parseFloat(values.price)
        })
        toast.success('Actualizado correctamente')
      } else {
        // @ts-ignore
        await window.api.createProduct({
          code: values.code,
          name: values.name,
          price: parseFloat(values.price)
        })
        toast.success('Creado correctamente')
      }
      loadProducts(searchQuery, showInactive)
    } catch (error: any) {
      if (error.message?.includes('UNIQUE')) {
        toast.error('El código ya existe')
      } else {
        toast.error('Error al guardar')
      }
      throw error
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
      toast.success('Estado actualizado')
      loadProducts(searchQuery, showInactive)
    } catch (error) {
      toast.error('Error al cambiar estado')
    }
  }

  // Paginación
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="flex h-full w-full flex-col bg-background overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Catálogo</h1>
          <p className="text-sm text-muted-foreground">Gestiona tu inventario.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 shadow-md">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex items-center px-6 py-4 gap-4 justify-between">
        <div className="w-full max-w-sm">
          <ProductFilter onSearch={(val) => setSearchQuery(val)} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInactive(!showInactive)}
          className={`gap-2 ${showInactive ? 'bg-primary/10 text-primary' : ''}`}
        >
          {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {showInactive ? 'Ocultar Inactivos' : 'Ver Inactivos'}
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <ProductsTable
          products={currentProducts}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDelete}
        />
        {/* Controles de Paginación */}
        {products.length > 0 && (
          <div className="flex items-center justify-between py-4">
            <span className="text-xs text-muted-foreground">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, products.length)} de{' '}
              {products.length}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium px-2 py-1 border rounded">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
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
        productToEdit={productToEdit}
        defaultCode={scannedCodeForNew}
      />
    </div>
  )
}
