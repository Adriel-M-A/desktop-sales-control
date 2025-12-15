import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const productSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  price: z.coerce
    .number({ invalid_type_error: 'Debe ser un número' })
    .min(0, 'El precio no puede ser negativo')
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ProductFormValues) => void
}

export default function ProductDialog({ open, onOpenChange, onSubmit }: ProductDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: '',
      name: '',
      price: 0
    }
  })

  // Reiniciar formulario al abrir
  useEffect(() => {
    if (open) {
      form.reset({ code: '', name: '', price: 0 })
    }
  }, [open, form])

  // Acción 1: Guardar y Cerrar (Comportamiento estándar)
  const handleSaveAndClose = (values: ProductFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  // Acción 2: Guardar y Continuar (Nuevo comportamiento)
  const handleSaveAndContinue = (values: ProductFormValues) => {
    onSubmit(values)

    // Reseteamos el formulario a valores vacíos para el siguiente
    form.reset({
      code: '',
      name: '',
      price: 0
    })

    // Opcional: Podrías hacer focus manual al primer input si fuera necesario,
    // pero React Hook Form suele manejar bien el ciclo de vida.
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogDescription>Complete los datos del producto.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {/* Usamos preventDefault en el form para manejar los botones manualmente */}
          <form className="space-y-4 py-4">
            {/* Código */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código / SKU</FormLabel>
                  <FormControl>
                    {/* autoFocus ayuda a iniciar escribiendo rápido */}
                    <Input placeholder="Ej. 7791234..." {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              {/* Botón Cancelar */}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>

              {/* Botón Guardar y Seguir (Secundario) */}
              <Button
                type="button"
                variant="secondary"
                onClick={form.handleSubmit(handleSaveAndContinue)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Guardar y crear otro
              </Button>

              {/* Botón Guardar y Cerrar (Principal) */}
              <Button type="submit" onClick={form.handleSubmit(handleSaveAndClose)}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
