import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { usePrintSchedule, useUpdatePrintPriority, OrderWithPrintTime } from "@/hooks/usePrintSchedule";
import { useUpdateOrderStatus } from "@/hooks/useOrders";
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
  Clock, 
  Calendar,
  Package,
  GripVertical,
  Play,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { format, addMinutes } from "date-fns";
import defaultProductImage from "@/assets/default-product.jpg";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function PrintSchedule() {
  const { data: orders, isLoading } = usePrintSchedule();
  const updatePriority = useUpdatePrintPriority();
  const updateStatus = useUpdateOrderStatus();
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Calculate cumulative print times
  const scheduleWithTimes = useMemo(() => {
    if (!orders) return [];
    
    let cumulativeMinutes = 0;
    return orders.map((order, index) => {
      const startTime = cumulativeMinutes;
      cumulativeMinutes += order.print_time_minutes || 60;
      const endTime = cumulativeMinutes;
      
      return {
        ...order,
        startTimeMinutes: startTime,
        endTimeMinutes: endTime,
        estimatedStartTime: addMinutes(new Date(), startTime),
        estimatedEndTime: addMinutes(new Date(), endTime),
      };
    });
  }, [orders]);

  const totalPrintTime = useMemo(() => {
    return scheduleWithTimes.reduce((sum, order) => sum + (order.print_time_minutes || 60), 0);
  }, [scheduleWithTimes]);

  const handleDragStart = (orderId: string) => {
    setDraggedOrderId(orderId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedOrderId || !orders) return;
    
    const draggedIndex = orders.findIndex(o => o.id === draggedOrderId);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedOrderId(null);
      return;
    }
    
    // Reorder array
    const newOrders = [...orders];
    const [removed] = newOrders.splice(draggedIndex, 1);
    newOrders.splice(dropIndex, 0, removed);
    
    // Update priorities
    updatePriority.mutate({ 
      orderIds: newOrders.map(o => o.id) 
    });
    
    setDraggedOrderId(null);
  };

  const handleDragEnd = () => {
    setDraggedOrderId(null);
    setDragOverIndex(null);
  };

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
            <h1 className="text-3xl font-bold text-foreground">Print Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Drag and drop to reorder • {scheduleWithTimes.length} orders • {formatDuration(totalPrintTime)} total print time
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleWithTimes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Print Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(totalPrintTime)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Estimated Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduleWithTimes.length > 0 
                  ? format(scheduleWithTimes[scheduleWithTimes.length - 1].estimatedEndTime, "h:mm a")
                  : "N/A"
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Print Queue */}
        {scheduleWithTimes.length > 0 ? (
          <div className="space-y-3">
            {scheduleWithTimes.map((order, index) => {
              const productImage = order.products?.images?.[0] || defaultProductImage;
              const isDragging = draggedOrderId === order.id;
              const isDragOver = dragOverIndex === index;
              
              return (
                <Card
                  key={order.id}
                  draggable
                  onDragStart={() => handleDragStart(order.id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move transition-all ${
                    isDragging ? "opacity-50" : ""
                  } ${
                    isDragOver ? "border-primary border-2 shadow-lg" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Drag Handle */}
                      <div className="flex-shrink-0 pt-2">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                      </div>

                      {/* Order Number Badge */}
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="font-mono">
                          #{index + 1}
                        </Badge>
                      </div>

                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                        <img 
                          src={productImage} 
                          alt={order.products?.title ?? "Product"} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              {order.products?.title ?? "Unknown Product"}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(order.created_at), "MMM d, h:mm a")}
                              </span>
                              {order.order_number && (
                                <span className="font-mono">{order.order_number}</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {order.customer_name}
                              </span>
                              {order.customer_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {order.customer_phone}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Select */}
                          <Select
                            value={order.status}
                            onValueChange={(value: "pending" | "confirmed" | "printing" | "finishing" | "ready" | "delivered" | "cancelled") => 
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

                        {/* Print Time & Schedule Info */}
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                            <Clock className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Print Time</p>
                              <p className="font-semibold">{formatDuration(order.print_time_minutes || 60)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                            <Play className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Start</p>
                              <p className="font-semibold">{format(order.estimatedStartTime, "h:mm a")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Finish</p>
                              <p className="font-semibold">{format(order.estimatedEndTime, "h:mm a")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="font-semibold truncate">{order.delivery_location}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Specs */}
                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                          {order.selected_size && (
                            <Badge variant="secondary">Size: {order.selected_size}</Badge>
                          )}
                          {order.selected_color && (
                            <Badge variant="secondary">Color: {order.selected_color}</Badge>
                          )}
                          {order.selected_material && (
                            <Badge variant="secondary">Material: {order.selected_material}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders in print queue</p>
              <p className="text-sm text-muted-foreground mt-1">
                Orders with status "Pending", "Confirmed", "Printing", or "Finishing" will appear here.
                Orders disappear once they reach "Ready", "Delivered", or "Cancelled".
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

