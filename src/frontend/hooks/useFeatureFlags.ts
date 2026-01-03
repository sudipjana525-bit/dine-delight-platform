import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  featureFlagService,
  type FeatureFlagInsert,
  type FeatureFlagUpdate,
} from "@/backend/services/featureFlagService";
import { toast } from "sonner";

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["feature-flags"],
    queryFn: featureFlagService.getAll,
  });
}

export function useEnabledFeatureFlags() {
  return useQuery({
    queryKey: ["feature-flags", "enabled"],
    queryFn: featureFlagService.getEnabled,
  });
}

export function useIsFeatureEnabled(name: string) {
  return useQuery({
    queryKey: ["feature-flags", "check", name],
    queryFn: () => featureFlagService.isEnabled(name),
    enabled: !!name,
  });
}

export function useCreateFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flag: FeatureFlagInsert) => featureFlagService.create(flag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      toast.success("Feature flag created!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create feature flag: ${error.message}`);
    },
  });
}

export function useUpdateFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FeatureFlagUpdate }) =>
      featureFlagService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      toast.success("Feature flag updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update feature flag: ${error.message}`);
    },
  });
}

export function useToggleFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureFlagService.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      toast.success("Feature flag toggled!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to toggle feature flag: ${error.message}`);
    },
  });
}

export function useDeleteFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureFlagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      toast.success("Feature flag deleted!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete feature flag: ${error.message}`);
    },
  });
}
