import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type AuditLog = Tables<"audit_logs">;
export type AuditLogInsert = TablesInsert<"audit_logs">;

export const auditLogService = {
  async getAll(filters?: {
    entityType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    let query = supabase
      .from("audit_logs")
      .select(`
        *,
        profiles:user_id(full_name)
      `)
      .order("created_at", { ascending: false });
    
    if (filters?.entityType) {
      query = query.eq("entity_type", filters.entityType);
    }
    if (filters?.userId) {
      query = query.eq("user_id", filters.userId);
    }
    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async log(log: AuditLogInsert) {
    const { data, error } = await supabase
      .from("audit_logs")
      .insert(log)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getEntityHistory(entityType: string, entityId: string) {
    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        *,
        profiles:user_id(full_name)
      `)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getUserActivity(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select("action, entity_type, created_at");
    
    if (error) throw error;
    
    const todayLogs = data.filter(l => new Date(l.created_at!) >= today);
    
    const actionCounts = data.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const entityCounts = data.reduce((acc, log) => {
      acc[log.entity_type] = (acc[log.entity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalLogs: data.length,
      todayLogs: todayLogs.length,
      actionCounts,
      entityCounts,
    };
  },
};
