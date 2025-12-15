import { Plus, Minus, Trash2 } from 'lucide-react'

export default function CartItem({ name, price, quantity, onIncrease, onDecrease, onRemove }) {
  const total = price * quantity

  return (
    <div className="grid grid-cols-[1fr_auto_auto] border-b">
      {/* Columna 1: Info */}
      <div className="flex flex-col">
        {/* Fila 1: Nombre */}
        <p className="text-[10px] font-medium truncate">{name}</p>

        {/* Fila 2: Precios */}
        <div className="flex justify-between text-[10px]">
          <span>${price}</span>
          <span>${total}</span>
        </div>
      </div>

      {/* Columna 2: Contador */}
      <div className="flex items-center">
        <button onClick={onDecrease}>
          <Minus size={10} />
        </button>

        <span className="text-[10px]">{quantity}</span>

        <button onClick={onIncrease}>
          <Plus size={10} />
        </button>
      </div>

      {/* Columna 3: Eliminar */}
      <div className="flex items-center">
        <button onClick={onRemove}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}
