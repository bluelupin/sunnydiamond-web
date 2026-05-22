import productRing from "@/assets/product-ring.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import type { StaticImageData } from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  image: string | StaticImageData;
  images: Array<string | StaticImageData>;
  carat: string;
  metal: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Celestial Solitaire Ring",
    price: 4500,
    originalPrice: 5200,
    description: "A breathtaking solitaire ring featuring a 1.5-carat round brilliant diamond set in 18K rose gold. The delicate pavé band adds subtle sparkle, making this piece perfect for engagements or milestone celebrations.",
    shortDescription: "1.5ct round brilliant diamond in 18K rose gold",
    category: "Rings",
    image: productRing,
    images: [productRing, productRing, productRing],
    carat: "1.5 ct",
    metal: "18K Rose Gold",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 127,
  },
  {
    id: "2",
    name: "Lumière Pendant Necklace",
    price: 3200,
    description: "An elegant pendant necklace showcasing a stunning round diamond suspended from a delicate rose gold chain. The minimalist design lets the diamond's brilliance take center stage.",
    shortDescription: "Round diamond pendant on rose gold chain",
    category: "Necklaces",
    image: productNecklace,
    images: [productNecklace, productNecklace, productNecklace],
    carat: "1.0 ct",
    metal: "18K Rose Gold",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "3",
    name: "Étoile Diamond Studs",
    price: 2800,
    description: "Classic diamond stud earrings featuring matched round brilliant diamonds in a four-prong setting. These timeless studs are the perfect everyday luxury accessory.",
    shortDescription: "Matched round brilliant diamond studs",
    category: "Earrings",
    image: productEarrings,
    images: [productEarrings, productEarrings, productEarrings],
    carat: "1.0 ct TW",
    metal: "18K White Gold",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "4",
    name: "Rivière Tennis Bracelet",
    price: 8500,
    description: "A stunning tennis bracelet featuring a continuous line of graduated round brilliant diamonds set in rose gold. Each diamond is hand-selected for exceptional brilliance and fire.",
    shortDescription: "Graduated diamond tennis bracelet",
    category: "Bracelets",
    image: productBracelet,
    images: [productBracelet, productBracelet, productBracelet],
    carat: "5.0 ct TW",
    metal: "18K Rose Gold",
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 56,
  },
  {
    id: "5",
    name: "Aurora Halo Ring",
    price: 6200,
    description: "A magnificent halo engagement ring featuring a 2-carat cushion-cut center diamond surrounded by a delicate halo of smaller diamonds set in platinum.",
    shortDescription: "2ct cushion-cut with diamond halo",
    category: "Rings",
    image: productRing,
    images: [productRing, productRing, productRing],
    carat: "2.0 ct",
    metal: "Platinum",
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 74,
  },
  {
    id: "6",
    name: "Cascade Drop Earrings",
    price: 5100,
    description: "Exquisite drop earrings featuring cascading diamonds that catch the light with every movement. Set in 18K white gold for a cool, contemporary feel.",
    shortDescription: "Diamond cascade drops in white gold",
    category: "Earrings",
    image: productEarrings,
    images: [productEarrings, productEarrings, productEarrings],
    carat: "2.5 ct TW",
    metal: "18K White Gold",
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 45,
  },
];

export const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
