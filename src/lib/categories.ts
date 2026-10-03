export const CATEGORIES = [
  "Fragrances & Beauty",
  "Flowers & Florals",
  "Chocolates & Confections",
  "Jewelry & Accessories",
  "Home & Living",
] as const;

export type Category = (typeof CATEGORIES)[number];
