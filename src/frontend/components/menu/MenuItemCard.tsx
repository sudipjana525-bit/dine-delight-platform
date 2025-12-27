import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Clock, Flame } from 'lucide-react';

interface MenuItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  dietaryTags?: string[];
  isAvailable?: boolean;
  isFeatured?: boolean;
  preparationTime?: number;
  calories?: number;
}

export function MenuItemCard({
  id,
  name,
  description,
  price,
  image,
  dietaryTags = [],
  isAvailable = true,
  isFeatured = false,
  preparationTime,
  calories,
}: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    
    addItem({
      menuItemId: id,
      name,
      price,
      quantity: 1,
      image,
    });
    toast.success(`${name} added to cart`);
  };

  const getDietaryColor = (tag: string) => {
    const colors: Record<string, string> = {
      'vegetarian': 'bg-green-100 text-green-800',
      'vegan': 'bg-emerald-100 text-emerald-800',
      'gluten-free': 'bg-amber-100 text-amber-800',
      'spicy': 'bg-red-100 text-red-800',
      'dairy-free': 'bg-blue-100 text-blue-800',
    };
    return colors[tag.toLowerCase()] || 'bg-muted text-muted-foreground';
  };

  return (
    <div 
      className={cn(
        'group relative bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300',
        !isAvailable && 'opacity-60'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-hero text-primary-foreground border-0">
              <Flame className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Unavailable Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="bg-background px-4 py-2 rounded-full text-sm font-medium">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Tags */}
        {dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dietaryTags.map((tag) => (
              <span
                key={tag}
                className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getDietaryColor(tag))}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title & Description */}
        <div>
          <h3 className="font-display text-lg font-semibold text-card-foreground">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {preparationTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {preparationTime} min
            </span>
          )}
          {calories && (
            <span>{calories} cal</span>
          )}
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            size="sm"
            className="bg-gradient-hero text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
