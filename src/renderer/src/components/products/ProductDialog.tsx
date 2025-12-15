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

  useEffect(() => {
    if (open) {
      form.reset({ code: '', name: '', price: 0 })
    }
  }, [open, form])

  const handleSaveAndClose = (values: ProductFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  const handleSaveAndContinue = (values: ProductFormValues) => {
    onSubmit(values)
    form.reset({
      code: '',
      name: '',
      price: 0
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* SUPERFICIE BLANCA (bg-card) flotando sobre el overlay oscuro */}
      <DialogContent className="sm:max-w-[500px] bg-card border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Nuevo Producto</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete los datos del producto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Código / SKU</FormLabel>
                  <FormControl>
                    {/* INPUT: Fondo 'background' (Gris suave) para contrastar con el modal blanco */}
                    <Input
                      placeholder="Ej. 7791234..."
                      {...field}
                      autoFocus
                      className="bg-background border-input focus:border-primary focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción del producto"
                      {...field}
                      className="bg-background border-input focus:border-primary focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Precio ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      className="bg-background border-input font-mono font-medium focus:border-primary focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-input hover:bg-muted text-foreground"
              >
                Cancelar
              </Button>

              {/* Botón secundario con el texto original restaurado */}
              <Button
                type="button"
                variant="secondary"
                onClick={form.handleSubmit(handleSaveAndContinue)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Guardar y crear otro
              </Button>

              <Button
                type="submit"
                onClick={form.handleSubmit(handleSaveAndClose)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
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
