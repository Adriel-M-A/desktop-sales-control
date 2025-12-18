import { ipcMain, BrowserWindow } from 'electron'

// Registra eventos de control de ventana (Minimizar, Maximizar, Cerrar)
export function registerWindowHandlers(mainWindow: BrowserWindow): void {
  ipcMain.on('window-minimize', () => mainWindow.minimize())

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => mainWindow.close())
}
