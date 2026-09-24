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
  imageSrc: string | null;
  imageAlt: string;
  category: string;
  href: string;
};

export type BlogFeaturedPost = {
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  imageSrc: string | null;
  imageAlt: string;
  backgroundSrc: string | null;
  backgroundAlt?: string;
  readNowLabel: string;
  href: string;
  /** CMS category id — featured chrome is shown on All only. */
  category: string;
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
    }
  | {
      type: "html";
      html: string;
    };

export type BlogDetailSection = {
  id: string;
  heading: string;
  /** CMS heading markup (links/bold). Plain `heading` is used for TOC labels. */
  headingHtml?: string;
  blocks: BlogContentBlock[];
};

export type BlogDetail = {
  slug: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  /** Detail banner — CMS `heroImage` (desktop + mobile). Landing cards use `coverImage`. */
  heroImage: {
    desktopUrl: string | null;
    mobileUrl: string | null;
    alt: string;
  };
  introParagraphs: string[];
  tableOfContents: BlogTableOfContentsItem[];
  sections: BlogDetailSection[];
  relatedPostIds: string[];
};
