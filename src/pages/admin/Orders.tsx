import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useOrders, useUpdateOrderStatus, useUpdateOrder, OrderStatus } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Package,
  DollarSign,
  Truck,
  Search,
  Palette,
  Ruler,
  Sparkles,
  FileText,
  Instagram,
  Youtube,
  Save
} from "lucide-react";
import { format } from "date-fns";
import defaultProductImage from "@/assets/default-product.jpg";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  printing: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  finishing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  ready: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  finishing: "Finishing",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Orders() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const updateOrder = useUpdateOrder();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingSocialLink, setEditingSocialLink] = useState<Record<string, string>>({});

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = order.customer_name.toLowerCase().includes(query);
        const matchesEmail = order.customer_email.toLowerCase().includes(query);
        const matchesOrderNumber = order.order_number?.toLowerCase().includes(query);
        const matchesProduct = order.products?.title?.toLowerCase().includes(query);
        const matchesPhone = order.customer_phone?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesEmail && !matchesOrderNumber && !matchesProduct && !matchesPhone) {
          return false;
        }
      }
      
      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-1">
              {filteredOrders.length} of {orders?.length ?? 0} orders
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, order #, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="printing">Printing</SelectItem>
              <SelectItem value="finishing">Finishing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {filteredOrders && filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const productImage = order.products?.images?.[0] || defaultProductImage;
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                          <img 
                            src={productImage} 
                            alt={order.products?.title ?? "Product"} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <CardTitle className="text-lg">
                              {order.products?.title ?? "Unknown Product"}
                            </CardTitle>
                            <Badge className={`${statusColors[order.status]} border`}>
                              {statusLabels[order.status]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            {order.order_number && (
                              <span className="font-mono font-medium text-primary">{order.order_number}</span>
                            )}
                            {order.products?.product_number && (
                              <span className="font-mono text-xs">#{order.products.product_number}</span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Select
                        value={order.status}
                        onValueChange={(value: OrderStatus) => 
                          updateStatus.mutate({ id: order.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="printing">Printing</SelectItem>
                          <SelectItem value="finishing">Finishing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Order Configuration - Prominent Display */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-primary">Order Specifications</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {order.selected_size && (
                          <div className="flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Size</p>
                              <p className="font-medium capitalize">{order.selected_size}</p>
                            </div>
                          </div>
                        )}
                        {order.selected_color && (
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Colors</p>
                              <p className="font-medium">{order.selected_color}</p>
                            </div>
                          </div>
                        )}
                        {order.selected_material && (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Material</p>
                              <p className="font-medium capitalize">{order.selected_material}</p>
                            </div>
                          </div>
                        )}
                        {order.selected_infill && (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Infill</p>
                              <p className="font-medium">{order.selected_infill}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customization - Prominent if exists */}
                    {order.customization_details && (
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <span className="font-medium text-accent">Customization Details</span>
                        </div>
                        <p className="text-foreground font-medium text-lg">{order.customization_details}</p>
                      </div>
                    )}

                    {/* Customer Info */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Customer</p>
                        <p className="font-medium">{order.customer_name}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Mail className="w-4 h-4" /> Email
                        </p>
                        <a href={`mailto:${order.customer_email}`} className="text-primary hover:underline">
                          {order.customer_email}
                        </a>
                      </div>
                      
                      {order.customer_phone && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                            <Phone className="w-4 h-4" /> Phone
                          </p>
                          <a href={`tel:${order.customer_phone}`} className="text-primary hover:underline">
                            {order.customer_phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Delivery Info */}
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-primary" />
                        Delivery Location: <span className="text-primary">{order.delivery_location}</span>
                      </div>
                      
                      {order.delivery_address && (
                        <p className="text-sm text-muted-foreground pl-6">
                          {order.delivery_address}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          Product: <span className="font-medium">${Number(order.product_price).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          Shipping: <span className="font-medium">${Number(order.shipping_cost).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-primary" />
                          Total: <span className="font-bold text-primary text-lg">${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    )}

                    {/* Social Media Link - Show at all stages */}
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-accent" />
                            <span className="font-medium text-accent">Social Media Link</span>
                          </div>
                          {!editingSocialLink[order.id] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSocialLink({
                                ...editingSocialLink,
                                [order.id]: order.social_media_url || ""
                              })}
                            >
                              {order.social_media_url ? "Edit Link" : "Add Link"}
                            </Button>
                          )}
                        </div>

                        {editingSocialLink[order.id] !== undefined ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground">
                                Paste Instagram, TikTok, or YouTube URL
                              </label>
                              <Input
                                placeholder="https://instagram.com/p/... or https://tiktok.com/@... or https://youtube.com/watch?v=..."
                                value={editingSocialLink[order.id]}
                                onChange={(e) => setEditingSocialLink({
                                  ...editingSocialLink,
                                  [order.id]: e.target.value
                                })}
                                className="text-sm"
                              />
                              <p className="text-xs text-muted-foreground">
                                The platform will be automatically detected from the URL
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={async () => {
                                  await updateOrder.mutateAsync({
                                    id: order.id,
                                    social_media_url: editingSocialLink[order.id] || null,
                                  });
                                  const newLinks = { ...editingSocialLink };
                                  delete newLinks[order.id];
                                  setEditingSocialLink(newLinks);
                                }}
                                disabled={updateOrder.isPending}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newLinks = { ...editingSocialLink };
                                  delete newLinks[order.id];
                                  setEditingSocialLink(newLinks);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {order.social_media_url ? (
                              <a
                                href={order.social_media_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                              >
                                {order.social_media_url.toLowerCase().includes("instagram.com") && <Instagram className="w-4 h-4" />}
                                {order.social_media_url.toLowerCase().includes("tiktok.com") && (
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                  </svg>
                                )}
                                {order.social_media_url.toLowerCase().includes("youtube.com") && <Youtube className="w-4 h-4" />}
                                View Social Media Post
                              </a>
                            ) : (
                              <p className="text-xs text-muted-foreground">No social media link added yet</p>
                            )}
                          </div>
                        )}
                      </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              {searchQuery || statusFilter !== "all" ? (
                <>
                  <Search className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders match your search</p>
                  <Button 
                    variant="ghost" 
                    className="mt-2"
                    onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                  >
                    Clear filters
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">No orders yet</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}