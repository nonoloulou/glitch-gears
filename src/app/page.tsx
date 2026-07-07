import { createClient } from "@/lib/supabase/server";
import ProductBrowser from "@/components/ProductBrowser";
import PromotionBanner from "@/components/PromotionBanner";
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

export default async function HomePage() {
  const products = await getProducts();

  const promotion = await getActivePromotion();

  return (
    <>
      <PromotionBanner promotion={promotion} />
      <ProductBrowser products={products} />
    </>
  );
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
