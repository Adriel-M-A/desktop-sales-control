import { contextBridge, ipcRenderer } from 'electron'

// Estructuramos la API por dominios para mayor claridad en el Frontend
const api = {
  products: {
    getAll: (params?: { search?: string; includeInactive?: boolean }) =>
      ipcRenderer.invoke('db:get-products', params),
    create: (product: any) => ipcRenderer.invoke('db:create-product', product),
    update: (product: any) => ipcRenderer.invoke('db:update-product', product),
    delete: (id: number) => ipcRenderer.invoke('db:delete-product', id),
    toggleStatus: (id: number, isActive: boolean) =>
      ipcRenderer.invoke('db:toggle-product-status', { id, isActive }),
    getByCode: (code: string) => ipcRenderer.invoke('db:get-product-by-code', code)
  },
  sales: {
    create: (sale: any) => ipcRenderer.invoke('db:create-sale', sale),
    getHistory: (params: any) => ipcRenderer.invoke('db:get-sales', params),
    cancel: (id: number) => ipcRenderer.invoke('db:cancel-sale', id),
    restore: (id: number) => ipcRenderer.invoke('db:restore-sale', id)
  },
  stats: {
    getDashboard: (params: { startDate: string; endDate: string }) =>
      ipcRenderer.invoke('db:get-stats', params),
    getTopProducts: (params: { startDate: string; endDate: string }) =>
      ipcRenderer.invoke('db:get-top-products', params),
    getChart: (params: { startDate: string; endDate: string }) =>
      ipcRenderer.invoke('db:get-sales-chart', params)
  },
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (para entornos sin aislamiento)
  window.api = api
}
