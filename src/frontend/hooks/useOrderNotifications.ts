import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useOrderNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('admin-order-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New order received:', payload);
          
          const newOrder = payload.new as {
            id: string;
            order_type: string;
            total: number;
            created_at: string;
          };

          // Show toast notification
          toast({
            title: '🔔 New Order Received!',
            description: `Order #${newOrder.id.slice(0, 8)} - ${newOrder.order_type === 'delivery' ? 'Delivery' : 'Pickup'} - $${newOrder.total.toFixed(2)}`,
            duration: 10000,
          });

          // Invalidate orders query to refresh the list
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated:', payload);
          
          // Invalidate orders query to refresh the list
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
      )
      .subscribe((status) => {
        console.log('Order notifications subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, queryClient]);
};
