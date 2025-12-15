import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ProductFilter() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

      <Input
        type="text"
        placeholder="Buscar producto por nombre, código..."
        className="h-12 pl-12 text-base bg-card shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
      />
    </div>
  )
}
