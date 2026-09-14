#!/usr/bin/env python3
"""Add comprehensive Blogs test cases sheet to Sunny Diamonds Test Cases workbook."""

from pathlib import Path

from openpyxl import load_workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

WORKBOOK_PATH = Path(__file__).resolve().parents[1] / "Sunny Diamonds Test Cases .xlsx"
SHEET_NAME = "Blogs"

MODULE = "Blogs"
ROUTES = "/blogs, /blogs/[slug]"
DATA_SOURCE = "Strapi CMS (blogPosts, blogLandingPage, blogCategories)"

PRECONDITIONS = [
    ("PRE-01", "Strapi CMS is reachable with published blog posts"),
    ("PRE-02", "At least 10+ published posts across multiple categories"),
    ("PRE-03", "Blog landing page configured in CMS (hero, optional featured post)"),
    ("PRE-04", "Test on Desktop (>=1280px), Tablet (~768px), Mobile (<=390px)"),
    ("PRE-05", "Browsers: Chrome, Safari, Firefox, Edge (latest)"),
]

TEST_DATA = [
    ("Post A", "Full HTML body, multiple H2s, hero + cover, author, read time, category bridal, tags"),
    ("Post B", "Markdown body with bullets, image row, no hero image"),
    ("Post C", "Minimal post (title + slug only)"),
    ("Post D–L", "10+ posts across categories for load-more testing"),
    ("Landing config", "Hero images (desktop + mobile), featured post, SEO fields"),
    ("Empty category", "Category with 0 posts (or filter yielding none)"),
]

HEADER = (
    "TC ID",
    "Module",
    "Feature Area",
    "Test Scenario",
    "Steps",
    "Expected Result",
    "Priority",
    "Type",
    "Preconditions",
    "Test Data",
    "Status",
    "Actual Result",
    "Notes",
)

# Each case: (id, area, scenario, steps, expected, priority, type, preconds, test_data, notes)
TEST_CASES = [
    # A. Routing & Navigation
    ("BLOG-001", "A. Routing & Navigation", "Route access — blogs listing", "Navigate to /blogs", "Page loads with hero + filter bar + post grid (or empty state if no CMS data)", "P0", "Functional", "PRE-01, PRE-04", "Post D–L", ""),
    ("BLOG-002", "A. Routing & Navigation", "Route access — blog detail", "Navigate to /blogs/{valid-slug}", "Detail page renders: header, hero (if image), article, sidebar, related section", "P0", "Functional", "PRE-01, PRE-04", "Post A", ""),
    ("BLOG-003", "A. Routing & Navigation", "404 handling — invalid slug", "Navigate to /blogs/non-existent-slug-xyz", "Next.js notFound() — site 404 page shown", "P0", "Negative", "PRE-04", "—", ""),
    ("BLOG-004", "A. Routing & Navigation", "Card navigation", "From listing, click image or title on any card", "Navigates to /blogs/{slug}; correct post content loads", "P0", "Functional", "PRE-01, PRE-02", "Post A", ""),
    ("BLOG-005", "A. Routing & Navigation", "Featured CTA — READ NOW", "Click READ NOW in featured section", "Navigates to featured post detail URL", "P0", "Functional", "PRE-03", "Landing config", ""),
    ("BLOG-006", "A. Routing & Navigation", "Related posts navigation", "From detail, click a related card in More to read", "Navigates to that post's detail page", "P1", "Functional", "PRE-02", "Post A, Post D–L", ""),
    ("BLOG-007", "A. Routing & Navigation", "Header treatment", "Visit /blogs and any /blogs/[slug]", "Header uses solid variant per navigation.ts (not overlay hero header)", "P2", "UI", "PRE-04", "—", ""),
    ("BLOG-008", "A. Routing & Navigation", "Footer link", "Click Blogs in footer (if linked)", "Lands on /blogs", "P2", "Functional", "PRE-04", "—", ""),
    ("BLOG-009", "A. Routing & Navigation", "Browser back/forward", "Listing → detail → browser Back", "Returns to listing with prior scroll/filter state where applicable", "P2", "Functional", "PRE-01", "Post A", ""),
    ("BLOG-010", "A. Routing & Navigation", "Deep link — filtered listing", "Open /blogs?category=bridal directly", "Bridal filter applied; only bridal posts shown", "P0", "Functional", "PRE-02", "Post A", ""),
    # B. Listing — Hero
    ("BLOG-011", "B. Listing — Hero Section", "Hero title — CMS", "Load /blogs with CMS hero configured", "H1 shows CMS heroSection.title; fallback: The Diamond Guide", "P0", "UI / CMS", "PRE-03", "Landing config", ""),
    ("BLOG-012", "B. Listing — Hero Section", "Hero image — desktop", "View at >=768px with CMS desktop image", "Desktop hero image visible with dark overlay; title positioned per design", "P1", "Responsive", "PRE-03, PRE-04", "Landing config", ""),
    ("BLOG-013", "B. Listing — Hero Section", "Hero image — mobile", "View at <768px with CMS mobile image", "Mobile-specific image shown (or desktop fallback)", "P1", "Responsive", "PRE-03, PRE-04", "Landing config", ""),
    ("BLOG-014", "B. Listing — Hero Section", "Hero fallback — no images", "CMS returns no hero images", "Hero shows dark background + title only (no broken image)", "P1", "Negative", "PRE-03", "Landing config (no images)", ""),
    ("BLOG-015", "B. Listing — Hero Section", "Hero dimensions", "Inspect hero on mobile and desktop", "Mobile h-[240px], desktop md:h-320; full viewport width", "P2", "UI", "PRE-04", "—", ""),
    ("BLOG-016", "B. Listing — Hero Section", "Hero accessibility", "Inspect hero markup", "aria-labelledby=blogs-hero-title; alt text on images from CMS", "P2", "A11y", "PRE-03", "Landing config", ""),
    # C. Listing — Category Filter
    ("BLOG-017", "C. Listing — Category Filter", "Filter label", "Load listing page", "Filter by: label visible", "P2", "UI", "PRE-01", "—", ""),
    ("BLOG-018", "C. Listing — Category Filter", "All categories chip — default", "Open /blogs (no query param)", "All (NN) chip selected (dark bg, white text)", "P0", "Functional", "PRE-02", "Post D–L", ""),
    ("BLOG-019", "C. Listing — Category Filter", "Category chips — list with counts", "Compare chips vs CMS posts", "Chips show categories with count > 0, formatted Category (0N)", "P0", "Functional", "PRE-02", "Post D–L", ""),
    ("BLOG-020", "C. Listing — Category Filter", "Category order", "Inspect chip order on listing", "Order: Bridal, Buying Guides, Occasion, Gifting, Jewellery, Styling, Education; then dynamic CMS categories", "P2", "Functional", "PRE-02", "Post D–L", ""),
    ("BLOG-021", "C. Listing — Category Filter", "Select category", "Click Bridal chip", "URL updates to /blogs?category=bridal; posts filter to bridal only; scroll position preserved (scroll: false)", "P0", "Functional", "PRE-02", "Post A", ""),
    ("BLOG-022", "C. Listing — Category Filter", "Deselect to All", "Click All chip", "URL becomes /blogs (no query param); all posts shown", "P0", "Functional", "PRE-02", "Post D–L", ""),
    ("BLOG-023", "C. Listing — Category Filter", "Invalid category URL", "Open /blogs?category=invalid-cat", "Posts show all (parsed as all); no chip may appear selected (known UI gap)", "P1", "Negative", "PRE-04", "—", "Known gap — see BLOG-136"),
    ("BLOG-024", "C. Listing — Category Filter", "Category inference", "Inspect post without blog_category relation in CMS", "Category inferred from title/excerpt/tags via CATEGORY_RULES; default fallback jewellery", "P2", "Data", "PRE-01", "Post without category", ""),
    ("BLOG-025", "C. Listing — Category Filter", "Horizontal scroll — mobile", "View filter bar on mobile (<=390px)", "Chips scroll horizontally; scrollbar hidden", "P2", "Responsive", "PRE-04", "—", ""),
    ("BLOG-026", "C. Listing — Category Filter", "Chip accessibility", "Tab to category buttons; inspect ARIA", "aria-pressed reflects selection; role=list / listitem on container/items", "P2", "A11y", "PRE-04", "—", ""),
    ("BLOG-027", "C. Listing — Category Filter", "Filter + load more reset", "Load more to 12 posts → switch category", "Visible limit resets to 9 (BLOGS_INITIAL_VISIBLE)", "P0", "Functional", "PRE-02", "Post D–L", ""),
    # D. Listing — Post Grid & Cards
    ("BLOG-028", "D. Listing — Post Grid & Cards", "Grid layout — first row", "Load listing with >=3 posts", "First 3 cards render in top grid section (before featured)", "P0", "Layout", "PRE-02", "Post D–L", ""),
    ("BLOG-029", "D. Listing — Post Grid & Cards", "Grid layout — remaining rows", "Load listing with >=4 posts", "Posts 4+ appear in section below featured block", "P0", "Layout", "PRE-02", "Post D–L", ""),
    ("BLOG-030", "D. Listing — Post Grid & Cards", "Card image — cover", "Inspect card with CMS cover image", "Image fills card area; correct alt text", "P0", "UI", "PRE-01", "Post A", ""),
    ("BLOG-031", "D. Listing — Post Grid & Cards", "Card image — fallback", "View card for post without cover/hero image", "Card renders with gray placeholder (bg-gray300), no broken image", "P1", "Negative", "PRE-01", "Post C", ""),
    ("BLOG-032", "D. Listing — Post Grid & Cards", "Card title", "View post with long title", "Title line-clamped to 2 lines; clickable link to detail", "P1", "UI", "PRE-01", "Post A", ""),
    ("BLOG-033", "D. Listing — Post Grid & Cards", "Card metadata — date", "Inspect card date", "Date formatted en-GB (e.g. 11 Sep 2026) from publishedDate", "P1", "Data", "PRE-01", "Post A", ""),
    ("BLOG-034", "D. Listing — Post Grid & Cards", "Card metadata — read time", "Inspect card with and without read time", "Shows read time with dot separator; hidden if empty", "P1", "UI", "PRE-01", "Post A, Post C", ""),
    ("BLOG-035", "D. Listing — Post Grid & Cards", "Sort order", "Compare listing order vs CMS publishedDate", "Posts sorted publishedDate:desc (newest first)", "P0", "Data", "PRE-02", "Post D–L", ""),
    ("BLOG-036", "D. Listing — Post Grid & Cards", "Responsive grid", "Resize 390px → 768px → 1280px", "Mobile: stacked cards; desktop: 3-column rows", "P1", "Responsive", "PRE-04", "Post D–L", ""),
    ("BLOG-037", "D. Listing — Post Grid & Cards", "Image sizes — performance", "Inspect Next/Image sizes attribute on card", "Card images use (max-width: 768px) 100vw, 33vw", "P3", "Performance", "PRE-04", "Post A", ""),
    # E. Listing — Featured Section
    ("BLOG-038", "E. Listing — Featured Section", "Featured visibility — CMS configured", "Landing has active featured post", "Featured section appears between first row and remaining grid", "P0", "Functional", "PRE-03", "Landing config", ""),
    ("BLOG-039", "E. Listing — Featured Section", "Featured hidden — not configured", "Landing has no featuredBlog / section inactive", "Featured section not rendered", "P1", "Functional", "PRE-03", "Landing config (no featured)", ""),
    ("BLOG-040", "E. Listing — Featured Section", "Featured content", "Inspect featured block", "Shows CMS section title (or post title), excerpt, date, read time", "P1", "UI / CMS", "PRE-03", "Landing config", ""),
    ("BLOG-041", "E. Listing — Featured Section", "Featured image", "Post with cover image in featured", "Responsive image on right (desktop) / below (mobile)", "P1", "UI", "PRE-03", "Landing config", ""),
    ("BLOG-042", "E. Listing — Featured Section", "Featured background", "CMS background image set on featured section", "Decorative background image with opacity", "P2", "UI", "PRE-03", "Landing config", ""),
    ("BLOG-043", "E. Listing — Featured Section", "Featured + filter interaction", "Apply category filter with featured visible", "Featured section still shows (not filtered out — current behavior)", "P2", "Functional", "PRE-02, PRE-03", "Landing config", "Design question — see BLOG-137"),
    ("BLOG-044", "E. Listing — Featured Section", "READ NOW CTA — a11y", "Tab to READ NOW link", "Underline hover to magenta; focus ring visible", "P2", "A11y", "PRE-04", "Landing config", ""),
    # F. Listing — Load More
    ("BLOG-045", "F. Listing — Load More", "Initial visible count", "Listing with >=10 posts, no filter", "Shows first 9 posts total (3 above featured + 6 below)", "P0", "Functional", "PRE-02", "Post D–L", "BLOGS_INITIAL_VISIBLE = 9"),
    ("BLOG-046", "F. Listing — Load More", "Load more button visibility", "Listing with >9 filtered posts", "LOAD MORE button visible with progress 9 out of N Blogs", "P0", "Functional", "PRE-02", "Post D–L", ""),
    ("BLOG-047", "F. Listing — Load More", "Load more action", "Click LOAD MORE once", "Reveals 3 more posts (limit becomes 12)", "P0", "Functional", "PRE-02", "Post D–L", "BLOGS_LOAD_MORE_STEP = 3"),
    ("BLOG-048", "F. Listing — Load More", "Progress bar", "Click LOAD MORE repeatedly", "Progress bar width updates; count text updates", "P2", "UI", "PRE-02", "Post D–L", ""),
    ("BLOG-049", "F. Listing — Load More", "Load more end state", "Click until all posts visible", "Button disappears when limit >= total; count shows N out of N", "P1", "Functional", "PRE-02", "Post D–L", ""),
    ("BLOG-050", "F. Listing — Load More", "Load more hidden — <=9 posts", "Filter/category with <=9 posts", "No load more footer rendered", "P1", "Functional", "PRE-02", "Post D–L", ""),
    ("BLOG-051", "F. Listing — Load More", "Client-only pagination", "Click load more; check URL", "URL unchanged; no ?limit= param (?limit= stripped on SSR redirect)", "P2", "Functional", "PRE-02", "Post D–L", ""),
    # G. Listing — Empty & Error States
    ("BLOG-052", "G. Listing — Empty & Error States", "Empty filter", "Select category with 0 posts", "Message: No blogs match this filter yet.", "P0", "Functional", "PRE-02", "Empty category", ""),
    ("BLOG-053", "G. Listing — Empty & Error States", "Empty CMS", "CMS returns 0 posts", "Static fallback page: hero title only, All (00), no cards, no featured", "P1", "Negative", "PRE-01", "—", "mapStaticBlogsPage() fallback"),
    ("BLOG-054", "G. Listing — Empty & Error States", "CMS API failure", "Block/mock Strapi API on listing", "Page still renders static empty shell; no user-facing error/retry UI (known gap)", "P1", "Negative", "PRE-04", "—", "Known gap — see BLOG-134"),
    ("BLOG-055", "G. Listing — Empty & Error States", "Partial CMS failure", "Mock landing 404, posts succeed", "Posts still render; hero uses fallback title; featured may be null", "P2", "Negative", "PRE-01", "Post D–L", ""),
    # H. Listing — SEO & Metadata
    ("BLOG-056", "H. Listing — SEO & Metadata", "Page title", "View /blogs page source/meta", "Title from CMS seo.metaTitle or footer fallback Blogs", "P0", "SEO", "PRE-03", "Landing config", ""),
    ("BLOG-057", "H. Listing — SEO & Metadata", "Meta description", "Inspect meta description tag", "From CMS seo.metaDescription or footer fallback", "P1", "SEO", "PRE-03", "Landing config", ""),
    ("BLOG-058", "H. Listing — SEO & Metadata", "Canonical URL", "Inspect link rel=canonical", "/blogs (or CMS canonical path)", "P1", "SEO", "PRE-03", "Landing config", ""),
    ("BLOG-059", "H. Listing — SEO & Metadata", "OG image", "CMS og image set; inspect social meta", "OG image meta populated", "P2", "SEO", "PRE-03", "Landing config", ""),
    ("BLOG-060", "H. Listing — SEO & Metadata", "Filtered noindex", "View /blogs?category=bridal meta robots", "noIndex: true — filtered URLs not indexed", "P0", "SEO", "PRE-02", "Post A", ""),
    ("BLOG-061", "H. Listing — SEO & Metadata", "Sitemap — listing", "Open /sitemap.xml", "/blogs present with weekly frequency, priority 0.6", "P1", "SEO", "PRE-01", "—", ""),
    ("BLOG-062", "H. Listing — SEO & Metadata", "ISR revalidation", "Publish new post in CMS; wait <=5 min", "New post appears without redeploy (revalidate = 300)", "P2", "Performance", "PRE-01", "New CMS post", ""),
    # I. Detail — Header & Hero
    ("BLOG-063", "I. Detail — Header & Hero", "Page title H1", "Open detail page", "H1 shows post title; responsive font sizes", "P0", "UI", "PRE-01", "Post A", ""),
    ("BLOG-064", "I. Detail — Header & Hero", "Author display", "Post with authorName in CMS", "Shows By {authorName}; without author: By Sunny Diamonds", "P1", "Data", "PRE-01", "Post A", ""),
    ("BLOG-065", "I. Detail — Header & Hero", "Author prefix", "CMS author = By Jane", "No double By By prefix", "P2", "Data", "PRE-01", "Post with By prefix", ""),
    ("BLOG-066", "I. Detail — Header & Hero", "Date and read time", "Inspect header metadata row", "Date (en-GB) + optional read time with dot separator", "P1", "UI", "PRE-01", "Post A", ""),
    ("BLOG-067", "I. Detail — Header & Hero", "Hero image", "Post with hero image", "Full-width hero image below header", "P0", "UI", "PRE-01", "Post A", ""),
    ("BLOG-068", "I. Detail — Header & Hero", "Hero hidden", "Post without hero image", "Hero block not rendered", "P1", "Negative", "PRE-01", "Post B", ""),
    ("BLOG-069", "I. Detail — Header & Hero", "Excerpt not on detail", "Compare listing card vs detail for same post", "Excerpt used on listing/featured only; not shown on detail page", "P2", "Functional", "PRE-01", "Post A", ""),
    # J. Detail — Article Content
    ("BLOG-070", "J. Detail — Article Content", "HTML body", "Post with HTML body in CMS", "Renders via dangerouslySetInnerHTML with sanitized styles", "P0", "Functional", "PRE-01", "Post A", ""),
    ("BLOG-071", "J. Detail — Article Content", "Markdown body", "Post with markdown body in CMS", "Parsed into paragraphs, lists, labeled lines, image rows", "P0", "Functional", "PRE-01", "Post B", ""),
    ("BLOG-072", "J. Detail — Article Content", "H2 sections — TOC source", "Post with multiple H2 headings", "Each H2 becomes section with unique id; TOC populated", "P0", "Functional", "PRE-01", "Post A", ""),
    ("BLOG-073", "J. Detail — Article Content", "Intro HTML before first H2", "HTML content before first heading", "Rendered in introduction section (links/formatting preserved)", "P1", "Functional", "PRE-01", "Post A", ""),
    ("BLOG-074", "J. Detail — Article Content", "Empty headings", "CMS has empty H2 tag", "Body merged into previous section; no orphan TOC entry", "P2", "Edge", "PRE-01", "Post with empty H2", ""),
    ("BLOG-075", "J. Detail — Article Content", "Duplicate headings", "Two identical H2 headings in body", "Second gets suffixed id (e.g. heading-2)", "P2", "Edge", "PRE-01", "Post with duplicate H2", ""),
    ("BLOG-076", "J. Detail — Article Content", "Paragraph blocks", "Markdown regular + emphasis paragraphs", "Correct font weight (regular vs light)", "P2", "UI", "PRE-01", "Post B", ""),
    ("BLOG-077", "J. Detail — Article Content", "Bullet lists", "Markdown bullets with lead text", "Bullets render with disc; optional bold lead", "P2", "UI", "PRE-01", "Post B", ""),
    ("BLOG-078", "J. Detail — Article Content", "Image row", "Markdown image row block", "Side-by-side images at 226px mobile / 496px desktop", "P1", "UI", "PRE-01, PRE-04", "Post B", ""),
    ("BLOG-079", "J. Detail — Article Content", "Section scroll margin", "Click TOC item to scroll", "Section scrolls with scroll-mt-28 (header clearance)", "P1", "Functional", "PRE-01, PRE-04", "Post A", ""),
    ("BLOG-080", "J. Detail — Article Content", "No body content", "Post with empty/null body", "Page renders header/hero; article area minimal/empty", "P2", "Negative", "PRE-01", "Post C", ""),
    # K. Detail — Sidebar
    ("BLOG-081", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "Sidebar placement — mobile", "View detail < desktop breakpoint", "Sidebar appears above article (not sticky)", "P0", "Responsive", "PRE-04", "Post A", ""),
    ("BLOG-082", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "Sidebar placement — desktop", "View detail >= desktop breakpoint", "Sticky sidebar on right (top-28); duplicate hidden on mobile", "P0", "Responsive", "PRE-04", "Post A", ""),
    ("BLOG-083", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "TOC list", "Post with H2 sections", "TOC lists all section labels", "P0", "Functional", "PRE-01", "Post A", ""),
    ("BLOG-084", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "TOC click", "Click TOC item", "Smooth scroll to section; clicked item becomes active", "P0", "Functional", "PRE-01", "Post A", ""),
    ("BLOG-085", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "Scroll spy", "Scroll through article manually", "Active TOC item updates via IntersectionObserver; desktop shows black indicator bar", "P1", "Functional", "PRE-01, PRE-04", "Post A", ""),
    ("BLOG-086", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "TOC empty", "Post without H2 sections", "TOC nav hidden; LISTEN/SHARE still visible", "P1", "Edge", "PRE-01", "Post C", ""),
    ("BLOG-087", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "LISTEN — supported", "Click LISTEN in Chrome/Safari", "Browser reads article text; button shows STOP; aria-pressed=true", "P1", "Functional", "PRE-05", "Post A", ""),
    ("BLOG-088", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "LISTEN — stop", "Click STOP while speaking", "Speech stops; button returns to LISTEN", "P1", "Functional", "PRE-05", "Post A", ""),
    ("BLOG-089", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "LISTEN — unsupported", "Test in browser without speechSynthesis", "LISTEN disabled (opacity 50%, not clickable)", "P2", "Negative", "PRE-05", "—", ""),
    ("BLOG-090", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "LISTEN — empty text", "Post with minimal/empty body", "LISTEN disabled when speechText is empty", "P2", "Edge", "PRE-01", "Post C", ""),
    ("BLOG-091", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "SHARE — Web Share API", "Click SHARE on mobile Chrome/Safari", "Native share sheet opens with title + URL", "P1", "Functional", "PRE-05", "Post A", ""),
    ("BLOG-092", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "SHARE — clipboard fallback", "Click SHARE on desktop / no share API", "Current URL copied to clipboard (silent fallback)", "P1", "Functional", "PRE-05", "Post A", ""),
    ("BLOG-093", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "SHARE dismiss", "Open share sheet → cancel", "No error; page stable", "P2", "Negative", "PRE-05", "Post A", ""),
    ("BLOG-094", "K. Detail — Sidebar (TOC, LISTEN, SHARE)", "Sidebar accessibility", "Inspect sidebar landmark and labels", "aria-label=Blog navigation; LISTEN has descriptive aria-label", "P2", "A11y", "PRE-04", "Post A", ""),
    # L. Detail — Related Posts
    ("BLOG-095", "L. Detail — Related Posts", "Section visibility", "Open detail with >=3 other posts in CMS", "More to read section with up to 3 cards", "P0", "Functional", "PRE-02", "Post A, Post D–L", ""),
    ("BLOG-096", "L. Detail — Related Posts", "Section hidden", "Only 1 post in CMS", "More to read section not rendered", "P1", "Edge", "PRE-01", "Post C only", ""),
    ("BLOG-097", "L. Detail — Related Posts", "Related ranking", "Compare related posts vs category/tags", "Prefers same category (+100), then shared tags (+10 each), then recency", "P2", "Data", "PRE-02", "Post A, Post D–L", ""),
    ("BLOG-098", "L. Detail — Related Posts", "Current post excluded", "Inspect related cards on detail", "Current post never appears in related list", "P0", "Functional", "PRE-02", "Post A", ""),
    ("BLOG-099", "L. Detail — Related Posts", "Layout — mobile", "View More to read on mobile", "Cards scroll horizontally (horizontalScrollbar)", "P1", "Responsive", "PRE-04", "Post D–L", ""),
    ("BLOG-100", "L. Detail — Related Posts", "Layout — desktop", "View More to read on desktop", "3-column grid layout", "P1", "Responsive", "PRE-04", "Post D–L", ""),
    # M. Detail — SEO
    ("BLOG-101", "M. Detail — SEO, Sitemap & 404", "Detail meta title", "Inspect detail page meta", "seo.metaTitle or post title", "P0", "SEO", "PRE-01", "Post A", ""),
    ("BLOG-102", "M. Detail — SEO, Sitemap & 404", "Detail meta description", "Inspect meta description", "seo.metaDescription or first intro paragraph or title", "P1", "SEO", "PRE-01", "Post A", ""),
    ("BLOG-103", "M. Detail — SEO, Sitemap & 404", "Detail canonical", "Inspect canonical link", "/blogs/{slug} or CMS canonical path", "P1", "SEO", "PRE-01", "Post A", ""),
    ("BLOG-104", "M. Detail — SEO, Sitemap & 404", "Detail keywords", "CMS keywords set", "Keywords meta populated", "P3", "SEO", "PRE-01", "Post A", ""),
    ("BLOG-105", "M. Detail — SEO, Sitemap & 404", "Sitemap — posts", "Check /sitemap.xml", "Each blog slug at /blogs/{slug}, priority 0.55", "P1", "SEO", "PRE-01", "Post D–L", ""),
    ("BLOG-106", "M. Detail — SEO, Sitemap & 404", "Static params", "Run production build", "generateStaticParams includes CMS slugs + any static slugs", "P2", "Build", "PRE-01", "Post D–L", ""),
    ("BLOG-107", "M. Detail — SEO, Sitemap & 404", "404 metadata", "Request invalid slug (before 404)", "Fallback metadata title Blog still set", "P3", "SEO", "PRE-04", "—", ""),
    # N. API / Data Layer
    ("BLOG-108", "N. API / Data Layer (Strapi)", "Posts fetch", "Verify network call on listing load", "blogPosts with populate cover/hero/tags/category, pageSize 100, sort desc", "P1", "API", "PRE-01", "—", ""),
    ("BLOG-109", "N. API / Data Layer (Strapi)", "Landing fetch", "Verify landing page network call", "Targeted populate query (not populate=*)", "P2", "API", "PRE-03", "Landing config", ""),
    ("BLOG-110", "N. API / Data Layer (Strapi)", "Detail fetch by slug", "Open detail page; inspect network", "filters[slug][$eq]={slug}&populate=*", "P1", "API", "PRE-01", "Post A", ""),
    ("BLOG-111", "N. API / Data Layer (Strapi)", "Soft fetch 404 — landing", "Landing returns 404", "Listing still works with post data; no crash", "P2", "API", "PRE-01", "Post D–L", ""),
    ("BLOG-112", "N. API / Data Layer (Strapi)", "Image resolution", "Inspect mapped image URLs", "Cover/hero resolve desktop then mobile fallback", "P1", "Data", "PRE-01", "Post A", ""),
    ("BLOG-113", "N. API / Data Layer (Strapi)", "Slug validation", "CMS post without slug/title", "Post excluded from cards and detail mapping", "P2", "Data", "PRE-01", "Invalid CMS post", ""),
    ("BLOG-114", "N. API / Data Layer (Strapi)", "Cache behavior", "Multiple calls same request in SSR", "getBlogsPageData / getBlogDetailBySlug deduped per request (React cache)", "P3", "Performance", "PRE-01", "—", ""),
    # O. Accessibility
    ("BLOG-115", "O. Accessibility & Keyboard", "Keyboard — category filter", "Tab + Enter on category chips", "Category changes; focus visible", "P1", "A11y", "PRE-04", "Post D–L", ""),
    ("BLOG-116", "O. Accessibility & Keyboard", "Keyboard — load more", "Tab + Enter on LOAD MORE", "Loads more posts", "P2", "A11y", "PRE-02", "Post D–L", ""),
    ("BLOG-117", "O. Accessibility & Keyboard", "Keyboard — TOC", "Tab + Enter on TOC item", "Scrolls to section", "P2", "A11y", "PRE-04", "Post A", ""),
    ("BLOG-118", "O. Accessibility & Keyboard", "Heading hierarchy", "Run axe/Lighthouse on detail", "Single H1; section H2s in article", "P1", "A11y", "PRE-04", "Post A", ""),
    ("BLOG-119", "O. Accessibility & Keyboard", "Image alt text", "Inspect all images on listing and detail", "Meaningful alt from CMS or empty decorative handling", "P1", "A11y", "PRE-01", "Post A, Post B", ""),
    ("BLOG-120", "O. Accessibility & Keyboard", "Focus states", "Tab through interactive elements", "Visible focus rings on READ NOW, LOAD MORE, LISTEN, SHARE", "P2", "A11y", "PRE-04", "—", ""),
    # P. Performance
    ("BLOG-121", "P. Performance & Resilience", "Hero priority image", "Check LCP on listing and detail", "Hero images use priority loading", "P2", "Performance", "PRE-04", "Post A", ""),
    ("BLOG-122", "P. Performance & Resilience", "Suspense fallback", "Hard refresh listing page", "Brief Suspense fallback div before client filter hydrates", "P3", "Performance", "PRE-04", "—", ""),
    ("BLOG-123", "P. Performance & Resilience", "Large catalog — 100 posts", "CMS with 100 posts", "All fetched server-side; client paginates 9+3; no crash", "P2", "Performance", "PRE-02", "Post D–L", ""),
    ("BLOG-124", "P. Performance & Resilience", "TTS cleanup", "Start LISTEN → navigate away", "Speech cancelled on unmount (no orphan audio)", "P2", "Functional", "PRE-05", "Post A", ""),
    ("BLOG-125", "P. Performance & Resilience", "Share clipboard denied", "Click SHARE with clipboard blocked", "Silent failure; no page crash", "P3", "Negative", "PRE-05", "Post A", ""),
    # Q. Cross-Browser
    ("BLOG-126", "Q. Cross-Browser & Device", "Chrome desktop — full flow", "Listing → filter → detail → share", "All features work", "P0", "Cross-browser", "PRE-04, PRE-05", "Post D–L", ""),
    ("BLOG-127", "Q. Cross-Browser & Device", "Safari iOS — mobile flow", "Listing scroll, filter, LISTEN, SHARE", "Layout correct; native share on iOS", "P0", "Cross-browser", "PRE-04, PRE-05", "Post A", ""),
    ("BLOG-128", "Q. Cross-Browser & Device", "Firefox — TTS + layout", "Detail LISTEN + TOC", "TTS works or gracefully disabled", "P1", "Cross-browser", "PRE-05", "Post A", ""),
    ("BLOG-129", "Q. Cross-Browser & Device", "Edge — listing interactions", "Load more + filter on Edge", "Matches Chrome behavior", "P2", "Cross-browser", "PRE-05", "Post D–L", ""),
    ("BLOG-130", "Q. Cross-Browser & Device", "Tablet landscape", "iPad landscape viewport", "3-column grid; desktop sidebar on detail if >= desktop breakpoint", "P2", "Responsive", "PRE-04", "Post D–L", ""),
    # R. Known Gaps
    ("BLOG-131", "R. Known Gaps / Not Implemented", "Blog search", "Search for keyword on /blogs", "Not implemented — N/A", "P3", "Gap", "—", "—", "Feature not built"),
    ("BLOG-132", "R. Known Gaps / Not Implemented", "Breadcrumbs", "Check detail page for breadcrumbs", "Not implemented — N/A", "P3", "Gap", "—", "—", "Feature not built"),
    ("BLOG-133", "R. Known Gaps / Not Implemented", "Tags UI", "Check tag display on card/detail", "Tags used internally for related posts only; no tag UI", "P3", "Gap", "PRE-01", "Post A", "Feature not built"),
    ("BLOG-134", "R. Known Gaps / Not Implemented", "Error UI on CMS failure", "Strapi failure on listing load", "Empty static page; no retry message", "P1", "Gap", "PRE-04", "—", "Known gap"),
    ("BLOG-135", "R. Known Gaps / Not Implemented", "Loading skeleton", "Route transition to /blogs", "No dedicated loading.tsx under blogs routes", "P3", "Gap", "PRE-04", "—", "Feature not built"),
    ("BLOG-136", "R. Known Gaps / Not Implemented", "Invalid category chip state", "Open /blogs?category=foo", "Posts show all but no chip highlighted", "P2", "Bug / Gap", "PRE-04", "—", "Known gap"),
    ("BLOG-137", "R. Known Gaps / Not Implemented", "Featured respects filter", "Filter to category without featured post", "Featured still shows global featured post", "P2", "Design Gap", "PRE-02, PRE-03", "Landing config", "Design decision pending"),
]

KNOWN_GAPS = [
    "Blog search — not implemented",
    "Breadcrumbs — not implemented",
    "Tag chips on cards/detail — not implemented",
    "Dedicated loading.tsx / error.tsx under /blogs — not implemented",
    "User-visible API error/retry UI on listing failure — not implemented",
    "Server-side pagination — all posts fetched up to 100; client paginates 9+3",
]

COLUMN_WIDTHS = {
    "A": 12,
    "B": 14,
    "C": 28,
    "D": 32,
    "E": 40,
    "F": 50,
    "G": 10,
    "H": 14,
    "I": 22,
    "J": 22,
    "K": 10,
    "L": 30,
    "M": 30,
}


def style_header_row(ws, row: int, col_count: int) -> None:
    fill = PatternFill("solid", fgColor="1F2937")
    font = Font(bold=True, color="FFFFFF")
    for col in range(1, col_count + 1):
        cell = ws.cell(row=row, column=col)
        cell.fill = fill
        cell.font = font
        cell.alignment = Alignment(vertical="center", wrap_text=True)


def style_section_title(ws, row: int, title: str) -> None:
    cell = ws.cell(row=row, column=1, value=title)
    cell.font = Font(bold=True, size=12)
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=6)


def main() -> None:
    wb = load_workbook(WORKBOOK_PATH)
    if SHEET_NAME in wb.sheetnames:
        del wb[SHEET_NAME]
    ws = wb.create_sheet(SHEET_NAME)

    row = 1
    style_section_title(ws, row, "BLOGS MODULE — TEST CASES")
    row += 1
    ws.cell(row=row, column=1, value="Module:")
    ws.cell(row=row, column=2, value=MODULE)
    ws.cell(row=row, column=3, value="Routes:")
    ws.cell(row=row, column=4, value=ROUTES)
    row += 1
    ws.cell(row=row, column=1, value="Data Source:")
    ws.cell(row=row, column=2, value=DATA_SOURCE)
    ws.cell(row=row, column=3, value="ISR:")
    ws.cell(row=row, column=4, value="revalidate = 300 (5 min)")
    row += 1
    ws.cell(row=row, column=1, value="Pagination:")
    ws.cell(row=row, column=2, value="BLOGS_INITIAL_VISIBLE = 9, BLOGS_LOAD_MORE_STEP = 3")
    row += 2

    style_section_title(ws, row, "GLOBAL PRECONDITIONS")
    row += 1
    ws.cell(row=row, column=1, value="ID")
    ws.cell(row=row, column=2, value="Description")
    style_header_row(ws, row, 2)
    row += 1
    for pre_id, desc in PRECONDITIONS:
        ws.cell(row=row, column=1, value=pre_id)
        ws.cell(row=row, column=2, value=desc)
        row += 1
    row += 1

    style_section_title(ws, row, "TEST DATA RECOMMENDATIONS")
    row += 1
    ws.cell(row=row, column=1, value="Dataset")
    ws.cell(row=row, column=2, value="Purpose")
    style_header_row(ws, row, 2)
    row += 1
    for dataset, purpose in TEST_DATA:
        ws.cell(row=row, column=1, value=dataset)
        ws.cell(row=row, column=2, value=purpose)
        row += 1
    row += 1

    style_section_title(ws, row, "KNOWN GAPS (OUT OF SCOPE)")
    row += 1
    for gap in KNOWN_GAPS:
        ws.cell(row=row, column=1, value=f"• {gap}")
        row += 1
    row += 1

    style_section_title(ws, row, "TEST CASES")
    row += 1
    header_row = row
    for col, value in enumerate(HEADER, start=1):
        ws.cell(row=header_row, column=col, value=value)
    style_header_row(ws, header_row, len(HEADER))
    row += 1

    wrap = Alignment(vertical="top", wrap_text=True)
    for case in TEST_CASES:
        tc_id, area, scenario, steps, expected, priority, typ, preconds, test_data, notes = case
        values = (
            tc_id,
            MODULE,
            area,
            scenario,
            steps,
            expected,
            priority,
            typ,
            preconds,
            test_data,
            "",  # Status
            "",  # Actual Result
            notes,
        )
        for col, value in enumerate(values, start=1):
            cell = ws.cell(row=row, column=col, value=value)
            cell.alignment = wrap
        row += 1

    for col_letter, width in COLUMN_WIDTHS.items():
        ws.column_dimensions[col_letter].width = width

    ws.freeze_panes = f"A{header_row + 1}"

    wb.save(WORKBOOK_PATH)
    print(f"Updated '{SHEET_NAME}' with {len(TEST_CASES)} comprehensive test cases")
    print(f"File: {WORKBOOK_PATH}")


if __name__ == "__main__":
    main()
