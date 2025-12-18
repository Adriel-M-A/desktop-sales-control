// src/renderer/src/components/products/ProductsTable.tsx
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

/**
 * Interfaz unificada de Producto para toda la aplicación.
 * Se asegura que isActive sea requerido para evitar errores de tipado en Sales y Products.
 */
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

/**
 * Tabla de gestión de productos del catálogo.
 * Muestra información detallada y permite acciones de edición, activación y eliminación.
 */
export default function ProductsTable({
  products,
  onEdit,
  onToggleStatus,
  onDelete
}: ProductsTableProps): React.ReactElement {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-b-border">
            <TableHead className="w-[120px] font-semibold text-foreground">Código</TableHead>
            <TableHead className="font-semibold text-foreground">Nombre del Producto</TableHead>
            <TableHead className="text-right pr-8 font-semibold text-foreground">Precio</TableHead>
            <TableHead className="text-center w-[100px] font-semibold text-foreground">
              Estado
            </TableHead>
            <TableHead className="text-center w-[150px] font-semibold text-foreground">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No se encontraron productos en el inventario.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                className="group hover:bg-muted/20 transition-colors border-b-border/50"
              >
                {/* Columna: Código de Barras */}
                <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                  {product.code}
                </TableCell>

                {/* Columna: Nombre */}
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>

                {/* Columna: Precio */}
                <TableCell className="text-right font-bold tabular-nums pr-8 text-foreground group-hover:text-primary transition-colors">
                  ${product.price.toLocaleString()}
                </TableCell>

                {/* Columna: Estado (Badge dinámico) */}
                <TableCell className="text-center">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
                      product.isActive
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : 'bg-gray-100 text-gray-600 ring-gray-500/20 opacity-80'
                    )}
                  >
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>

                {/* Columna: Botones de Acción */}
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    {/* Botón: Editar */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 no-drag"
                      onClick={() => onEdit(product.id)}
                      title="Modificar producto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* Botón: Alternar Estado (Activar/Desactivar) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8 transition-colors no-drag',
                        product.isActive
                          ? 'text-green-600/70 hover:text-green-700 hover:bg-green-50'
                          : 'text-muted-foreground hover:text-green-600'
                      )}
                      onClick={() => onToggleStatus(product.id)}
                      title={product.isActive ? 'Desactivar producto' : 'Activar producto'}
                    >
                      {product.isActive ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Botón: Eliminación (Lógica) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 no-drag"
                      onClick={() => onDelete(product.id)}
                      title="Dar de baja producto"
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
