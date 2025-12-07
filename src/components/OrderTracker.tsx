import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useOrderByNumber } from "@/hooks/useOrderTracking";
import { Search, Package, Clock, CheckCircle2, XCircle, Instagram, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface OrderTrackerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  in_progress: { label: "In Progress", icon: Package, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function OrderTracker({ open, onOpenChange }: OrderTrackerProps) {
  const [searchInput, setSearchInput] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  
  const { data: order, isLoading, error } = useOrderByNumber(orderNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderNumber(searchInput.trim());
  };

  const status = order ? statusConfig[order.status] : null;
  const StatusIcon = status?.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Track Your Order
          </DialogTitle>
          <DialogDescription>
            Enter your order number to see the current status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number</Label>
            <div className="flex gap-2">
              <Input
                id="orderNumber"
                placeholder="ORD-XXXXXXXX"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!searchInput.trim() || isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>

        {orderNumber && !isLoading && (
          <div className="mt-4">
            {order ? (
              <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order</p>
                    <p className="font-mono font-bold">{order.order_number}</p>
                  </div>
                  {status && (
                    <Badge className={`${status.color} border flex items-center gap-1`}>
                      {StatusIcon && <StatusIcon className="w-3 h-3" />}
                      {status.label}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{order.products?.title || "Unknown Product"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ordered</p>
                    <p className="font-medium">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>

                {order.status === "in_progress" && (
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    Watch your print on Instagram
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
                <XCircle className="w-8 h-8 mx-auto text-destructive mb-2" />
                <p className="font-medium text-destructive">Order not found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Check your order number and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
