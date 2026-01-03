import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory, useLowStockItems, useRestockInventory, useUpsertInventory } from "@/frontend/hooks/useInventory";
import { useBranches } from "@/frontend/hooks/useBranches";
import { useMenu } from "@/frontend/hooks/useMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Package, AlertTriangle, Plus, RefreshCw } from "lucide-react";

export default function Inventory() {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState<Record<string, number>>({});
  const { data: inventory, isLoading } = useInventory();
  const { data: lowStock } = useLowStockItems(selectedBranch || undefined);
  const { data: branches } = useBranches();
  const { data: menuItems } = useMenu();
  const restockMutation = useRestockInventory();
  const upsertMutation = useUpsertInventory();
  const [newInventory, setNewInventory] = useState({ menu_item_id: "", branch_id: "", quantity: 0, min_threshold: 10, max_threshold: 100, unit: "pieces" });
  const filteredInventory = selectedBranch ? inventory?.filter((i) => i.branch_id === selectedBranch) : inventory;
  const handleRestock = (id: string) => { const qty = restockQuantity[id]; if (qty && qty > 0) { restockMutation.mutate({ id, quantity: qty }); setRestockQuantity((prev) => ({ ...prev, [id]: 0 })); } };
  const handleAddInventory = () => { upsertMutation.mutate(newInventory, { onSuccess: () => { setIsAddDialogOpen(false); setNewInventory({ menu_item_id: "", branch_id: "", quantity: 0, min_threshold: 10, max_threshold: 100, unit: "pieces" }); } }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Inventory Management</h1><p className="text-muted-foreground">Track and manage stock levels</p></div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Item</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add Inventory</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Menu Item</Label><Select value={newInventory.menu_item_id} onValueChange={(v) => setNewInventory({ ...newInventory, menu_item_id: v })}><SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger><SelectContent>{menuItems?.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Branch</Label><Select value={newInventory.branch_id} onValueChange={(v) => setNewInventory({ ...newInventory, branch_id: v })}><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{branches?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div><div className="grid grid-cols-2 gap-4"><div><Label>Quantity</Label><Input type="number" value={newInventory.quantity} onChange={(e) => setNewInventory({ ...newInventory, quantity: Number(e.target.value) })} /></div><div><Label>Unit</Label><Input value={newInventory.unit} onChange={(e) => setNewInventory({ ...newInventory, unit: e.target.value })} /></div></div><Button onClick={handleAddInventory} className="w-full">Add</Button></div></DialogContent></Dialog>
      </div>
      {lowStock && lowStock.length > 0 && (<Card className="border-destructive"><CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Low Stock Alert</CardTitle><CardDescription>{lowStock.length} item(s) running low</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{lowStock.map((item) => <Badge key={item.id} variant="destructive">{(item.menu_items as { name: string })?.name} - {item.quantity} left</Badge>)}</div></CardContent></Card>)}
      <Card><CardHeader><CardTitle>Filter</CardTitle></CardHeader><CardContent><Select value={selectedBranch} onValueChange={setSelectedBranch}><SelectTrigger className="w-64"><SelectValue placeholder="All branches" /></SelectTrigger><SelectContent><SelectItem value="">All</SelectItem>{branches?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Inventory</CardTitle></CardHeader><CardContent>
        {isLoading ? <p>Loading...</p> : (
          <Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Branch</TableHead><TableHead>Quantity</TableHead><TableHead>Status</TableHead><TableHead>Thresholds</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredInventory?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{(item.menu_items as { name: string })?.name}</TableCell>
                <TableCell>{(item.branches as { name: string })?.name}</TableCell>
                <TableCell>{item.quantity} {item.unit}</TableCell>
                <TableCell>{item.quantity <= item.min_threshold ? <Badge variant="destructive">Low</Badge> : item.quantity >= item.max_threshold ? <Badge variant="secondary">Overstocked</Badge> : <Badge variant="default">In Stock</Badge>}</TableCell>
                <TableCell>Min: {item.min_threshold} / Max: {item.max_threshold}</TableCell>
                <TableCell><div className="flex items-center gap-2"><Input type="number" placeholder="Qty" className="w-20" value={restockQuantity[item.id] || ""} onChange={(e) => setRestockQuantity((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))} /><Button size="sm" variant="outline" onClick={() => handleRestock(item.id)}><RefreshCw className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
}
