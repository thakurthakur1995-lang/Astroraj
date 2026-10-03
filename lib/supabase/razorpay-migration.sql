-- ====================================================================
-- ASTRO RAJ PLATFORM - PRODUCTION HARDENED RAZORPAY & PAYMENTS SCHEMA
-- Non-destructive, idempotent, and strictly enforced RLS security
-- ====================================================================

-- 1. Ensure required Razorpay columns exist on bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE;

-- 2. Ensure required Razorpay columns exist on orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMP WITH TIME ZONE;

-- 3. Dedicated Payments Ledger Table (Idempotent & Audited)
-- Uses native gen_random_uuid() (standard in PostgreSQL 13+ / Supabase)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('booking', 'order')),
    entity_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
    error_code TEXT,
    error_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. High-Performance B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_razorpay_order ON public.bookings(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order ON public.orders(razorpay_order_id);

-- 5. Strict Row Level Security (RLS) Configuration

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy, loose, or public policies
DROP POLICY IF EXISTS "Public can view payments" ON public.payments;
DROP POLICY IF EXISTS "Allow insert payments" ON public.payments;
DROP POLICY IF EXISTS "Public can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Allow update payments" ON public.payments;
DROP POLICY IF EXISTS "Public can update payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can view payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;

-- Drop any insecure public update policies on bookings and orders
DROP POLICY IF EXISTS "Allow updates on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow updates on orders" ON public.orders;

-- PAYMENTS POLICIES:
-- Authenticated users can only view payments linked to their own bookings or orders.
-- Anonymous/public visitors have ZERO SELECT access to the payment ledger.
-- Backend service_role bypasses RLS automatically.
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (
        auth.role() = 'service_role'
        OR (
            auth.uid() IS NOT NULL AND (
                (entity_type = 'booking' AND EXISTS (
                    SELECT 1 FROM public.bookings b 
                    WHERE b.booking_code = payments.entity_id 
                      AND b.user_id = auth.uid()
                ))
                OR
                (entity_type = 'order' AND EXISTS (
                    SELECT 1 FROM public.orders o 
                    WHERE o.order_number = payments.entity_id 
                      AND o.user_id = auth.uid()
                ))
            )
        )
    );

-- NOTE ON INSERT & UPDATE PERMISSIONS:
-- We intentionally DO NOT create any public INSERT or UPDATE policies on public.payments,
-- public.bookings, or public.orders. Under PostgreSQL RLS default-deny rules:
--   - No browser client or anonymous user can insert into or update payments.
--   - No browser client can alter payment_status, razorpay_order_id, or razorpay_payment_id.
--   - All payment verifications, status updates, and ledger writes are strictly handled
--     by the Next.js server-side backend using the SUPABASE_SERVICE_ROLE_KEY.

