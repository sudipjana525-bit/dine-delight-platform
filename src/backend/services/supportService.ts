import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type SupportTicket = Tables<"support_tickets">;
export type SupportTicketInsert = TablesInsert<"support_tickets">;
export type SupportTicketUpdate = TablesUpdate<"support_tickets">;
export type SupportMessage = Tables<"support_messages">;
export type SupportMessageInsert = TablesInsert<"support_messages">;

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export const supportService = {
  // Tickets
  async getTicketsByUser(userId: string) {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        orders(id, total, created_at)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAllTickets() {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        profiles:user_id(full_name),
        orders(id, total)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTicketById(id: string) {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        profiles:user_id(full_name),
        orders(id, total, created_at)
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createTicket(ticket: SupportTicketInsert) {
    const { data, error } = await supabase
      .from("support_tickets")
      .insert(ticket)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTicket(id: string, updates: SupportTicketUpdate) {
    const { data, error } = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Messages
  async getMessages(ticketId: string) {
    const { data, error } = await supabase
      .from("support_messages")
      .select(`
        *,
        profiles:sender_id(full_name, avatar_url)
      `)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async sendMessage(message: SupportMessageInsert) {
    const { data, error } = await supabase
      .from("support_messages")
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  subscribeToMessages(ticketId: string, callback: (message: SupportMessage) => void) {
    return supabase
      .channel(`support-messages-${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => callback(payload.new as SupportMessage)
      )
      .subscribe();
  },

  async getStats() {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("status, priority, created_at");
    
    if (error) throw error;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: data.length,
      open: data.filter(t => t.status === "open").length,
      inProgress: data.filter(t => t.status === "in_progress").length,
      resolved: data.filter(t => t.status === "resolved").length,
      todayTickets: data.filter(t => new Date(t.created_at!) >= today).length,
      urgent: data.filter(t => t.priority === "urgent" && t.status !== "closed").length,
    };
  },
};
