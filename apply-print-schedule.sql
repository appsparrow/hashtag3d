-- =================================================================
-- ADD PRINT SCHEDULE SUPPORT
-- Run this in Supabase SQL Editor to enable print schedule features
-- =================================================================

-- Add print schedule priority to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS print_priority INTEGER DEFAULT 0;

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS idx_orders_print_priority ON public.orders(print_priority);

-- Function to calculate print time based on product and order details
CREATE OR REPLACE FUNCTION public.calculate_print_time(
  p_product_id UUID,
  p_selected_size TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  print_time_minutes INTEGER := 0;
BEGIN
  SELECT CASE
    WHEN p_selected_size = 'small' THEN print_time_small
    WHEN p_selected_size = 'medium' THEN print_time_medium
    WHEN p_selected_size = 'large' THEN print_time_large
    ELSE print_time_small
  END
  INTO print_time_minutes
  FROM products
  WHERE id = p_product_id;
  
  RETURN COALESCE(print_time_minutes, 60); -- Default to 60 minutes if not found
END;
$$;

