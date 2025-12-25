import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/frontend/components/layout/Layout';
import { LocationCard } from '@/frontend/components/locations/LocationCard';
import { supabase } from '@/integrations/supabase/client';

export default function LocationsPage() {
  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('city');
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-warm py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            Our Locations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find a Savoria restaurant near you. Each location offers the same 
            exceptional quality and warm hospitality.
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-soft animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-4">
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="flex gap-3 pt-2">
                      <div className="h-10 bg-muted rounded flex-1" />
                      <div className="h-10 bg-muted rounded flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : branches && branches.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch, index) => (
                <div key={branch.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <LocationCard
                    id={branch.id}
                    name={branch.name}
                    address={branch.address}
                    city={branch.city}
                    phone={branch.phone || undefined}
                    image={branch.image_url || undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="font-display text-2xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                We're expanding! New locations will be announced soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
