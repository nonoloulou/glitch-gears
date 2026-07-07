export function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} DA`;
}

export function getDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function tagsToInput(tags: string[]): string {
  return tags.join(", ");
}
