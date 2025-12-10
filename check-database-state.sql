-- ============================================
-- DIAGNOSTIC QUERIES - Check Current Database State
-- ============================================
-- Run these queries in Supabase SQL Editor to check if migration was applied
-- ============================================

-- 1. Check if sequence exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'product_number_seq')
    THEN '✅ Sequence EXISTS'
    ELSE '❌ Sequence MISSING - Migration not applied!'
  END as sequence_status;

-- 2. Check current sequence value
SELECT 
  last_value as current_sequence_value,
  CASE 
    WHEN last_value > 0 THEN '✅ Sequence initialized'
    ELSE '⚠️ Sequence at 0'
  END as sequence_status
FROM product_number_seq;

-- 3. Check current trigger function code
SELECT 
  prosrc as function_code
FROM pg_proc 
WHERE proname = 'generate_product_number';

-- 4. Check if trigger exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'generate_product_number_trigger'
    )
    THEN '✅ Trigger EXISTS'
    ELSE '❌ Trigger MISSING'
  END as trigger_status;

-- 5. Check existing product numbers
SELECT 
  COUNT(*) as total_products,
  COUNT(product_number) as products_with_number,
  MAX(product_number) as highest_product_number
FROM products;

-- 6. Check for duplicate product numbers (should be 0)
SELECT 
  product_number,
  COUNT(*) as duplicate_count
FROM products
WHERE product_number IS NOT NULL
GROUP BY product_number
HAVING COUNT(*) > 1;

