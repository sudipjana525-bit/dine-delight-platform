import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFeatureFlags, useCreateFeatureFlag, useToggleFeatureFlag, useDeleteFeatureFlag, useUpdateFeatureFlag } from "@/frontend/hooks/useFeatureFlags";
import { Flag, Plus, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";

export default function FeatureFlags() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<string | null>(null);
  const { data: flags, isLoading } = useFeatureFlags();
  const createMutation = useCreateFeatureFlag();
  const toggleMutation = useToggleFeatureFlag();
  const deleteMutation = useDeleteFeatureFlag();
  const updateMutation = useUpdateFeatureFlag();
  const [newFlag, setNewFlag] = useState({ name: "", description: "", is_enabled: false });
  const [editFlag, setEditFlag] = useState({ name: "", description: "" });

  const handleCreate = () => { createMutation.mutate(newFlag, { onSuccess: () => { setIsAddDialogOpen(false); setNewFlag({ name: "", description: "", is_enabled: false }); } }); };
  const handleToggle = (id: string) => { toggleMutation.mutate(id); };
  const handleDelete = (id: string) => { if (confirm("Delete this feature flag?")) deleteMutation.mutate(id); };
  const handleUpdate = (id: string) => { updateMutation.mutate({ id, updates: editFlag }, { onSuccess: () => setEditingFlag(null) }); };
  const openEditDialog = (flag: { id: string; name: string; description: string | null }) => { setEditFlag({ name: flag.name, description: flag.description || "" }); setEditingFlag(flag.id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Feature Flags</h1><p className="text-muted-foreground">Control feature rollouts</p></div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}><DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Feature Flag</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create Feature Flag</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Name</Label><Input placeholder="feature_name" value={newFlag.name} onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })} /></div><div><Label>Description</Label><Textarea value={newFlag.description} onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })} /></div><div className="flex items-center justify-between"><Label>Enable by default</Label><Switch checked={newFlag.is_enabled} onCheckedChange={(checked) => setNewFlag({ ...newFlag, is_enabled: checked })} /></div><Button onClick={handleCreate} className="w-full" disabled={!newFlag.name}>Create</Button></div></DialogContent></Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{flags?.length || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">Enabled</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{flags?.filter((f) => f.is_enabled).length || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Disabled</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{flags?.filter((f) => !f.is_enabled).length || 0}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Flag className="h-5 w-5" />Feature Flags</CardTitle><CardDescription>Toggle features on or off</CardDescription></CardHeader><CardContent>
        {isLoading ? <p>Loading...</p> : (
          <Table><TableHeader><TableRow><TableHead>Status</TableHead><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Updated</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{flags?.map((flag) => (
              <TableRow key={flag.id}>
                <TableCell><Switch checked={flag.is_enabled} onCheckedChange={() => handleToggle(flag.id)} /></TableCell>
                <TableCell className="font-mono font-medium">{flag.name}</TableCell>
                <TableCell className="max-w-xs truncate">{flag.description || "-"}</TableCell>
                <TableCell>{flag.updated_at && format(new Date(flag.updated_at), "MMM d, yyyy")}</TableCell>
                <TableCell><div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => openEditDialog(flag)}><Edit2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(flag.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </CardContent></Card>
      <Dialog open={!!editingFlag} onOpenChange={() => setEditingFlag(null)}><DialogContent><DialogHeader><DialogTitle>Edit Feature Flag</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Name</Label><Input value={editFlag.name} onChange={(e) => setEditFlag({ ...editFlag, name: e.target.value })} /></div><div><Label>Description</Label><Textarea value={editFlag.description} onChange={(e) => setEditFlag({ ...editFlag, description: e.target.value })} /></div><Button onClick={() => handleUpdate(editingFlag!)} className="w-full">Save</Button></div></DialogContent></Dialog>
    </div>
  );
}
