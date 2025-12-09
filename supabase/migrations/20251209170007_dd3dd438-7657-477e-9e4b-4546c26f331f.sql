-- Add columns for estimated filament grams per material tier and accessories cost
ALTER TABLE public.products
ADD COLUMN estimated_grams_standard numeric NOT NULL DEFAULT 0,
ADD COLUMN estimated_grams_premium numeric NOT NULL DEFAULT 0,
ADD COLUMN estimated_grams_ultra numeric NOT NULL DEFAULT 0,
ADD COLUMN accessories_cost numeric NOT NULL DEFAULT 0;