import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    // 1. Añadimos resolución de alias para MAIN
    resolve: {
      alias: {
        '@main': resolve('src/main')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    // 2. Añadimos resolución de alias para PRELOAD
    resolve: {
      alias: {
        '@preload': resolve('src/preload')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src')
        // 3. (Opcional) Si quisieras usar @components sin el slash
        // '@components': resolve('src/renderer/src/components')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
