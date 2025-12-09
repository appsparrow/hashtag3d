-- Rename gram estimate columns from material-based to size-based
ALTER TABLE public.products 
  RENAME COLUMN estimated_grams_standard TO estimated_grams_small;

ALTER TABLE public.products 
  RENAME COLUMN estimated_grams_premium TO estimated_grams_medium;

ALTER TABLE public.products 
  RENAME COLUMN estimated_grams_ultra TO estimated_grams_large;