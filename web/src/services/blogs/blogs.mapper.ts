import {
  resolveCmsAltText,
  resolveCmsMediaUrl,
} from "@/shared/utils/strapiMedia";
import type {
  BlogCategory,
  BlogContentBlock,
  BlogDetail,
  BlogDetailSection,
  BlogFeaturedPost,
  BlogPost,
  BlogTableOfContentsItem,
} from "@/features/blogs/types";
import { blogsPageContent } from "@/features/blogs/data/content";
import type {
  BlogsPageSeo,
  NormalizedBlogsPage,
  StrapiBlogCategory,
  StrapiBlogLandingPage,
  StrapiBlogPost,
  StrapiBlogSeo,
  StrapiBlogTag,
} from "./blogs.types";

const FALLBACK_CARD_IMAGES = [...blogsPageContent.cardImageFallbacks];

const CATEGORY_RULES: Array<{
  id: string;
  patterns: RegExp;
}> = [
  { id: "bridal", patterns: /\b(bridal|wedding|engagement|thali|bride|lehenga)\b/i },
  { id: "gifting", patterns: /\b(gift|gifting)\b/i },
  { id: "buying-guides", patterns: /\b(guide|price|buying|how to choose|emerald|4\s*cs|carat)\b/i },
  { id: "occasion", patterns: /\b(occasion|onam|festival|celebrate)\b/i },
  { id: "styling", patterns: /\b(styl(?:e|ing)|layer|outfit)\b/i },
  { id: "jewellery", patterns: /\b(jewell?ery|ring|necklace|diamond|earring|bracelet|pendant)\b/i },
];

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function padCount(count: number): string {
  return count < 10 ? `0${count}` : String(count);
}

function formatCategoryLabel(title: string, count: number): string {
  return `${title} (${padCount(count)})`;
}

export function formatBlogDate(value: string | null | undefined): string {
  const raw = cleanText(value);
  if (!raw) return "";

  const date = new Date(raw.includes("T") ? raw : `${raw}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatReadTime(post: StrapiBlogPost): string {
  return (
    cleanText(post.readTimeLabel) ??
    cleanText(post.duration) ??
    (typeof post.readTimeMinutes === "number"
      ? `${post.readTimeMinutes} min read`
      : "5 min read")
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function tagLabels(tags: StrapiBlogTag[] | null | undefined): string[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => cleanText(tag.label))
    .filter((label): label is string => Boolean(label));
}

function categoryValue(category: StrapiBlogCategory | null | undefined): string | undefined {
  return cleanText(category?.value) ?? cleanText(category?.Value);
}

function categoryTitle(category: StrapiBlogCategory | null | undefined): string | undefined {
  return cleanText(category?.title) ?? cleanText(category?.Title);
}

export function inferBlogCategory(post: StrapiBlogPost): string {
  const fromRelation = categoryValue(post.blog_category ?? undefined);
  if (fromRelation) {
    return fromRelation;
  }

  const haystack = [cleanText(post.title), cleanText(post.excerpt), ...tagLabels(post.tags)]
    .filter(Boolean)
    .join(" ");

  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.test(haystack)) {
      return rule.id;
    }
  }

  return "jewellery";
}

/**
 * Prefer same category, then shared tags, then recent posts.
 * `blog_category` relation is used when set; otherwise inferred category.
 */
export function selectRelatedBlogPosts(
  current: StrapiBlogPost,
  allPosts: StrapiBlogPost[],
  limit = 3,
): BlogPost[] {
  const currentSlug = cleanText(current.slug);
  if (!currentSlug || limit <= 0) return [];

  const currentCategory = inferBlogCategory(current);
  const currentTags = new Set(
    tagLabels(current.tags).map((label) => label.toLowerCase()),
  );

  type Ranked = { post: StrapiBlogPost; index: number; score: number };
  const ranked: Ranked[] = [];

  allPosts.forEach((post, index) => {
    const slug = cleanText(post.slug);
    if (!slug || slug === currentSlug) return;

    let score = 0;
    if (inferBlogCategory(post) === currentCategory) {
      score += 100;
    }

    const sharedTags = tagLabels(post.tags).filter((label) =>
      currentTags.has(label.toLowerCase()),
    ).length;
    score += sharedTags * 10;

    // Mild recency preference (list is already date-desc).
    score += Math.max(0, 5 - Math.min(index, 5));

    ranked.push({ post, index, score });
  });

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  return ranked
    .slice(0, limit)
    .map(({ post, index }) => mapStrapiBlogPostToCard(post, index))
    .filter((post): post is BlogPost => Boolean(post));
}

const MARKDOWN_IMAGE_RE =
  /(?:!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\))|(?:\[\s*!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*]\([^)]*\))/g;

export function extractMarkdownImageUrls(markdown: string | null | undefined): string[] {
  const body = cleanText(markdown);
  if (!body) return [];

  const urls: string[] = [];
  for (const match of body.matchAll(MARKDOWN_IMAGE_RE)) {
    const url = cleanText(match[1] ?? match[2]);
    if (url) urls.push(url);
  }
  return urls;
}

function resolvePostImage(
  post: StrapiBlogPost,
  fallbackIndex: number,
): { src: string; alt: string } {
  const mediaUrl =
    resolveCmsMediaUrl(post.coverImage) ??
    resolveCmsMediaUrl(post.heroImage) ??
    extractMarkdownImageUrls(post.body)[0];

  const fallback = FALLBACK_CARD_IMAGES[fallbackIndex % FALLBACK_CARD_IMAGES.length] ?? {
    src: "/images/blogs/card-jewellery.png",
    alt: cleanText(post.title) ?? "Blog post",
  };

  return {
    src: mediaUrl ?? fallback.src,
    alt:
      resolveCmsAltText(post.coverImage) ??
      resolveCmsAltText(post.heroImage) ??
      cleanText(post.title) ??
      fallback.alt,
  };
}

function stripMarkdownInline(text: string): string {
  return text
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMarkdownBlocks(chunk: string): BlogContentBlock[] {
  const blocks: BlogContentBlock[] = [];
  const paragraphs = chunk.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);

  for (const paragraph of paragraphs) {
    const imageUrls = extractMarkdownImageUrls(paragraph);
    if (imageUrls.length > 0 && stripMarkdownInline(paragraph).length === 0) {
      blocks.push({
        type: "image_row",
        images: imageUrls.map((src) => ({ src, alt: "Blog article image" })),
      });
      continue;
    }

    const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
    const bulletLines = lines.filter((line) => /^[-*]\s+/.test(line));
    if (bulletLines.length > 0 && bulletLines.length === lines.length) {
      blocks.push({
        type: "bullet_list",
        items: bulletLines.map((line) => {
          const text = stripMarkdownInline(line.replace(/^[-*]\s+/, ""));
          const labeled = text.match(/^([^:]{2,40}):\s*(.+)$/);
          if (labeled) {
            return { lead: `${labeled[1]}: `, text: labeled[2] };
          }
          return { text };
        }),
      });
      continue;
    }

    if (imageUrls.length > 0) {
      blocks.push({
        type: "image_row",
        images: imageUrls.map((src) => ({ src, alt: "Blog article image" })),
      });
    }

    const text = stripMarkdownInline(paragraph);
    if (text) {
      const labeled = text.match(/^([^:]{2,60}):\s*(.+)$/);
      if (labeled && text.length < 220) {
        blocks.push({
          type: "labeled_lines",
          lines: [{ label: `${labeled[1]}: `, text: labeled[2] }],
        });
      } else {
        blocks.push({ type: "paragraph", text, emphasis: "light" });
      }
    }
  }

  return blocks;
}

export function mapMarkdownBodyToDetailSections(body: string | null | undefined): {
  introParagraphs: string[];
  tableOfContents: BlogTableOfContentsItem[];
  sections: BlogDetailSection[];
} {
  const markdown = cleanText(body);
  if (!markdown) {
    return { introParagraphs: [], tableOfContents: [], sections: [] };
  }

  const parts = markdown.split(/\n(?=##\s+)/);
  const introRaw = parts[0]?.startsWith("## ") ? "" : (parts[0] ?? "");
  const sectionParts = parts[0]?.startsWith("## ") ? parts : parts.slice(1);

  const introParagraphs = introRaw
    .split(/\n{2,}/)
    .map((part) => stripMarkdownInline(part))
    .filter(Boolean)
    .filter((text) => !/^!\[/.test(text))
    .slice(0, 3);

  const sections: BlogDetailSection[] = [];
  const tableOfContents: BlogTableOfContentsItem[] = [];

  for (const part of sectionParts) {
    const match = part.match(/^##\s+(.+?)(?:\n|$)([\s\S]*)$/);
    if (!match) continue;

    const heading = stripMarkdownInline(match[1]);
    if (!heading) continue;

    const id = slugify(heading) || `section-${sections.length + 1}`;
    const blocks = parseMarkdownBlocks(match[2] ?? "");
    if (blocks.length === 0) continue;

    sections.push({ id, heading, blocks });
    tableOfContents.push({ id, label: heading });
  }

  if (sections.length === 0) {
    const blocks = parseMarkdownBlocks(markdown);
    if (blocks.length > 0) {
      sections.push({ id: "article", heading: "Article", blocks });
    }
  }

  return { introParagraphs, tableOfContents, sections };
}

export function mapStrapiBlogPostToCard(
  post: StrapiBlogPost,
  index = 0,
): BlogPost | null {
  const slug = cleanText(post.slug);
  const title = cleanText(post.title);
  if (!slug || !title) return null;

  const image = resolvePostImage(post, index);

  return {
    id: cleanText(post.documentId) ?? String(post.id ?? slug),
    title,
    date: formatBlogDate(post.publishedDate),
    readTime: formatReadTime(post),
    imageSrc: image.src,
    imageAlt: image.alt,
    category: inferBlogCategory(post),
    href: `/blogs/${slug}`,
  };
}

export function mapStrapiBlogPostToDetail(
  post: StrapiBlogPost,
  relatedPostIds: string[] = [],
): BlogDetail | null {
  const slug = cleanText(post.slug);
  const title = cleanText(post.title);
  if (!slug || !title) return null;

  const image = resolvePostImage(post, 0);
  const excerpt = cleanText(post.excerpt);
  const { introParagraphs, tableOfContents, sections } = mapMarkdownBodyToDetailSections(
    post.body,
  );

  const authorName = cleanText(post.authorName);
  const author = authorName
    ? authorName.toLowerCase().startsWith("by ")
      ? authorName
      : `By ${authorName}`
    : "By Sunny Diamonds";

  return {
    slug,
    title,
    author,
    date: formatBlogDate(post.publishedDate),
    readTime: formatReadTime(post),
    heroImage: { src: image.src, alt: image.alt },
    introParagraphs:
      introParagraphs.length > 0 ? introParagraphs : excerpt ? [excerpt] : [],
    tableOfContents,
    sections,
    relatedPostIds,
  };
}

export function mapStrapiSeo(seo: StrapiBlogSeo | null | undefined): BlogsPageSeo | null {
  if (!seo) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  const canonicalUrl = cleanText(seo.canonicalUrl);
  const keywords = cleanText(seo.metaKeywords);
  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  if (!metaTitle && !metaDescription && !canonicalUrl && !ogImageUrl) return null;

  let canonicalPath: string | undefined;
  if (canonicalUrl) {
    try {
      const url = new URL(canonicalUrl);
      canonicalPath = url.pathname.replace(/\/$/, "") || "/blogs";
    } catch {
      canonicalPath = canonicalUrl.startsWith("/")
        ? canonicalUrl.replace(/\/$/, "") || "/blogs"
        : undefined;
    }
  }

  return {
    ...(metaTitle ? { metaTitle } : {}),
    ...(metaDescription ? { metaDescription } : {}),
    ...(canonicalPath ? { canonicalPath } : {}),
    ...(keywords ? { keywords } : {}),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
}

function buildCategoriesFromPosts(
  posts: BlogPost[],
  cmsCategories: StrapiBlogCategory[] | null,
): BlogCategory[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }

  if (cmsCategories && cmsCategories.length > 0) {
    const mapped = cmsCategories
      .map((category) => {
        const id = categoryValue(category);
        const title = categoryTitle(category);
        if (!id || !title) return null;
        const count = counts.get(id) ?? 0;
        return {
          id,
          label: formatCategoryLabel(title, count),
          count,
        } satisfies BlogCategory;
      })
      .filter((category): category is BlogCategory => Boolean(category));

    return [
      {
        id: "all",
        label: formatCategoryLabel("All", posts.length),
        count: posts.length,
      },
      ...mapped,
    ];
  }

  const knownOrder = [...blogsPageContent.categoryOrder];

  const dynamicIds = Array.from(counts.keys()).filter(
    (id) => !(knownOrder as readonly string[]).includes(id),
  );

  const orderedIds = [...knownOrder, ...dynamicIds];

  return [
    {
      id: "all",
      label: formatCategoryLabel("All", posts.length),
      count: posts.length,
    },
    ...orderedIds
      .map((id) => {
        const count = counts.get(id) ?? 0;
        if (count === 0) return null;
        const title =
          blogsPageContent.categoryLabels[id] ??
          id
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
        return {
          id,
          label: formatCategoryLabel(title, count),
          count,
        } satisfies BlogCategory;
      })
      .filter((category): category is BlogCategory => Boolean(category)),
  ];
}

function mapFeaturedFromPost(
  post: BlogPost,
  excerpt: string | undefined,
  overrides?: Partial<BlogFeaturedPost>,
): BlogFeaturedPost {
  return {
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    excerpt:
      excerpt ??
      "Explore expert guidance from Sunny Diamonds on choosing, styling, and caring for diamond jewellery.",
    imageSrc: post.imageSrc,
    imageAlt: post.imageAlt,
    backgroundSrc: blogsPageContent.featured.backgroundSrc,
    readNowLabel: blogsPageContent.featured.readNowLabel,
    href: post.href,
    ...overrides,
  };
}

export function mapBlogsPageData(input: {
  posts: StrapiBlogPost[];
  landing: StrapiBlogLandingPage | null;
  categories: StrapiBlogCategory[] | null;
}): NormalizedBlogsPage {
  const cards = input.posts
    .map((post, index) => mapStrapiBlogPostToCard(post, index))
    .filter((post): post is BlogPost => Boolean(post));

  const postsBySlug: Record<string, BlogPost> = {};
  for (const post of cards) {
    const slug = post.href.replace(/^\/blogs\//, "");
    postsBySlug[slug] = post;
  }

  const landingCategories =
    input.categories ??
    (Array.isArray(input.landing?.blogCategory) ? input.landing.blogCategory : null);

  const featuredSection = input.landing?.featuredBlogSection;
  const featuredCms =
    input.posts.find((post) => post.isFeatured) ??
    featuredSection?.post ??
    input.posts[0];

  const featuredCard = featuredCms
    ? mapStrapiBlogPostToCard(featuredCms, 0)
    : null;

  const featuredBackground =
    resolveCmsMediaUrl(featuredSection?.backgroundImage?.desktopImage) ??
    resolveCmsMediaUrl(featuredSection?.backgroundImage?.mobileImage);

  const featured = featuredCard
    ? mapFeaturedFromPost(
        featuredCard,
        cleanText(featuredCms?.excerpt) ?? cleanText(featuredSection?.excerpt),
        {
          title: cleanText(featuredSection?.title) ?? featuredCard.title,
          readNowLabel:
            cleanText(featuredSection?.readNowLabel) ??
            blogsPageContent.featured.readNowLabel,
          backgroundSrc:
            featuredBackground ?? blogsPageContent.featured.backgroundSrc,
        },
      )
    : null;

  const heroSection = input.landing?.heroSection;
  const heroTitle =
    cleanText(heroSection?.title) ?? blogsPageContent.hero.title;
  const heroDesktop =
    resolveCmsMediaUrl(heroSection?.backgroundImage?.desktopImage) ??
    blogsPageContent.hero.image.desktopUrl;
  const heroMobile =
    resolveCmsMediaUrl(heroSection?.backgroundImage?.mobileImage) ??
    heroDesktop;
  const heroAlt =
    cleanText(heroSection?.backgroundImage?.altText) ??
    resolveCmsAltText(heroSection?.backgroundImage?.desktopImage) ??
    resolveCmsAltText(heroSection?.backgroundImage?.mobileImage) ??
    blogsPageContent.hero.image.alt;

  return {
    hero: {
      title: heroTitle,
      image: {
        desktopUrl: heroDesktop,
        mobileUrl: heroMobile,
        alt: heroAlt,
      },
    },
    filterLabel: blogsPageContent.filterLabel,
    loadMore: {
      buttonLabel: blogsPageContent.loadMore.buttonLabel,
    },
    featured,
    categories: buildCategoriesFromPosts(cards, landingCategories),
    posts: cards,
    seo: mapStrapiSeo(input.landing?.seo),
    postsBySlug,
  };
}

export function mapStaticBlogsPage(): NormalizedBlogsPage {
  return {
    hero: {
      title: blogsPageContent.hero.title,
      image: {
        desktopUrl: blogsPageContent.hero.image.desktopUrl,
        mobileUrl: blogsPageContent.hero.image.mobileUrl,
        alt: blogsPageContent.hero.image.alt,
      },
    },
    filterLabel: blogsPageContent.filterLabel,
    loadMore: {
      buttonLabel: blogsPageContent.loadMore.buttonLabel,
    },
    featured: null,
    categories: [{ id: "all", label: formatCategoryLabel("All", 0), count: 0 }],
    posts: [],
    seo: null,
    postsBySlug: {},
  };
}
