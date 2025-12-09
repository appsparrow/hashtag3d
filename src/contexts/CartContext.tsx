import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/hooks/useProducts";

export interface CartItem {
  id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  selected_material: string;
  selected_size: string;
  selected_colors: string[];
  customization_details: string | null;
  unit_price: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getSessionId: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SESSION_KEY = "cart_session_id";

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = getOrCreateSessionId();

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, product:products(*)")
      .eq("session_id", sessionId);

    if (!error && data) {
      setItems(data.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product: item.product as unknown as Product,
        quantity: item.quantity,
        selected_material: item.selected_material || "standard",
        selected_size: item.selected_size || "small",
        selected_colors: item.selected_colors || [],
        customization_details: item.customization_details,
        unit_price: Number(item.unit_price),
      })));
    }
    setIsLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item: Omit<CartItem, "id">) => {
    const { error } = await supabase.from("cart_items").insert({
      session_id: sessionId,
      product_id: item.product_id,
      quantity: item.quantity,
      selected_material: item.selected_material,
      selected_size: item.selected_size,
      selected_colors: item.selected_colors,
      customization_details: item.customization_details,
      unit_price: item.unit_price,
    });

    if (!error) {
      await fetchCart();
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id);

    if (!error) {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id);

    if (!error) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const clearCart = async () => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("session_id", sessionId);

    if (!error) {
      setItems([]);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getSessionId: () => sessionId,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
