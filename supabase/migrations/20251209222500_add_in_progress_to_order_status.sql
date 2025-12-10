-- Add missing 'in_progress' value to order_status enum
-- This fixes the "invalid input value for enum" error

DO $$
BEGIN
    -- Check if 'in_progress' exists in the enum
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'order_status' 
        AND e.enumlabel = 'in_progress'
    ) THEN
        -- Add 'in_progress' to the enum (can only add at the end)
        ALTER TYPE public.order_status ADD VALUE 'in_progress';
    END IF;
END $$;

