import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  image?: string;
  openingHours?: Record<string, string>;
}

export function LocationCard({
  id,
  name,
  address,
  city,
  phone,
  image,
  openingHours,
}: LocationCardProps) {
  const setSelectedBranch = useCartStore((state) => state.setSelectedBranch);

  const handleSelect = () => {
    setSelectedBranch(id);
    toast.success(`Selected ${name} for your order`);
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-card-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 flex items-start gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            {address}, {city}
          </p>
        </div>

        {phone && (
          <a 
            href={`tel:${phone}`}
            className="text-sm text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
        )}

        {openingHours && (
          <div className="text-sm text-muted-foreground flex items-start gap-2">
            <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Open today: 11am - 10pm</span>
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address + ', ' + city)}`, '_blank')}
          >
            Directions
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-hero text-primary-foreground hover:opacity-90"
            onClick={handleSelect}
          >
            Order Here
          </Button>
        </div>
      </div>
    </div>
  );
}
