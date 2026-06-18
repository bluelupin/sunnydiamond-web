import type { JewelleryCategory } from "../types";

export const jewelleryCategories: JewelleryCategory[] = [
  { slug: "all", label: "All" },
  { slug: "rings", label: "Rings" },
  { slug: "earrings", label: "Earrings" },
  { slug: "necklace", label: "Necklace" },
  { slug: "pendants", label: "Pendants" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "bangles", label: "Bangles" },
  { slug: "nosepins", label: "Nosepins" },
];

export const categorySlugToProductCategory: Record<string, string> = {
  rings: "Rings",
  earrings: "Earrings",
  necklace: "Necklaces",
  pendants: "Necklaces",
  bracelets: "Bracelets",
  bangles: "Bracelets",
  nosepins: "Earrings",
};
