-- Add color_slots column to products table
-- This stores an array of slot definitions like: [{label: "Background", id: "bg"}, {label: "Foreground", id: "fg"}]
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_slots jsonb DEFAULT '[]'::jsonb;