import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllReviews, useToggleReviewVisibility } from "@/frontend/hooks/useReviews";
import { Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Reviews() {
  const { data: reviews, isLoading } = useAllReviews();
  const toggleVisibilityMutation = useToggleReviewVisibility();

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    toggleVisibilityMutation.mutate({ id, isVisible: !isVisible });
  };

  const stats = {
    total: reviews?.length || 0,
    average: reviews?.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0,
    fiveStars: reviews?.filter((r) => r.rating === 5).length || 0,
    visible: reviews?.filter((r) => r.is_visible).length || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
        <p className="text-muted-foreground">Manage customer reviews and feedback</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Reviews</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Average Rating</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2 text-2xl font-bold">{stats.average}<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /></div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.fiveStars}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Visible Reviews</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.visible}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" />All Reviews</CardTitle><CardDescription>View and moderate customer reviews</CardDescription></CardHeader>
        <CardContent>
          {isLoading ? <p>Loading...</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Item</TableHead><TableHead>Rating</TableHead><TableHead>Comment</TableHead><TableHead>Verified</TableHead><TableHead>Visible</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {reviews?.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.created_at && format(new Date(review.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>{(review.menu_items as { name?: string })?.name || "Unknown"}</TableCell>
                    <TableCell><div className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />))}</div></TableCell>
                    <TableCell className="max-w-xs truncate">{review.comment || "-"}</TableCell>
                    <TableCell>{review.is_verified_purchase ? <Badge>Verified</Badge> : <Badge variant="outline">Unverified</Badge>}</TableCell>
                    <TableCell>{review.is_visible ? <Badge>Visible</Badge> : <Badge variant="secondary">Hidden</Badge>}</TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => handleToggleVisibility(review.id, review.is_visible ?? true)}>{review.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
