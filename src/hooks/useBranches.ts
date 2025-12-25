import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService, type BranchInsert, type BranchUpdate } from "@/services/branchService";
import { toast } from "sonner";

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getAll,
  });
}

export function useActiveBranches() {
  return useQuery({
    queryKey: ["branches", "active"],
    queryFn: branchService.getActive,
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => branchService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (branch: BranchInsert) => branchService.create(branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create branch: ${error.message}`);
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, branch }: { id: string; branch: BranchUpdate }) => 
      branchService.update(id, branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update branch: ${error.message}`);
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => branchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete branch: ${error.message}`);
    },
  });
}
