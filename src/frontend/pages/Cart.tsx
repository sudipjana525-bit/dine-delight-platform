import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/frontend/components/layout/Layout';
import { useCartStore } from '@/lib/store';
import { useAuth } from '@/frontend/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getSubtotal, orderType, setOrderType, clearCart } = useCartStore();
  const { user } = useAuth();
  const subtotal = getSubtotal();
  const tax = subtotal * 0.08;
  const deliveryFee = orderType === 'delivery' && subtotal < 30 ? 4.99 : 0;
  const total = subtotal + tax + deliveryFee;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center animate-fade-up">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven't added any items to your cart yet. 
              Explore our menu to find something delicious!
            </p>
            <Link to="/menu">
              <Button size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                Browse Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-gradient-warm min-h-[80vh]">
        <div className="container mx-auto">
          <Link to="/menu" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-card rounded-xl p-4 shadow-soft flex gap-4 animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-lg truncate">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <p className="font-bold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>

                {/* Order Type Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={cn(
                      'flex-1 py-3 rounded-lg font-medium transition-all',
                      orderType === 'delivery'
                        ? 'bg-gradient-hero text-primary-foreground shadow-glow'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={cn(
                      'flex-1 py-3 rounded-lg font-medium transition-all',
                      orderType === 'pickup'
                        ? 'bg-gradient-hero text-primary-foreground shadow-glow'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    Pickup
                  </button>
                </div>

                {/* Summary Lines */}
                <div className="space-y-3 pb-4 border-b border-border">
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
                </div>

                {/* Total */}
                <div className="flex justify-between py-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                {orderType === 'delivery' && subtotal < 30 && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Add ${(30 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}

                {user ? (
                  <Button 
                    className="w-full h-12 bg-gradient-hero text-primary-foreground hover:opacity-90 text-base"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Link to="/auth" className="block">
                      <Button 
                        className="w-full h-12 bg-gradient-hero text-primary-foreground hover:opacity-90 text-base"
                      >
                        Sign In to Order
                      </Button>
                    </Link>
                    <p className="text-sm text-center text-muted-foreground">
                      Or <Link to="/auth" className="text-primary hover:underline">create an account</Link>
                    </p>
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
