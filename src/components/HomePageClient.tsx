"use client";

import { useState } from "react";
import type { Product, Promotion } from "@/lib/types";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";
import PromotionBanner from "./PromotionBanner";

type HomePageClientProps = {
  initialProducts: Product[];
  initialPromotion: Promotion | null;
};

export default function HomePageClient({
  initialProducts,
  initialPromotion,
}: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");

  function handleTagClick(tag: string) {
    setActiveTag((current) => (current === tag ? "" : tag));
    setSearchQuery("");
  }

  return (
    <div className="space-y-10">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {activeTag && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">
            Filtering by tag:
          </span>
          <button
            type="button"
            onClick={() => setActiveTag("")}
            className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-900 transition-all duration-300 hover:bg-white"
          >
            {activeTag} ×
          </button>
        </div>
      )}

      <PromotionBanner promotion={initialPromotion} />

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-white">All products</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {initialProducts.length} product
              {initialProducts.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
        <ProductGrid
          products={initialProducts}
          searchQuery={searchQuery}
          activeTag={activeTag}
          onTagClick={handleTagClick}
        />
      </section>
    </div>
  );
}
