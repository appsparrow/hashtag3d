-- =================================================================
-- 1. DEBUG & FIX: Intelligent Reset
-- =================================================================

DO $$
DECLARE
  max_val text;
  max_num bigint;
  start_seq bigint;
BEGIN
  -- Find the "largest" product number string
  SELECT product_number INTO max_val
  FROM products
  WHERE product_number LIKE '1215%'
  ORDER BY length(product_number) DESC, product_number DESC
  LIMIT 1;

  RAISE NOTICE 'Highest existing Product Number: %', max_val;

  -- Extract the suffix. If null, assume 0.
  IF max_val IS NULL THEN
    max_num := 0;
  ELSE
    -- Try to parse the number after '1215'
    BEGIN
      max_num := CAST(SUBSTRING(max_val FROM 5) AS BIGINT);
    EXCEPTION WHEN OTHERS THEN
      max_num := 999999; -- Fallback
    END;
  END IF;

  RAISE NOTICE 'Parsed Max Suffix: %', max_num;

  -- Set sequence safely above it
  start_seq := max_num + 10000;
  
  -- Re-create sequence with this safe value
  DROP SEQUENCE IF EXISTS product_number_seq CASCADE;
  EXECUTE 'CREATE SEQUENCE product_number_seq START WITH ' || start_seq;
  
  RAISE NOTICE 'Reset sequence to: %', start_seq;
END $$;

-- 2. Update function to log what it's doing
CREATE OR REPLACE FUNCTION public.generate_product_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_val text;
BEGIN
  IF NEW.product_number IS NULL OR NEW.product_number = '' THEN
    new_val := '1215' || nextval('product_number_seq')::text;
    RAISE NOTICE 'Generating Product Number: %', new_val; 
    NEW.product_number := new_val;
  END IF;
  RETURN NEW;
END;
$$;

-- 3. TEST MANUALLY (This tells us if DB is working)
INSERT INTO products (title, price, category, is_active) 
VALUES ('Test SQL Insert', 10.00, 'general', false) 
RETURNING id, product_number;

