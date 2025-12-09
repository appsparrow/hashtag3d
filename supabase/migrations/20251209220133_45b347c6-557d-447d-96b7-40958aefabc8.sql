-- Add print time estimate columns for each size (in minutes)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS print_time_small integer NOT NULL DEFAULT 60,
ADD COLUMN IF NOT EXISTS print_time_medium integer NOT NULL DEFAULT 120,
ADD COLUMN IF NOT EXISTS print_time_large integer NOT NULL DEFAULT 180;