import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  ShoppingBag,
  Ban,
  AlertTriangle
} from 'lucide-react'
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
import { toast } from 'sonner' // Importamos toast
// Reutilizamos el Dialog existente para la confirmación
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

// Definición de Tipos
interface SaleItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
}

interface Sale {
  id: number
  timestamp: string
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia'
  items: SaleItem[]
  total: number
  status: 'completed' | 'cancelled' // Nuevo campo de estado
}

// Mock Data Actualizada
const MOCK_SALES: Sale[] = [
  {
    id: 1024,
    timestamp: '2025-12-15T10:30:00',
    paymentMethod: 'Efectivo',
    total: 25000,
    items: [
      { productId: 1, productName: 'Auriculares Bluetooth', quantity: 1, unitPrice: 15000 },
      { productId: 2, productName: 'Funda Protectora', quantity: 2, unitPrice: 5000 }
    ],
    status: 'completed'
  },
  {
    id: 1023,
    timestamp: '2025-12-15T09:15:00',
    paymentMethod: 'Tarjeta',
    total: 85000,
    items: [{ productId: 3, productName: 'Monitor 24" IPS', quantity: 1, unitPrice: 85000 }],
    status: 'completed'
  },
  {
    id: 1022,
    timestamp: '2025-12-14T18:45:00',
    paymentMethod: 'Transferencia',
    total: 12500,
    items: [{ productId: 4, productName: 'Mouse Gamer', quantity: 1, unitPrice: 12500 }],
    status: 'cancelled' // Ejemplo de una ya cancelada
  }
]

export default function SalesHistoryTable() {
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  // Estado para controlar qué venta se está intentando cancelar
  const [saleIdToCancel, setSaleIdToCancel] = useState<number | null>(null)

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  // Abrir modal de confirmación
  const initiateCancel = (e: React.MouseEvent, id: number) => {
    e.stopPropagation() // Evita que se expanda la fila al hacer click en el botón
    setSaleIdToCancel(id)
  }

  // Ejecutar cancelación
  const confirmCancel = () => {
    if (saleIdToCancel === null) return

    setSales((prev) =>
      prev.map((sale) => (sale.id === saleIdToCancel ? { ...sale, status: 'cancelled' } : sale))
    )

    toast.info('La venta ha sido anulada correctamente')
    setSaleIdToCancel(null)
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Efectivo':
        return <Banknote className="h-3 w-3 mr-1" />
      case 'Tarjeta':
        return <CreditCard className="h-3 w-3 mr-1" />
      case 'Transferencia':
        return <ArrowRightLeft className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[100px]">Hora</TableHead>
              <TableHead>Resumen</TableHead>
              <TableHead className="text-center">Método</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead> {/* Columna Acciones */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => {
              const isExpanded = expandedRows.includes(sale.id)
              const isCancelled = sale.status === 'cancelled'
              const dateObj = new Date(sale.timestamp)

              return (
                <>
                  {/* FILA PRINCIPAL */}
                  <TableRow
                    key={sale.id}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-muted/50',
                      isExpanded && 'bg-muted/30 border-b-0',
                      // Si está cancelada, bajamos la opacidad y ponemos fondo sutil rojo
                      isCancelled && 'opacity-60 bg-red-50/50 hover:bg-red-50/80 dark:bg-red-900/10'
                    )}
                    onClick={() => toggleRow(sale.id)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>

                    {/* Hora */}
                    <TableCell className="font-medium text-xs">
                      <div className="flex flex-col">
                        <span className={cn(isCancelled && 'line-through')}>
                          {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {dateObj.toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>

                    {/* Resumen */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        <span
                          className={cn(
                            'font-medium',
                            isCancelled && 'line-through decoration-muted-foreground'
                          )}
                        >
                          Venta #{sale.id}
                        </span>

                        {isCancelled ? (
                          <span className="ml-2 inline-flex items-center rounded-sm bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 uppercase tracking-wide dark:bg-red-900/30 dark:text-red-400">
                            Cancelado
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            • {sale.items.reduce((acc, item) => acc + item.quantity, 0)} artículos
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Método */}
                    <TableCell className="text-center">
                      <div
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border',
                          isCancelled
                            ? 'bg-transparent border-transparent text-muted-foreground'
                            : cn(
                                sale.paymentMethod === 'Efectivo' &&
                                  'bg-green-50 text-green-700 border-green-200',
                                sale.paymentMethod === 'Tarjeta' &&
                                  'bg-blue-50 text-blue-700 border-blue-200',
                                sale.paymentMethod === 'Transferencia' &&
                                  'bg-purple-50 text-purple-700 border-purple-200'
                              )
                        )}
                      >
                        {getPaymentIcon(sale.paymentMethod)}
                        {sale.paymentMethod}
                      </div>
                    </TableCell>

                    {/* Total */}
                    <TableCell className="text-right font-bold">
                      <span className={cn(isCancelled && 'line-through text-muted-foreground')}>
                        ${sale.total.toLocaleString()}
                      </span>
                    </TableCell>

                    {/* Acción Cancelar */}
                    <TableCell>
                      {!isCancelled && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => initiateCancel(e, sale.id)}
                          title="Anular Venta"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* FILA DE DETALLE */}
                  {isExpanded && (
                    <TableRow
                      className={cn('bg-muted/20 hover:bg-muted/20', isCancelled && 'bg-red-50/30')}
                    >
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4 pl-14 grid gap-4 animate-in slide-in-from-top-2 duration-200">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            {isCancelled ? (
                              <span className="text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Venta Anulada
                              </span>
                            ) : (
                              'Detalle de productos'
                            )}
                          </p>
                          <div
                            className={cn(
                              'border rounded-md bg-background',
                              isCancelled && 'opacity-50'
                            )}
                          >
                            <Table>
                              <TableBody>
                                {sale.items.map((item, index) => (
                                  <TableRow key={index} className="hover:bg-transparent">
                                    <TableCell className="py-2 text-sm">
                                      {item.productName}
                                    </TableCell>
                                    <TableCell className="py-2 text-right text-sm text-muted-foreground">
                                      {item.quantity} x ${item.unitPrice.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-medium text-sm">
                                      ${(item.quantity * item.unitPrice).toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
      <Dialog
        open={saleIdToCancel !== null}
        onOpenChange={(open) => !open && setSaleIdToCancel(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              ¿Anular esta venta?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Esta acción marcará la venta <strong>#{saleIdToCancel}</strong> como cancelada y
              afectará los reportes de caja diarios.
              <br />
              <br />
              ¿Estás seguro de continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSaleIdToCancel(null)}>
              No, mantener
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Sí, anular venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
