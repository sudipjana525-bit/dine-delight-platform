import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate, Enums } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;
export type UserRole = Tables<"user_roles">;
export type AppRole = Enums<"app_role">;

export interface UserWithRole extends Profile {
  user_roles: UserRole[];
  email?: string;
}

export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, profile: ProfileUpdate) {
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    // Fetch profiles and roles separately since there's no direct FK relation
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (profilesError) throw profilesError;

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*");
    
    if (rolesError) throw rolesError;

    // Combine profiles with their roles
    const usersWithRoles: UserWithRole[] = profiles.map(profile => ({
      ...profile,
      user_roles: roles.filter(role => role.user_id === profile.id),
    }));

    return usersWithRoles;
  },

  async getUserRoles(userId: string) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);
    
    if (error) throw error;
    return data;
  },

  async hasRole(userId: string, role: AppRole) {
    const { data, error } = await supabase
      .rpc("has_role", { _user_id: userId, _role: role });
    
    if (error) throw error;
    return data;
  },

  async updateUserRole(userId: string, role: AppRole, branchId?: string) {
    // First check if user already has a role entry
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingRole) {
      const { error } = await supabase
        .from("user_roles")
        .update({ role, branch_id: branchId || null })
        .eq("user_id", userId);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role, branch_id: branchId || null });
      
      if (error) throw error;
    }
  },
};
