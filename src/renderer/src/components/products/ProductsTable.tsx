import { Edit, Trash2, Power, PowerOff } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface Product {
  id: number
  code: string
  name: string
  price: number
  isActive: boolean
}

interface ProductsTableProps {
  products: Product[]
  onEdit: (id: number) => void
  onToggleStatus: (id: number) => void
  onDelete: (id: number) => void
}

export default function ProductsTable({
  products,
  onEdit,
  onToggleStatus,
  onDelete
}: ProductsTableProps) {
  return (
    // Agregamos 'relative' para asegurar el contexto de posicionamiento
    <div className="relative rounded-md border border-border overflow-hidden bg-card">
      <Table>
        {/* CORRECCIÓN AQUÍ:
            - sticky top-0: Fija el encabezado arriba.
            - z-10: Lo pone por encima de las filas.
            - bg-muted: Color sólido para tapar el contenido que pasa por debajo (adiós transparencia).
            - shadow-sm: Un borde sutil para separarlo visualmente al scrollear.
        */}
        <TableHeader className="sticky top-0 z-10 bg-muted shadow-sm">
          <TableRow>
            <TableHead className="w-[120px]">Código</TableHead>
            <TableHead>Nombre del Producto</TableHead>

            {/* Precio alineado a la derecha con padding exacto */}
            <TableHead className="text-right pr-8">Precio</TableHead>

            <TableHead className="text-center w-[100px]">Estado</TableHead>
            <TableHead className="text-center w-[150px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No se encontraron productos.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="group">
                {/* Código */}
                <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                  {product.code}
                </TableCell>

                {/* Nombre */}
                <TableCell className="font-medium">{product.name}</TableCell>

                {/* Precio */}
                <TableCell className="text-right font-bold tabular-nums pr-8">
                  ${product.price.toLocaleString()}
                </TableCell>

                {/* Estado */}
                <TableCell className="text-center">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                      product.isActive
                        ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400'
                    )}
                  >
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>

                {/* Acciones */}
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(product.id)}
                      title="Modificar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8 transition-colors',
                        product.isActive
                          ? 'text-green-600/70 hover:text-green-700 hover:bg-green-50'
                          : 'text-muted-foreground hover:text-green-600'
                      )}
                      onClick={() => onToggleStatus(product.id)}
                      title={product.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {product.isActive ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(product.id)}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
