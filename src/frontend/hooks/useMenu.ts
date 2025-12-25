import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService, type MenuItemInsert, type MenuItemUpdate } from "@/backend/services/menuService";
import { toast } from "sonner";

export function useMenuItems() {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: menuService.getAll,
  });
}

export function useFeaturedMenuItems() {
  return useQuery({
    queryKey: ["menu-items", "featured"],
    queryFn: menuService.getFeatured,
  });
}

export function useMenuItemsByCategory(categoryId: string | null) {
  return useQuery({
    queryKey: ["menu-items", "category", categoryId],
    queryFn: () => categoryId ? menuService.getByCategory(categoryId) : menuService.getAll(),
    enabled: true,
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menu-items", id],
    queryFn: () => menuService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: MenuItemInsert) => menuService.create(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu item created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create menu item: ${error.message}`);
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, item }: { id: string; item: MenuItemUpdate }) => 
      menuService.update(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu item updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update menu item: ${error.message}`);
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => menuService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu item deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete menu item: ${error.message}`);
    },
  });
}
