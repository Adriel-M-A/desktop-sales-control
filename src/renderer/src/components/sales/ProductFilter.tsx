import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ProductFilterProps {
  onSearch?: (value: string) => void
}

export default function ProductFilter({ onSearch }: ProductFilterProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

      <Input
        type="text"
        placeholder="Buscar producto por nombre, código..."
        className="h-12 pl-12 text-base bg-card border-border shadow-sm placeholder:text-muted-foreground/70 focus-visible:ring-primary/30 focus-visible:border-primary"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    </div>
  )
}
