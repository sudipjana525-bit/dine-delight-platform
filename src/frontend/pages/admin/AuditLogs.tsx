import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuditLogs, useAuditLogStats } from "@/frontend/hooks/useAuditLogs";
import { FileText, Search, Activity } from "lucide-react";
import { format } from "date-fns";

export default function AuditLogs() {
  const [entityType, setEntityType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(100);
  const { data: logs, isLoading } = useAuditLogs({ entityType: entityType || undefined, limit });
  const { data: stats } = useAuditLogStats();
  const filteredLogs = searchQuery ? logs?.filter((log) => log.action.toLowerCase().includes(searchQuery.toLowerCase()) || log.entity_type.toLowerCase().includes(searchQuery.toLowerCase())) : logs;
  const getActionBadge = (action: string) => {
    if (action.includes("create") || action.includes("insert")) return <Badge variant="default">{action}</Badge>;
    if (action.includes("update") || action.includes("edit")) return <Badge variant="secondary">{action}</Badge>;
    if (action.includes("delete") || action.includes("remove")) return <Badge variant="destructive">{action}</Badge>;
    return <Badge variant="outline">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Audit Logs</h1><p className="text-muted-foreground">Track all system activities and changes</p></div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Events</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalLogs || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Today's Events</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.todayLogs || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Action</CardTitle></CardHeader><CardContent><div className="text-lg font-medium">{stats?.actionCounts ? Object.entries(stats.actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A" : "N/A"}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Top Entity</CardTitle></CardHeader><CardContent><div className="text-lg font-medium">{stats?.entityCounts ? Object.entries(stats.entityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A" : "N/A"}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Filters</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-4"><Input placeholder="Search actions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64" /><Select value={entityType} onValueChange={setEntityType}><SelectTrigger className="w-48"><SelectValue placeholder="All entity types" /></SelectTrigger><SelectContent><SelectItem value="">All</SelectItem><SelectItem value="orders">Orders</SelectItem><SelectItem value="menu_items">Menu Items</SelectItem><SelectItem value="users">Users</SelectItem></SelectContent></Select></div></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Activity Log</CardTitle><CardDescription>Detailed history of all system changes</CardDescription></CardHeader><CardContent>
        {isLoading ? <p>Loading...</p> : (
          <Table><TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Action</TableHead><TableHead>Entity Type</TableHead><TableHead>Entity ID</TableHead></TableRow></TableHeader>
            <TableBody>{filteredLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap">{log.created_at && format(new Date(log.created_at), "MMM d, HH:mm:ss")}</TableCell>
                <TableCell>{getActionBadge(log.action)}</TableCell>
                <TableCell><Badge variant="outline">{log.entity_type}</Badge></TableCell>
                <TableCell className="font-mono text-xs">{log.entity_id?.slice(0, 8)}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
}
