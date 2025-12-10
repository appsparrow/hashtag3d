-- Fix orders UPDATE policy to include WITH CHECK clause
-- This allows admins to actually update orders, not just read them

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

