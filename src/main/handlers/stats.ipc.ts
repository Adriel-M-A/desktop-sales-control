import { ipcMain } from 'electron'
import { StatsService } from '../services/stats.service'

export function registerStatsHandlers(): void {
  ipcMain.handle('db:get-stats', (_, params) =>
    StatsService.getDashboardStats(params.startDate, params.endDate)
  )

  ipcMain.handle('db:get-top-products', (_, params) =>
    StatsService.getTopProducts(params.startDate, params.endDate)
  )

  ipcMain.handle('db:get-sales-chart', (_, params) =>
    StatsService.getSalesChart(params.startDate, params.endDate)
  )
}
