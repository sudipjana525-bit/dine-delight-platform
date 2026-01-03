import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Inventory = Tables<"inventory">;
export type InventoryInsert = TablesInsert<"inventory">;
export type InventoryUpdate = TablesUpdate<"inventory">;

export const inventoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from("inventory")
      .select(`
        *,
        menu_items(name, image_url),
        branches(name)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByBranch(branchId: string) {
    const { data, error } = await supabase
      .from("inventory")
      .select(`
        *,
        menu_items(name, image_url)
      `)
      .eq("branch_id", branchId)
      .order("quantity", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getLowStock(branchId?: string) {
    let query = supabase
      .from("inventory")
      .select(`
        *,
        menu_items(name, image_url),
        branches(name)
      `);
    
    if (branchId) {
      query = query.eq("branch_id", branchId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Filter items where quantity <= min_threshold
    return data?.filter(item => item.quantity <= item.min_threshold) || [];
  },

  async upsert(inventory: InventoryInsert) {
    const { data, error } = await supabase
      .from("inventory")
      .upsert(inventory)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: InventoryUpdate) {
    const { data, error } = await supabase
      .from("inventory")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async restock(id: string, quantity: number) {
    const { data: current, error: fetchError } = await supabase
      .from("inventory")
      .select("quantity")
      .eq("id", id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { data, error } = await supabase
      .from("inventory")
      .update({
        quantity: current.quantity + quantity,
        last_restocked_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deductStock(menuItemId: string, branchId: string, quantity: number) {
    const { data: current, error: fetchError } = await supabase
      .from("inventory")
      .select("id, quantity")
      .eq("menu_item_id", menuItemId)
      .eq("branch_id", branchId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newQuantity = Math.max(0, current.quantity - quantity);
    
    const { data, error } = await supabase
      .from("inventory")
      .update({ quantity: newQuantity })
      .eq("id", current.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
