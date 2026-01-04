import { useState } from 'react';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/frontend/hooks/useAuth';
import { useCartStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

interface ScheduledOrderFormProps {
  branchId?: string;
}

export function ScheduledOrderForm({ branchId }: ScheduledOrderFormProps) {
  const { user } = useAuth();
  const { items, clearCart } = useCartStore();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('weekly');

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to schedule orders');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('scheduled_orders').insert({
        user_id: user.id,
        branch_id: branchId || null,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? recurrencePattern : null,
        cart_data: items as any,
      });

      if (error) throw error;

      toast.success('Order scheduled successfully!');
      clearCart();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to schedule order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [];
  for (let h = 10; h <= 21; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule for Later
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Your Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Date */}
          <div>
            <Label htmlFor="date" className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
            />
          </div>

          {/* Time */}
          <div>
            <Label htmlFor="time" className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              Time
            </Label>
            <Select value={scheduledTime} onValueChange={setScheduledTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="recurring">Make it recurring</Label>
            </div>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </div>

          {isRecurring && (
            <div>
              <Label htmlFor="pattern" className="mb-2 block">Repeat</Label>
              <Select value={recurrencePattern} onValueChange={setRecurrencePattern}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Order Summary</p>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} scheduled for{' '}
              {format(new Date(scheduledDate), 'EEEE, MMMM d')} at {scheduledTime}
            </p>
            {isRecurring && (
              <p className="text-sm text-primary mt-1">
                Repeating {recurrencePattern}
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || items.length === 0}
            className="w-full"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
