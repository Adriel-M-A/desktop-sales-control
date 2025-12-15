import { Sidebar } from './Sidebar'
import { TitleBar } from './TitleBar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            <div className="mx-auto max-w-6xl space-y-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  )
}
