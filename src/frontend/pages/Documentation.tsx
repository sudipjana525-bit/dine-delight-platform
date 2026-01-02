import { Layout } from '@/frontend/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  User,
  ShieldCheck,
  ShoppingCart,
  MapPin,
  CreditCard,
  Bell,
  UtensilsCrossed,
  Settings,
  Users,
  Package,
  Tag,
  BarChart3,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function Documentation() {
  const customerFeatures = [
    {
      icon: UtensilsCrossed,
      title: 'Browse Menu',
      description: 'Explore our full menu with categories, dietary information, and prices.',
      path: '/menu',
    },
    {
      icon: ShoppingCart,
      title: 'Cart & Ordering',
      description: 'Add items to cart, customize orders, and proceed to checkout.',
      path: '/cart',
    },
    {
      icon: MapPin,
      title: 'Find Locations',
      description: 'View all restaurant branches with addresses and opening hours.',
      path: '/locations',
    },
    {
      icon: CreditCard,
      title: 'Checkout',
      description: 'Choose delivery or pickup, apply promo codes, and complete your order.',
      path: '/checkout',
    },
    {
      icon: User,
      title: 'Account Management',
      description: 'View order history, manage profile, and update delivery addresses.',
      path: '/account',
    },
    {
      icon: Tag,
      title: 'Promotions',
      description: 'Apply discount codes during checkout for special offers.',
      path: '/checkout',
    },
  ];

  const adminFeatures = [
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Overview of revenue, orders, and key business metrics.',
      roles: ['admin', 'manager', 'staff'],
    },
    {
      icon: UtensilsCrossed,
      title: 'Menu Management',
      description: 'Add, edit, or remove menu items. Set prices, descriptions, and availability.',
      roles: ['admin', 'manager'],
    },
    {
      icon: Package,
      title: 'Category Management',
      description: 'Organize menu items into categories. Control display order and visibility.',
      roles: ['admin', 'manager'],
    },
    {
      icon: Building2,
      title: 'Branch Management',
      description: 'Manage restaurant locations, addresses, and operating hours.',
      roles: ['admin'],
    },
    {
      icon: ShoppingCart,
      title: 'Order Management',
      description: 'View all orders, update status, and track deliveries in real-time.',
      roles: ['admin', 'manager', 'staff'],
    },
    {
      icon: Tag,
      title: 'Promotions',
      description: 'Create and manage discount codes, set validity periods and usage limits.',
      roles: ['admin', 'manager'],
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage user accounts and assign roles (admin, manager, staff).',
      roles: ['admin'],
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Receive instant notifications when new orders are placed.',
      roles: ['admin', 'manager', 'staff'],
    },
  ];

  const roleDescriptions = [
    {
      role: 'Customer',
      badge: 'default' as const,
      description: 'Regular users who browse the menu and place orders.',
      capabilities: [
        'Browse menu and view item details',
        'Add items to cart and place orders',
        'Choose delivery or pickup',
        'Apply promotional codes',
        'View order history',
        'Manage profile and addresses',
      ],
    },
    {
      role: 'Staff',
      badge: 'secondary' as const,
      description: 'Restaurant staff with limited admin access.',
      capabilities: [
        'All customer features',
        'View admin dashboard',
        'View and update order status',
        'Receive order notifications',
      ],
    },
    {
      role: 'Manager',
      badge: 'outline' as const,
      description: 'Restaurant managers with broader administrative access.',
      capabilities: [
        'All staff features',
        'Manage menu items and categories',
        'Create and manage promotions',
        'View all orders and statistics',
      ],
    },
    {
      role: 'Admin',
      badge: 'destructive' as const,
      description: 'Full administrative access to all features.',
      capabilities: [
        'All manager features',
        'Manage restaurant branches',
        'Manage user accounts and roles',
        'Full system configuration',
      ],
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn how to use our restaurant ordering platform as a customer or administrator.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button asChild variant="outline">
            <a href="#customer-features">Customer Guide</a>
          </Button>
          <Button asChild variant="outline">
            <a href="#admin-features">Admin Guide</a>
          </Button>
          <Button asChild variant="outline">
            <a href="#roles">User Roles</a>
          </Button>
          <Button asChild variant="outline">
            <a href="#getting-started">Getting Started</a>
          </Button>
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Getting Started
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  For Customers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Visit our website and browse the menu</li>
                  <li>Create an account or sign in</li>
                  <li>Add items to your cart</li>
                  <li>Choose delivery or pickup</li>
                  <li>Complete checkout and track your order</li>
                </ol>
                <Button asChild className="w-full">
                  <Link to="/menu">
                    Browse Menu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  For Administrators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Set up initial admin at <code className="bg-muted px-1 rounded">/admin-setup</code></li>
                  <li>Sign in with your admin credentials</li>
                  <li>Access admin panel via the gear icon or <code className="bg-muted px-1 rounded">/admin</code></li>
                  <li>Configure menu, branches, and promotions</li>
                  <li>Manage orders and monitor business metrics</li>
                </ol>
                <Button asChild className="w-full">
                  <Link to="/admin-setup">
                    Admin Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Customer Features */}
        <section id="customer-features" className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Customer Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerFeatures.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={feature.path}>
                      Try it
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Admin Features */}
        <section id="admin-features" className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Admin Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {feature.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle>Accessing the Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The admin panel is available at <code className="bg-background px-2 py-1 rounded">/admin</code>. 
                You must be signed in with a staff, manager, or admin role to access it.
              </p>
              <div className="space-y-2">
                <p className="font-medium">Admin panel sections:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Dashboard</strong> - Overview and statistics</li>
                  <li><strong>Menu Items</strong> - Manage food items</li>
                  <li><strong>Categories</strong> - Organize menu categories</li>
                  <li><strong>Branches</strong> - Manage locations</li>
                  <li><strong>Orders</strong> - Process customer orders</li>
                  <li><strong>Promotions</strong> - Create discount codes</li>
                  <li><strong>Users</strong> - Manage user roles (admin only)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* User Roles */}
        <section id="roles" className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Roles & Permissions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {roleDescriptions.map((item) => (
              <Card key={item.role}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{item.role}</CardTitle>
                    <Badge variant={item.badge}>{item.role}</Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {item.capabilities.map((cap, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {cap}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              If you have questions or need assistance, our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/locations">Find a Location</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
