import { ipcMain } from 'electron'
import { ProductService } from '../services/product.service'

// Registra todos los eventos relacionados con productos
export function registerProductHandlers(): void {
  ipcMain.handle('db:get-products', (_, params) =>
    ProductService.getProducts(params?.search, params?.includeInactive)
  )

  ipcMain.handle('db:create-product', (_, p) => ProductService.createProduct(p))

  ipcMain.handle('db:update-product', (_, p) => ProductService.updateProduct(p.id, p))

  ipcMain.handle('db:delete-product', (_, id) => ProductService.deleteProduct(id))

  ipcMain.handle('db:toggle-product-status', (_, p) =>
    ProductService.toggleProductStatus(p.id, p.isActive)
  )

  ipcMain.handle('db:get-product-by-code', (_, code) => ProductService.getProductByCode(code))
}
