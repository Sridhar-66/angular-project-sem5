-- ============================================================
-- Fix: Infinite Recursion in RLS Policies
-- ============================================================

-- 1. Create a function to get the current user's role, bypassing RLS to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Drop the old recursive policies
DROP POLICY IF EXISTS "profiles: admin read all" ON profiles;
DROP POLICY IF EXISTS "products: admin insert" ON products;
DROP POLICY IF EXISTS "products: admin update" ON products;
DROP POLICY IF EXISTS "products: admin delete" ON products;
DROP POLICY IF EXISTS "orders: admin read all" ON orders;
DROP POLICY IF EXISTS "orders: admin update" ON orders;
DROP POLICY IF EXISTS "order_items: admin read all" ON order_items;

-- Storage policies don't exist yet because we set them up via DB UI or SQL differently,
-- but just in case they were created in the previous migration via SQL on storage.objects:
DROP POLICY IF EXISTS "product-images: admin insert" ON storage.objects;
DROP POLICY IF EXISTS "product-images: admin update" ON storage.objects;
DROP POLICY IF EXISTS "product-images: admin delete" ON storage.objects;

-- 3. Recreate them using the safe SECURITY DEFINER function

-- PROFILES
CREATE POLICY "profiles: admin read all"
  ON profiles FOR SELECT
  USING ( public.get_user_role() = 'admin' );

-- PRODUCTS
CREATE POLICY "products: admin insert"
  ON products FOR INSERT
  WITH CHECK ( public.get_user_role() = 'admin' );

CREATE POLICY "products: admin update"
  ON products FOR UPDATE
  USING ( public.get_user_role() = 'admin' )
  WITH CHECK ( public.get_user_role() = 'admin' );

CREATE POLICY "products: admin delete"
  ON products FOR DELETE
  USING ( public.get_user_role() = 'admin' );

-- ORDERS
CREATE POLICY "orders: admin read all"
  ON orders FOR SELECT
  USING ( public.get_user_role() = 'admin' );

CREATE POLICY "orders: admin update"
  ON orders FOR UPDATE
  USING ( public.get_user_role() = 'admin' )
  WITH CHECK ( public.get_user_role() = 'admin' );

-- ORDER_ITEMS
CREATE POLICY "order_items: admin read all"
  ON order_items FOR SELECT
  USING ( public.get_user_role() = 'admin' );

-- STORAGE (if applicable)
CREATE POLICY "product-images: admin insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "product-images: admin update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "product-images: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND public.get_user_role() = 'admin'
  );
