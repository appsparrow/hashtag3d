import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Product } from "./useProducts";

export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Order {
  id: string;
  product_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_location: string;
  delivery_address: string | null;
  shipping_cost: number;
  product_price: number;
  total_amount: number;
  status: OrderStatus;
  selected_color: string | null;
  selected_material: string | null;
  selected_size: string | null;
  selected_infill: string | null;
  customization_details: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  products?: Product | null;
}

export interface CreateOrderData {
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  delivery_location?: string;
  delivery_address?: string;
  shipping_cost?: number;
  product_price: number;
  total_amount: number;
  selected_color?: string;
  selected_material?: string;
  selected_size?: string;
  selected_infill?: string;
  customization_details?: string;
  notes?: string;
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(*)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    },
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("status");
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        pending: data.filter(o => o.status === "pending").length,
        in_progress: data.filter(o => o.status === "in_progress").length,
        completed: data.filter(o => o.status === "completed").length,
        cancelled: data.filter(o => o.status === "cancelled").length,
      };
      
      return stats;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: CreateOrderData) => {
      const { data, error } = await supabase
        .from("orders")
        .insert(order)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating order", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
      toast({ title: "Order status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating order", description: error.message, variant: "destructive" });
    },
  });
}
