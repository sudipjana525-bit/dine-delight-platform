import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type KdsOrder = Tables<"kds_orders">;
export type KdsOrderInsert = TablesInsert<"kds_orders">;
export type KdsOrderUpdate = TablesUpdate<"kds_orders">;

export type KdsStatus = "queued" | "preparing" | "ready" | "served";

export const kdsService = {
  async getByBranch(branchId: string) {
    const { data, error } = await supabase
      .from("kds_orders")
      .select(`
        *,
        orders(
          id,
          order_type,
          special_instructions,
          created_at,
          order_items(*, menu_items(name))
        )
      `)
      .eq("branch_id", branchId)
      .in("status", ["queued", "preparing", "ready"])
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("kds_orders")
      .select(`
        *,
        orders(
          id,
          order_type,
          special_instructions,
          created_at,
          order_items(*, menu_items(name))
        ),
        branches(name)
      `)
      .in("status", ["queued", "preparing", "ready"])
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(kdsOrder: KdsOrderInsert) {
    const { data, error } = await supabase
      .from("kds_orders")
      .insert(kdsOrder)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: KdsStatus) {
    const updates: KdsOrderUpdate = { status };
    
    if (status === "preparing") {
      updates.started_at = new Date().toISOString();
    } else if (status === "ready" || status === "served") {
      updates.completed_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from("kds_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePriority(id: string, priority: number) {
    const { data, error } = await supabase
      .from("kds_orders")
      .update({ priority })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  subscribeToKds(branchId: string, callback: (event: KdsOrder) => void) {
    return supabase
      .channel(`kds-${branchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kds_orders",
          filter: `branch_id=eq.${branchId}`,
        },
        (payload) => callback(payload.new as KdsOrder)
      )
      .subscribe();
  },
};
