import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loyaltyService, TIER_THRESHOLDS, POINTS_PER_DOLLAR } from "@/backend/services/loyaltyService";
import { toast } from "sonner";

export { TIER_THRESHOLDS, POINTS_PER_DOLLAR };

export function useLoyaltyPoints(userId: string | undefined) {
  return useQuery({
    queryKey: ["loyalty-points", userId],
    queryFn: () => loyaltyService.getPoints(userId!),
    enabled: !!userId,
  });
}

export function useLoyaltyTransactions(userId: string | undefined) {
  return useQuery({
    queryKey: ["loyalty-transactions", userId],
    queryFn: () => loyaltyService.getTransactions(userId!),
    enabled: !!userId,
  });
}

export function useEarnPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      orderId,
      orderTotal,
    }: {
      userId: string;
      orderId: string;
      orderTotal: number;
    }) => loyaltyService.earnPoints(userId, orderId, orderTotal),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-points"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty-transactions"] });
      toast.success(`You earned ${result.pointsEarned} points!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to earn points: ${error.message}`);
    },
  });
}

export function useRedeemPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      points,
      description,
    }: {
      userId: string;
      points: number;
      description: string;
    }) => loyaltyService.redeemPoints(userId, points, description),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-points"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty-transactions"] });
      toast.success(`Redeemed ${result.pointsRedeemed} points!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to redeem points: ${error.message}`);
    },
  });
}

export function useAddBonusPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      points,
      description,
    }: {
      userId: string;
      points: number;
      description: string;
    }) => loyaltyService.addBonusPoints(userId, points, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-points"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty-transactions"] });
      toast.success("Bonus points added!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add bonus points: ${error.message}`);
    },
  });
}
