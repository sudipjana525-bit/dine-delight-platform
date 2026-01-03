import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Review = Tables<"reviews">;
export type ReviewInsert = TablesInsert<"reviews">;
export type ReviewUpdate = TablesUpdate<"reviews">;

export const reviewService = {
  async getByMenuItem(menuItemId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles(full_name, avatar_url)
      `)
      .eq("menu_item_id", menuItemId)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        menu_items(name, image_url)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAverageRating(menuItemId: string) {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("menu_item_id", menuItemId)
      .eq("is_visible", true);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return { average: 0, count: 0 };
    
    const sum = data.reduce((acc, r) => acc + r.rating, 0);
    return {
      average: Number((sum / data.length).toFixed(1)),
      count: data.length,
    };
  },

  async create(review: ReviewInsert) {
    const { data, error } = await supabase
      .from("reviews")
      .insert(review)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, review: ReviewUpdate) {
    const { data, error } = await supabase
      .from("reviews")
      .update(review)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },

  // Admin functions
  async getAll() {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles(full_name),
        menu_items(name)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async toggleVisibility(id: string, isVisible: boolean) {
    const { data, error } = await supabase
      .from("reviews")
      .update({ is_visible: isVisible })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
