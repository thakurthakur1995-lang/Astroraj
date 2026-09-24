-- ====================================================================
-- ASTRO RAJ PLATFORM - COMPLETE DATABASE SCHEMA (PostgreSQL / Supabase)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'astrologer', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS public.service_categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT,
    icon_name TEXT,
    badge TEXT,
    featured_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    category_id TEXT REFERENCES public.service_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    image TEXT NOT NULL,
    price_starting_from NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    featured BOOLEAN DEFAULT false,
    benefits JSONB DEFAULT '[]'::jsonb,
    inclusions JSONB DEFAULT '[]'::jsonb,
    process_steps JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. CONSULTATION PRICING TIERS
CREATE TABLE IF NOT EXISTS public.consultation_pricing (
    id TEXT PRIMARY KEY,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (15, 30, 45, 60)),
    consultation_type TEXT NOT NULL CHECK (consultation_type IN ('audio', 'video', 'in-person')),
    urgency TEXT NOT NULL CHECK (urgency IN ('normal', 'urgent')),
    turnaround_days TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true
);

-- 5. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id TEXT NOT NULL,
    service_title TEXT NOT NULL,
    consultation_type TEXT NOT NULL CHECK (consultation_type IN ('audio', 'video', 'in-person')),
    duration_minutes INTEGER NOT NULL,
    urgency TEXT NOT NULL CHECK (urgency IN ('normal', 'urgent')),
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    
    -- Client Birth & Contact Coordinates
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT,
    gender TEXT,
    date_of_birth DATE NOT NULL,
    time_of_birth TEXT NOT NULL,
    time_is_approximate BOOLEAN DEFAULT false,
    place_of_birth TEXT NOT NULL,
    preferred_language TEXT DEFAULT 'Hindi',
    concerns_topic TEXT,
    question_or_notes TEXT,
    
    -- Status & Payments
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id TEXT,
    razorpay_order_id TEXT,
    meeting_link TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. PRODUCTS (E-commerce)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('gemstones', 'rudraksha', 'yantra', 'ayurveda', 'spiritual')),
    category_label TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    sku TEXT UNIQUE NOT NULL,
    featured BOOLEAN DEFAULT false,
    certified BOOLEAN DEFAULT false,
    certification_authority TEXT,
    suitable_zodiac JSONB DEFAULT '[]'::jsonb,
    spiritual_benefits JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    origin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'processing' CHECK (order_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
    payment_id TEXT,
    order_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TESTIMONIALS & REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    service_name TEXT NOT NULL,
    review_text TEXT NOT NULL,
    review_date TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('consultation', 'kundli', 'puja', 'gemstones', 'payment')),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. BLOG POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author_name TEXT NOT NULL DEFAULT 'Astrologer Rajat Thakur',
    author_role TEXT NOT NULL DEFAULT 'Founder & Spiritual Guide',
    author_image TEXT,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    read_time_minutes INTEGER DEFAULT 5,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public services are viewable by everyone" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Public faqs are viewable by everyone" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public blog posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Customer Specific Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "Anyone can create an order" ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
