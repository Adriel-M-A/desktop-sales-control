export default function CartHeader({ totalItems }) {
  return (
    <div className="flex items-center justify-between border-b">
      <p className="text-xs font-semibold text-center">Carrito</p>
      <p className="text-[10px] text-center">{totalItems} productos</p>
    </div>
  )
}
