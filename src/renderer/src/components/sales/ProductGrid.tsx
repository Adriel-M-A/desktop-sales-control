import ProductCard from './ProductCard'

// Movemos los datos aquí (o podrían venir por props en el futuro)
const MOCK_PRODUCTS = [
  { id: 1, name: 'Auriculares Bluetooth Pro', price: 12000 },
  { id: 2, name: "Monitor 24' IPS 75Hz", price: 85000 },
  { id: 3, name: 'Teclado Mecánico RGB', price: 45000 },
  { id: 4, name: 'Mouse Gamer Inalámbrico', price: 22500 },
  { id: 5, name: 'Soporte de Notebook Aluminio', price: 15000 },
  { id: 6, name: 'Webcam HD 1080p', price: 18000 },
  { id: 7, name: 'Cable HDMI 2.0 (2m)', price: 3500 },
  { id: 8, name: 'Hub USB-C 5 en 1', price: 12500 },
  { id: 9, name: 'Mochila Porta Notebook', price: 32000 },
  { id: 10, name: 'Kit de Limpieza Pantallas', price: 2500 },
  // Copias para probar scroll
  { id: 11, name: 'Auriculares Bluetooth Pro (Copia)', price: 12000 },
  { id: 12, name: "Monitor 24' IPS 75Hz (Copia)", price: 85000 },
  { id: 13, name: 'Teclado Mecánico RGB (Copia)', price: 45000 },
  { id: 14, name: 'Mouse Gamer Inalámbrico (Copia)', price: 22500 },
  { id: 15, name: 'Soporte de Notebook Aluminio (Copia)', price: 15000 }
]

interface ProductGridProps {
  // En el futuro, aquí recibirás la lista filtrada de productos
  // products?: Product[]
}

export default function ProductGrid({}: ProductGridProps) {
  return (
    // Este contenedor maneja el SCROLL
    // 'flex-1' para ocupar todo el espacio disponible que le deje el padre
    <div className="flex-1 overflow-y-auto p-4 bg-muted/5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 pb-20">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            onClick={() => console.log('Click en:', product.name)}
          />
        ))}
      </div>
    </div>
  )
}
