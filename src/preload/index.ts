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
  getSales: (limit = 50, offset = 0) => ipcRenderer.invoke('db:get-sales', { limit, offset }),
  cancelSale: (id: number) => ipcRenderer.invoke('db:cancel-sale', id),

  // --- REPORTES (ASEGÚRATE DE QUE ESTO ESTÉ AQUÍ) ---
  getDashboardStats: () => ipcRenderer.invoke('db:get-stats'),
  getTopProducts: () => ipcRenderer.invoke('db:get-top-products'),
  getSalesChart: () => ipcRenderer.invoke('db:get-sales-chart')
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
