import { useQuery } from "@tanstack/react-query";
import { auditLogService } from "@/backend/services/auditLogService";

export function useAuditLogs(filters?: {
  entityType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => auditLogService.getAll(filters),
  });
}

export function useEntityHistory(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ["audit-logs", "entity", entityType, entityId],
    queryFn: () => auditLogService.getEntityHistory(entityType, entityId),
    enabled: !!entityType && !!entityId,
  });
}

export function useUserActivity(userId: string, limit = 50) {
  return useQuery({
    queryKey: ["audit-logs", "user", userId, limit],
    queryFn: () => auditLogService.getUserActivity(userId, limit),
    enabled: !!userId,
  });
}

export function useAuditLogStats() {
  return useQuery({
    queryKey: ["audit-logs", "stats"],
    queryFn: auditLogService.getStats,
  });
}
