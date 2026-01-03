import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKdsOrders, useUpdateKdsStatus, useUpdateKdsPriority } from "@/frontend/hooks/useKds";
import { useBranches } from "@/frontend/hooks/useBranches";
import { Clock, ChefHat, CheckCircle, Bell, ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type KdsStatus = "queued" | "preparing" | "ready" | "served";

export default function KitchenDisplay() {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const { data: kdsOrders, isLoading } = useKdsOrders();
  const { data: branches } = useBranches();
  const updateStatusMutation = useUpdateKdsStatus();
  const updatePriorityMutation = useUpdateKdsPriority();
  const filteredOrders = selectedBranch ? kdsOrders?.filter((o) => o.branch_id === selectedBranch) : kdsOrders;
  const queuedOrders = filteredOrders?.filter((o) => o.status === "queued") || [];
  const preparingOrders = filteredOrders?.filter((o) => o.status === "preparing") || [];
  const readyOrders = filteredOrders?.filter((o) => o.status === "ready") || [];
  const handleStatusChange = (id: string, status: KdsStatus) => { updateStatusMutation.mutate({ id, status }); };
  const handlePriorityChange = (id: string, currentPriority: number, increase: boolean) => { updatePriorityMutation.mutate({ id, priority: increase ? currentPriority + 1 : Math.max(0, currentPriority - 1) }); };
  const getStatusColor = (status: string) => { switch (status) { case "queued": return "bg-yellow-500/10 border-yellow-500/50"; case "preparing": return "bg-blue-500/10 border-blue-500/50"; case "ready": return "bg-green-500/10 border-green-500/50"; default: return ""; } };

  const OrderCard = ({ order }: { order: (typeof kdsOrders)[0] }) => {
    const orderData = order.orders as { id: string; order_type: string; special_instructions: string; created_at: string; order_items: Array<{ quantity: number; menu_items: { name: string } }> };
    return (
      <Card className={`${getStatusColor(order.status)} transition-all`}>
        <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-lg">Order #{orderData?.id?.slice(0, 8)}</CardTitle>{order.priority > 0 && <Badge variant="destructive">Priority {order.priority}</Badge>}</div><p className="text-sm text-muted-foreground">{orderData?.created_at && formatDistanceToNow(new Date(orderData.created_at), { addSuffix: true })}</p></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">{orderData?.order_items?.map((item, idx) => (<div key={idx} className="text-sm">{item.quantity}x {item.menu_items?.name}</div>))}</div>
          {orderData?.special_instructions && <div className="rounded bg-muted p-2 text-sm"><strong>Note:</strong> {orderData.special_instructions}</div>}
          <div className="flex gap-2">
            {order.status === "queued" && <Button size="sm" onClick={() => handleStatusChange(order.id, "preparing")} className="flex-1">Start</Button>}
            {order.status === "preparing" && <Button size="sm" onClick={() => handleStatusChange(order.id, "ready")} className="flex-1">Ready</Button>}
            {order.status === "ready" && <Button size="sm" onClick={() => handleStatusChange(order.id, "served")} className="flex-1">Served</Button>}
            <Button size="sm" variant="outline" onClick={() => handlePriorityChange(order.id, order.priority || 0, true)}><ArrowUp className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => handlePriorityChange(order.id, order.priority || 0, false)}><ArrowDown className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Kitchen Display</h1><p className="text-muted-foreground">Manage kitchen orders in real-time</p></div><Select value={selectedBranch} onValueChange={setSelectedBranch}><SelectTrigger className="w-48"><SelectValue placeholder="All branches" /></SelectTrigger><SelectContent><SelectItem value="">All</SelectItem>{branches?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
      {isLoading ? <p>Loading orders...</p> : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-yellow-500" /><h2 className="text-xl font-semibold">Queued</h2><Badge variant="secondary">{queuedOrders.length}</Badge></div><div className="space-y-4">{queuedOrders.map((order) => <OrderCard key={order.id} order={order} />)}{queuedOrders.length === 0 && <p className="text-center text-muted-foreground">No orders</p>}</div></div>
          <div className="space-y-4"><div className="flex items-center gap-2"><ChefHat className="h-5 w-5 text-blue-500" /><h2 className="text-xl font-semibold">Preparing</h2><Badge variant="secondary">{preparingOrders.length}</Badge></div><div className="space-y-4">{preparingOrders.map((order) => <OrderCard key={order.id} order={order} />)}{preparingOrders.length === 0 && <p className="text-center text-muted-foreground">No orders</p>}</div></div>
          <div className="space-y-4"><div className="flex items-center gap-2"><Bell className="h-5 w-5 text-green-500" /><h2 className="text-xl font-semibold">Ready</h2><Badge variant="secondary">{readyOrders.length}</Badge></div><div className="space-y-4">{readyOrders.map((order) => <OrderCard key={order.id} order={order} />)}{readyOrders.length === 0 && <p className="text-center text-muted-foreground">No orders</p>}</div></div>
        </div>
      )}
    </div>
  );
}
