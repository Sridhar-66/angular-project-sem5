-- ============================================================
-- Thesaurus — init_schema.sql
-- Tables: profiles, products, orders, order_items, notifications
-- RLS policies, trigger for auto-profile creation, storage bucket
-- ============================================================

-- ──────────────────────────────────────────────
-- 0. Extensions
-- ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- 1. Enums
-- ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'delivery', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status_type AS ENUM (
    'placed',
    'ready_to_deliver',
    'out_for_delivery',
    'delivered'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ──────────────────────────────────────────────
-- 2. profiles
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  role          user_role NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Each user can read and update their own profile
CREATE POLICY "profiles: own read"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can read all profiles (needed for delivery boy list)
CREATE POLICY "profiles: admin read all"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ──────────────────────────────────────────────
-- 3. products
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock_quantity  INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  image_url       TEXT,
  category        TEXT,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone (including anonymous) can read products
CREATE POLICY "products: public read"
  ON products FOR SELECT
  USING (true);

-- Only admin can insert/update/delete
CREATE POLICY "products: admin insert"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "products: admin update"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "products: admin delete"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ──────────────────────────────────────────────
-- 4. orders
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount     NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_status   payment_status_type NOT NULL DEFAULT 'pending',
  order_status     order_status_type NOT NULL DEFAULT 'placed',
  delivery_boy_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customer sees only their own orders
CREATE POLICY "orders: customer read own"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Customer can insert new orders (checkout)
CREATE POLICY "orders: customer insert"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Admin sees all orders
CREATE POLICY "orders: admin read all"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admin can update any order (assign delivery boy, etc.)
CREATE POLICY "orders: admin update"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Delivery boy sees orders assigned to them
CREATE POLICY "orders: delivery read assigned"
  ON orders FOR SELECT
  USING (auth.uid() = delivery_boy_id);

-- Delivery boy can only update order_status on their assigned orders
CREATE POLICY "orders: delivery update status"
  ON orders FOR UPDATE
  USING (auth.uid() = delivery_boy_id)
  WITH CHECK (auth.uid() = delivery_boy_id);

-- ──────────────────────────────────────────────
-- 5. order_items
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity          INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10,2) NOT NULL CHECK (price_at_purchase >= 0),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customer can read items for their own orders
CREATE POLICY "order_items: customer read own"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
    )
  );

-- Customer can insert items (during checkout)
CREATE POLICY "order_items: customer insert"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
    )
  );

-- Admin reads all
CREATE POLICY "order_items: admin read all"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Delivery boy reads items for assigned orders
CREATE POLICY "order_items: delivery read assigned"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.delivery_boy_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────
-- 6. notifications
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'info',  -- 'order_placed', 'status_update', etc.
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users see only their own notifications
CREATE POLICY "notifications: own read"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users mark their own notifications as read (UPDATE)
CREATE POLICY "notifications: own update"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Any authenticated user can insert a notification for another user
-- (server-side inserts via service role, but we also allow authenticated to insert
--  for the realtime trigger path — tightened further via DB function if needed)
CREATE POLICY "notifications: authenticated insert"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 7. Trigger: auto-create profile on signup
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'customer'
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ──────────────────────────────────────────────
-- 8. Storage bucket for product images
-- ──────────────────────────────────────────────
-- Note: Storage buckets are created via Supabase Storage API, not plain SQL.
-- We use the storage schema helpers available in hosted Supabase.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read on product-images bucket
CREATE POLICY "product-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only admin can upload to product-images
CREATE POLICY "product-images: admin insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admin can update/delete their uploads
CREATE POLICY "product-images: admin update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "product-images: admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ──────────────────────────────────────────────
-- 9. Enable Realtime on notifications table
-- ──────────────────────────────────────────────
-- This tells Supabase Realtime to stream changes from the notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

