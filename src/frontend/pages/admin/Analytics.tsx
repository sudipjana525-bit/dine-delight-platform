import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalyticsDashboard, useBranchPerformance, useTopSellingItems } from "@/frontend/hooks/useAnalytics";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, ShoppingBag, DollarSign, Clock } from "lucide-react";
import { format, subDays } from "date-fns";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#10b981", "#f59e0b", "#ef4444"];

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30");
  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), Number(dateRange)), "yyyy-MM-dd");
  const { data: dashboardData, isLoading } = useAnalyticsDashboard(startDate, endDate);
  const { data: branchPerformance } = useBranchPerformance();
  const { data: topItems } = useTopSellingItems(5);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><p>Loading analytics...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Analytics & Reports</h1><p className="text-muted-foreground">Comprehensive insights into your business performance</p></div>
        <Select value={dateRange} onValueChange={setDateRange}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem></SelectContent></Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">${dashboardData?.revenue.reduce((sum, r) => sum + r.amount, 0).toFixed(2) || "0.00"}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Orders</CardTitle><ShoppingBag className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardData?.orders.reduce((sum, o) => sum + o.count, 0) || 0}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Avg Order Value</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">${dashboardData?.orderMetrics.averageOrderValue.toFixed(2) || "0.00"}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Customers</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardData?.customerMetrics.totalCustomers || 0}</div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><AreaChart data={dashboardData?.revenue || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "MMM d")} /><YAxis /><Tooltip /><Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" /></AreaChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Order Volume</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={dashboardData?.orders || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "MMM d")} /><YAxis /><Tooltip /><Bar dataKey="count" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Top Selling Items</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={topItems} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>{topItems?.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle>Branch Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={branchPerformance} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="branch" type="category" width={100} /><Tooltip /><Bar dataKey="revenue" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Peak Hours</CardTitle></CardHeader><CardContent><div className="space-y-2">{dashboardData?.orderMetrics.peakHours.slice(0, 5).map((hour) => (<div key={hour.hour} className="flex items-center justify-between"><span>{hour.hour.toString().padStart(2, "0")}:00</span><span className="text-sm text-muted-foreground">{hour.count} orders</span></div>))}</div></CardContent></Card>
      </div>
    </div>
  );
}
