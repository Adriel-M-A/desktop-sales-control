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
import { ScanBarcode, Package, DollarSign, Loader2, Save, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { code: string; name: string; price: number }) => Promise<void>
}

export default function ProductDialog({ open, onOpenChange, onSubmit }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: ''
  })

  // Estados de validación
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Referencias para el foco
  const codeInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Resetear formulario al abrir
  useEffect(() => {
    if (open) {
      setFormData({ code: '', name: '', price: '' })
      setCodeError(null)
      setIsSubmitting(false)
      // Auto-foco con pequeño delay para esperar la animación
      setTimeout(() => codeInputRef.current?.focus(), 100)
    }
  }, [open])

  // --- VALIDACIÓN DE CÓDIGO EXISTENTE ---
  const checkCodeAvailability = async () => {
    const code = formData.code.trim()
    if (!code) return

    setIsCheckingCode(true)
    try {
      // @ts-ignore
      // Reutilizamos la función que creamos para el escáner
      const existing = await window.api.getProductByCode(code)

      if (existing) {
        setCodeError('Este código ya está en uso.')
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
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Si cambian el código, limpiamos el error hasta que validen de nuevo
    if (field === 'code') setCodeError(null)
  }

  // --- MANEJO DE TECLAS (ESCÁNER) ---
  const handleCodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Validamos el código al dar enter
      checkCodeAvailability()
      // Saltamos al siguiente campo
      nameInputRef.current?.focus()
    }
  }

  // --- GUARDADO ---
  const handleSubmit = async (createAnother: boolean) => {
    setIsSubmitting(true)

    try {
      await onSubmit({
        code: formData.code,
        name: formData.name,
        price: parseFloat(formData.price)
      })

      if (createAnother) {
        // Resetear para el siguiente
        setFormData({ code: '', name: '', price: '' })
        setCodeError(null)
        toast.success('Producto guardado. Listo para el siguiente.')
        // Re-enfocar código
        setTimeout(() => codeInputRef.current?.focus(), 100)
      } else {
        onOpenChange(false)
      }
    } catch (error) {
      // El error lo maneja el padre, pero aquí liberamos el loading
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- VALIDACIÓN GENERAL ---
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
            <Package className="h-5 w-5 text-primary" />
            Nuevo Producto
          </DialogTitle>
          <DialogDescription>
            Complete los datos. Use el escáner para mayor velocidad.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          {/* CÓDIGO */}
          <div className="grid gap-2">
            <Label htmlFor="code" className="flex justify-between">
              Código de Barras
              {isCheckingCode && (
                <span className="text-xs text-muted-foreground animate-pulse">Verificando...</span>
              )}
            </Label>
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
                onChange={(e) => handleChange('code', e.target.value)}
                onBlur={checkCodeAvailability} // Validar al salir del campo
                onKeyDown={handleCodeKeyDown} // Salto con Enter
                placeholder="Escanea o escribe..."
                className={cn(
                  'pl-9 font-mono tracking-wide',
                  codeError && 'border-red-500 focus-visible:ring-red-500'
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
                min="0.01" // HTML validation visual
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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            tabIndex={-1} // Sacar del ciclo de tabulación para ir directo a guardar
          >
            Cancelar
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* BOTÓN: GUARDAR Y OTRO */}
            <Button
              variant="secondary"
              onClick={() => handleSubmit(true)}
              disabled={!isValid || isSubmitting}
              className="flex-1 sm:flex-none"
              title="Guardar y limpiar para cargar otro"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Guardar y Otro
            </Button>

            {/* BOTÓN: GUARDAR Y CERRAR */}
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
              Guardar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
