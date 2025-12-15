import { cn } from '@/lib/utils'
import { menuConfig } from '@/config/menu'
import { NavLink } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NotebookPen } from 'lucide-react'

export function Sidebar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground',
        className
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-accent px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <NotebookPen />
          <span>Control de Ventas</span>
        </div>
      </div>

      {/* Cuerpo del Menú */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-2">
          {menuConfig.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-4 py-2.5 text-base font-medium transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
