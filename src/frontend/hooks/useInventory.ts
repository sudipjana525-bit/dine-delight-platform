import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  inventoryService,
  type InventoryInsert,
  type InventoryUpdate,
} from "@/backend/services/inventoryService";
import { toast } from "sonner";

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryService.getAll,
  });
}

export function useInventoryByBranch(branchId: string) {
  return useQuery({
    queryKey: ["inventory", "branch", branchId],
    queryFn: () => inventoryService.getByBranch(branchId),
    enabled: !!branchId,
  });
}

export function useLowStockItems(branchId?: string) {
  return useQuery({
    queryKey: ["inventory", "low-stock", branchId],
    queryFn: () => inventoryService.getLowStock(branchId),
  });
}

export function useUpsertInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inventory: InventoryInsert) => inventoryService.upsert(inventory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update inventory: ${error.message}`);
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: InventoryUpdate }) =>
      inventoryService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update inventory: ${error.message}`);
    },
  });
}

export function useRestockInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      inventoryService.restock(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Stock replenished!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to restock: ${error.message}`);
    },
  });
}
