import type { BlogCategory, BlogPost } from "../types";

export const BLOGS_INITIAL_VISIBLE = 9;
export const BLOGS_LOAD_MORE_STEP = 3;

type SearchParams = Record<string, string | string[] | undefined>;

export function filterBlogPosts(posts: BlogPost[], category: string): BlogPost[] {
  if (category === "all") {
    return posts;
  }

  return posts.filter((post) => post.category === category);
}

export function parseBlogsListingQuery(
  searchParams: SearchParams | undefined,
  categories: BlogCategory[],
): { category: string; limit: number } {
  const validCategoryIds = new Set(categories.map((item) => item.id));

  const rawCategory =
    typeof searchParams?.category === "string" ? searchParams.category : "all";
  const category =
    rawCategory === "all" || validCategoryIds.has(rawCategory) ? rawCategory : "all";

  const rawLimit =
    typeof searchParams?.limit === "string"
      ? Number.parseInt(searchParams.limit, 10)
      : BLOGS_INITIAL_VISIBLE;

  const limit = Number.isFinite(rawLimit)
    ? Math.max(BLOGS_INITIAL_VISIBLE, rawLimit)
    : BLOGS_INITIAL_VISIBLE;

  return { category, limit };
}
