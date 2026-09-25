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
    (typeof post.readTimeMinutes === "number" && Number.isFinite(post.readTimeMinutes)
      ? `${post.readTimeMinutes} min read`
      : "")
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function allocateSectionId(heading: string, usedIds: Set<string>, fallbackIndex: number): string {
  const base = slugify(heading) || `section-${fallbackIndex}`;
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);
  return id;
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
 * Spec: closest tag overlap first, then latest date within that tier.
 * Category is a mild secondary signal only.
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

    const sharedTags = tagLabels(post.tags).filter((label) =>
      currentTags.has(label.toLowerCase()),
    ).length;

    let score = sharedTags * 100;
    if (inferBlogCategory(post) === currentCategory) {
      score += 10;
    }

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
    .map(({ post }) => mapStrapiBlogPostToCard(post))
    .filter((post): post is BlogPost => Boolean(post));
}

/** CMS `GET /blog-posts/:slug/related` — first 3 from the API response order. */
export function mapRelatedBlogPostsFromApi(
  posts: StrapiBlogPost[],
  limit = 3,
): BlogPost[] {
  if (limit <= 0) return [];

  return posts
    .slice(0, limit)
    .map((post) => mapStrapiBlogPostToCard(post))
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

  for (const match of body.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    const url = cleanText(match[1]);
    if (url) urls.push(url);
  }

  return urls;
}

function resolveCoverImage(
  post: StrapiBlogPost,
): { src: string | null; alt: string } {
  const responsive = resolveCoverImageResponsive(post);
  const src = responsive.desktopUrl ?? responsive.mobileUrl;

  return {
    src,
    alt: responsive.alt,
  };
}

function resolveCoverImageResponsive(post: StrapiBlogPost): {
  desktopUrl: string | null;
  mobileUrl: string | null;
  alt: string;
} {
  const cover = post.coverImage;
  const desktopUrl = resolveCmsMediaUrl(cover?.desktopImage) ?? null;
  const mobileUrl = resolveCmsMediaUrl(cover?.mobileImage) ?? null;

  return {
    desktopUrl,
    mobileUrl,
    alt:
      resolveCmsAltText(cover?.desktopImage) ??
      resolveCmsAltText(cover?.mobileImage) ??
      "",
  };
}

function resolveCutoutImage(
  post: StrapiBlogPost,
): { src: string | null; alt: string } {
  const cutout = post.cutoutImage;
  const src =
    resolveCmsMediaUrl(cutout?.desktopImage) ??
    resolveCmsMediaUrl(cutout?.mobileImage) ??
    null;

  return {
    src,
    alt: resolveCmsAltText(cutout?.desktopImage) ?? "",
  };
}

/** Detail banner — CMS `heroImage` only (desktop + mobile); no cover fallback. */
function resolveHeroImage(
  post: StrapiBlogPost,
): { desktopUrl: string | null; mobileUrl: string | null; alt: string } {
  const hero = post.heroImage;
  const desktopUrl = resolveCmsMediaUrl(hero?.desktopImage) ?? null;
  const mobileUrl = resolveCmsMediaUrl(hero?.mobileImage) ?? null;

  return {
    desktopUrl,
    mobileUrl,
    alt:
      resolveCmsAltText(hero?.desktopImage) ??
      resolveCmsAltText(hero?.mobileImage) ??
      "",
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

/** Keep links/bold/italics as HTML for blog body rendering. */
function markdownInlineToHtml(text: string): string {
  const escapeText = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const safeHref = (raw: string): string | null => {
    const href = raw.trim().replace(/^<|>$/g, "");
    if (!href) return null;
    if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
      return href.replace(/"/g, "%22");
    }
    return null;
  };

  // Protect markdown links / images before escaping the rest of the line.
  const tokens: string[] = [];
  const protect = (html: string) => {
    tokens.push(html);
    return `\u0000${tokens.length - 1}\u0000`;
  };

  let working = text
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, (_match, label: string, hrefRaw: string) => {
      const href = safeHref(String(hrefRaw));
      if (!href) return escapeText(String(label));
      return protect(`<a href="${href}">${escapeText(String(label))}</a>`);
    })
    .replace(/\*\*([^*]+)\*\*/g, (_match, value: string) =>
      protect(`<strong>${escapeText(String(value))}</strong>`),
    )
    .replace(/\*([^*]+)\*/g, (_match, value: string) =>
      protect(`<em>${escapeText(String(value))}</em>`),
    )
    .replace(/`([^`]+)`/g, (_match, value: string) =>
      protect(`<code>${escapeText(String(value))}</code>`),
    );

  working = escapeText(working).replace(/\u0000(\d+)\u0000/g, (_match, index: string) => {
    return tokens[Number(index)] ?? "";
  });

  return working;
}

function looksLikeHtml(value: string): boolean {
  return /<\/?(?:p|h[1-6]|ul|ol|li|div|figure|img|strong|em|br|a|span|table|blockquote|section)\b/i.test(
    value,
  );
}

function sanitizeBlogHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /<a\b([^>]*)href\s*=\s*(["'])\s*javascript:[^"']*\2([^>]*)>/gi,
      "<a$1$3>",
    );
}

/**
 * CMS editors often insert empty headings (`<h2>&nbsp;</h2>`). Treating those as
 * real H2 boundaries drops all following content until the next real heading.
 */
function stripEmptyHeadingTags(html: string): string {
  return html.replace(
    /<h([1-6])(?:\s[^>]*)?>\s*(?:&nbsp;|&#160;|&#x0*a0;|<br\s*\/?>|\u00a0|\s)*<\/h\1>/gi,
    "",
  );
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Preserve safe inline markup inside CMS headings (links, emphasis). */
function extractHeadingInnerHtml(h2Tag: string): string | undefined {
  const match = h2Tag.match(/^<h2(?:\s[^>]*)?>([\s\S]*)<\/h2>$/i);
  const inner = match?.[1]?.trim();
  if (!inner || !/<[a-z]/i.test(inner)) {
    return undefined;
  }

  const cleaned = sanitizeBlogHtml(inner)
    // Headings should only keep inline formatting from the CMS.
    .replace(/<\/?(?!a\b|strong\b|b\b|em\b|i\b|span\b|br\b)[a-z0-9-]+\b[^>]*>/gi, "")
    .trim();

  return cleaned || undefined;
}

function appendHtmlToLastSection(sections: BlogDetailSection[], html: string) {
  const previous = sections[sections.length - 1];
  if (!previous) {
    sections.push({
      id: "introduction",
      heading: "",
      blocks: [{ type: "html", html }],
    });
    return;
  }

  const lastBlock = previous.blocks[previous.blocks.length - 1];
  if (lastBlock?.type === "html") {
    lastBlock.html = `${lastBlock.html}${html}`;
    return;
  }

  previous.blocks.push({ type: "html", html });
}

function mapHtmlBodyToDetailSections(html: string): {
  introParagraphs: string[];
  tableOfContents: BlogTableOfContentsItem[];
  sections: BlogDetailSection[];
} {
  const sanitized = stripEmptyHeadingTags(sanitizeBlogHtml(html)).trim();
  if (!sanitized) {
    return { introParagraphs: [], tableOfContents: [], sections: [] };
  }

  const headingRegex = /<h2(?:\s[^>]*)?>[\s\S]*?<\/h2>/gi;
  const headingMatches = [...sanitized.matchAll(headingRegex)];

  if (headingMatches.length === 0) {
    return {
      introParagraphs: [],
      tableOfContents: [],
      sections: [
        {
          id: "article",
          heading: "",
          blocks: [{ type: "html", html: sanitized }],
        },
      ],
    };
  }

  const firstHeadingIndex = headingMatches[0]?.index ?? 0;
  const introHtml = sanitized.slice(0, firstHeadingIndex).trim();

  // Always keep CMS HTML as HTML (links, paragraph gaps, lists). Do not strip
  // intro to plain text — that dropped <a> tags and merged adjacent <p>s.
  const introParagraphs: string[] = [];

  const sections: BlogDetailSection[] = [];
  const tableOfContents: BlogTableOfContentsItem[] = [];
  const usedSectionIds = new Set<string>(["introduction", "article"]);

  if (introHtml) {
    sections.push({
      id: "introduction",
      heading: "",
      blocks: [{ type: "html", html: introHtml }],
    });
  }

  for (let index = 0; index < headingMatches.length; index += 1) {
    const match = headingMatches[index];
    if (!match || match.index == null) continue;

    const heading = stripHtmlToText(match[0] ?? "");
    const contentStart = match.index + match[0].length;
    const contentEnd =
      index + 1 < headingMatches.length
        ? (headingMatches[index + 1]?.index ?? sanitized.length)
        : sanitized.length;
    const sectionHtml = sanitized.slice(contentStart, contentEnd).trim();

    // Empty/whitespace headings must not discard their following body HTML.
    if (!heading) {
      if (sectionHtml) {
        appendHtmlToLastSection(sections, sectionHtml);
      }
      continue;
    }

    const id = allocateSectionId(heading, usedSectionIds, sections.length + 1);
    const headingHtml = extractHeadingInnerHtml(match[0] ?? "");

    if (!sectionHtml) {
      sections.push({
        id,
        heading,
        ...(headingHtml ? { headingHtml } : {}),
        blocks: [],
      });
      tableOfContents.push({ id, label: heading });
      continue;
    }

    sections.push({
      id,
      heading,
      ...(headingHtml ? { headingHtml } : {}),
      blocks: [{ type: "html", html: sectionHtml }],
    });
    tableOfContents.push({ id, label: heading });
  }

  if (sections.length === 0) {
    return {
      introParagraphs: [],
      tableOfContents: [],
      sections: [
        {
          id: "article",
          heading: "",
          blocks: [{ type: "html", html: sanitized }],
        },
      ],
    };
  }

  return { introParagraphs, tableOfContents, sections };
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
      const itemsHtml = bulletLines
        .map((line) => {
          const inline = markdownInlineToHtml(line.replace(/^[-*]\s+/, ""));
          return `<li>${inline}</li>`;
        })
        .join("");
      blocks.push({ type: "html", html: `<ul>${itemsHtml}</ul>` });
      continue;
    }

    if (imageUrls.length > 0) {
      blocks.push({
        type: "image_row",
        images: imageUrls.map((src) => ({ src, alt: "Blog article image" })),
      });
    }

    const plain = stripMarkdownInline(paragraph);
    if (!plain) continue;

    // Preserve links / emphasis as HTML so CMS formatting survives on the UI.
    const hasInlineMarkup = /\[[^\]]+]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`/.test(
      paragraph,
    );
    if (hasInlineMarkup) {
      const htmlLines = lines
        .filter((line) => !/^!\[/.test(line) && !/^\[[^\]]*!\[[^\]]*]\([^)]*\)[^\]]*]\([^)]*\)$/.test(line))
        .map((line) => markdownInlineToHtml(line.replace(/^[-*]\s+/, "")));
      if (htmlLines.length > 0) {
        blocks.push({
          type: "html",
          html: htmlLines.map((line) => `<p>${line}</p>`).join(""),
        });
      }
      continue;
    }

    const labeled = plain.match(/^([^:]{2,60}):\s*(.+)$/);
    if (labeled && plain.length < 220) {
      blocks.push({
        type: "labeled_lines",
        lines: [{ label: `${labeled[1]}: `, text: labeled[2] }],
      });
    } else {
      // Separate lines within a markdown block become separate paragraphs
      // (CMS "line gap" between sentences), not one continuous run-on.
      if (lines.length > 1) {
        blocks.push({
          type: "html",
          html: lines.map((line) => `<p>${markdownInlineToHtml(line)}</p>`).join(""),
        });
      } else {
        blocks.push({ type: "paragraph", text: plain, emphasis: "light" });
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

  // CMS rich text is stored as HTML — render that path instead of treating tags as markdown.
  if (looksLikeHtml(markdown)) {
    return mapHtmlBodyToDetailSections(markdown);
  }

  const parts = markdown.split(/\n(?=##\s+)/);
  const introRaw = parts[0]?.startsWith("## ") ? "" : (parts[0] ?? "");
  const sectionParts = parts[0]?.startsWith("## ") ? parts : parts.slice(1);

  // Prefer HTML blocks for intro so links / paragraph gaps match the CMS.
  const introBlocks = introRaw ? parseMarkdownBlocks(introRaw) : [];
  const introParagraphs: string[] = [];

  const sections: BlogDetailSection[] = [];
  const tableOfContents: BlogTableOfContentsItem[] = [];
  const usedSectionIds = new Set<string>(["introduction", "article"]);

  if (introBlocks.length > 0) {
    sections.push({
      id: "introduction",
      heading: "",
      blocks: introBlocks,
    });
  }

  for (const part of sectionParts) {
    const match = part.match(/^##\s+(.+?)(?:\n|$)([\s\S]*)$/);
    if (!match) continue;

    const heading = stripMarkdownInline(match[1]);
    const blocks = parseMarkdownBlocks(match[2] ?? "");

    // Empty `##` headings (CMS artifacts) — keep body, skip TOC entry.
    if (!heading) {
      if (blocks.length > 0) {
        const previous = sections[sections.length - 1];
        if (previous) {
          previous.blocks.push(...blocks);
        } else {
          sections.push({ id: "introduction", heading: "", blocks });
        }
      }
      continue;
    }

    if (blocks.length === 0) continue;

    const id = allocateSectionId(heading, usedSectionIds, sections.length + 1);
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
): BlogPost | null {
  const slug = cleanText(post.slug);
  const title = cleanText(post.title);
  if (!slug || !title) return null;

  const image = resolveCoverImage(post);

  return {
    id: cleanText(post.documentId) ?? String(post.id ?? slug),
    title,
    date: formatBlogDate(post.publishedDate),
    readTime: formatReadTime(post),
    imageSrc: image.src,
    imageAlt: image.alt,
    // Listing chips/counts use CMS `blog_category` only (no FE inference).
    category: categoryValue(post.blog_category ?? undefined) ?? "",
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

  const hero = resolveHeroImage(post);
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
    authorName: authorName?.replace(/^by\s+/i, "") ?? null,
    publishedDate: cleanText(post.publishedDate) ?? null,
    date: formatBlogDate(post.publishedDate),
    readTime: formatReadTime(post),
    heroImage: {
      desktopUrl: hero.desktopUrl,
      mobileUrl: hero.mobileUrl,
      alt: hero.alt,
    },
    // Excerpt is landing/featured-only — never reuse it on the detail page.
    introParagraphs,
    tableOfContents,
    sections,
    relatedPostIds,
  };
}

export function mapStrapiSeo(seo: StrapiBlogSeo | null | undefined): BlogsPageSeo | null {
  if (!seo) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  const keywords = cleanText(seo.metaKeywords);
  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);

  if (!metaTitle && !metaDescription && !ogImageUrl) return null;

  return {
    ...(metaTitle ? { metaTitle } : {}),
    ...(metaDescription ? { metaDescription } : {}),
    ...(keywords ? { keywords } : {}),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
}

function buildCategoriesFromPosts(
  posts: BlogPost[],
  cmsCategories: StrapiBlogCategory[] | null,
): BlogCategory[] {
  const allChip: BlogCategory = {
    id: "all",
    label: formatCategoryLabel("All", posts.length),
    count: posts.length,
  };

  // Chips from landing `blogCategory`; per-chip count from CMS `count`.
  if (!cmsCategories || cmsCategories.length === 0) {
    return [allChip];
  }

  const mapped = cmsCategories
    .map((category) => {
      const id = categoryValue(category);
      const title = categoryTitle(category);
      if (!id || !title) return null;
      const count =
        typeof category.count === "number" && Number.isFinite(category.count)
          ? Math.max(0, Math.floor(category.count))
          : 0;
      return {
        id,
        label: formatCategoryLabel(title, count),
        count,
      } satisfies BlogCategory;
    })
    .filter((category): category is BlogCategory => Boolean(category));

  // Figma chip order for known ids; any new CMS categories append after.
  const preferredIndex = new Map<string, number>(
    blogsPageContent.categoryOrder.map((id, index) => [id, index]),
  );
  const ordered = mapped
    .map((category, index) => ({ category, index }))
    .sort((a, b) => {
      const aRank = preferredIndex.get(a.category.id) ?? Number.MAX_SAFE_INTEGER;
      const bRank = preferredIndex.get(b.category.id) ?? Number.MAX_SAFE_INTEGER;
      if (aRank !== bRank) return aRank - bRank;
      return a.index - b.index;
    })
    .map(({ category }) => category);

  return [allChip, ...ordered];
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
    excerpt: excerpt ?? "",
    imageSrc: post.imageSrc,
    imageAlt: post.imageAlt,
    backgroundSrc: null,
    backgroundAlt: "",
    readNowLabel: blogsPageContent.featured.readNowLabel,
    href: post.href,
    category: post.category,
    ...overrides,
  };
}

export function mapBlogsPageData(input: {
  posts: StrapiBlogPost[];
  landing: StrapiBlogLandingPage | null;
}): NormalizedBlogsPage {
  const cards = input.posts
    .map((post) => mapStrapiBlogPostToCard(post))
    .filter((post): post is BlogPost => Boolean(post));

  const postsBySlug: Record<string, BlogPost> = {};
  for (const post of cards) {
    const slug = post.href.replace(/^\/blogs\//, "");
    postsBySlug[slug] = post;
  }

  // Chips + counts from landing `blogCategory` (`count` from CMS).
  const landingCategories = Array.isArray(input.landing?.blogCategory)
    ? input.landing.blogCategory
    : null;

  const featuredSection = input.landing?.featuredBlogSection;
  const sectionActive = featuredSection?.isActive !== false;

  /**
   * Featured article is CMS-only.
   * Current schema: `featuredBlogSection.featuredBlog`.
   * Legacy: root `featuredBlog` or `featuredBlogSection.post`.
   * No fallback to the latest listing post — if CMS links nothing, hide the block.
   */
  const featuredCmsPost =
    sectionActive
      ? featuredSection?.featuredBlog ??
        input.landing?.featuredBlog ??
        featuredSection?.post ??
        null
      : null;

  const featuredSlug = cleanText(featuredCmsPost?.slug);
  const featuredMediaPost =
    (featuredSlug
      ? input.posts.find((post) => cleanText(post.slug) === featuredSlug)
      : null) ?? featuredCmsPost;

  const featuredCard = featuredCmsPost
    ? mapStrapiBlogPostToCard(featuredMediaPost ?? featuredCmsPost)
    : null;

  const featuredBackground =
    resolveCmsMediaUrl(featuredSection?.backgroundImage?.desktopImage) ??
    resolveCmsMediaUrl(featuredSection?.backgroundImage?.mobileImage);
  const featuredBackgroundAlt =
    resolveCmsAltText(featuredSection?.backgroundImage?.desktopImage) ?? "";

  const cutout = featuredMediaPost ? resolveCutoutImage(featuredMediaPost) : { src: null, alt: "" };

  const featured = featuredCard
    ? mapFeaturedFromPost(
        featuredCard,
        cleanText(featuredCmsPost?.excerpt) ?? cleanText(featuredSection?.excerpt),
        {
          title: cleanText(featuredSection?.title) ?? featuredCard.title,
          readNowLabel:
            cleanText(featuredSection?.readNowLabel) ??
            blogsPageContent.featured.readNowLabel,
          backgroundSrc: featuredBackground ?? null,
          backgroundAlt: featuredBackgroundAlt,
          // Spec: cutout only — no cover/hero fallback; hide image if CMS has none.
          imageSrc: cutout.src,
          imageAlt: cutout.alt || "",
        },
      )
    : null;

  const heroSection = input.landing?.heroSection;
  const heroActive = heroSection?.isActive !== false;
  const hero = heroActive
    ? {
        title: cleanText(heroSection?.title) ?? blogsPageContent.hero.title,
        image: {
          desktopUrl:
            resolveCmsMediaUrl(heroSection?.backgroundImage?.desktopImage) ??
            null,
          mobileUrl:
            resolveCmsMediaUrl(heroSection?.backgroundImage?.mobileImage) ??
            resolveCmsMediaUrl(heroSection?.backgroundImage?.desktopImage) ??
            null,
          alt:
            resolveCmsAltText(heroSection?.backgroundImage?.desktopImage) ??
            resolveCmsAltText(heroSection?.backgroundImage?.mobileImage) ??
            "",
        },
      }
    : null;

  return {
    hero,
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
        desktopUrl: null,
        mobileUrl: null,
        alt: blogsPageContent.hero.title,
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
