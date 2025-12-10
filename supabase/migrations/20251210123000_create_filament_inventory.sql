
CREATE TABLE IF NOT EXISTS public.filament_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  color_id UUID REFERENCES public.colors(id) ON DELETE CASCADE,
  brand TEXT,
  material_type TEXT DEFAULT 'PLA',
  weight_g INTEGER NOT NULL DEFAULT 1000,
  remaining_weight_g INTEGER NOT NULL DEFAULT 1000,
  batch_number TEXT,
  purchase_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.filament_inventory ENABLE ROW LEVEL SECURITY;

-- Create policy for admins
CREATE POLICY "Admins can manage filament inventory"
  ON public.filament_inventory
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger to update total stock in colors table
CREATE OR REPLACE FUNCTION update_color_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.colors
    SET stock_quantity = (
      SELECT COALESCE(SUM(remaining_weight_g), 0)
      FROM public.filament_inventory
      WHERE color_id = NEW.color_id AND is_active = true
    )
    WHERE id = NEW.color_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.colors
    SET stock_quantity = (
      SELECT COALESCE(SUM(remaining_weight_g), 0)
      FROM public.filament_inventory
      WHERE color_id = OLD.color_id AND is_active = true
    )
    WHERE id = OLD.color_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_color_stock_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.filament_inventory
FOR EACH ROW
EXECUTE FUNCTION update_color_stock();

