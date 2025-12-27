import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: { id: string; name: string; image_url?: string }[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({ categories, selectedId, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all',
          selectedId === null
            ? 'bg-gradient-hero text-primary-foreground shadow-glow'
            : 'bg-secondary text-secondary-foreground hover:bg-muted'
        )}
      >
        All Items
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all',
            selectedId === category.id
              ? 'bg-gradient-hero text-primary-foreground shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
