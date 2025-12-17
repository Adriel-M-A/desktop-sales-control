import { Sidebar } from './Sidebar'
import TitleBar from './TitleBar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* CAMBIO AQUÍ: Agregamos clases para asegurar que el hijo ocupe el 100% y no más */}
          <div className="flex h-full w-full flex-col overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster position="bottom-center" />
    </div>
  )
}
