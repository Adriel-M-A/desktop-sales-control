import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Productos
  getProducts: (search?: string) => ipcRenderer.invoke('db:get-products', search),
  createProduct: (product: any) => ipcRenderer.invoke('db:create-product', product),
  updateProduct: (id: number, data: any) =>
    ipcRenderer.invoke('db:update-product', { id, ...data }),
  deleteProduct: (id: number) => ipcRenderer.invoke('db:delete-product', id),

  // Ventas
  createSale: (sale: any) => ipcRenderer.invoke('db:create-sale', sale),
  getSales: (limit = 50, offset = 0) => ipcRenderer.invoke('db:get-sales', { limit, offset }),
  cancelSale: (id: number) => ipcRenderer.invoke('db:cancel-sale', id),

  // Reportes
  getDashboardStats: () => ipcRenderer.invoke('db:get-stats'),
  getTopProducts: () => ipcRenderer.invoke('db:get-top-products'),
  getSalesChart: () => ipcRenderer.invoke('db:get-sales-chart')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api) // <--- EXPONEMOS LA API AQUÍ
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
