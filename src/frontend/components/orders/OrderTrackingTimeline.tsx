import { Check, Clock, ChefHat, Package, Truck, MapPin } from 'lucide-react';
import { useOrderTracking, useRealtimeOrderTracking } from '@/frontend/hooks/useOrderTracking';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OrderTrackingTimelineProps {
  orderId: string;
  orderType: 'delivery' | 'pickup';
}

const deliverySteps = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: Check },
  { status: 'preparing', label: 'Preparing', icon: ChefHat },
  { status: 'ready', label: 'Ready', icon: Package },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: MapPin },
];

const pickupSteps = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: Check },
  { status: 'preparing', label: 'Preparing', icon: ChefHat },
  { status: 'ready', label: 'Ready for Pickup', icon: Package },
  { status: 'picked_up', label: 'Picked Up', icon: Check },
];

export function OrderTrackingTimeline({ orderId, orderType }: OrderTrackingTimelineProps) {
  const { data: trackingHistory, refetch } = useOrderTracking(orderId);
  
  // Enable realtime updates - use the returned events for real-time display
  const realtimeEvents = useRealtimeOrderTracking(orderId);

  const steps = orderType === 'delivery' ? deliverySteps : pickupSteps;
  
  // Use realtime events if available, otherwise fall back to query data
  const events = realtimeEvents.length > 0 ? realtimeEvents : trackingHistory;
  const currentStatuses = events?.map(t => t.status) || [];
  const latestStatus = currentStatuses[currentStatuses.length - 1] || 'pending';
  const currentStepIndex = steps.findIndex(s => s.status === latestStatus);

  const getStepStatus = (index: number) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  const getStatusTime = (status: string) => {
    const event = events?.find(t => t.status === status);
    return event ? format(new Date(event.created_at), 'h:mm a') : null;
  };

  return (
    <div className="py-4">
      <div className="relative">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const Icon = step.icon;
          const time = getStatusTime(step.status);

          return (
            <div key={step.status} className="flex items-start gap-4 pb-8 last:pb-0">
              {/* Timeline Line */}
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all',
                    stepStatus === 'completed' && 'bg-green-500 text-white',
                    stepStatus === 'current' && 'bg-primary text-primary-foreground animate-pulse',
                    stepStatus === 'pending' && 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute top-10 w-0.5 h-full',
                      index < currentStepIndex ? 'bg-green-500' : 'bg-muted'
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center justify-between">
                  <h4
                    className={cn(
                      'font-medium',
                      stepStatus === 'pending' && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </h4>
                  {time && (
                    <span className="text-sm text-muted-foreground">{time}</span>
                  )}
                </div>
                {stepStatus === 'current' && (
                  <p className="text-sm text-primary mt-1">In progress...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
