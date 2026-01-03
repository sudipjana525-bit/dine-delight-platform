import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { refundService, type RefundInsert } from "@/backend/services/refundService";
import { toast } from "sonner";

export function useRefunds() {
  return useQuery({
    queryKey: ["refunds"],
    queryFn: refundService.getAll,
  });
}

export function useUserRefunds(userId: string | undefined) {
  return useQuery({
    queryKey: ["refunds", "user", userId],
    queryFn: () => refundService.getByUser(userId!),
    enabled: !!userId,
  });
}

export function useRefundStats() {
  return useQuery({
    queryKey: ["refunds", "stats"],
    queryFn: refundService.getStats,
  });
}

export function useCreateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refund: RefundInsert) => refundService.create(refund),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      toast.success("Refund request submitted!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit refund: ${error.message}`);
    },
  });
}

export function useApproveRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      processedBy,
      refundMethod,
    }: {
      id: string;
      processedBy: string;
      refundMethod: string;
    }) => refundService.approve(id, processedBy, refundMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      toast.success("Refund approved!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve refund: ${error.message}`);
    },
  });
}

export function useRejectRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, processedBy }: { id: string; processedBy: string }) =>
      refundService.reject(id, processedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      toast.success("Refund rejected!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject refund: ${error.message}`);
    },
  });
}

export function useMarkRefundProcessed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, transactionId }: { id: string; transactionId: string }) =>
      refundService.markProcessed(id, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      toast.success("Refund marked as processed!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to process refund: ${error.message}`);
    },
  });
}
