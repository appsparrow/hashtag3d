-- Add size and color category upcharge settings
INSERT INTO pricing_settings (setting_key, setting_value, description) VALUES
  ('size_small_upcharge', 0, 'Upcharge for small size products'),
  ('size_medium_upcharge', 2, 'Upcharge for medium size products'),
  ('size_large_upcharge', 4, 'Upcharge for large size products'),
  ('color_premium_upcharge', 1.50, 'Upcharge when customer selects premium color'),
  ('color_ultra_upcharge', 3, 'Upcharge when customer selects ultra color'),
  ('material_premium_upcharge', 3, 'Upcharge for premium material selection'),
  ('material_ultra_upcharge', 6, 'Upcharge for ultra material selection')
ON CONFLICT (setting_key) DO NOTHING;

-- Add business settings to local_settings
INSERT INTO local_settings (setting_key, setting_value) VALUES
  ('business_name', '"3D Print Shop"'),
  ('business_location', '"Alpharetta, GA"'),
  ('business_currency', '"USD"'),
  ('business_currency_symbol', '"$"'),
  ('business_email', '""'),
  ('business_phone', '""')
ON CONFLICT (setting_key) DO NOTHING;

-- Add allowed_materials column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS allowed_materials text[] DEFAULT '{standard}'::text[];

-- Add allowed_sizes column to products table  
ALTER TABLE products ADD COLUMN IF NOT EXISTS allowed_sizes text[] DEFAULT '{small,medium,large}'::text[];