import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Store, CreditCard, Loader2, Tag, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/frontend/components/layout/Layout';
import { useCartStore } from '@/lib/store';
import { useAuth } from '@/frontend/hooks/useAuth';
import { useActiveBranches } from '@/frontend/hooks/useBranches';
import { useCreateOrder } from '@/frontend/hooks/useOrders';
import { useValidatePromoCode } from '@/frontend/hooks/usePromotions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: branches } = useActiveBranches();
  const createOrder = useCreateOrder();
  const validatePromo = useValidatePromoCode();

  const { 
    items, 
    orderType, 
    setOrderType, 
    selectedBranchId, 
    setSelectedBranch,
    getSubtotal,
    clearCart 
  } = useCartStore();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    id: string;
    code: string;
    discount_type: string;
    discount_value: number;
  } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const deliveryFee = orderType === 'delivery' && subtotal < 30 ? 4.99 : 0;
  
  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount_type === 'percentage') {
      discount = subtotal * (appliedPromo.discount_value / 100);
    } else {
      discount = appliedPromo.discount_value;
    }
  }
  
  const total = subtotal + tax + deliveryFee - discount;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, authLoading, items, navigate]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidatingPromo(true);
    try {
      const result = await validatePromo.mutateAsync({ code: promoCode, orderTotal: subtotal });
      if (result.valid && result.promo) {
        setAppliedPromo({
          id: result.promo.id,
          code: result.promo.code,
          discount_type: result.promo.discount_type,
          discount_value: Number(result.promo.discount_value),
        });
        setPromoCode('');
      }
    } catch (error: any) {
      // Error handled in hook
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success('Promo code removed');
  };

  const handlePlaceOrder = async () => {
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    if (orderType === 'pickup' && !selectedBranchId) {
      toast.error('Please select a pickup location');
      return;
    }

    try {
      await createOrder.mutateAsync({
        order: {
          user_id: user!.id,
          branch_id: orderType === 'pickup' ? selectedBranchId : null,
          order_type: orderType,
          delivery_address: orderType === 'delivery' ? deliveryAddress : null,
          special_instructions: specialInstructions || null,
          subtotal,
          tax,
          delivery_fee: deliveryFee,
          discount,
          total,
          status: 'pending',
          estimated_time: orderType === 'delivery' ? 45 : 20,
        },
        items: items.map(item => ({
          menu_item_id: item.menuItemId,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          special_requests: item.specialRequests || null,
        })),
      });

      clearCart();
      navigate('/account');
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  if (authLoading) {
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
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </button>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-xl font-semibold mb-4">Order Type</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={cn(
                      'flex-1 py-4 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
                      orderType === 'delivery'
                        ? 'bg-gradient-hero text-primary-foreground shadow-glow'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    <MapPin className="h-5 w-5" />
                    Delivery
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={cn(
                      'flex-1 py-4 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
                      orderType === 'pickup'
                        ? 'bg-gradient-hero text-primary-foreground shadow-glow'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    <Store className="h-5 w-5" />
                    Pickup
                  </button>
                </div>
              </div>

              {/* Delivery Address or Branch Selection */}
              {orderType === 'delivery' ? (
                <div className="bg-card rounded-xl p-6 shadow-soft">
                  <h2 className="font-display text-xl font-semibold mb-4">
                    <MapPin className="inline h-5 w-5 mr-2" />
                    Delivery Address
                  </h2>
                  <Textarea
                    placeholder="Enter your full delivery address..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              ) : (
                <div className="bg-card rounded-xl p-6 shadow-soft">
                  <h2 className="font-display text-xl font-semibold mb-4">
                    <Store className="inline h-5 w-5 mr-2" />
                    Select Pickup Location
                  </h2>
                  <div className="space-y-3">
                    {branches?.map((branch) => (
                      <button
                        key={branch.id}
                        onClick={() => setSelectedBranch(branch.id)}
                        className={cn(
                          'w-full p-4 rounded-lg text-left transition-all border-2',
                          selectedBranchId === branch.id
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent bg-secondary hover:bg-muted'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{branch.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {branch.address}, {branch.city}
                            </p>
                            {branch.phone && (
                              <p className="text-sm text-muted-foreground">{branch.phone}</p>
                            )}
                          </div>
                          {selectedBranchId === branch.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-xl font-semibold mb-4">Special Instructions</h2>
                <Textarea
                  placeholder="Any special requests? (allergies, preferences, etc.)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Promo Code */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-xl font-semibold mb-4">
                  <Tag className="inline h-5 w-5 mr-2" />
                  Promo Code
                </h2>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div>
                      <span className="font-medium text-primary">{appliedPromo.code}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({appliedPromo.discount_type === 'percentage' 
                          ? `${appliedPromo.discount_value}% off`
                          : `$${appliedPromo.discount_value} off`
                        })
                      </span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyPromo}
                      disabled={isValidatingPromo || !promoCode.trim()}
                    >
                      {isValidatingPromo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 pb-4 border-b border-border">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 py-4 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between py-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full h-12 bg-gradient-hero text-primary-foreground hover:opacity-90 text-base"
                  onClick={handlePlaceOrder}
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing your order, you agree to our terms of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
