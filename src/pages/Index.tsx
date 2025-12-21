import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Clock, Truck, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { LocationCard } from '@/components/locations/LocationCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const { data: featuredItems } = useQuery({
    queryKey: ['featured-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-warm">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Star className="h-4 w-4 fill-primary" />
                Award-Winning Cuisine
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-foreground">
                Where Every Bite
                <span className="block text-gradient">Tells a Story</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Experience the perfect blend of tradition and innovation. Fresh ingredients, 
                bold flavors, and culinary excellence crafted just for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu">
                  <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-glow text-base px-8 h-14">
                    Explore Our Menu
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/locations">
                  <Button size="lg" variant="outline" className="text-base px-8 h-14">
                    Find a Location
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-display font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Locations</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="text-3xl font-display font-bold text-primary">50k+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="text-3xl font-display font-bold text-primary">4.9</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-hero rounded-full blur-3xl opacity-20 animate-float" />
                <div className="relative bg-gradient-hero rounded-full p-8 shadow-elevated">
                  <div className="bg-card rounded-full p-8 shadow-soft">
                    <img
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop"
                      alt="Delicious food"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -left-8 top-1/4 bg-card p-4 rounded-xl shadow-elevated animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Fast Delivery</p>
                      <p className="text-xs text-muted-foreground">30 min avg</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 bg-card p-4 rounded-xl shadow-elevated animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Fresh Daily</p>
                      <p className="text-xs text-muted-foreground">Made to order</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Utensils,
                title: 'Fresh Ingredients',
                description: 'Locally sourced, seasonal ingredients for the best quality and taste.',
              },
              {
                icon: Clock,
                title: 'Quick Service',
                description: 'Fast preparation without compromising on quality or flavor.',
              },
              {
                icon: Truck,
                title: 'Free Delivery',
                description: 'Complimentary delivery on orders over $30 within our service area.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-8 rounded-2xl bg-background shadow-soft hover:shadow-elevated transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Our Specialties
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
                Featured Dishes
              </h2>
            </div>
            <Link to="/menu" className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-4 transition-all">
              View Full Menu
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          {featuredItems && featuredItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item, index) => (
                <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <MenuItemCard
                    id={item.id}
                    name={item.name}
                    description={item.description || undefined}
                    price={Number(item.price)}
                    image={item.image_url || undefined}
                    dietaryTags={item.dietary_tags || []}
                    isAvailable={item.is_available || true}
                    isFeatured={item.is_featured || false}
                    preparationTime={item.preparation_time || undefined}
                    calories={item.calories || undefined}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No featured items yet. Check back soon!</p>
              <Link to="/menu">
                <Button className="bg-gradient-hero text-primary-foreground">
                  Browse All Menu Items
                </Button>
              </Link>
            </div>
          )}

          <Link to="/menu" className="mt-8 flex md:hidden items-center justify-center gap-2 text-primary font-medium">
            View Full Menu
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Visit Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">
              Our Locations
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Find a Savoria restaurant near you and experience our exceptional dining firsthand.
            </p>
          </div>

          {branches && branches.length > 0 ? (
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
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Locations coming soon!</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/locations">
              <Button variant="outline" size="lg">
                View All Locations
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Experience the taste of excellence. Order now for delivery or pickup 
            and enjoy our award-winning dishes at your convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" variant="secondary" className="text-base px-10 h-14">
                Start Your Order
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-base px-10 h-14 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Join Rewards
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
