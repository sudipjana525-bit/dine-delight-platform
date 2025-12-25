import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionService, type PromotionInsert, type PromotionUpdate } from "@/services/promotionService";
import { toast } from "sonner";

export function usePromotions() {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: promotionService.getAll,
  });
}

export function useActivePromotions() {
  return useQuery({
    queryKey: ["promotions", "active"],
    queryFn: promotionService.getActive,
  });
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: ({ code, orderTotal }: { code: string; orderTotal: number }) =>
      promotionService.validateCode(code, orderTotal),
    onSuccess: (result) => {
      if (result.valid) {
        toast.success(`Promo code applied! You save $${result.discount?.toFixed(2)}`);
      } else {
        toast.error(result.message);
      }
    },
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (promotion: PromotionInsert) => promotionService.create(promotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create promotion: ${error.message}`);
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, promotion }: { id: string; promotion: PromotionUpdate }) => 
      promotionService.update(id, promotion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update promotion: ${error.message}`);
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => promotionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast.success("Promotion deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete promotion: ${error.message}`);
    },
  });
}
