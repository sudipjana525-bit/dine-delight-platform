import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  revenue: { date: string; amount: number }[];
  orders: { date: string; count: number }[];
  topItems: { name: string; quantity: number; revenue: number }[];
  branchPerformance: { branch: string; orders: number; revenue: number }[];
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
  orderMetrics: {
    averageOrderValue: number;
    ordersPerDay: number;
    peakHours: { hour: number; count: number }[];
  };
}

export const analyticsService = {
  async getRevenueByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("total, created_at")
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .eq("status", "delivered");
    
    if (error) throw error;
    
    // Group by date
    const revenueByDate = data.reduce((acc, order) => {
      const date = new Date(order.created_at!).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + Number(order.total);
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      amount,
    }));
  },

  async getOrdersByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at")
      .gte("created_at", startDate)
      .lte("created_at", endDate);
    
    if (error) throw error;
    
    // Group by date
    const ordersByDate = data.reduce((acc, order) => {
      const date = new Date(order.created_at!).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(ordersByDate).map(([date, count]) => ({
      date,
      count,
    }));
  },

  async getTopSellingItems(limit = 10) {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        quantity,
        total_price,
        menu_items(name)
      `);
    
    if (error) throw error;
    
    // Aggregate by menu item
    const itemStats = data.reduce((acc, item) => {
      const name = (item.menu_items as { name: string })?.name || "Unknown";
      if (!acc[name]) {
        acc[name] = { quantity: 0, revenue: 0 };
      }
      acc[name].quantity += item.quantity;
      acc[name].revenue += Number(item.total_price);
      return acc;
    }, {} as Record<string, { quantity: number; revenue: number }>);
    
    return Object.entries(itemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  },

  async getBranchPerformance() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        total,
        branches(name)
      `)
      .eq("status", "delivered");
    
    if (error) throw error;
    
    // Aggregate by branch
    const branchStats = data.reduce((acc, order) => {
      const branch = (order.branches as { name: string })?.name || "Unknown";
      if (!acc[branch]) {
        acc[branch] = { orders: 0, revenue: 0 };
      }
      acc[branch].orders += 1;
      acc[branch].revenue += Number(order.total);
      return acc;
    }, {} as Record<string, { orders: number; revenue: number }>);
    
    return Object.entries(branchStats).map(([branch, stats]) => ({
      branch,
      ...stats,
    }));
  },

  async getCustomerMetrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: allOrders, error } = await supabase
      .from("orders")
      .select("user_id, created_at");
    
    if (error) throw error;
    
    const uniqueCustomers = new Set(allOrders.map(o => o.user_id));
    const recentCustomers = new Set(
      allOrders
        .filter(o => new Date(o.created_at!) >= thirtyDaysAgo)
        .map(o => o.user_id)
    );
    
    // Count orders per customer
    const orderCounts = allOrders.reduce((acc, order) => {
      acc[order.user_id!] = (acc[order.user_id!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const returningCustomers = Object.values(orderCounts).filter(c => c > 1).length;
    
    return {
      totalCustomers: uniqueCustomers.size,
      newCustomers: recentCustomers.size,
      returningCustomers,
    };
  },

  async getOrderMetrics() {
    const { data, error } = await supabase
      .from("orders")
      .select("total, created_at");
    
    if (error) throw error;
    
    if (data.length === 0) {
      return {
        averageOrderValue: 0,
        ordersPerDay: 0,
        peakHours: [],
      };
    }
    
    const totalRevenue = data.reduce((sum, o) => sum + Number(o.total), 0);
    const averageOrderValue = totalRevenue / data.length;
    
    // Calculate orders per day
    const dates = new Set(data.map(o => new Date(o.created_at!).toISOString().split("T")[0]));
    const ordersPerDay = data.length / dates.size;
    
    // Peak hours
    const hourCounts = data.reduce((acc, order) => {
      const hour = new Date(order.created_at!).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: Number(hour), count }))
      .sort((a, b) => b.count - a.count);
    
    return {
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      ordersPerDay: Number(ordersPerDay.toFixed(1)),
      peakHours,
    };
  },

  async getDashboardData(startDate: string, endDate: string): Promise<AnalyticsData> {
    const [revenue, orders, topItems, branchPerformance, customerMetrics, orderMetrics] =
      await Promise.all([
        this.getRevenueByDateRange(startDate, endDate),
        this.getOrdersByDateRange(startDate, endDate),
        this.getTopSellingItems(),
        this.getBranchPerformance(),
        this.getCustomerMetrics(),
        this.getOrderMetrics(),
      ]);
    
    return {
      revenue,
      orders,
      topItems,
      branchPerformance,
      customerMetrics,
      orderMetrics,
    };
  },
};
