-- Allow anyone to update likes_count on products
CREATE POLICY "Anyone can update product likes"
ON public.products
FOR UPDATE
USING (true)
WITH CHECK (true);