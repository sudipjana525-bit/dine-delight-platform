import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Favorite = Tables<"favorites">;
export type FavoriteInsert = TablesInsert<"favorites">;

export const favoriteService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("favorites")
      .select(`
        *,
        menu_items(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async add(userId: string, menuItemId: string) {
    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, menu_item_id: menuItemId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async remove(userId: string, menuItemId: string) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("menu_item_id", menuItemId);
    
    if (error) throw error;
  },

  async isFavorite(userId: string, menuItemId: string) {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("menu_item_id", menuItemId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  },
};
