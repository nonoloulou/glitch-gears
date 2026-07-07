"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  onTagClick: (tag: string) => void;
  activeTag?: string;
};

export default function ProductCard({
  product,
  onTagClick,
  activeTag,
}: ProductCardProps) {
  const hasDiscount =
    product.discount_price != null && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? getDiscountPercent(product.price, product.discount_price!)
    : 0;
  const inStock = product.quantity > 0;

  return (
    <article className="soft-card group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <svg
              className="h-16 w-16 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-neutral-700 px-3 py-1 text-xs font-semibold text-neutral-100 shadow-lg">
            {discountPercent}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">
            {product.type}
          </p>
          <h3 className="mt-1 text-lg font-medium text-text-primary">
            {product.name}
          </h3>
        </div>

        <div className="flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-sm text-text-muted line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-xl font-semibold text-text-primary">
                {formatPrice(product.discount_price!)}
              </span>
            </>
          ) : (
            <span className="text-xl font-semibold text-text-primary">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <p
          className={`text-sm ${
            inStock ? "text-neutral-400" : "font-medium text-neutral-500"
          }`}
        >
          {inStock ? `${product.quantity} in stock` : "Out of stock"}
        </p>

        {product.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            {product.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className={`rounded-full px-3 py-1 text-xs transition-all duration-300 ${
                  activeTag === tag
                    ? "bg-neutral-700 text-neutral-100"
                    : "bg-surface-muted text-text-secondary hover:bg-neutral-700 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
