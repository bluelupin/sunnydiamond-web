import type {
  BlogCategory,
  BlogDetail,
  BlogFeaturedPost,
  BlogPost,
} from "@/features/blogs/types";
import type { StrapiImage } from "@/types/strapiMedia";

export type StrapiBlogSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  ogImage?: StrapiImage;
};

export type StrapiBlogTag = {
  id?: number;
  label?: string | null;
};

export type StrapiBlogCategory = {
  id?: number;
  documentId?: string;
  title?: string | null;
  Title?: string | null;
  value?: string | null;
  Value?: string | null;
};

export type StrapiBlogResponsiveImage = {
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiImage;
  mobileImage?: StrapiImage;
};

export type StrapiBlogPost = {
  id?: number;
  documentId?: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  body?: string | null;
  authorName?: string | null;
  publishedDate?: string | null;
  isFeatured?: boolean | null;
  tags?: StrapiBlogTag[] | null;
  /** Responsive media component: desktopImage / mobileImage */
  heroImage?: StrapiBlogResponsiveImage | null;
  /** Responsive media component: desktopImage / mobileImage */
  coverImage?: StrapiBlogResponsiveImage | null;
  blog_category?: StrapiBlogCategory | null;
  seo?: StrapiBlogSeo | null;
  duration?: string | null;
  readTimeMinutes?: number | null;
  readTimeLabel?: string | null;
};

/** Actual CMS single-type shape for Blog Landing Page. */
export type StrapiBlogLandingPage = {
  heroSection?: {
    title?: string | null;
    backgroundImage?: StrapiBlogResponsiveImage | null;
  } | null;
  featuredBlogSection?: {
    title?: string | null;
    excerpt?: string | null;
    readNowLabel?: string | null;
    backgroundImage?: StrapiBlogResponsiveImage | null;
    post?: StrapiBlogPost | null;
  } | null;
  blogCategory?: StrapiBlogCategory[] | null;
  seo?: StrapiBlogSeo | null;
};

export type BlogsPageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  keywords?: string;
  ogImageUrl?: string;
};

export type NormalizedBlogsPage = {
  hero: {
    title: string;
    image: {
      desktopUrl: string | null;
      mobileUrl: string | null;
      alt: string;
    };
  };
  filterLabel: string;
  loadMore: {
    buttonLabel: string;
  };
  featured: BlogFeaturedPost | null;
  categories: BlogCategory[];
  posts: BlogPost[];
  seo: BlogsPageSeo | null;
  /** Raw CMS posts keyed by slug — used for detail related-post resolution. */
  postsBySlug: Record<string, BlogPost>;
};

export type NormalizedBlogDetailResult = {
  detail: BlogDetail;
  relatedPosts: BlogPost[];
  seo: BlogsPageSeo | null;
};
