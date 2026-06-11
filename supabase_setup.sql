-- Supabase SQL Setup Script for Nutri Dates E-Commerce
-- Run this in your Supabase SQL Editor (https://supabase.com) to initialize database tables!

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    stock_status TEXT NOT NULL DEFAULT 'in_stock',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow public read/write access (for the customer portal) 
-- and restrict update operations if needed, or allow anon for simplicity of this prototype.
CREATE POLICY "Allow public read access to orders" ON public.orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update to orders" ON public.orders FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow public delete to orders" ON public.orders FOR DELETE TO anon USING (true);

CREATE POLICY "Allow public read to products" ON public.products FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public update to products" ON public.products FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow public read to settings" ON public.settings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public write to settings" ON public.settings FOR ALL TO anon USING (true);

-- Insert Default Product
INSERT INTO public.products (id, name, description, sizes, stock_status)
VALUES (
    'prod_chocolate_mix', 
    'Chocolate Dates Nutrition Powder', 
    'Date-Based Chocolate Nutrition Powder with Oats and Mixed Dry Fruits. India''s first healthy sugar-free kids and gym mix.',
    '[{"size": "250g", "price": 299, "in_stock": true}, {"size": "500g", "price": 549, "in_stock": true}, {"size": "1kg", "price": 999, "in_stock": true}]'::jsonb,
    'in_stock'
)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, sizes = EXCLUDED.sizes;

-- Insert Default Settings
INSERT INTO public.settings (key, value)
VALUES (
    'store_settings', 
    '{"whatsapp_phone": "917970574329", "support_email": "hello@nutridates.in"}'::jsonb
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;
