export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          customization_details: string | null
          id: string
          product_id: string | null
          quantity: number
          selected_colors: string[] | null
          selected_material: string | null
          selected_size: string | null
          session_id: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customization_details?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          selected_colors?: string[] | null
          selected_material?: string | null
          selected_size?: string | null
          session_id: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customization_details?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          selected_colors?: string[] | null
          selected_material?: string | null
          selected_size?: string | null
          session_id?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      colors: {
        Row: {
          created_at: string
          hex_color: string
          id: string
          is_active: boolean
          material_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hex_color?: string
          id?: string
          is_active?: boolean
          material_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hex_color?: string
          id?: string
          is_active?: boolean
          material_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "colors_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      complexity_settings: {
        Row: {
          created_at: string
          description: string | null
          fee: number
          help_text: string | null
          id: string
          max_time_minutes: number | null
          min_time_minutes: number | null
          tier: Database["public"]["Enums"]["complexity_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          fee?: number
          help_text?: string | null
          id?: string
          max_time_minutes?: number | null
          min_time_minutes?: number | null
          tier: Database["public"]["Enums"]["complexity_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          fee?: number
          help_text?: string | null
          id?: string
          max_time_minutes?: number | null
          min_time_minutes?: number | null
          tier?: Database["public"]["Enums"]["complexity_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      customization_options: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          max_fee: number
          min_fee: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_fee?: number
          min_fee?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_fee?: number
          min_fee?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      finish_options: {
        Row: {
          created_at: string
          fee: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fee?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fee?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      local_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          category: Database["public"]["Enums"]["material_category"]
          cost_per_gram: number
          created_at: string
          id: string
          is_active: boolean
          name: string
          upcharge: number
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["material_category"]
          cost_per_gram?: number
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          upcharge?: number
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["material_category"]
          cost_per_gram?: number
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          upcharge?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          customization_details: string | null
          delivery_address: string | null
          delivery_location: string
          id: string
          notes: string | null
          order_number: string | null
          product_id: string | null
          product_price: number
          selected_color: string | null
          selected_infill: string | null
          selected_material: string | null
          selected_size: string | null
          shipping_cost: number
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          customization_details?: string | null
          delivery_address?: string | null
          delivery_location?: string
          id?: string
          notes?: string | null
          order_number?: string | null
          product_id?: string | null
          product_price: number
          selected_color?: string | null
          selected_infill?: string | null
          selected_material?: string | null
          selected_size?: string | null
          shipping_cost?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          customization_details?: string | null
          delivery_address?: string | null
          delivery_location?: string
          id?: string
          notes?: string | null
          order_number?: string | null
          product_id?: string | null
          product_price?: number
          selected_color?: string | null
          selected_infill?: string | null
          selected_material?: string | null
          selected_size?: string | null
          shipping_cost?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          accessories_cost: number
          allowed_materials: string[] | null
          allowed_sizes: string[] | null
          category: string
          color_slots: Json | null
          colors: string[] | null
          created_at: string
          description: string | null
          estimated_grams_large: number
          estimated_grams_medium: number
          estimated_grams_small: number
          id: string
          images: string[] | null
          infill_options: string[] | null
          is_active: boolean
          is_customizable: boolean
          likes_count: number
          materials: string[] | null
          personalization_options: string | null
          price: number
          product_number: string | null
          sizes: string[] | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          accessories_cost?: number
          allowed_materials?: string[] | null
          allowed_sizes?: string[] | null
          category?: string
          color_slots?: Json | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          estimated_grams_large?: number
          estimated_grams_medium?: number
          estimated_grams_small?: number
          id?: string
          images?: string[] | null
          infill_options?: string[] | null
          is_active?: boolean
          is_customizable?: boolean
          likes_count?: number
          materials?: string[] | null
          personalization_options?: string | null
          price?: number
          product_number?: string | null
          sizes?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          accessories_cost?: number
          allowed_materials?: string[] | null
          allowed_sizes?: string[] | null
          category?: string
          color_slots?: Json | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          estimated_grams_large?: number
          estimated_grams_medium?: number
          estimated_grams_small?: number
          id?: string
          images?: string[] | null
          infill_options?: string[] | null
          is_active?: boolean
          is_customizable?: boolean
          likes_count?: number
          materials?: string[] | null
          personalization_options?: string | null
          price?: number
          product_number?: string | null
          sizes?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      complexity_tier: "simple" | "medium" | "complex"
      material_category: "standard" | "premium" | "ultra"
      order_status: "pending" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      complexity_tier: ["simple", "medium", "complex"],
      material_category: ["standard", "premium", "ultra"],
      order_status: ["pending", "in_progress", "completed", "cancelled"],
    },
  },
} as const
