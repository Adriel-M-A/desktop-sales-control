import { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
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
}

const ITEMS_PER_PAGE = 15

export default function SalesHistoryTable({ onSaleUpdated }: SalesHistoryTableProps) {
  const [sales, setSales] = useState<any[]>([])
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [saleIdToCancel, setSaleIdToCancel] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const loadSales = async (page: number) => {
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE
      const data = await window.api.getSales(ITEMS_PER_PAGE, offset)
      setSales(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadSales(currentPage)
  }, [currentPage])

  const refresh = () => {
    loadSales(currentPage)
    if (onSaleUpdated) onSaleUpdated()
  }

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const initiateCancel = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setSaleIdToCancel(id)
  }

  const confirmCancel = async () => {
    if (saleIdToCancel === null) return
    try {
      await window.api.cancelSale(saleIdToCancel)
      toast.info('Venta anulada correctamente')
      setSaleIdToCancel(null)
      refresh()
    } catch (error) {
      toast.error('Error al anular venta')
    }
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
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b-border">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[100px] font-semibold text-foreground">Hora</TableHead>
                <TableHead className="font-semibold text-foreground">Resumen</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Método</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No hay historial de ventas.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => {
                  const isExpanded = expandedRows.includes(sale.id)
                  const isCancelled = sale.status === 'cancelled'
                  const dateObj = new Date(sale.timestamp)

                  return (
                    <>
                      <TableRow
                        key={sale.id}
                        className={cn(
                          'cursor-pointer transition-colors border-b-border/50',
                          'hover:bg-muted/20',
                          isExpanded && 'bg-muted/30 border-b-0',
                          isCancelled &&
                            'opacity-60 bg-red-50/50 hover:bg-red-50/80 dark:bg-red-900/10'
                        )}
                        onClick={() => toggleRow(sale.id)}
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>

                        <TableCell className="font-medium text-xs text-foreground">
                          <div className="flex flex-col">
                            <span className={cn(isCancelled && 'line-through')}>
                              {dateObj.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {dateObj.toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-foreground">
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
                              <span className="ml-2 inline-flex items-center rounded-sm bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 uppercase tracking-wide">
                                Cancelado
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                • {sale.items.length} ítems
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div
                            className={cn(
                              'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border',
                              isCancelled
                                ? 'bg-transparent border-transparent text-muted-foreground'
                                : 'bg-background border-border text-foreground'
                            )}
                          >
                            {getPaymentIcon(sale.paymentMethod)}
                            {sale.paymentMethod}
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-bold text-foreground">
                          <span className={cn(isCancelled && 'line-through text-muted-foreground')}>
                            ${sale.total.toLocaleString()}
                          </span>
                        </TableCell>

                        <TableCell>
                          {!isCancelled && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => initiateCancel(e, sale.id)}
                              title="Anular Venta"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
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
                                {isCancelled ? 'Detalle (Anulado)' : 'Detalle de productos'}
                              </p>
                              <div
                                className={cn(
                                  'border border-border rounded-md bg-card shadow-sm',
                                  isCancelled && 'opacity-50'
                                )}
                              >
                                <Table>
                                  <TableBody>
                                    {sale.items.map((item: any, index: number) => (
                                      <TableRow
                                        key={index}
                                        className="hover:bg-transparent border-b-border/50 last:border-0"
                                      >
                                        <TableCell className="py-2 text-sm text-foreground">
                                          {item.product_name}
                                        </TableCell>
                                        <TableCell className="py-2 text-right text-sm text-muted-foreground">
                                          {item.quantity} x ${item.unit_price.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="py-2 text-right font-medium text-sm text-foreground">
                                          ${item.subtotal.toLocaleString()}
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
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-border bg-muted/10 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 bg-card hover:bg-muted border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm font-medium px-2 text-center">Página {currentPage}</div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={sales.length < ITEMS_PER_PAGE}
            className="h-8 w-8 p-0 bg-card hover:bg-muted border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog
        open={saleIdToCancel !== null}
        onOpenChange={(open) => !open && setSaleIdToCancel(null)}
      >
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              ¿Anular esta venta?
            </DialogTitle>
            <DialogDescription className="pt-2 text-muted-foreground">
              Esta acción marcará la venta como cancelada y afectará los reportes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSaleIdToCancel(null)}
              className="bg-card hover:bg-muted text-foreground"
            >
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
