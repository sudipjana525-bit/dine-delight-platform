import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type ProfileUpdate, type AppRole } from "@/backend/services/userService";
import { toast } from "sonner";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => userService.getProfile(userId!),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, profile }: { userId: string; profile: ProfileUpdate }) =>
      userService.updateProfile(userId, profile),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
  });
}

export function useUserRoles(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: () => userService.getUserRoles(userId!),
    enabled: !!userId,
  });
}

export function useHasRole(userId: string | undefined, role: AppRole) {
  return useQuery({
    queryKey: ["has-role", userId, role],
    queryFn: () => userService.hasRole(userId!, role),
    enabled: !!userId,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role, branchId }: { userId: string; role: AppRole; branchId?: string }) =>
      userService.updateUserRole(userId, role, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success("User role updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
  });
}
