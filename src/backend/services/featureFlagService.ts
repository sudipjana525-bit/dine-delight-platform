import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type FeatureFlag = Tables<"feature_flags">;
export type FeatureFlagInsert = TablesInsert<"feature_flags">;
export type FeatureFlagUpdate = TablesUpdate<"feature_flags">;

export const featureFlagService = {
  async getAll() {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getEnabled() {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .eq("is_enabled", true);
    
    if (error) throw error;
    return data;
  },

  async isEnabled(name: string) {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("is_enabled, conditions")
      .eq("name", name)
      .maybeSingle();
    
    if (error) throw error;
    return data?.is_enabled || false;
  },

  async create(flag: FeatureFlagInsert) {
    const { data, error } = await supabase
      .from("feature_flags")
      .insert(flag)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: FeatureFlagUpdate) {
    const { data, error } = await supabase
      .from("feature_flags")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async toggle(id: string) {
    const { data: current, error: fetchError } = await supabase
      .from("feature_flags")
      .select("is_enabled")
      .eq("id", id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { data, error } = await supabase
      .from("feature_flags")
      .update({ is_enabled: !current.is_enabled })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("feature_flags")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  },
};
