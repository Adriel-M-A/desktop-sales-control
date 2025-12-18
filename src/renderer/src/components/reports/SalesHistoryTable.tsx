// src/renderer/src/components/reports/SalesHistoryTable.tsx
import { useState, useEffect, Fragment } from 'react'
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Ban,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Package,
  RotateCcw,
  CheckCircle
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
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface SalesHistoryTableProps {
  onSaleUpdated?: () => void
  dateRange: { startDate: string; endDate: string } | null
  totalRows?: number
}

const ITEMS_PER_PAGE = 10

/**
 * Tabla de historial de ventas completa.
 * Mantiene todos los estilos originales y la lógica de expansión de productos.
 */
export default function SalesHistoryTable({
  onSaleUpdated,
  dateRange,
  totalRows = 0
}: SalesHistoryTableProps): React.ReactElement {
  const [sales, setSales] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  // Estados para gestión de anulación y restauración
  const [saleIdToCancel, setSaleIdToCancel] = useState<number | null>(null)
  const [saleIdToRestore, setSaleIdToRestore] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  /**
   * Carga el historial de ventas desde la base de datos modularizada.
   */
  const loadSales = async (): Promise<void> => {
    if (!dateRange) return

    setIsLoading(true)
    setError(null)

    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE

      // Llamada corregida a la nueva estructura de API
      const data = await window.api.sales.getHistory({
        limit: ITEMS_PER_PAGE,
        offset,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })

      setSales(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('Error cargando ventas:', err)
      setError('No se pudo conectar con la base de datos.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [dateRange])
  useEffect(() => {
    loadSales()
  }, [currentPage, dateRange])

  const refresh = (): void => {
    loadSales()
    if (onSaleUpdated) onSaleUpdated()
  }

  const toggleRow = (id: number): void => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const confirmCancel = async (): Promise<void> => {
    if (saleIdToCancel === null) return
    try {
      await window.api.sales.cancel(saleIdToCancel)
      toast.success('Venta anulada correctamente')
      setSaleIdToCancel(null)
      refresh()
    } catch (error) {
      toast.error('Error al anular venta')
    }
  }

  const confirmRestore = async (): Promise<void> => {
    if (saleIdToRestore === null) return
    try {
      await window.api.sales.restore(saleIdToRestore)
      toast.success('Venta recuperada exitosamente')
      setSaleIdToRestore(null)
      refresh()
    } catch (error) {
      toast.error('Error al recuperar venta')
    }
  }

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentIcon = (method: string): React.ReactNode => {
    const m = (method || '').toLowerCase()
    if (m.includes('efectivo')) return <Banknote className="h-3 w-3 mr-1" />
    if (m.includes('tarjeta')) return <CreditCard className="h-3 w-3 mr-1" />
    if (m.includes('transferencia')) return <ArrowRightLeft className="h-3 w-3 mr-1" />
    return null
  }

  const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE) || 1
  const startRange = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, totalRows)

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm h-[400px] flex flex-col items-center justify-center text-muted-foreground animate-pulse">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
        <p className="text-sm font-medium">Cargando historial...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-red-50/50 h-[200px] flex flex-col items-center justify-center text-red-600 p-6 text-center">
        <AlertCircle className="h-10 w-10 mb-2" />
        <h3 className="font-semibold">Error de Conexión</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={loadSales} className="bg-white no-drag">
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b-border">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="font-semibold text-foreground">Fecha</TableHead>
                <TableHead className="font-semibold text-foreground">Resumen</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Método</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    {!dateRange ? 'Selecciona un rango de fechas.' : 'No se encontraron ventas.'}
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => {
                  const isExpanded = expandedRows.includes(sale.id)
                  const isCancelled = sale.status === 'cancelled'
                  const items = Array.isArray(sale.items) ? sale.items : []
                  const totalUnits = items.reduce(
                    (acc: number, item: any) => acc + (item.quantity || 0),
                    0
                  )

                  return (
                    <Fragment key={sale.id}>
                      <TableRow
                        className={cn(
                          'cursor-pointer transition-colors border-b-border/50',
                          'hover:bg-muted/20',
                          isExpanded && 'bg-muted/30 border-b-0',
                          isCancelled && 'opacity-60 bg-red-50/50 dark:bg-red-900/10'
                        )}
                        onClick={() => toggleRow(sale.id)}
                      >
                        <TableCell className="p-2 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground no-drag"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>

                        <TableCell className={cn('text-xs', isCancelled && 'line-through')}>
                          {formatDateTime(sale.timestamp || sale.created_at)}
                        </TableCell>

                        <TableCell>
                          <div
                            className={cn(
                              'flex items-center gap-2 text-sm',
                              isCancelled && 'line-through text-muted-foreground'
                            )}
                          >
                            <Package className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">
                              {totalUnits} u. ({items.length} prods.)
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          {isCancelled ? (
                            <span className="inline-flex items-center rounded-sm bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 uppercase tracking-wide border border-red-200">
                              CANCELADO
                            </span>
                          ) : (
                            <div className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border bg-background border-border text-foreground">
                              {getPaymentIcon(sale.payment_method || sale.paymentMethod)}
                              {sale.payment_method || sale.paymentMethod}
                            </div>
                          )}
                        </TableCell>

                        <TableCell
                          className={cn(
                            'text-right font-bold text-foreground',
                            isCancelled && 'line-through text-muted-foreground'
                          )}
                        >
                          ${Number(sale.total_amount || sale.total).toLocaleString()}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary no-drag"
                            onClick={(e) => {
                              e.stopPropagation()
                              isCancelled ? setSaleIdToRestore(sale.id) : setSaleIdToCancel(sale.id)
                            }}
                          >
                            {isCancelled ? (
                              <RotateCcw className="h-4 w-4 text-green-600" />
                            ) : (
                              <Ban className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow
                          className={cn(
                            'bg-muted/20 hover:bg-muted/20',
                            isCancelled && 'bg-red-50/30'
                          )}
                        >
                          <TableCell colSpan={6} className="p-0">
                            <div className="p-4 pl-14 grid gap-4 animate-in slide-in-from-top-2 duration-200">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {isCancelled
                                  ? 'Detalle (Anulado)'
                                  : `Detalle de la venta #${sale.id}`}
                              </p>
                              <div
                                className={cn(
                                  'border border-border rounded-md bg-card shadow-sm',
                                  isCancelled && 'opacity-50'
                                )}
                              >
                                <Table>
                                  <TableHeader>
                                    <TableRow className="h-8 hover:bg-transparent">
                                      <TableHead className="h-8 text-xs">Producto</TableHead>
                                      <TableHead className="h-8 text-xs text-right">
                                        Cant.
                                      </TableHead>
                                      <TableHead className="h-8 text-xs text-right">
                                        Precio U.
                                      </TableHead>
                                      <TableHead className="h-8 text-xs text-right">
                                        Subtotal
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {items.map((item: any, index: number) => (
                                      <TableRow
                                        key={index}
                                        className="hover:bg-transparent border-b-border/50 last:border-0 h-8"
                                      >
                                        <TableCell className="py-1 text-xs text-foreground">
                                          {item.product_name}
                                        </TableCell>
                                        <TableCell className="py-1 text-right text-xs text-muted-foreground">
                                          {item.quantity}
                                        </TableCell>
                                        <TableCell className="py-1 text-right font-medium text-xs text-foreground">
                                          ${Number(item.unit_price).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="py-1 text-right font-bold text-xs text-foreground">
                                          ${Number(item.subtotal).toLocaleString()}
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
                    </Fragment>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* PIE DE PÁGINA / PAGINACIÓN */}
        {sales.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
            <div className="text-xs text-muted-foreground">
              Mostrando {startRange}-{endRange} de {totalRows} movimientos
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="bg-card hover:bg-muted no-drag"
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
                disabled={currentPage >= totalPages || isLoading}
                className="bg-card hover:bg-muted no-drag"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* DIÁLOGOS DE CONFIRMACIÓN */}
      <Dialog
        open={saleIdToCancel !== null}
        onOpenChange={(open) => !open && setSaleIdToCancel(null)}
      >
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> ¿Anular esta venta?
            </DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground">
              Esta acción marcará la venta como cancelada y afectará los reportes financieros
              inmediatamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSaleIdToCancel(null)} className="no-drag">
              No, mantener
            </Button>
            <Button variant="destructive" onClick={confirmCancel} className="no-drag">
              Sí, anular venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={saleIdToRestore !== null}
        onOpenChange={(open) => !open && setSaleIdToRestore(null)}
      >
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" /> ¿Recuperar esta venta?
            </DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground">
              La venta volverá a contarse como válida en los reportes y estadísticas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSaleIdToRestore(null)} className="no-drag">
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white no-drag"
              onClick={confirmRestore}
            >
              Sí, recuperar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
