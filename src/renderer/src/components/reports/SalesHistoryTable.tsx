import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  ShoppingBag,
  Ban,
  AlertTriangle,
  ChevronLeft // Importamos iconos de navegación
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
  status: 'completed' | 'cancelled'
}

// --- GENERADOR DE DATOS MOCK (45 Ventas para probar paginación) ---
const GENERATE_MOCK_SALES = (): Sale[] => {
  return Array.from({ length: 45 }).map((_, i) => ({
    id: 1000 + (45 - i), // IDs descendentes
    timestamp: new Date(2025, 11, 15, 18 - Math.floor(i / 2), 30 - (i % 30)).toISOString(),
    paymentMethod: i % 3 === 0 ? 'Efectivo' : i % 3 === 1 ? 'Tarjeta' : 'Transferencia',
    total: (Math.floor(Math.random() * 50) + 1) * 1000,
    status: i === 4 ? 'cancelled' : 'completed', // Una cancelada de prueba
    items: [
      {
        productId: 1,
        productName: `Producto Ejemplo ${i + 1}`,
        quantity: Math.floor(Math.random() * 3) + 1,
        unitPrice: 1000
      }
    ]
  }))
}

const ITEMS_PER_PAGE = 15

export default function SalesHistoryTable() {
  const [sales, setSales] = useState<Sale[]>(GENERATE_MOCK_SALES())
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [saleIdToCancel, setSaleIdToCancel] = useState<number | null>(null)

  // 1. ESTADO DE PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1)

  // 2. CÁLCULOS DE PAGINACIÓN
  const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentSales = sales.slice(startIndex, endIndex)

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const initiateCancel = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setSaleIdToCancel(id)
  }

  const confirmCancel = () => {
    if (saleIdToCancel === null) return
    setSales((prev) =>
      prev.map((sale) => (sale.id === saleIdToCancel ? { ...sale, status: 'cancelled' } : sale))
    )
    toast.info('Venta anulada correctamente')
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
      {/* CONTENEDOR PRINCIPAL: Superficie blanca con bordes redondeados */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        {/* ÁREA DE TABLA (Flexible para ocupar espacio si fuera necesario) */}
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
              {currentSales.map((sale) => {
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
                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                  {sale.items.map((item, index) => (
                                    <TableRow
                                      key={index}
                                      className="hover:bg-transparent border-b-border/50 last:border-0"
                                    >
                                      <TableCell className="py-2 text-sm text-foreground">
                                        {item.productName}
                                      </TableCell>
                                      <TableCell className="py-2 text-right text-sm text-muted-foreground">
                                        {item.quantity} x ${item.unitPrice.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="py-2 text-right font-medium text-sm text-foreground">
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

        {/* 3. FOOTER DE PAGINACIÓN (Integrado visualmente) */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
          <div className="text-xs text-muted-foreground">
            Mostrando{' '}
            <strong>
              {startIndex + 1}-{Math.min(endIndex, sales.length)}
            </strong>{' '}
            de <strong>{sales.length}</strong> ventas
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 bg-card hover:bg-muted border-border"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-sm font-medium px-2 min-w-[3rem] text-center">
              Página {currentPage} / {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 bg-card hover:bg-muted border-border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
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
