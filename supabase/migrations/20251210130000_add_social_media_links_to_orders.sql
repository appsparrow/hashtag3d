-- Add social media link field to orders table
-- This link can be added by admins when order status is "printing"
-- The UI will automatically detect the platform (Instagram, TikTok, YouTube) from the URL

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS social_media_url TEXT;

COMMENT ON COLUMN public.orders.social_media_url IS 'Social media post/video URL (Instagram, TikTok, or YouTube) showing the order being printed';

