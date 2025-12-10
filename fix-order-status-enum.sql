-- =================================================================
-- FIX ORDER_STATUS ENUM - Add missing 'in_progress' value
-- Run this in Supabase SQL Editor
-- =================================================================

-- Step 1: Check current enum values
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'order_status'
ORDER BY e.enumsortorder;

-- Step 2: Add 'in_progress' if it doesn't exist
-- Note: PostgreSQL only allows adding enum values at the end
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'order_status' 
        AND e.enumlabel = 'in_progress'
    ) THEN
        ALTER TYPE public.order_status ADD VALUE 'in_progress';
        RAISE NOTICE 'Added in_progress to order_status enum';
    ELSE
        RAISE NOTICE 'in_progress already exists in order_status enum';
    END IF;
END $$;

-- Step 3: Verify all values exist
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'order_status'
ORDER BY e.enumsortorder;
