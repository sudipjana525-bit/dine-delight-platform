import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/frontend/hooks/useAuth';
import { useMenuItemReviews, useCreateReview } from '@/frontend/hooks/useReviews';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ItemReviewsProps {
  menuItemId: string;
  menuItemName: string;
}

export function ItemReviews({ menuItemId, menuItemName }: ItemReviewsProps) {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useMenuItemReviews(menuItemId);
  const createReview = useCreateReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    createReview.mutate(
      { menu_item_id: menuItemId, user_id: user.id, rating, comment },
      {
        onSuccess: () => {
          setOpen(false);
          setRating(5);
          setComment('');
        },
      }
    );
  };

  const averageRating = reviews?.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-4 w-4',
                  star <= Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} ({reviews?.length || 0} reviews)
          </span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review {menuItemName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          'h-6 w-6',
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Comment</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createReview.isPending}
                className="w-full"
              >
                {createReview.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-muted/50 rounded-lg animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-3 w-3',
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No reviews yet. Be the first to review!
        </p>
      )}
    </div>
  );
}
