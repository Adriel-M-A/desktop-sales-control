import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScanBarcode, Package, DollarSign, Loader2, Save, PlusCircle, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/**
 * Interfaz para los datos del formulario de productos.
 */
export interface ProductFormData {
  id?: number
  code: string
  name: string
  price: string
}

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ProductFormData) => Promise<void>
  product?: ProductFormData | null // Objeto para edición
  defaultCode?: string // Código detectado por escáner
}

export default function ProductDialog({
  open,
  onOpenChange,
  onSubmit,
  product,
  defaultCode
}: ProductDialogProps): React.ReactElement {
  const [formData, setFormData] = useState<ProductFormData>({
    code: '',
    name: '',
    price: ''
  })

  // Estados de validación e interfaz
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Referencias para manejo de foco manual
  const codeInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!product

  // --- EFECTO DE SINCRONIZACIÓN DE DATOS ---
  useEffect(() => {
    if (open) {
      setCodeError(null)
      setIsSubmitting(false)

      if (isEditing && product) {
        // MODO EDICIÓN: Poblamos con datos existentes
        setFormData({
          id: product.id,
          code: product.code,
          name: product.name,
          price: product.price.toString()
        })
        // Enfocamos el nombre ya que el código suele ser inmutable en edición
        setTimeout(() => nameInputRef.current?.focus(), 100)
      } else {
        // MODO CREACIÓN: Limpio o con código pre-escaneado
        setFormData({
          code: defaultCode || '',
          name: '',
          price: ''
        })
        // Gestión inteligente del foco inicial
        setTimeout(() => {
          if (defaultCode) {
            nameInputRef.current?.focus()
          } else {
            codeInputRef.current?.focus()
          }
        }, 100)
      }
    }
  }, [open, product, defaultCode])

  // --- VALIDACIÓN DE DISPONIBILIDAD DE CÓDIGO ---
  const checkCodeAvailability = async (): Promise<void> => {
    if (isEditing) return

    const code = formData.code.trim()
    if (!code) return

    setIsCheckingCode(true)
    try {
      // Cambio: Uso de la nueva API modular products.getByCode
      const existing = await window.api.products.getByCode(code)
      if (existing) {
        setCodeError('Este código ya existe en el inventario.')
      } else {
        setCodeError(null)
      }
    } catch (error) {
      console.error('Error verificando código:', error)
    } finally {
      setIsCheckingCode(false)
    }
  }

  // --- MANEJADORES DE EVENTOS ---
  const handleChange = (field: keyof ProductFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'code') setCodeError(null)
  }

  const handleCodeKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      checkCodeAvailability()
      nameInputRef.current?.focus()
    }
  }

  const handleSubmit = async (createAnother: boolean): Promise<void> => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)

      if (createAnother && !isEditing) {
        // Lógica de creación rápida en serie
        setFormData({ code: '', name: '', price: '' })
        setCodeError(null)
        toast.success('Producto guardado. Ingrese el siguiente.')
        setTimeout(() => codeInputRef.current?.focus(), 100)
      } else {
        onOpenChange(false)
      }
    } catch (error) {
      // El error es capturado por el componente padre para mostrar el toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid =
    formData.code.trim() !== '' &&
    formData.name.trim() !== '' &&
    formData.price !== '' &&
    parseFloat(formData.price) > 0 &&
    codeError === null &&
    !isCheckingCode

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isEditing ? (
              <Pencil className="h-5 w-5 text-primary" />
            ) : (
              <Package className="h-5 w-5 text-primary" />
            )}
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifique los campos necesarios para actualizar el producto.'
              : 'Ingrese la información del nuevo producto o use el escáner.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          {/* CAMPO: CÓDIGO DE BARRAS */}
          <div className="grid gap-2">
            <Label htmlFor="code">Código de Barras</Label>
            <div className="relative">
              <ScanBarcode
                className={cn(
                  'absolute left-3 top-2.5 h-4 w-4 transition-colors',
                  codeError ? 'text-red-500' : 'text-muted-foreground'
                )}
              />
              <Input
                id="code"
                ref={codeInputRef}
                value={formData.code}
                disabled={isEditing}
                onChange={(e) => handleChange('code', e.target.value)}
                onBlur={checkCodeAvailability}
                onKeyDown={handleCodeKeyDown}
                placeholder="Escanee el código..."
                className={cn(
                  'pl-9 font-mono tracking-wide no-drag',
                  codeError && 'border-red-500 focus-visible:ring-red-500',
                  isEditing && 'bg-muted text-muted-foreground'
                )}
                autoComplete="off"
              />
            </div>
            {codeError && (
              <p className="text-xs font-medium text-red-500 animate-in slide-in-from-left-1">
                {codeError}
              </p>
            )}
          </div>

          {/* CAMPO: NOMBRE */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <div className="relative">
              <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                ref={nameInputRef}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nombre descriptivo..."
                className="pl-9 no-drag"
                autoComplete="off"
              />
            </div>
          </div>

          {/* CAMPO: PRECIO */}
          <div className="grid gap-2">
            <Label htmlFor="price">Precio de Venta</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                className="pl-9 no-drag"
              />
            </div>
            {formData.price !== '' && parseFloat(formData.price) <= 0 && (
              <p className="text-xs text-amber-600">El precio debe ser mayor a cero.</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="no-drag"
            tabIndex={-1}
          >
            Cancelar
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            {!isEditing && (
              <Button
                variant="secondary"
                onClick={() => handleSubmit(true)}
                disabled={!isValid || isSubmitting}
                className="flex-1 sm:flex-none no-drag"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Guardar y Otro
              </Button>
            )}

            <Button
              onClick={() => handleSubmit(false)}
              disabled={!isValid || isSubmitting}
              className="flex-1 sm:flex-none no-drag"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
