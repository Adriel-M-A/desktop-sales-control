import { cn } from '@/lib/utils'
import { menuConfig } from '@/config/menu'
import { NavLink } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Sidebar({ className }: { className?: string }) {
  return (
    // CAMBIO 1: Usamos 'bg-sidebar' y 'text-sidebar-foreground'
    <div
      className={cn(
        'flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground',
        className
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-accent px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-6 w-6 rounded bg-primary"></div>
          <span>Mi App</span>
        </div>
      </div>

      {/* Cuerpo del Menú */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {menuConfig.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  // CAMBIO 2: Usamos las variables de sidebar-accent para el hover
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? // CAMBIO 3: Estilo activo específico
                      'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
