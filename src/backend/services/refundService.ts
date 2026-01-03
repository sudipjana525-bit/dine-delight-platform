import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Refund = Tables<"refunds">;
export type RefundInsert = TablesInsert<"refunds">;
export type RefundUpdate = TablesUpdate<"refunds">;

export type RefundStatus = "pending" | "approved" | "rejected" | "processed";

export const refundService = {
  async getAll() {
    const { data, error } = await supabase
      .from("refunds")
      .select(`
        *,
        orders(id, total, created_at),
        profiles:user_id(full_name)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("refunds")
      .select(`
        *,
        orders(id, total, created_at)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(refund: RefundInsert) {
    const { data, error } = await supabase
      .from("refunds")
      .insert(refund)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async approve(id: string, processedBy: string, refundMethod: string) {
    const { data, error } = await supabase
      .from("refunds")
      .update({
        status: "approved",
        processed_by: processedBy,
        processed_at: new Date().toISOString(),
        refund_method: refundMethod,
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async reject(id: string, processedBy: string) {
    const { data, error } = await supabase
      .from("refunds")
      .update({
        status: "rejected",
        processed_by: processedBy,
        processed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async markProcessed(id: string, transactionId: string) {
    const { data, error } = await supabase
      .from("refunds")
      .update({
        status: "processed",
        transaction_id: transactionId,
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStats() {
    const { data, error } = await supabase
      .from("refunds")
      .select("status, amount");
    
    if (error) throw error;
    
    return {
      total: data.length,
      pending: data.filter(r => r.status === "pending").length,
      approved: data.filter(r => r.status === "approved").length,
      rejected: data.filter(r => r.status === "rejected").length,
      processed: data.filter(r => r.status === "processed").length,
      totalAmount: data.reduce((sum, r) => sum + Number(r.amount), 0),
      processedAmount: data
        .filter(r => r.status === "processed")
        .reduce((sum, r) => sum + Number(r.amount), 0),
    };
  },
};
