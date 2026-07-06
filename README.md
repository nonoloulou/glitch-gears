# Product Showcase

A full-stack product showcase built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase** (database, auth, storage).

## Features

- Public homepage with live search and tag filtering
- Promotional banner section (admin-editable)
- Responsive product grid with discounts, stock status, and tags
- Protected admin dashboard at `/admin`
- Product & promotion CRUD with image uploads to Supabase Storage

---

## Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**, pick an organization, name, password, and region.
3. Wait for the project to finish provisioning.

## Step 2 — Get your API keys

1. In the Supabase dashboard, open **Project Settings → API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3 — Create tables & policies

1. Open **SQL Editor** in Supabase.
2. Click **New query**.
3. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Click **Run**.

This creates `products`, `promotions`, RLS policies, and the `product-images` storage bucket.

## Step 4 — Create your admin user

1. In Supabase, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter your admin email and password.
4. Confirm the user (disable “Auto confirm” only if you want email verification).

This is the only account needed — any authenticated user can access the admin dashboard.

## Step 5 — Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 6 — Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (server fetch)
│   ├── layout.tsx
│   └── admin/
│       ├── page.tsx          # Dashboard
│       └── login/page.tsx
├── components/
│   ├── SearchBar.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── PromotionBanner.tsx
│   ├── HomePageClient.tsx
│   ├── AdminLoginForm.tsx
│   ├── AdminProductForm.tsx
│   └── AdminPromotionForm.tsx
└── lib/
    ├── supabase/             # Client, server, middleware
    ├── storage.ts            # Image uploads
    └── types.ts
```

## Design notes

- Black/gray palette only — no bright accent colors
- Soft UI: `rounded-2xl`, gentle shadows, smooth transitions
- Mobile-first responsive grid
