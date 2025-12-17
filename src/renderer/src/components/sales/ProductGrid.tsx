import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  price: number
  code?: string
}

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {products.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              onClick={() => onAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
