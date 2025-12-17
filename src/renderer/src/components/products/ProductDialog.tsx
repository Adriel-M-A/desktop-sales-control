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
  productToEdit?: ProductFormData | null // Objeto completo si editamos
  defaultCode?: string // Código solo si es nuevo escaneado
}

export default function ProductDialog({
  open,
  onOpenChange,
  onSubmit,
  productToEdit,
  defaultCode
}: ProductDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    code: '',
    name: '',
    price: ''
  })

  // Estados de interfaz
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Referencias para foco
  const codeInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!productToEdit

  // --- EFECTO DE APERTURA ---
  useEffect(() => {
    if (open) {
      setCodeError(null)
      setIsSubmitting(false)

      if (isEditing && productToEdit) {
        // MODO EDICIÓN: Cargar datos
        setFormData({
          id: productToEdit.id,
          code: productToEdit.code,
          name: productToEdit.name,
          price: productToEdit.price.toString()
        })
        // Enfocar nombre porque el código suele ser fijo
        setTimeout(() => nameInputRef.current?.focus(), 100)
      } else {
        // MODO CREACIÓN: Limpiar o usar defaultCode
        setFormData({
          code: defaultCode || '',
          name: '',
          price: ''
        })
        // Si hay código pre-escaneado, saltar al nombre. Si no, al código.
        setTimeout(() => {
          if (defaultCode) {
            nameInputRef.current?.focus()
          } else {
            codeInputRef.current?.focus()
          }
        }, 100)
      }
    }
  }, [open, productToEdit, defaultCode])

  // --- VALIDACIÓN DE CÓDIGO (Solo si es nuevo) ---
  const checkCodeAvailability = async () => {
    // No validamos duplicados si estamos editando el mismo producto
    if (isEditing) return

    const code = formData.code.trim()
    if (!code) return

    setIsCheckingCode(true)
    try {
      // @ts-ignore
      const existing = await window.api.getProductByCode(code)
      if (existing) {
        setCodeError('Este código ya existe. Escanéalo en la pantalla principal para editar.')
      } else {
        setCodeError(null)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsCheckingCode(false)
    }
  }

  // --- MANEJO DE INPUTS ---
  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'code') setCodeError(null)
  }

  // --- ENTER SALTA AL SIGUIENTE CAMPO ---
  const handleCodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      checkCodeAvailability()
      nameInputRef.current?.focus()
    }
  }

  // --- GUARDAR ---
  const handleSubmit = async (createAnother: boolean) => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)

      if (createAnother && !isEditing) {
        // Solo permitido en creación: Limpiar y enfocar código
        setFormData({ code: '', name: '', price: '' })
        setCodeError(null)
        toast.success('Guardado. Listo para el siguiente.')
        setTimeout(() => codeInputRef.current?.focus(), 100)
      } else {
        onOpenChange(false)
      }
    } catch (error) {
      // Error manejado por el padre
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
              ? 'Modifique los detalles del producto seleccionado.'
              : 'Complete los datos. Use el escáner para mayor velocidad.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          {/* CÓDIGO */}
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
                // Bloqueamos edición de código en modo Edit para evitar conflictos de ID
                disabled={isEditing}
                onChange={(e) => handleChange('code', e.target.value)}
                onBlur={checkCodeAvailability}
                onKeyDown={handleCodeKeyDown}
                placeholder="Escanea o escribe..."
                className={cn(
                  'pl-9 font-mono tracking-wide',
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

          {/* NOMBRE */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Producto</Label>
            <div className="relative">
              <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                ref={nameInputRef}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ej: Alfajor de Maicena"
                className="pl-9"
                autoComplete="off"
              />
            </div>
          </div>

          {/* PRECIO */}
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
                className="pl-9"
              />
            </div>
            {formData.price !== '' && parseFloat(formData.price) <= 0 && (
              <p className="text-xs text-amber-600">El precio debe ser mayor a 0.</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} tabIndex={-1}>
            Cancelar
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Botón Guardar y Otro: Solo visible si estamos CREANDO */}
            {!isEditing && (
              <Button
                variant="secondary"
                onClick={() => handleSubmit(true)}
                disabled={!isValid || isSubmitting}
                className="flex-1 sm:flex-none"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Guardar y Otro
              </Button>
            )}

            <Button
              onClick={() => handleSubmit(false)}
              disabled={!isValid || isSubmitting}
              className="flex-1 sm:flex-none"
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
