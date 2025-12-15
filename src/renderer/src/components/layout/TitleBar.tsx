import { Minus, Square, X } from 'lucide-react'

export function TitleBar() {
  const handleMinimize = () => window.api.minimize()
  const handleMaximize = () => window.api.maximize()
  const handleClose = () => window.api.close()

  return (
    <div className="flex h-8 w-full select-none items-center justify-between bg-background border-b pl-4 drag-region">
      {/* Título de la App */}
      <span className="text-xs font-medium text-muted-foreground">Mi App Core</span>

      {/* Botones de Control (No arrastrables) */}
      <div className="flex h-full no-drag">
        <button
          onClick={handleMinimize}
          className="flex h-full w-10 items-center justify-center hover:bg-muted transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={handleMaximize}
          className="flex h-full w-10 items-center justify-center hover:bg-muted transition-colors"
        >
          <Square className="h-3 w-3" />
        </button>
        <button
          onClick={handleClose}
          className="flex h-full w-10 items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
