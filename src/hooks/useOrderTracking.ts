import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TrackedOrder {
  id: string;
  order_number: string;
  product_id: string | null;
  customer_name: string;
  status: "pending" | "confirmed" | "printing" | "finishing" | "ready" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  products?: {
    title: string;
    images: string[];
  } | null;
}

export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: ["order-tracking", orderNumber],
    queryFn: async () => {
      if (!orderNumber) return null;
      
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, product_id, customer_name, status, created_at, updated_at, products(title, images)")
        .eq("order_number", orderNumber.toUpperCase())
        .maybeSingle();
      
      if (error) throw error;
      return data as TrackedOrder | null;
    },
    enabled: !!orderNumber,
  });
}
