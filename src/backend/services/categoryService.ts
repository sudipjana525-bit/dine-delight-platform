import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Category = Tables<"categories">;
export type CategoryInsert = TablesInsert<"categories">;
export type CategoryUpdate = TablesUpdate<"categories">;

export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    
    if (error) throw error;
    return data;
  },

  async getActive() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(category: CategoryInsert) {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, category: CategoryUpdate) {
    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },
};
