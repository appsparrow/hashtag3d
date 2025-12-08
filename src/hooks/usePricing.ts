import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type MaterialCategory = "standard" | "premium" | "ultra";
export type ComplexityTier = "simple" | "medium" | "complex";

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  cost_per_gram: number;
  upcharge: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Color {
  id: string;
  name: string;
  hex_color: string;
  material_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  material?: Material;
}

export interface ComplexitySetting {
  id: string;
  tier: ComplexityTier;
  description: string | null;
  min_time_minutes: number | null;
  max_time_minutes: number | null;
  fee: number;
  help_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface FinishOption {
  id: string;
  name: string;
  fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  description: string | null;
  min_fee: number;
  max_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingSetting {
  id: string;
  setting_key: string;
  setting_value: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Materials hooks
export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Material[];
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (material: Omit<Material, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("materials")
        .insert(material)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast({ title: "Material created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating material", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Material> & { id: string }) => {
      const { data, error } = await supabase
        .from("materials")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast({ title: "Material updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating material", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast({ title: "Material deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting material", description: error.message, variant: "destructive" });
    },
  });
}

// Colors hooks
export function useColors() {
  return useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colors")
        .select("*, material:materials(*)")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as (Color & { material: Material | null })[];
    },
  });
}

export function useCreateColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (color: Omit<Color, "id" | "created_at" | "updated_at" | "material">) => {
      const { data, error } = await supabase
        .from("colors")
        .insert(color)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast({ title: "Color created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating color", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Color> & { id: string }) => {
      const { data, error } = await supabase
        .from("colors")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast({ title: "Color updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating color", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("colors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast({ title: "Color deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting color", description: error.message, variant: "destructive" });
    },
  });
}

// Complexity settings hooks
export function useComplexitySettings() {
  return useQuery({
    queryKey: ["complexity-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complexity_settings")
        .select("*")
        .order("tier", { ascending: true });
      if (error) throw error;
      return data as ComplexitySetting[];
    },
  });
}

export function useUpdateComplexitySetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ComplexitySetting> & { id: string }) => {
      const { data, error } = await supabase
        .from("complexity_settings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complexity-settings"] });
      toast({ title: "Complexity setting updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating complexity setting", description: error.message, variant: "destructive" });
    },
  });
}

// Finish options hooks
export function useFinishOptions() {
  return useQuery({
    queryKey: ["finish-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("finish_options")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as FinishOption[];
    },
  });
}

export function useCreateFinishOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (option: Omit<FinishOption, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("finish_options")
        .insert(option)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finish-options"] });
      toast({ title: "Finish option created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating finish option", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateFinishOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FinishOption> & { id: string }) => {
      const { data, error } = await supabase
        .from("finish_options")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finish-options"] });
      toast({ title: "Finish option updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating finish option", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteFinishOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("finish_options").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finish-options"] });
      toast({ title: "Finish option deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting finish option", description: error.message, variant: "destructive" });
    },
  });
}

// Customization options hooks
export function useCustomizationOptions() {
  return useQuery({
    queryKey: ["customization-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customization_options")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as CustomizationOption[];
    },
  });
}

export function useCreateCustomizationOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (option: Omit<CustomizationOption, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("customization_options")
        .insert(option)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customization-options"] });
      toast({ title: "Customization option created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating customization option", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateCustomizationOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CustomizationOption> & { id: string }) => {
      const { data, error } = await supabase
        .from("customization_options")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customization-options"] });
      toast({ title: "Customization option updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating customization option", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteCustomizationOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customization_options").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customization-options"] });
      toast({ title: "Customization option deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting customization option", description: error.message, variant: "destructive" });
    },
  });
}

// Pricing settings hooks
export function usePricingSettings() {
  return useQuery({
    queryKey: ["pricing-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_settings")
        .select("*")
        .order("setting_key", { ascending: true });
      if (error) throw error;
      return data as PricingSetting[];
    },
  });
}

export function useUpdatePricingSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: number }) => {
      const { data, error } = await supabase
        .from("pricing_settings")
        .update({ setting_value: value })
        .eq("setting_key", key)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-settings"] });
      toast({ title: "Pricing setting updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating pricing setting", description: error.message, variant: "destructive" });
    },
  });
}

// Calculator helper
export function calculatePrice(params: {
  basePrice: number;
  materialCategory: MaterialCategory;
  numColors: number;
  complexity: ComplexityTier;
  customizationFee: number;
  pricingSettings: PricingSetting[];
  complexitySettings: ComplexitySetting[];
  profitMargin?: number;
}) {
  const { basePrice, materialCategory, numColors, complexity, customizationFee, pricingSettings, complexitySettings, profitMargin = 40 } = params;
  
  const getSetting = (key: string) => pricingSettings.find(s => s.setting_key === key)?.setting_value || 0;
  const getComplexityFee = (tier: ComplexityTier) => complexitySettings.find(c => c.tier === tier)?.fee || 0;
  
  const materialUpcharge = materialCategory === 'standard' 
    ? getSetting('standard_upcharge')
    : materialCategory === 'premium' 
      ? getSetting('premium_upcharge')
      : getSetting('ultra_upcharge');
  
  const amsFee = numColors > 1 
    ? getSetting('ams_base_fee') + (numColors - 1) * getSetting('ams_per_color_fee')
    : 0;
  
  const complexityFee = getComplexityFee(complexity);
  
  const totalCost = basePrice + materialUpcharge + amsFee + complexityFee + customizationFee;
  const marginMultiplier = 1 + (profitMargin / 100);
  
  return {
    basePrice,
    materialUpcharge,
    amsFee,
    complexityFee,
    customizationFee,
    totalCost,
    suggestedPrice: Math.ceil(totalCost * marginMultiplier),
    profitMargin,
  };
}
