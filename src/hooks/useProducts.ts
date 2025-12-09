import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  product_number: string | null;
  title: string;
  description: string | null;
  price: number;
  is_customizable: boolean;
  category: string;
  colors: string[];
  materials: string[];
  sizes: string[];
  infill_options: string[];
  personalization_options: string | null;
  images: string[];
  video_url: string | null;
  is_active: boolean;
  likes_count: number;
  allowed_materials: string[] | null;
  allowed_sizes: string[] | null;
  estimated_grams_standard: number;
  estimated_grams_premium: number;
  estimated_grams_ultra: number;
  accessories_cost: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  title: string;
  description?: string;
  price: number;
  is_customizable: boolean;
  category: string;
  colors?: string[];
  materials?: string[];
  sizes?: string[];
  infill_options?: string[];
  personalization_options?: string;
  images?: string[];
  video_url?: string;
  is_active?: boolean;
  allowed_materials?: string[];
  allowed_sizes?: string[];
  estimated_grams_standard?: number;
  estimated_grams_premium?: number;
  estimated_grams_ultra?: number;
  accessories_cost?: number;
}

export function useProducts(includeInactive = false) {
  return useQuery({
    queryKey: ["products", includeInactive],
    queryFn: async () => {
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });
      
      if (!includeInactive) {
        query = query.eq("is_active", true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: CreateProductData) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating product", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
    },
  });
}
