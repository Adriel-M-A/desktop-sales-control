import { useEffect, useRef } from 'react'

interface UseBarcodeScannerProps {
  onScan: (code: string) => void // Qué hacer cuando se escanea algo
  isActive?: boolean // Opción para pausar el escáner (ej: si hay un modal abierto)
}

export const useBarcodeScanner = ({ onScan, isActive = true }: UseBarcodeScannerProps) => {
  // Buffer y Tiempos internos (nadie más necesita ver esto)
  const barcodeBuffer = useRef('')
  const lastKeyTime = useRef(Date.now())

  useEffect(() => {
    // Si el hook está desactivado, no escuchamos nada
    if (!isActive) return

    const handleGlobalScan = (e: KeyboardEvent) => {
      // 1. Ignorar si el usuario está escribiendo en un input normal
      // (Así no escanea mientras escribes el nombre de un producto)
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      // 2. Control de velocidad (Buffer)
      const currentTime = Date.now()
      // Si pasan más de 100ms entre teclas, asumimos que es tecleo manual, no escáner
      if (currentTime - lastKeyTime.current > 100) {
        barcodeBuffer.current = ''
      }
      lastKeyTime.current = currentTime

      // 3. Procesar Enter (Fin del código)
      if (e.key === 'Enter') {
        const code = barcodeBuffer.current.trim()

        if (code.length > 0) {
          // ¡BINGO! Tenemos un código, se lo pasamos a la función
          onScan(code)
        }
        barcodeBuffer.current = '' // Limpiar buffer
      }
      // 4. Acumular caracteres
      else if (e.key.length === 1) {
        barcodeBuffer.current += e.key
      }
    }

    // Activar el oído global
    window.addEventListener('keydown', handleGlobalScan)

    // Limpiar al desmontar
    return () => window.removeEventListener('keydown', handleGlobalScan)
  }, [isActive, onScan]) // Se reinicia si cambia la función o el estado activo
}
