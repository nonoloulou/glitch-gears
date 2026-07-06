"use client";

import { useMemo } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  searchQuery: string;
  activeTag: string;
  onTagClick: (tag: string) => void;
  loading?: boolean;
};

function matchesQuery(product: Product, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  return (
    product.name.toLowerCase().includes(q) ||
    product.type.toLowerCase().includes(q) ||
    product.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export default function ProductGrid({
  products,
  searchQuery,
  activeTag,
  onTagClick,
  loading = false,
}: ProductGridProps) {
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const tagMatch =
        !activeTag ||
        product.tags.some(
          (tag) => tag.toLowerCase() === activeTag.toLowerCase()
        );
      const searchMatch = matchesQuery(product, searchQuery);
      return tagMatch && searchMatch;
    });
  }, [products, searchQuery, activeTag]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="soft-card animate-pulse overflow-hidden"
            aria-hidden
          >
            <div className="aspect-[4/3] bg-surface-muted" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-1/4 rounded-full bg-surface-muted" />
              <div className="h-5 w-3/4 rounded-full bg-surface-muted" />
              <div className="h-4 w-1/3 rounded-full bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="soft-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <svg
          className="mb-4 h-12 w-12 text-text-muted opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <h3 className="text-lg font-medium text-text-primary">
          No products found
        </h3>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          {searchQuery || activeTag
            ? "Try adjusting your search or clearing the active tag filter."
            : "Check back soon — new products are on the way."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onTagClick={onTagClick}
          activeTag={activeTag}
        />
      ))}
    </div>
  );
}
