-- =================================================================
-- CLEAN SLATE PROTOCOL
-- WARNING: This will delete ALL products!
-- =================================================================

-- 1. Delete all products (CASCADE will delete related orders/cart items/etc)
TRUNCATE TABLE public.products CASCADE;

-- 2. Reset sequence to 1
DROP SEQUENCE IF EXISTS product_number_seq CASCADE;
CREATE SEQUENCE product_number_seq START WITH 1;

-- 3. Re-create the trigger function cleanly
CREATE OR REPLACE FUNCTION public.generate_product_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.product_number IS NULL OR NEW.product_number = '' THEN
    -- Generate: 1215001, 1215002, etc.
    NEW.product_number := '1215' || LPAD(nextval('product_number_seq')::text, 3, '0');
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Attach trigger
DROP TRIGGER IF EXISTS generate_product_number_trigger ON public.products;
CREATE TRIGGER generate_product_number_trigger
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.generate_product_number();

-- 5. Verify it's empty
SELECT COUNT(*) as product_count FROM products;

