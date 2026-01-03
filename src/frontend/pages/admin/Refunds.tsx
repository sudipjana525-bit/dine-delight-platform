import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRefunds, useRefundStats, useApproveRefund, useRejectRefund, useMarkRefundProcessed } from "@/frontend/hooks/useRefunds";
import { useAuth } from "@/frontend/hooks/useAuth";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function Refunds() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedRefund, setSelectedRefund] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: refunds, isLoading } = useRefunds();
  const { data: stats } = useRefundStats();
  const approveMutation = useApproveRefund();
  const rejectMutation = useRejectRefund();
  const processMutation = useMarkRefundProcessed();

  const filteredRefunds = statusFilter ? refunds?.filter((r) => r.status === statusFilter) : refunds;

  const handleApprove = (id: string) => { if (user?.id) approveMutation.mutate({ id, processedBy: user.id, refundMethod: "original_payment" }); };
  const handleReject = (id: string) => { if (user?.id) rejectMutation.mutate({ id, processedBy: user.id }); };
  const handleProcess = (id: string) => { processMutation.mutate({ id, transactionId: `TXN-${Date.now()}` }); };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case "approved": return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case "rejected": return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      case "processed": return <Badge variant="outline"><DollarSign className="mr-1 h-3 w-3" />Processed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Refunds & Cancellations</h1><p className="text-muted-foreground">Manage customer refund requests</p></div>
      <div className="grid gap-4 md:grid-cols-5">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.total || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.pending || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">Approved</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.approved || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-600">Rejected</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.rejected || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Refunded</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${stats?.processedAmount?.toFixed(2) || "0.00"}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Filter</CardTitle></CardHeader><CardContent><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-48"><SelectValue placeholder="All statuses" /></SelectTrigger><SelectContent><SelectItem value="">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem><SelectItem value="processed">Processed</SelectItem></SelectContent></Select></CardContent></Card>
      <Card><CardHeader><CardTitle>Refund Requests</CardTitle><CardDescription>Review and process refund requests</CardDescription></CardHeader><CardContent>
        {isLoading ? <p>Loading...</p> : (
          <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Order</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredRefunds?.map((refund) => (
              <TableRow key={refund.id}>
                <TableCell>{refund.created_at && format(new Date(refund.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell>#{(refund.orders as { id?: string })?.id?.slice(0, 8)}</TableCell>
                <TableCell className="font-medium">${Number(refund.amount).toFixed(2)}</TableCell>
                <TableCell className="max-w-xs truncate">{refund.reason}</TableCell>
                <TableCell>{getStatusBadge(refund.status)}</TableCell>
                <TableCell><div className="flex gap-2">
                  {refund.status === "pending" && (<><Button size="sm" onClick={() => handleApprove(refund.id)}>Approve</Button><Button size="sm" variant="destructive" onClick={() => handleReject(refund.id)}>Reject</Button></>)}
                  {refund.status === "approved" && <Button size="sm" variant="outline" onClick={() => handleProcess(refund.id)}>Process</Button>}
                </div></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
}
