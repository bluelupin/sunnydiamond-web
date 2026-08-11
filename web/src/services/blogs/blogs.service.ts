import { cache } from "react";
import { apiFetch, ApiError } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import {
  getAllBlogSlugs as getStaticBlogSlugs,
} from "@/features/blogs/data/getBlogDetail";
import type { BlogDetail } from "@/features/blogs/types";
import {
  mapBlogsPageData,
  mapStaticBlogsPage,
  mapStrapiBlogPostToDetail,
  mapStrapiSeo,
  selectRelatedBlogPosts,
} from "./blogs.mapper";
import type {
  NormalizedBlogDetailResult,
  NormalizedBlogsPage,
  StrapiBlogCategory,
  StrapiBlogLandingPage,
  StrapiBlogPost,
} from "./blogs.types";

const BLOG_POSTS_LIST_QUERY =
  "populate[coverImage][populate][desktopImage]=true" +
  "&populate[coverImage][populate][mobileImage]=true" +
  "&populate[heroImage][populate][desktopImage]=true" +
  "&populate[heroImage][populate][mobileImage]=true" +
  "&populate[tags]=true" +
  "&populate[blog_category]=true" +
  "&pagination[pageSize]=100" +
  "&sort=publishedDate:desc";

/** Targeted populate — `populate=*` 400s on this single-type. */
const BLOG_LANDING_POPULATE_QUERY =
  "populate[heroSection][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[heroSection][populate][backgroundImage][populate][mobileImage]=true" +
  "&populate[featuredBlogSection][populate][backgroundImage][populate][desktopImage]=true" +
  "&populate[featuredBlogSection][populate][backgroundImage][populate][mobileImage]=true" +
  // CMS oneToOne relation on the landing page (not nested under featuredBlogSection).
  "&populate[featuredBlog][populate][coverImage][populate][desktopImage]=true" +
  "&populate[featuredBlog][populate][coverImage][populate][mobileImage]=true" +
  "&populate[featuredBlog][populate][heroImage][populate][desktopImage]=true" +
  "&populate[featuredBlog][populate][heroImage][populate][mobileImage]=true" +
  "&populate[featuredBlog][populate][blog_category]=true" +
  "&populate[featuredBlog][populate][tags]=true" +
  "&populate[seo][populate]=ogImage" +
  "&populate[blogCategory]=true";

async function softFetch<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T | null> {
  try {
    return await apiFetch<T>(endpoint, { signal });
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 403 || error.status === 404 || error.status === 400)
    ) {
      return null;
    }
    console.warn(`[blogs] Failed to fetch ${endpoint}`, error);
    return null;
  }
}

async function fetchBlogPosts(signal?: AbortSignal): Promise<StrapiBlogPost[]> {
  try {
    const data = await apiFetch<StrapiBlogPost[]>(
      `${STRAPI_ENDPOINTS.blogPosts}?${BLOG_POSTS_LIST_QUERY}`,
      { signal },
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[blogs] Failed to fetch blog posts", error);
    return [];
  }
}

async function fetchBlogPostBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<StrapiBlogPost | null> {
  try {
    const data = await apiFetch<StrapiBlogPost[]>(
      `${STRAPI_ENDPOINTS.blogPosts}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      { signal },
    );
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0] ?? null;
  } catch (error) {
    console.warn(`[blogs] Failed to fetch blog post slug=${slug}`, error);
    return null;
  }
}

export const getBlogsPageData = cache(
  async (signal?: AbortSignal): Promise<NormalizedBlogsPage> => {
    const [posts, landing, categories] = await Promise.all([
      fetchBlogPosts(signal),
      softFetch<StrapiBlogLandingPage>(
        `${STRAPI_ENDPOINTS.blogLandingPage}?${BLOG_LANDING_POPULATE_QUERY}`,
        signal,
      ),
      softFetch<StrapiBlogCategory[]>(STRAPI_ENDPOINTS.blogCategories, signal),
    ]);

    if (posts.length === 0) {
      return mapStaticBlogsPage();
    }

    return mapBlogsPageData({
      posts,
      landing,
      categories: Array.isArray(categories) ? categories : null,
    });
  },
);

export const getBlogDetailBySlug = cache(
  async (
    slug: string,
    signal?: AbortSignal,
  ): Promise<NormalizedBlogDetailResult | null> => {
    const [cmsPost, allPosts] = await Promise.all([
      fetchBlogPostBySlug(slug, signal),
      fetchBlogPosts(signal),
    ]);

    if (cmsPost) {
      const relatedPosts = selectRelatedBlogPosts(cmsPost, allPosts, 3);

      const detail = mapStrapiBlogPostToDetail(
        cmsPost,
        relatedPosts.map((post) => post.id),
      );

      if (!detail) return null;

      return {
        detail,
        relatedPosts,
        seo: mapStrapiSeo(cmsPost.seo),
      };
    }

    return null;
  },
);

export const getAllBlogSlugsForStaticParams = cache(
  async (signal?: AbortSignal): Promise<string[]> => {
    const posts = await fetchBlogPosts(signal);
    const cmsSlugs = posts
      .map((post) => (typeof post.slug === "string" ? post.slug.trim() : ""))
      .filter(Boolean);

    return Array.from(new Set([...cmsSlugs, ...getStaticBlogSlugs()]));
  },
);

export type { NormalizedBlogsPage, NormalizedBlogDetailResult, BlogDetail };
