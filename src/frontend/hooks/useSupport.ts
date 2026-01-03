import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  supportService,
  type SupportTicket,
  type SupportTicketInsert,
  type SupportTicketUpdate,
  type SupportMessage,
  type SupportMessageInsert,
} from "@/backend/services/supportService";
import { toast } from "sonner";

// Tickets
export function useUserTickets(userId: string | undefined) {
  return useQuery({
    queryKey: ["support-tickets", "user", userId],
    queryFn: () => supportService.getTicketsByUser(userId!),
    enabled: !!userId,
  });
}

export function useAllTickets() {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: supportService.getAllTickets,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["support-tickets", id],
    queryFn: () => supportService.getTicketById(id),
    enabled: !!id,
  });
}

export function useSupportStats() {
  return useQuery({
    queryKey: ["support-tickets", "stats"],
    queryFn: supportService.getStats,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticket: SupportTicketInsert) => supportService.createTicket(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast.success("Support ticket created!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create ticket: ${error.message}`);
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SupportTicketUpdate }) =>
      supportService.updateTicket(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast.success("Ticket updated!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update ticket: ${error.message}`);
    },
  });
}

// Messages
export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: ["support-messages", ticketId],
    queryFn: () => supportService.getMessages(ticketId),
    enabled: !!ticketId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: SupportMessageInsert) => supportService.sendMessage(message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-messages", variables.ticket_id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

export function useRealtimeMessages(ticketId: string) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ticketId) return;

    // Load initial messages
    supportService.getMessages(ticketId).then(setMessages);

    // Subscribe to new messages
    const channel = supportService.subscribeToMessages(ticketId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      queryClient.invalidateQueries({ queryKey: ["support-messages", ticketId] });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [ticketId, queryClient]);

  return messages;
}
