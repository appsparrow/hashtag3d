-- Create material category enum
CREATE TYPE public.material_category AS ENUM ('standard', 'premium', 'ultra');

-- Create complexity tier enum
CREATE TYPE public.complexity_tier AS ENUM ('simple', 'medium', 'complex');

-- Materials table
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category material_category NOT NULL DEFAULT 'standard',
  cost_per_gram NUMERIC(10, 4) NOT NULL DEFAULT 0.03,
  upcharge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Colors table
CREATE TABLE public.colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hex_color TEXT NOT NULL DEFAULT '#000000',
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Complexity settings table
CREATE TABLE public.complexity_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier complexity_tier NOT NULL UNIQUE,
  description TEXT,
  min_time_minutes INTEGER DEFAULT 0,
  max_time_minutes INTEGER,
  fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  help_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Finish options table
CREATE TABLE public.finish_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customization options table
CREATE TABLE public.customization_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  min_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pricing settings table (global settings)
CREATE TABLE public.pricing_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complexity_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finish_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for materials
CREATE POLICY "Anyone can view active materials" ON public.materials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage materials" ON public.materials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for colors
CREATE POLICY "Anyone can view active colors" ON public.colors FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage colors" ON public.colors FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for complexity_settings
CREATE POLICY "Anyone can view complexity settings" ON public.complexity_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage complexity settings" ON public.complexity_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for finish_options
CREATE POLICY "Admins can view finish options" ON public.finish_options FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage finish options" ON public.finish_options FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for customization_options
CREATE POLICY "Anyone can view active customization options" ON public.customization_options FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage customization options" ON public.customization_options FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for pricing_settings
CREATE POLICY "Anyone can view pricing settings" ON public.pricing_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage pricing settings" ON public.pricing_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default complexity settings
INSERT INTO public.complexity_settings (tier, description, min_time_minutes, max_time_minutes, fee, help_text) VALUES
('simple', 'No supports, under 60 minutes', 0, 60, 0, 'Simple prints with no support structures needed'),
('medium', 'Light supports, 60-120 minutes', 60, 120, 2, 'Moderate complexity with some support structures'),
('complex', 'Heavy supports, over 120 minutes', 120, NULL, 5, 'Complex prints requiring extensive supports');

-- Insert default pricing settings
INSERT INTO public.pricing_settings (setting_key, setting_value, description) VALUES
('ams_base_fee', 1.50, 'Base fee for AMS multicolor printing'),
('ams_per_color_fee', 0.50, 'Fee per additional color'),
('standard_upcharge', 0, 'Upcharge for standard materials'),
('premium_upcharge', 3, 'Upcharge for premium materials'),
('ultra_upcharge', 6, 'Upcharge for ultra premium materials');

-- Insert default customization options
INSERT INTO public.customization_options (name, description, min_fee, max_fee) VALUES
('Add Name/Text', 'Add personalized name or text to the print', 2, 5),
('Minor Edit', 'Small modifications to existing design', 1, 2),
('Full Custom Model', 'Completely custom design work', 15, 80);

-- Insert default finish options
INSERT INTO public.finish_options (name, fee) VALUES
('Standard', 0),
('Smooth Finish', 3),
('Satin Clear Coat', 5),
('Glitter Coat', 4),
('Polished', 6);

-- Insert default materials
INSERT INTO public.materials (name, category, cost_per_gram, upcharge) VALUES
('PLA Black', 'standard', 0.03, 0),
('PLA White', 'standard', 0.03, 0),
('PLA Gray', 'standard', 0.03, 0),
('PLA Blue', 'standard', 0.03, 0),
('PLA Red', 'standard', 0.03, 0),
('Silk Gold', 'premium', 0.05, 3),
('Silk Silver', 'premium', 0.05, 3),
('Matte Black', 'premium', 0.04, 2),
('Marble White', 'premium', 0.05, 3),
('Wood PLA', 'ultra', 0.07, 6),
('Carbon Fiber PLA', 'ultra', 0.08, 8),
('TPU Flexible', 'ultra', 0.06, 5);

-- Create updated_at triggers
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_colors_updated_at BEFORE UPDATE ON public.colors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_complexity_settings_updated_at BEFORE UPDATE ON public.complexity_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_finish_options_updated_at BEFORE UPDATE ON public.finish_options FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customization_options_updated_at BEFORE UPDATE ON public.customization_options FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_settings_updated_at BEFORE UPDATE ON public.pricing_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();