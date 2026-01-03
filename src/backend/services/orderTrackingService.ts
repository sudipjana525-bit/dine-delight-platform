import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type OrderTracking = Tables<"order_tracking">;
export type OrderTrackingInsert = TablesInsert<"order_tracking">;

export const ORDER_TRACKING_STATUSES = [
  { status: "pending", label: "Order Placed", description: "Your order has been received" },
  { status: "confirmed", label: "Confirmed", description: "Restaurant has confirmed your order" },
  { status: "preparing", label: "Preparing", description: "Your food is being prepared" },
  { status: "ready", label: "Ready", description: "Your order is ready" },
  { status: "out_for_delivery", label: "Out for Delivery", description: "Your order is on the way" },
  { status: "delivered", label: "Delivered", description: "Order has been delivered" },
  { status: "cancelled", label: "Cancelled", description: "Order was cancelled" },
];

export const orderTrackingService = {
  async getByOrder(orderId: string) {
    const { data, error } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addEvent(event: OrderTrackingInsert) {
    const { data, error } = await supabase
      .from("order_tracking")
      .insert(event)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getLatestStatus(orderId: string) {
    const { data, error } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  subscribeToOrder(orderId: string, callback: (event: OrderTracking) => void) {
    return supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_tracking",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => callback(payload.new as OrderTracking)
      )
      .subscribe();
  },
};
