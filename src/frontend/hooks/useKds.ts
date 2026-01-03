import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  kdsService,
  type KdsOrder,
  type KdsOrderInsert,
  type KdsStatus,
} from "@/backend/services/kdsService";
import { toast } from "sonner";

export function useKdsOrders() {
  return useQuery({
    queryKey: ["kds-orders"],
    queryFn: kdsService.getAll,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useKdsOrdersByBranch(branchId: string) {
  return useQuery({
    queryKey: ["kds-orders", "branch", branchId],
    queryFn: () => kdsService.getByBranch(branchId),
    enabled: !!branchId,
    refetchInterval: 30000,
  });
}

export function useCreateKdsOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kdsOrder: KdsOrderInsert) => kdsService.create(kdsOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create KDS order: ${error.message}`);
    },
  });
}

export function useUpdateKdsStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: KdsStatus }) =>
      kdsService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      toast.success("Order status updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });
}

export function useUpdateKdsPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: number }) =>
      kdsService.updatePriority(id, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      toast.success("Priority updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update priority: ${error.message}`);
    },
  });
}

export function useRealtimeKds(branchId: string) {
  const [orders, setOrders] = useState<KdsOrder[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!branchId) return;

    // Load initial orders
    kdsService.getByBranch(branchId).then(setOrders);

    // Subscribe to updates
    const channel = kdsService.subscribeToKds(branchId, () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      kdsService.getByBranch(branchId).then(setOrders);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [branchId, queryClient]);

  return orders;
}
