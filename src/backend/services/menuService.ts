import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type MenuItem = Tables<"menu_items">;
export type MenuItemInsert = TablesInsert<"menu_items">;
export type MenuItemUpdate = TablesUpdate<"menu_items">;

export const menuService = {
  async getAll() {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, categories(name)")
      .order("name");
    
    if (error) throw error;
    return data;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, categories(name)")
      .eq("is_featured", true)
      .eq("is_available", true)
      .limit(6);
    
    if (error) throw error;
    return data;
  },

  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, categories(name)")
      .eq("category_id", categoryId)
      .eq("is_available", true);
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, categories(name)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(item: MenuItemInsert) {
    const { data, error } = await supabase
      .from("menu_items")
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, item: MenuItemUpdate) {
    const { data, error } = await supabase
      .from("menu_items")
      .update(item)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },
};
