import Cart from '@renderer/components/cart/Cart'

export default function Sales() {
  return (
    <div className="flex h-full bg-slate-100">
      {/* Columna izquierda */}
      <div className="flex flex-1 flex-col min-w-0 border-r border-slate-300">
        {/* Fila 1: Filtros */}
        <div className="border-b border-slate-300 p-3">
          <h2 className="text-sm font-semibold mb-1">Filtros</h2>
          <p className="text-xs text-slate-600">Opciones de filtrado</p>
        </div>

        {/* Fila 2: Contenido principal */}
        <div className="flex-1 overflow-auto p-3">
          <h1 className="text-xl font-bold mb-2">Sales Page</h1>
          <p className="text-sm text-slate-600">Listado de productos / ventas</p>
        </div>
      </div>

      {/* Columna derecha: Carrito */}
      <aside className="w-100 border-l border-slate-300">
        <Cart />
      </aside>
    </div>
  )
}
