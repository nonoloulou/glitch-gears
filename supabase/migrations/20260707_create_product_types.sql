-- Migration: Create product_types table and migrate existing product types
-- Run this in Supabase Dashboard → SQL Editor → New query → Run

begin;

create table if not exists public.product_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.products
  add column if not exists product_type_id uuid references public.product_types(id) on delete restrict;

insert into public.product_types (name)
select distinct type
from public.products
where type is not null and type <> '';

update public.products
set product_type_id = pt.id
from public.product_types pt
where public.products.type = pt.name;

commit;
