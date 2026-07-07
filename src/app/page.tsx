import { createClient } from "@/lib/supabase/server";
import ProductBrowser from "@/components/ProductBrowser";
import type { Product } from "@/lib/types";

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

  return <ProductBrowser products={products} />;
}
