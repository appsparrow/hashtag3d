import { AdminLayout } from "@/components/admin/AdminLayout";
import { useOrders, useUpdateOrderStatus, OrderStatus } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Truck
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function Orders() {
  const { data: orders, isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            {orders?.length ?? 0} total orders
          </p>
        </div>

        {/* Orders List */}
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          {order.products?.title ?? "Unknown Product"}
                        </CardTitle>
                        <Badge className={`${statusColors[order.status]} border`}>
                          {statusLabels[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
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
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
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
                        Total: <span className="font-bold text-primary">${Number(order.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Options */}
                  {(order.selected_color || order.selected_material || order.selected_size || order.selected_infill) && (
                    <div className="flex flex-wrap gap-2">
                      {order.selected_color && (
                        <Badge variant="outline">Color: {order.selected_color}</Badge>
                      )}
                      {order.selected_material && (
                        <Badge variant="outline">Material: {order.selected_material}</Badge>
                      )}
                      {order.selected_size && (
                        <Badge variant="outline">Size: {order.selected_size}</Badge>
                      )}
                      {order.selected_infill && (
                        <Badge variant="outline">Infill: {order.selected_infill}</Badge>
                      )}
                    </div>
                  )}

                  {/* Customization */}
                  {order.customization_details && (
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-medium text-accent mb-1">Customization:</p>
                      <p className="text-sm">{order.customization_details}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
