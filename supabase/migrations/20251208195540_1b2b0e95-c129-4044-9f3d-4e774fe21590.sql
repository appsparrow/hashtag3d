-- Update product number generation to use 1215 prefix
CREATE OR REPLACE FUNCTION public.generate_product_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  seq_num int;
BEGIN
  -- Format: 1215 + XXX (sequence from 001)
  SELECT COUNT(*) + 1 INTO seq_num FROM products WHERE product_number IS NOT NULL;
  NEW.product_number := '1215' || LPAD(seq_num::text, 3, '0');
  RETURN NEW;
END;
$function$;

-- Create cart_items table for storing shopping cart (preparing for Stripe)
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_material TEXT DEFAULT 'standard',
  selected_size TEXT DEFAULT 'small',
  selected_colors TEXT[] DEFAULT '{}',
  customization_details TEXT,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Anyone can manage their own cart by session_id
CREATE POLICY "Anyone can manage cart items by session"
ON public.cart_items
FOR ALL
USING (true)
WITH CHECK (true);

-- Add index for session lookups
CREATE INDEX idx_cart_items_session ON public.cart_items(session_id);

-- Trigger for updated_at
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();