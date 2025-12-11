import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useOrderByNumber } from "@/hooks/useOrderTracking";
import { Search, Package, Clock, CheckCircle2, XCircle, Instagram, Loader2, Youtube } from "lucide-react";
import { format } from "date-fns";

// Helper function to detect social media platform from URL
const detectSocialPlatform = (url: string): "instagram" | "tiktok" | "youtube" | null => {
  if (!url) return null;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram.com")) return "instagram";
  if (lowerUrl.includes("tiktok.com")) return "tiktok";
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "youtube";
  return null;
};

interface OrderTrackerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/20", badgeColor: "bg-amber-500 text-white" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", badgeColor: "bg-blue-500 text-white" },
  printing: { label: "Printing", icon: Package, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", badgeColor: "bg-indigo-500 text-white" },
  finishing: { label: "Finishing", icon: Package, color: "bg-purple-500/10 text-purple-600 border-purple-500/20", badgeColor: "bg-purple-500 text-white" },
  ready: { label: "Ready", icon: CheckCircle2, color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20", badgeColor: "bg-cyan-500 text-white" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "bg-green-500/10 text-green-600 border-green-500/20", badgeColor: "bg-green-500 text-white" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20", badgeColor: "bg-red-500 text-white" },
};

export function OrderTracker({ open, onOpenChange }: OrderTrackerProps) {
  const [searchInput, setSearchInput] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  
  const { data: order, isLoading, error } = useOrderByNumber(orderNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Just use the input as-is, no complex normalization
    setOrderNumber(searchInput.trim().toUpperCase());
  };

  const status = order ? statusConfig[order.status as keyof typeof statusConfig] : null;
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
                placeholder="Enter your order number"
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Order</p>
                      <p className="font-mono font-bold text-lg">{order.order_number}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge - Prominent Display */}
                  {status && (
                    <div className="flex items-center gap-2">
                      <Badge className={`${status.badgeColor} border-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-sm`}>
                        {StatusIcon && <StatusIcon className="w-4 h-4" />}
                        {status.label}
                      </Badge>
                    </div>
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

                {/* Social Media Link - Show whenever link is available */}
                {order.social_media_url && (() => {
                  const platform = detectSocialPlatform(order.social_media_url);
                  if (!platform) return null;

                  const linkConfig = {
                    instagram: {
                      icon: Instagram,
                      label: "View on Instagram",
                      className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                    },
                    tiktok: {
                      icon: () => (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      ),
                      label: "View on TikTok",
                      className: "bg-black text-white",
                    },
                    youtube: {
                      icon: Youtube,
                      label: "View on YouTube",
                      className: "bg-red-600 text-white",
                    },
                  };

                  const config = linkConfig[platform];
                  const IconComponent = config.icon;

                  return (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Watch Your Print:</p>
                      <a
                        href={order.social_media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 w-full p-3 rounded-lg ${config.className} font-medium hover:opacity-90 transition-opacity`}
                      >
                        {typeof IconComponent === "function" ? <IconComponent className="w-5 h-5" /> : <IconComponent />}
                        {config.label}
                      </a>
                    </div>
                  );
                })()}
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
