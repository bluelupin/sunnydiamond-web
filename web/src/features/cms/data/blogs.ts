export const blogs = [
  {
    slug: "crafting-a-diamond",
    title: "Crafting a Diamond",
    excerpt: "How each Sunny Diamonds piece moves from concept to polished brilliance.",
    date: "2026-05-18",
  },
  {
    slug: "choosing-the-right-cut",
    title: "Choosing the Right Cut",
    excerpt: "A quick guide to understanding the balance of shape, sparkle, and style.",
    date: "2026-05-18",
  },
  {
    slug: "our-bespoke-process",
    title: "Our Bespoke Process",
    excerpt: "See how a custom idea becomes a finished jewel through collaboration and craft.",
    date: "2026-05-18",
  },
] as const;

export type BlogPost = (typeof blogs)[number];
