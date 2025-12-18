import { ipcMain } from 'electron'
import { SaleService } from '../services/sale.service'

export function registerSalesHandlers(): void {
  ipcMain.handle('db:create-sale', (_, s) => SaleService.createSale(s))

  ipcMain.handle('db:get-sales', (_, p) =>
    SaleService.getSales(p.limit, p.offset, p.startDate, p.endDate)
  )

  ipcMain.handle('db:cancel-sale', (_, id) => SaleService.cancelSale(id))

  ipcMain.handle('db:restore-sale', (_, id) => SaleService.restoreSale(id))
}
