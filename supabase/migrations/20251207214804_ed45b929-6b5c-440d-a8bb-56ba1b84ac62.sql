-- Fix: Make the INSERT policy PERMISSIVE (not restrictive)
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Anyone can create orders"
ON public.orders
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);

-- Add order_number column for tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE;

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || UPPER(SUBSTRING(NEW.id::text, 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order number
DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_order_number();

-- Add policy for anyone to view their order by order_number (for tracking)
CREATE POLICY "Anyone can view order by order_number"
ON public.orders
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- Create local_settings table for admin configuration
CREATE TABLE IF NOT EXISTS public.local_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on local_settings
ALTER TABLE public.local_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read local settings
CREATE POLICY "Anyone can view local settings"
ON public.local_settings
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- Only admins can modify local settings
CREATE POLICY "Admins can manage local settings"
ON public.local_settings
AS PERMISSIVE
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default delivery areas
INSERT INTO public.local_settings (setting_key, setting_value)
VALUES ('delivery_areas', '["Alpharetta, GA", "Cumming, GA"]'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;