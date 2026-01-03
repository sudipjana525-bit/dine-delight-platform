import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService, type ReviewInsert, type ReviewUpdate } from "@/backend/services/reviewService";
import { toast } from "sonner";

export function useMenuItemReviews(menuItemId: string) {
  return useQuery({
    queryKey: ["reviews", "menu-item", menuItemId],
    queryFn: () => reviewService.getByMenuItem(menuItemId),
    enabled: !!menuItemId,
  });
}

export function useUserReviews(userId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", "user", userId],
    queryFn: () => reviewService.getByUser(userId!),
    enabled: !!userId,
  });
}

export function useMenuItemRating(menuItemId: string) {
  return useQuery({
    queryKey: ["reviews", "rating", menuItemId],
    queryFn: () => reviewService.getAverageRating(menuItemId),
    enabled: !!menuItemId,
  });
}

export function useAllReviews() {
  return useQuery({
    queryKey: ["reviews", "all"],
    queryFn: reviewService.getAll,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: ReviewInsert) => reviewService.create(review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit review: ${error.message}`);
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, review }: { id: string; review: ReviewUpdate }) =>
      reviewService.update(id, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update review: ${error.message}`);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete review: ${error.message}`);
    },
  });
}

export function useToggleReviewVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      reviewService.toggleVisibility(id, isVisible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review visibility updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update review: ${error.message}`);
    },
  });
}
