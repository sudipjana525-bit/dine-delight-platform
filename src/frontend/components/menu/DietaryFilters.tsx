import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Leaf, Wheat, Milk, Flame, Fish } from 'lucide-react';

interface DietaryFiltersProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const dietaryOptions = [
  { value: 'vegetarian', label: 'Vegetarian', icon: Leaf, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { value: 'vegan', label: 'Vegan', icon: Leaf, color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
  { value: 'gluten-free', label: 'Gluten-Free', icon: Wheat, color: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
  { value: 'dairy-free', label: 'Dairy-Free', icon: Milk, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { value: 'spicy', label: 'Spicy', icon: Flame, color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { value: 'seafood', label: 'Seafood', icon: Fish, color: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200' },
];

export function DietaryFilters({ selectedFilters, onFilterChange }: DietaryFiltersProps) {
  const toggleFilter = (value: string) => {
    if (selectedFilters.includes(value)) {
      onFilterChange(selectedFilters.filter(f => f !== value));
    } else {
      onFilterChange([...selectedFilters, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {dietaryOptions.map(({ value, label, icon: Icon, color }) => {
        const isSelected = selectedFilters.includes(value);
        return (
          <Badge
            key={value}
            variant="outline"
            className={cn(
              'cursor-pointer transition-all px-3 py-1.5 text-sm font-medium',
              isSelected
                ? color
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
            onClick={() => toggleFilter(value)}
          >
            <Icon className="h-3.5 w-3.5 mr-1.5" />
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
