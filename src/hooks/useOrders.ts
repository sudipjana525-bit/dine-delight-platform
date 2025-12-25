import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, type CreateOrderData, type OrderStatus } from "@/services/orderService";
import { toast } from "sonner";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getAll,
  });
}

export function useUserOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ["orders", "user", userId],
    queryFn: () => orderService.getByUser(userId!),
    enabled: !!userId,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: orderService.getStats,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: CreateOrderData) => orderService.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to place order: ${error.message}`);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => 
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update order status: ${error.message}`);
    },
  });
}
