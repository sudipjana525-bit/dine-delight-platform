import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/backend/services/favoriteService";
import { toast } from "sonner";

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => favoriteService.getByUser(userId!),
    enabled: !!userId,
  });
}

export function useIsFavorite(userId: string | undefined, menuItemId: string) {
  return useQuery({
    queryKey: ["favorites", userId, menuItemId],
    queryFn: () => favoriteService.isFavorite(userId!, menuItemId),
    enabled: !!userId && !!menuItemId,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      menuItemId,
      isFavorite,
    }: {
      userId: string;
      menuItemId: string;
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        await favoriteService.remove(userId, menuItemId);
      } else {
        await favoriteService.add(userId, menuItemId);
      }
    },
    onSuccess: (_, { isFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update favorites: ${error.message}`);
    },
  });
}
