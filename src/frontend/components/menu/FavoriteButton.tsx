import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/frontend/hooks/useAuth';
import { useFavorites, useToggleFavorite } from '@/frontend/hooks/useFavorites';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  menuItemId: string;
  className?: string;
}

export function FavoriteButton({ menuItemId, className }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { data: favorites } = useFavorites(user?.id);
  const toggleFavorite = useToggleFavorite();

  const isFavorite = favorites?.some(f => f.menu_item_id === menuItemId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    toggleFavorite.mutate({ 
      userId: user.id, 
      menuItemId, 
      isFavorite: !!isFavorite 
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={toggleFavorite.isPending}
      className={cn(
        'h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        )}
      />
    </Button>
  );
}
