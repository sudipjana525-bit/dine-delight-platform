import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Branch = Tables<"branches">;
export type BranchInsert = TablesInsert<"branches">;
export type BranchUpdate = TablesUpdate<"branches">;

export const branchService = {
  async getAll() {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("name");
    
    if (error) throw error;
    return data;
  },

  async getActive() {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("is_active", true)
      .order("name");
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(branch: BranchInsert) {
    const { data, error } = await supabase
      .from("branches")
      .insert(branch)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, branch: BranchUpdate) {
    const { data, error } = await supabase
      .from("branches")
      .update(branch)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("branches")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },
};
