import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./frontend/pages/Index";
import Menu from "./frontend/pages/Menu";
import Locations from "./frontend/pages/Locations";
import Auth from "./frontend/pages/Auth";
import Cart from "./frontend/pages/Cart";
import Checkout from "./frontend/pages/Checkout";
import Account from "./frontend/pages/Account";
import NotFound from "./frontend/pages/NotFound";
import { AdminLayout } from "./frontend/components/admin/AdminLayout";
import { AdminRoute } from "./frontend/components/admin/AdminRoute";
import AdminDashboard from "./frontend/pages/admin/Dashboard";
import AdminMenuItems from "./frontend/pages/admin/MenuItems";
import AdminCategories from "./frontend/pages/admin/Categories";
import AdminBranches from "./frontend/pages/admin/Branches";
import AdminOrders from "./frontend/pages/admin/Orders";
import AdminPromotions from "./frontend/pages/admin/Promotions";
import AdminUsers from "./frontend/pages/admin/Users";
import AdminSetup from "./frontend/pages/AdminSetup";
import Documentation from "./frontend/pages/Documentation";
import AdminInventory from "./frontend/pages/admin/Inventory";
import AdminKitchenDisplay from "./frontend/pages/admin/KitchenDisplay";
import AdminAnalytics from "./frontend/pages/admin/Analytics";
import AdminRefunds from "./frontend/pages/admin/Refunds";
import AdminAuditLogs from "./frontend/pages/admin/AuditLogs";
import AdminFeatureFlags from "./frontend/pages/admin/FeatureFlags";
import AdminReviews from "./frontend/pages/admin/Reviews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-setup" element={<AdminSetup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="menu-items" element={<AdminMenuItems />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="branches" element={<AdminBranches />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="users" element={<AdminRoute requiredRole="admin"><AdminUsers /></AdminRoute>} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="kitchen" element={<AdminKitchenDisplay />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="refunds" element={<AdminRefunds />} />
            <Route path="audit-logs" element={<AdminRoute requiredRole="admin"><AdminAuditLogs /></AdminRoute>} />
            <Route path="feature-flags" element={<AdminRoute requiredRole="admin"><AdminFeatureFlags /></AdminRoute>} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
