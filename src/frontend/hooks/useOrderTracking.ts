import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  orderTrackingService,
  ORDER_TRACKING_STATUSES,
  type OrderTracking,
  type OrderTrackingInsert,
} from "@/backend/services/orderTrackingService";
import { toast } from "sonner";

export { ORDER_TRACKING_STATUSES };

export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: ["order-tracking", orderId],
    queryFn: () => orderTrackingService.getByOrder(orderId),
    enabled: !!orderId,
  });
}

export function useLatestOrderStatus(orderId: string) {
  return useQuery({
    queryKey: ["order-tracking", "latest", orderId],
    queryFn: () => orderTrackingService.getLatestStatus(orderId),
    enabled: !!orderId,
  });
}

export function useAddTrackingEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: OrderTrackingInsert) => orderTrackingService.addEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-tracking"] });
      toast.success("Tracking updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update tracking: ${error.message}`);
    },
  });
}

export function useRealtimeOrderTracking(orderId: string) {
  const [events, setEvents] = useState<OrderTracking[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) return;

    // Load initial events
    orderTrackingService.getByOrder(orderId).then(setEvents);

    // Subscribe to new events
    const channel = orderTrackingService.subscribeToOrder(orderId, (newEvent) => {
      setEvents((prev) => [...prev, newEvent]);
      queryClient.invalidateQueries({ queryKey: ["order-tracking", orderId] });
      toast.info(`Order update: ${newEvent.status}`);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [orderId, queryClient]);

  return events;
}
