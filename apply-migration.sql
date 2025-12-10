-- =================================================================
-- FORCE FIX: Reset Product Number Generation (FINAL)
-- Run this in Supabase SQL Editor to stop the "Duplicate Key" errors
-- =================================================================

-- 1. Clean up old objects to ensure a fresh start
-- We use CASCADE to automatically drop any triggers depending on this function
DROP FUNCTION IF EXISTS public.generate_product_number() CASCADE;
DROP SEQUENCE IF EXISTS product_number_seq;

-- 2. Create a new thread-safe sequence
CREATE SEQUENCE product_number_seq;

-- 3. Force the sequence to start at 1000 to be ABSOLUTELY safe
-- This avoids any confusion with existing IDs like 001, 002, 050, etc.
ALTER SEQUENCE product_number_seq RESTART WITH 1000;

-- 4. Create the new, thread-safe generator function
CREATE OR REPLACE FUNCTION public.generate_product_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only generate if not provided
  IF NEW.product_number IS NULL OR NEW.product_number = '' THEN
    -- Generate: 1215 + Sequence Number (padded to 3 digits)
    -- Example: 12151001, 12151002
    NEW.product_number := '1215' || nextval('product_number_seq')::text;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Re-attach the trigger
CREATE TRIGGER generate_product_number_trigger
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.generate_product_number();
