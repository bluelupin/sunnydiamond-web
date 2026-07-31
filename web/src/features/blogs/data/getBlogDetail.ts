import type { BlogDetail, BlogPost } from "../types";

/**
 * Static blog detail helpers kept for sitemap/legacy imports.
 * Article content is CMS-only via `getBlogDetailBySlug`.
 */
export function getAllBlogSlugs(): string[] {
  return [];
}

export function getBlogDetail(_slug: string): BlogDetail | null {
  return null;
}

export function getRelatedPosts(_detail: BlogDetail): BlogPost[] {
  return [];
}
