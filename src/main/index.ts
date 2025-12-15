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
      sandbox: false
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

  ipcMain.handle('db:get-products', (_, search) => db.getProducts(search))
  ipcMain.handle('db:create-product', (_, product) => db.createProduct(product))
  ipcMain.handle('db:update-product', (_, { id, ...data }) => db.updateProduct(id, data))
  ipcMain.handle('db:delete-product', (_, id) => db.deleteProduct(id))

  ipcMain.handle('db:create-sale', (_, sale) => db.createSale(sale))
  ipcMain.handle('db:get-sales', (_, { limit, offset }) => db.getSales(limit, offset))
  ipcMain.handle('db:cancel-sale', (_, id) => db.cancelSale(id))

  ipcMain.handle('db:get-stats', () => db.getDashboardStats())
  ipcMain.handle('db:get-top-products', () => db.getTopProducts())
  ipcMain.handle('db:get-sales-chart', () => db.getSalesChart())

  ipcMain.on('window-minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    mainWindow.close()
  })

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
