import CartItem from './CartItem'
import CartHeader from './CartHeader'

export default function Cart() {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Fila 1: Header */}
      <CartHeader totalItems={1} />

      {/* Fila 2: Items (scroll) */}
      <div className="flex-1 overflow-auto border-b">
        <CartItem
          name="Producto A"
          price={500}
          quantity={2}
          onIncrease={() => {}}
          onDecrease={() => {}}
          onRemove={() => {}}
        />
      </div>

      {/* Fila 3: Venta */}
      <div>
        <p className="text-[10px] text-center">Total</p>
        <p className="text-sm font-bold text-center">$2000</p>

        <select className="w-full text-[10px]">
          <option>Contado</option>
          <option>Crédito</option>
          <option>Débito</option>
        </select>

        <button className="w-full text-[10px]">Vender</button>
      </div>
    </div>
  )
}
