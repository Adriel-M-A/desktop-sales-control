import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as db from './database'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  db.initDB()

  ipcMain.handle('db:get-products', (_, params) =>
    db.getProducts(params?.search, params?.includeInactive)
  )
  ipcMain.handle('db:create-product', (_, p) => db.createProduct(p))
  ipcMain.handle('db:update-product', (_, p) => db.updateProduct(p.id, p))
  ipcMain.handle('db:delete-product', (_, id) => db.deleteProduct(id))
  ipcMain.handle('db:toggle-product-status', (_, p) => db.toggleProductStatus(p.id, p.isActive))

  ipcMain.handle('db:create-sale', (_, s) => db.createSale(s))

  ipcMain.handle('db:get-sales', (_, p) => db.getSales(p.limit, p.offset, p.startDate, p.endDate))

  ipcMain.handle('db:cancel-sale', (_, id) => db.cancelSale(id))
  // NUEVO: Handler para restaurar venta
  ipcMain.handle('db:restore-sale', (_, id) => db.restoreSale(id))

  ipcMain.handle('db:get-stats', (_, params) =>
    db.getDashboardStats(params.startDate, params.endDate)
  )
  ipcMain.handle('db:get-top-products', (_, params) =>
    db.getTopProducts(params.startDate, params.endDate)
  )
  ipcMain.handle('db:get-sales-chart', (_, params) =>
    db.getSalesChart(params.startDate, params.endDate)
  )

  ipcMain.handle('db:get-product-by-code', (_, code) => db.getProductByCode(code))

  ipcMain.on('window-minimize', () => mainWindow.minimize())
  ipcMain.on('window-maximize', () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  })
  ipcMain.on('window-close', () => mainWindow.close())

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
