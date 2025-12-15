import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  name: string
  price: number
  onClick?: () => void
}

export default function ProductCard({ name, price, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      title={name}
      className={cn(
        'group flex flex-col justify-between p-4',
        'h-32 w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        'cursor-pointer transition-all duration-200',
        'hover:border-primary hover:shadow-md hover:-translate-y-0.5'
      )}
    >
      {/* Encabezado */}
      <div className="flex justify-between items-start gap-3">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors pr-2">
          {name}
        </h3>

        <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Package className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-auto flex justify-end w-full pt-2">
        <p className="text-lg font-bold text-primary">${price.toLocaleString()}</p>
      </div>
    </div>
  )
}
