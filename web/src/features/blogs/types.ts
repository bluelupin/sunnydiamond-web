/** Static category ids plus CMS `blog-categories` values when available. */
export type BlogCategoryId = string;

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
  category: string;
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

export type BlogTableOfContentsItem = {
  id: string;
  label: string;
};

export type BlogContentBlock =
  | { type: "paragraph"; text: string; emphasis?: "regular" | "light" }
  | {
      type: "labeled_lines";
      lines: Array<{ label: string; text: string }>;
    }
  | {
      type: "bullet_list";
      items: Array<{ lead?: string; text: string }>;
    }
  | {
      type: "image_row";
      images: Array<{ src: string; alt: string }>;
      mobileHeight?: number;
    };

export type BlogDetailSection = {
  id: string;
  heading: string;
  blocks: BlogContentBlock[];
};

export type BlogDetail = {
  slug: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  heroImage: { src: string; alt: string };
  introParagraphs: string[];
  tableOfContents: BlogTableOfContentsItem[];
  sections: BlogDetailSection[];
  relatedPostIds: string[];
};
