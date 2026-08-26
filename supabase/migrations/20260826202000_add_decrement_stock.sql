-- ============================================================
-- Migration: add decrement_stock RPC function
-- Called by OrderService.placeOrder() to atomically reduce stock
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity - qty)
  WHERE id = product_id;
END;
$$;
