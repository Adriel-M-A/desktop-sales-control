// src/preload/index.d.ts
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      products: {
        getAll: (params?: { search?: string; includeInactive?: boolean }) => Promise<any[]>
        create: (product: { code: string; name: string; price: number }) => Promise<any>
        update: (product: { id: number; name: string; price: number }) => Promise<any>
        delete: (id: number) => Promise<any>
        toggleStatus: (id: number, isActive: boolean) => Promise<any>
        getByCode: (code: string) => Promise<any>
      }
      sales: {
        create: (sale: { paymentMethod: string; items: any[]; total: number }) => Promise<any>
        getHistory: (params: {
          limit: number
          offset: number
          startDate?: string
          endDate?: string
        }) => Promise<any[]>
        cancel: (id: number) => Promise<any>
        restore: (id: number) => Promise<any>
      }
      stats: {
        getDashboard: (params: { startDate: string; endDate: string }) => Promise<any>
        getTopProducts: (params: { startDate: string; endDate: string }) => Promise<any[]>
        getChart: (params: { startDate: string; endDate: string }) => Promise<any[]>
      }
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
      }
    }
  }
}
