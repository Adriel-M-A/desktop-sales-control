import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // --- PRODUCTOS ---
  getProducts: (search = '', includeInactive = false) =>
    ipcRenderer.invoke('db:get-products', { search, includeInactive }),
  createProduct: (product: any) => ipcRenderer.invoke('db:create-product', product),
  updateProduct: (id: number, data: any) =>
    ipcRenderer.invoke('db:update-product', { id, ...data }),
  deleteProduct: (id: number) => ipcRenderer.invoke('db:delete-product', id),
  toggleProductStatus: (id: number, isActive: boolean) =>
    ipcRenderer.invoke('db:toggle-product-status', { id, isActive }),

  // --- VENTAS ---
  createSale: (sale: any) => ipcRenderer.invoke('db:create-sale', sale),

  getSales: (params: { limit?: number; offset?: number; startDate?: string; endDate?: string }) =>
    ipcRenderer.invoke('db:get-sales', params),

  cancelSale: (id: number) => ipcRenderer.invoke('db:cancel-sale', id),
  // NUEVO: Función para restaurar
  restoreSale: (id: number) => ipcRenderer.invoke('db:restore-sale', id),

  // --- REPORTES ---
  getDashboardStats: (range: { startDate: string; endDate: string }) =>
    ipcRenderer.invoke('db:get-stats', range),
  getTopProducts: (range: { startDate: string; endDate: string }) =>
    ipcRenderer.invoke('db:get-top-products', range),
  getSalesChart: (range: { startDate: string; endDate: string }) =>
    ipcRenderer.invoke('db:get-sales-chart', range)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
