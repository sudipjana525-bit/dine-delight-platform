import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  DollarSign, 
  UtensilsCrossed, 
  MapPin,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [ordersRes, menuItemsRes, branchesRes, recentOrdersRes] = await Promise.all([
        supabase.from('orders').select('id, total, status, created_at'),
        supabase.from('menu_items').select('id', { count: 'exact' }),
        supabase.from('branches').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('orders').select('*, order_items(*, menu_items(*))').order('created_at', { ascending: false }).limit(5),
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

      return {
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        menuItems: menuItemsRes.count || 0,
        branches: branchesRes.count || 0,
        recentOrders: recentOrdersRes.data || [],
      };
    },
  });

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, 
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    { 
      label: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingCart,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Pending Orders', 
      value: stats?.pendingOrders || 0, 
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    { 
      label: 'Menu Items', 
      value: stats?.menuItems || 0, 
      icon: UtensilsCrossed,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Active Branches', 
      value: stats?.branches || 0, 
      icon: MapPin,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your restaurant.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_items?.length || 0} items • {order.order_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total?.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' || order.status === 'picked_up' 
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : order.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}