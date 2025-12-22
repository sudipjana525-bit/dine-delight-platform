import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Locations from "./pages/Locations";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminRoute } from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMenuItems from "./pages/admin/MenuItems";
import AdminCategories from "./pages/admin/Categories";
import AdminBranches from "./pages/admin/Branches";
import AdminOrders from "./pages/admin/Orders";
import AdminPromotions from "./pages/admin/Promotions";
import AdminUsers from "./pages/admin/Users";

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
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="menu-items" element={<AdminMenuItems />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="branches" element={<AdminBranches />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="users" element={<AdminRoute requiredRole="admin"><AdminUsers /></AdminRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
