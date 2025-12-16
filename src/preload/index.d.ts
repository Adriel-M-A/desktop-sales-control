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
      getSales: (limit?: number, offset?: number) => Promise<any[]>
      cancelSale: (id: number) => Promise<any>

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
