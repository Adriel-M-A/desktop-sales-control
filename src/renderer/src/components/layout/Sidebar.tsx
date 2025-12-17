import { cn } from '@/lib/utils'
import { menuConfig } from '@/config/menu'
import { NavLink } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NotebookPen } from 'lucide-react'

interface SidebarProps {
  className?: string
  onMobileClick?: () => void
  collapsed?: boolean // <--- NUEVA PROP
}

export function Sidebar({ className, onMobileClick, collapsed = false }: SidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64', // Cambio de ancho dinámico
        className
      )}
    >
      {/* Header / Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-sidebar-accent',
          collapsed ? 'justify-center px-0' : 'px-6'
        )}
      >
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <NotebookPen className="h-6 w-6" />
          {/* Ocultamos el texto si está colapsado */}
          {!collapsed && <span className="animate-in fade-in duration-300">Control</span>}
        </div>
      </div>

      {/* Cuerpo del Menú */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-2">
          {menuConfig.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onMobileClick}
              title={collapsed ? item.title : undefined} // Tooltip nativo simple
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md py-2.5 transition-colors',
                  // Ajuste de padding y justificación según estado
                  collapsed ? 'justify-center px-0' : 'gap-3 px-4',

                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {/* Ocultamos el texto del link si está colapsado */}
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
