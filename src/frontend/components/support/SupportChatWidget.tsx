import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/frontend/hooks/useAuth';
import { 
  useUserTickets, 
  useTicketMessages, 
  useCreateTicket, 
  useSendMessage,
  useRealtimeMessages 
} from '@/frontend/hooks/useSupport';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function SupportChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: tickets } = useUserTickets(user?.id);
  const { data: messages, refetch: refetchMessages } = useTicketMessages(activeTicketId || '');
  const createTicket = useCreateTicket();
  const sendMessage = useSendMessage();

  // Enable realtime for active ticket
  const realtimeMessages = useRealtimeMessages(activeTicketId || '');

  // Use realtime messages if available
  const displayMessages = realtimeMessages.length > 0 ? realtimeMessages : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  const handleCreateTicket = () => {
    if (!user || !newSubject.trim()) return;
    
    createTicket.mutate(
      { user_id: user.id, subject: newSubject },
      {
        onSuccess: (ticket) => {
          setActiveTicketId(ticket.id);
          setNewSubject('');
          setShowNewTicket(false);
        },
      }
    );
  };

  const handleSendMessage = () => {
    if (!user || !activeTicketId || !message.trim()) return;

    sendMessage.mutate(
      { ticket_id: activeTicketId, sender_id: user.id, message },
      { onSuccess: () => setMessage('') }
    );
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50',
          'bg-gradient-hero text-primary-foreground hover:opacity-90',
          isOpen && 'hidden'
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-card rounded-xl shadow-elevated z-50 flex flex-col overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-gradient-hero text-primary-foreground p-4 flex items-center justify-between">
            <h3 className="font-semibold">Support Chat</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                onClick={() => {
                  setActiveTicketId(null);
                  setShowNewTicket(false);
                }}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTicketId ? (
              // Chat Messages
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {displayMessages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'max-w-[80%] p-3 rounded-lg text-sm',
                        msg.is_from_support
                          ? 'bg-muted mr-auto'
                          : 'bg-primary text-primary-foreground ml-auto'
                      )}
                    >
                      <p>{msg.message}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        msg.is_from_support ? 'text-muted-foreground' : 'opacity-70'
                      )}>
                        {format(new Date(msg.created_at), 'h:mm a')}
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={sendMessage.isPending || !message.trim()}
                      size="icon"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : showNewTicket ? (
              // New Ticket Form
              <div className="p-4 space-y-4">
                <h4 className="font-medium">Start a new conversation</h4>
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="What do you need help with?"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateTicket}
                    disabled={createTicket.isPending || !newSubject.trim()}
                    className="flex-1"
                  >
                    {createTicket.isPending ? 'Creating...' : 'Start Chat'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Ticket List
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <Button
                    onClick={() => setShowNewTicket(true)}
                    className="w-full mb-4"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>

                  {tickets && tickets.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">Recent conversations</p>
                      {tickets.map((ticket) => (
                        <button
                          key={ticket.id}
                          onClick={() => setActiveTicketId(ticket.id)}
                          className="w-full p-3 bg-muted/50 rounded-lg text-left hover:bg-muted transition-colors"
                        >
                          <p className="font-medium text-sm truncate">{ticket.subject}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full capitalize',
                              ticket.status === 'open' && 'bg-green-100 text-green-700',
                              ticket.status === 'in_progress' && 'bg-blue-100 text-blue-700',
                              ticket.status === 'resolved' && 'bg-gray-100 text-gray-700'
                            )}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(ticket.created_at), 'MMM d')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No conversations yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
