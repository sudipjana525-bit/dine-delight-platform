import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/backend/services/analyticsService";

export function useAnalyticsDashboard(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["analytics", "dashboard", startDate, endDate],
    queryFn: () => analyticsService.getDashboardData(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useRevenueAnalytics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["analytics", "revenue", startDate, endDate],
    queryFn: () => analyticsService.getRevenueByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useOrdersAnalytics(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["analytics", "orders", startDate, endDate],
    queryFn: () => analyticsService.getOrdersByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useTopSellingItems(limit = 10) {
  return useQuery({
    queryKey: ["analytics", "top-items", limit],
    queryFn: () => analyticsService.getTopSellingItems(limit),
  });
}

export function useBranchPerformance() {
  return useQuery({
    queryKey: ["analytics", "branch-performance"],
    queryFn: analyticsService.getBranchPerformance,
  });
}

export function useCustomerMetrics() {
  return useQuery({
    queryKey: ["analytics", "customer-metrics"],
    queryFn: analyticsService.getCustomerMetrics,
  });
}

export function useOrderMetrics() {
  return useQuery({
    queryKey: ["analytics", "order-metrics"],
    queryFn: analyticsService.getOrderMetrics,
  });
}
