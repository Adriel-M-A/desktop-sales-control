import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Productos
      getProducts: (search?: string) => Promise<any[]>
      createProduct: (product: { code: string; name: string; price: number }) => Promise<any>
      updateProduct: (id: number, data: { name: string; price: number }) => Promise<any>
      deleteProduct: (id: number) => Promise<any>

      // Ventas
      createSale: (sale: { paymentMethod: string; total: number; items: any[] }) => Promise<any>
      getSales: (limit?: number, offset?: number) => Promise<any[]>
      cancelSale: (id: number) => Promise<any>

      // Reportes
      getDashboardStats: () => Promise<{
        totalIncome: number
        totalSales: number
        averageTicket: number
        cancelledCount: number
        cancelledAmount: number
      }>
      getTopProducts: () => Promise<any[]>
      getSalesChart: () => Promise<any[]>
    }
  }
}
