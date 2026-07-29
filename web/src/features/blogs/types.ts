export type BlogCategoryId =
  | "all"
  | "bridal"
  | "buying-guides"
  | "occasion"
  | "gifting"
  | "jewellery"
  | "styling";

export type BlogCategory = {
  id: BlogCategoryId;
  label: string;
  count: number;
};

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  readTime: string;
  imageSrc: string;
  imageAlt: string;
  category: Exclude<BlogCategoryId, "all">;
  href: string;
};

export type BlogFeaturedPost = {
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  imageSrc: string;
  imageAlt: string;
  backgroundSrc: string;
  readNowLabel: string;
  href: string;
};
