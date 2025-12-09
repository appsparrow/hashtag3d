-- Drop and recreate the trigger to ensure it fires on every insert
DROP TRIGGER IF EXISTS generate_product_number_trigger ON public.products;

CREATE TRIGGER generate_product_number_trigger
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.generate_product_number();