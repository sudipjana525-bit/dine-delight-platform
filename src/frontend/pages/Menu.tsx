import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Layout } from '@/frontend/components/layout/Layout';
import { MenuItemCard } from '@/frontend/components/menu/MenuItemCard';
import { CategoryFilter } from '@/frontend/components/menu/CategoryFilter';
import { DietaryFilters } from '@/frontend/components/menu/DietaryFilters';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items', selectedCategory, searchQuery, dietaryFilters],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select('*, categories(name)')
        .eq('is_available', true);

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query.order('is_featured', { ascending: false });
      if (error) throw error;
      
      // Filter by dietary tags client-side
      if (dietaryFilters.length > 0) {
        return data?.filter(item => 
          dietaryFilters.every(filter => 
            item.dietary_tags?.some((tag: string) => tag.toLowerCase() === filter.toLowerCase())
          )
        );
      }
      
      return data;
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-warm py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully crafted dishes made with the freshest ingredients 
            and bold flavors that will tantalize your taste buds.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-border py-4">
        <div className="container mx-auto space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Filter */}
            <div className="w-full md:w-auto overflow-x-auto">
              <CategoryFilter
                categories={categories || []}
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Dietary Filters */}
          <DietaryFilters
            selectedFilters={dietaryFilters}
            onFilterChange={setDietaryFilters}
          />
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-soft animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded" />
                    <div className="flex justify-between pt-2">
                      <div className="h-6 bg-muted rounded w-16" />
                      <div className="h-8 bg-muted rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : menuItems && menuItems.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item, index) => (
                <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
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
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="font-display text-2xl font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No dishes match "${searchQuery}". Try a different search.`
                  : 'Our menu is being prepared. Check back soon!'
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
