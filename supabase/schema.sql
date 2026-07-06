-- Product Showcase — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run

-- ─────────────────────────────────────────────
-- 1. Products table
-- ─────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  price numeric(10, 2) not null check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  quantity integer not null default 0 check (quantity >= 0),
  tags text[] not null default '{}',
  image_url text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 2. Promotions table
-- ─────────────────────────────────────────────
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 3. Row Level Security (RLS)
-- ─────────────────────────────────────────────
alter table public.products enable row level security;
alter table public.promotions enable row level security;

-- Public read access (homepage)
create policy "Anyone can read products"
  on public.products for select
  using (true);

create policy "Anyone can read promotions"
  on public.promotions for select
  using (true);

-- Authenticated users (admin) can manage data
create policy "Authenticated users can insert products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update products"
  on public.products for update
  to authenticated
  using (true);

create policy "Authenticated users can delete products"
  on public.products for delete
  to authenticated
  using (true);

create policy "Authenticated users can insert promotions"
  on public.promotions for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update promotions"
  on public.promotions for update
  to authenticated
  using (true);

create policy "Authenticated users can delete promotions"
  on public.promotions for delete
  to authenticated
  using (true);

-- ─────────────────────────────────────────────
-- 4. Storage bucket for product images
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read for images
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Authenticated upload/update/delete
create policy "Authenticated upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ─────────────────────────────────────────────
-- 5. Optional sample data (remove if not wanted)
-- ─────────────────────────────────────────────
insert into public.products (name, type, price, discount_price, quantity, tags, image_url)
values
  ('Wireless Headphones', 'Electronics', 129.99, 99.99, 12, array['wireless', 'audio', 'sale'], null),
  ('Minimal Desk Lamp', 'Home', 59.00, null, 8, array['lighting', 'minimal'], null),
  ('Ceramic Mug Set', 'Kitchen', 34.50, 24.99, 0, array['kitchen', 'gift'], null);

insert into public.promotions (title, description, image_url, active)
values (
  'Summer Sale — Up to 30% Off',
  'Discover curated essentials at special prices. Limited time only.',
  null,
  true
);
