-- Add address field to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Add delivery_address field to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address TEXT;
