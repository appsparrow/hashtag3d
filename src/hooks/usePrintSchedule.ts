import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface OrderWithPrintTime {
  id: string;
  order_number: string | null;
  product_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_location: string;
  delivery_address: string | null;
  shipping_cost: number;
  product_price: number;
  total_amount: number;
  status: "pending" | "confirmed" | "printing" | "finishing" | "ready" | "delivered" | "cancelled";
  selected_color: string | null;
  selected_material: string | null;
  selected_size: string | null;
  selected_infill: string | null;
  customization_details: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  print_priority: number | null;
  products?: {
    id: string;
    title: string;
    images: string[];
    print_time_small: number;
    print_time_medium: number;
    print_time_large: number;
  } | null;
  print_time_minutes?: number; // Calculated field
}

// Get orders for print schedule (pending, confirmed, printing, finishing only)
// Orders disappear once they reach ready, delivered, or cancelled
export function usePrintSchedule() {
  return useQuery({
    queryKey: ["print-schedule"],
    queryFn: async () => {
      // Query all orders first, then filter by status in JavaScript
      // This avoids enum issues if the database enum differs
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products (
            id,
            title,
            images,
            print_time_small,
            print_time_medium,
            print_time_large
          )
        `)
        .order("created_at", { ascending: true });
      
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      // Filter to only active orders (pending through finishing)
      // Orders disappear from schedule once they reach "ready", "delivered", or "cancelled"
      const activeOrders = (data || []).filter((order: any) => {
        const status = order.status?.toLowerCase();
        return status === "pending" || 
               status === "confirmed" ||
               status === "printing" ||
               status === "finishing";
      });
      
      // Calculate print time for each order and sort by priority if available
      const ordersWithPrintTime = activeOrders.map((order: any) => {
        const size = order.selected_size || "small";
        const product = order.products;
        let printTime = 60; // default
        
        if (product) {
          if (size === "small") printTime = product.print_time_small || 60;
          else if (size === "medium") printTime = product.print_time_medium || 120;
          else if (size === "large") printTime = product.print_time_large || 180;
        }
        
        return {
          ...order,
          print_priority: order.print_priority ?? null, // Handle if column doesn't exist
          print_time_minutes: printTime,
        };
      });
      
      // Sort by print_priority if it exists, otherwise keep created_at order
      ordersWithPrintTime.sort((a, b) => {
        if (a.print_priority !== null && b.print_priority !== null) {
          return a.print_priority - b.print_priority;
        }
        if (a.print_priority !== null) return -1;
        if (b.print_priority !== null) return 1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      
      return ordersWithPrintTime as OrderWithPrintTime[];
    },
  });
}

// Update print priority (for drag-and-drop reordering)
export function useUpdatePrintPriority() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderIds }: { orderIds: string[] }) => {
      // Update all orders with their new priority based on array index
      const updates = orderIds.map((id, index) => ({
        id,
        print_priority: index + 1,
      }));
      
      // Batch update
      const promises = updates.map(({ id, print_priority }) =>
        supabase
          .from("orders")
          .update({ print_priority })
          .eq("id", id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        // Check if error is about missing column
        const columnError = errors.find(e => 
          e.error?.message?.includes("print_priority") || 
          e.error?.message?.includes("column")
        );
        
        if (columnError) {
          throw new Error(
            "print_priority column not found. Please run the migration: apply-print-schedule.sql"
          );
        }
        
        throw new Error(`Failed to update ${errors.length} orders`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["print-schedule"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Print schedule updated" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error updating schedule", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

