import { useState } from 'react'
import { Sidebar } from './Sidebar'
import TitleBar from './TitleBar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, NotebookPen } from 'lucide-react'

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        {/* --- MODO 1: DESKTOP (> 1024px) --- */}
        {/* Visible solo en pantallas grandes (lg). Ancho completo. */}
        <Sidebar className="hidden lg:flex" collapsed={false} />

        {/* --- MODO 2: TABLET (768px - 1024px) --- */}
        {/* Visible en media (md) pero oculto en grandes (lg). Modo Colapsado. */}
        <Sidebar className="hidden md:flex lg:hidden" collapsed={true} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* --- MODO 3: MÓVIL (< 768px) --- */}
          {/* Navbar Superior. Visible solo en pantallas pequeñas (oculto en md). */}
          <header className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-sidebar text-sidebar-foreground shrink-0">
            <div className="flex items-center gap-2 font-bold text-lg">
              <NotebookPen className="h-5 w-5" />
              <span>Control</span>
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 flex items-center justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="p-0 w-[280px] border-r-0 [&>button]:hidden">
                <SheetTitle className="sr-only">Menú Principal</SheetTitle>
                {/* En móvil usamos el Sidebar completo dentro del Sheet */}
                <Sidebar
                  className="w-full h-full border-none"
                  onMobileClick={() => setIsMobileMenuOpen(false)}
                  collapsed={false}
                />
              </SheetContent>
            </Sheet>
          </header>

          {/* CONTENIDO PRINCIPAL */}
          <div className="flex h-full w-full flex-col overflow-hidden relative">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster position="bottom-center" />
    </div>
  )
}
