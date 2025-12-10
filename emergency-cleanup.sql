-- =================================================================
-- NUCLEAR OPTION: Completely Replace Product Number Logic
-- =================================================================

-- 1. DROP EVERYTHING related to product numbers
-- Using CASCADE to ensure triggers are removed
DROP TRIGGER IF EXISTS generate_product_number_trigger ON public.products CASCADE;
DROP TRIGGER IF EXISTS set_product_number ON public.products CASCADE;
DROP FUNCTION IF EXISTS public.generate_product_number() CASCADE;
DROP SEQUENCE IF EXISTS product_number_seq CASCADE;

-- 2. Create the sequence starting at a safe, high number (5000)
CREATE SEQUENCE product_number_seq START WITH 5000;

-- 3. Create a simple, robust function
CREATE OR REPLACE FUNCTION public.generate_product_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Always overwrite if null or empty
  IF NEW.product_number IS NULL OR NEW.product_number = '' THEN
    NEW.product_number := '1215' || nextval('product_number_seq')::text;
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Create the trigger
CREATE TRIGGER generate_product_number_trigger
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.generate_product_number();

-- 5. DIAGNOSTIC: Check what the next value will be (should be 5000)
SELECT nextval('product_number_seq') as next_val_test;
