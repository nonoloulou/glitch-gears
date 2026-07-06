import Image from "next/image";
import type { Promotion } from "@/lib/types";

type PromotionBannerProps = {
  promotion: Promotion | null;
};

export default function PromotionBanner({ promotion }: PromotionBannerProps) {
  if (!promotion) return null;

  return (
    <section className="soft-card overflow-hidden">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative aspect-[16/10] min-h-[200px] bg-surface-muted md:aspect-auto md:min-h-[280px]">
          {promotion.image_url ? (
            <Image
              src={promotion.image_url}
              alt={promotion.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted">
              <span className="text-sm">Promotion image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
            Promotions & Offers
          </p>
          <h2 className="text-2xl font-medium leading-tight text-white md:text-3xl">
            {promotion.title}
          </h2>
          <p className="text-base leading-relaxed text-text-secondary">
            {promotion.description}
          </p>
        </div>
      </div>
    </section>
  );
}
