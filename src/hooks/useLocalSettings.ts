import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LocalSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  created_at: string;
  updated_at: string;
}

export function useLocalSettings() {
  return useQuery({
    queryKey: ["local-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("local_settings")
        .select("*");
      
      if (error) throw error;
      return data as LocalSetting[];
    },
  });
}

export function useLocalSetting(key: string) {
  return useQuery({
    queryKey: ["local-settings", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("local_settings")
        .select("*")
        .eq("setting_key", key)
        .maybeSingle();
      
      if (error) throw error;
      return data as LocalSetting | null;
    },
  });
}

export function useDeliveryAreas() {
  const { data: setting, ...rest } = useLocalSetting("delivery_areas");
  const areas = setting?.setting_value as string[] || ["Alpharetta, GA", "Cumming, GA"];
  return { data: areas, ...rest };
}

export function useUpdateLocalSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      // First check if setting exists
      const { data: existing } = await supabase
        .from("local_settings")
        .select("id")
        .eq("setting_key", key)
        .maybeSingle();
      
      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("local_settings")
          .update({ setting_value: value as any, updated_at: new Date().toISOString() })
          .eq("setting_key", key)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("local_settings")
          .insert({ setting_key: key, setting_value: value as any })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["local-settings"] });
      toast({ title: "Settings saved" });
    },
    onError: (error: Error) => {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    },
  });
}
