import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate, Enums } from "@/integrations/supabase/types";

export type Order = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;
export type OrderUpdate = TablesUpdate<"orders">;
export type OrderItem = Tables<"order_items">;
export type OrderItemInsert = TablesInsert<"order_items">;
export type OrderStatus = Enums<"order_status">;
export type OrderType = Enums<"order_type">;

export interface CreateOrderData {
  order: Omit<OrderInsert, "id" | "created_at" | "updated_at">;
  items: Omit<OrderItemInsert, "id" | "order_id" | "created_at">[];
}

export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        branches(name),
        order_items(*, menu_items(name, image_url))
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        branches(name),
        order_items(*, menu_items(name, image_url))
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        branches(name, address, phone),
        order_items(*, menu_items(name, image_url))
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(orderData: CreateOrderData) {
    // Create order first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData.order)
      .select()
      .single();
    
    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return order;
  },

  async updateStatus(id: string, status: OrderStatus) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStats() {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("total, status, created_at");
    
    if (error) throw error;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalOrders: orders.length,
      todayOrders: orders.filter(o => new Date(o.created_at!) >= today).length,
      totalRevenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
      todayRevenue: orders
        .filter(o => new Date(o.created_at!) >= today)
        .reduce((sum, o) => sum + Number(o.total), 0),
      pendingOrders: orders.filter(o => o.status === "pending").length,
    };

    return stats;
  },
};
