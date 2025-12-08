-- Add product_number to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_number text UNIQUE;

-- Create function to generate product number (1225MMDDXX format)
CREATE OR REPLACE FUNCTION public.generate_product_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  today_prefix text;
  seq_num int;
BEGIN
  -- Format: 1225 + MMDD + XX (sequence)
  today_prefix := '1225' || to_char(CURRENT_DATE, 'MMDD');
  
  -- Get the count of products created today + 1
  SELECT COUNT(*) + 1 INTO seq_num
  FROM products
  WHERE product_number LIKE today_prefix || '%';
  
  NEW.product_number := today_prefix || LPAD(seq_num::text, 2, '0');
  RETURN NEW;
END;
$function$;

-- Create trigger for auto-generating product number
DROP TRIGGER IF EXISTS generate_product_number_trigger ON public.products;
CREATE TRIGGER generate_product_number_trigger
  BEFORE INSERT ON public.products
  FOR EACH ROW
  WHEN (NEW.product_number IS NULL)
  EXECUTE FUNCTION public.generate_product_number();

-- Insert common colors
INSERT INTO public.colors (name, hex_color, material_id, is_active) 
SELECT name, hex_color, material_id, true
FROM (
  VALUES 
    -- Standard Colors (link to a standard material if exists)
    ('White', '#FFFFFF', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Black', '#000000', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Grey', '#808080', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Red', '#FF0000', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Blue', '#0000FF', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Green', '#008000', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Yellow', '#FFFF00', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Orange', '#FFA500', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Pink', '#FFC0CB', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    ('Purple', '#800080', (SELECT id FROM materials WHERE category = 'standard' LIMIT 1)),
    -- Premium Colors (link to a premium material if exists)
    ('Silk Gold', '#FFD700', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Silk Silver', '#C0C0C0', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Silk Red', '#DC143C', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Silk Rainbow', '#FF69B4', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Silk Copper', '#B87333', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Matte Black', '#1A1A1A', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Matte White', '#F5F5F5', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Matte Forest Green', '#228B22', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Matte Navy', '#000080', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Glitter Red', '#FF4444', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Glitter Blue', '#4444FF', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1)),
    ('Glitter Gold', '#FFD700', (SELECT id FROM materials WHERE category = 'premium' LIMIT 1))
) AS v(name, hex_color, material_id)
ON CONFLICT DO NOTHING;