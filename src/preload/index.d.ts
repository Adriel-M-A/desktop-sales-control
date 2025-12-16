import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getProducts: (search?: string, includeInactive?: boolean) => Promise<any[]>
      createProduct: (product: { code: string; name: string; price: number }) => Promise<any>
      updateProduct: (id: number, data: { name: string; price: number }) => Promise<any>
      deleteProduct: (id: number) => Promise<any>
      toggleProductStatus: (id: number, isActive: boolean) => Promise<any>

      createSale: (sale: { paymentMethod: string; total: number; items: any[] }) => Promise<any>

      getSales: (params: {
        limit?: number
        offset?: number
        startDate?: string
        endDate?: string
      }) => Promise<any[]>

      cancelSale: (id: number) => Promise<any>
      // NUEVO: Definición de tipo
      restoreSale: (id: number) => Promise<any>

      getDashboardStats: (range: { startDate: string; endDate: string }) => Promise<{
        totalIncome: number
        totalSales: number
        averageTicket: number
        cancelledCount: number
        cancelledAmount: number
      }>
      getTopProducts: (range: { startDate: string; endDate: string }) => Promise<any[]>
      getSalesChart: (range: { startDate: string; endDate: string }) => Promise<any[]>
      getProductByCode: (code: string) => Promise<any>
    }
  }
}
