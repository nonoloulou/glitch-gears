import { createClient } from "@/lib/supabase/server";
import HomePageClient from "@/components/HomePageClient";
import type { Product, Promotion } from "@/lib/types";

export const revalidate = 0;

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

async function getActivePromotion(): Promise<Promotion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch promotion:", error.message);
    return null;
  }

  return data as Promotion | null;
}

export default async function HomePage() {
  const [products, promotion] = await Promise.all([
    getProducts(),
    getActivePromotion(),
  ]);

  return (
    <HomePageClient
      initialProducts={products}
      initialPromotion={promotion}
    />
  );
}
