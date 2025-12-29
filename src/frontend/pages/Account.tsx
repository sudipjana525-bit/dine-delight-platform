import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, Save, Loader2, ArrowLeft, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/frontend/components/layout/Layout';
import { useAuth } from '@/frontend/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    default_address: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        default_address: profile.default_address || '',
      });
    }
  }, [profile]);

  const { data: orders } = useQuery({
    queryKey: ['orders', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, menu_items(name))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const handleSaveProfile = () => {
    updateProfile.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'picked_up':
        return 'bg-emerald-500/10 text-emerald-600';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600';
      case 'pending':
      case 'confirmed':
        return 'bg-amber-500/10 text-amber-600';
      case 'preparing':
      case 'ready':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-gradient-warm min-h-[80vh]">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">My Account</h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Default Address</Label>
                      <Textarea
                        id="address"
                        value={formData.default_address}
                        onChange={(e) => setFormData({ ...formData, default_address: e.target.value })}
                        placeholder="Your delivery address"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={handleSaveProfile}
                        disabled={updateProfile.isPending}
                      >
                        {updateProfile.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-xl font-semibold text-center">
                      {profile?.full_name || 'Welcome'}
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      {user?.email}
                    </p>
                    {profile?.phone && (
                      <p className="text-sm text-muted-foreground text-center">
                        {profile.phone}
                      </p>
                    )}
                    {profile?.default_address && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Default Address</p>
                        <p className="text-sm">{profile.default_address}</p>
                      </div>
                    )}
                    
                    <div className="mt-6 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-6 w-6 text-primary" />
                  <h2 className="font-display text-xl font-semibold">Order History</h2>
                </div>

                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="p-4 bg-secondary/50 rounded-lg border border-border"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at!).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-lg">
                              ${Number(order.total).toFixed(2)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.status || 'pending')}`}>
                              {order.status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <div className="text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}
                          </p>
                          {order.order_items && order.order_items.length > 0 && (
                            <p className="mt-1">
                              {order.order_items.map((item: any, i: number) => (
                                <span key={item.id}>
                                  {item.quantity}x {item.menu_items?.name || 'Item'}
                                  {i < order.order_items.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start exploring our delicious menu!
                    </p>
                    <Button 
                      className="bg-gradient-hero text-primary-foreground"
                      onClick={() => navigate('/menu')}
                    >
                      Browse Menu
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
