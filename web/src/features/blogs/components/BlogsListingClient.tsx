"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  BlogCategory,
  BlogFeaturedPost,
  BlogPost,
} from "../types";
import {
  BLOGS_INITIAL_VISIBLE,
  BLOGS_LOAD_MORE_STEP,
  filterBlogPosts,
  parseBlogsCategoryFromSearchParams,
} from "../utils/blogsListingQuery";
import BlogsCardGrid from "./BlogsCardGrid";
import BlogsFilterBar from "./BlogsFilterBar";
import BlogsFeaturedSection from "./BlogsFeaturedSection";
import BlogsLoadMore from "./BlogsLoadMore";

const blogsGridSectionClassName =
  "mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] md:bg-gray200 md:pt-10 pt-0 lg:pb-104 pb-16";

type BlogsListingClientProps = {
  filterLabel: string;
  categories: BlogCategory[];
  posts: BlogPost[];
  featured: BlogFeaturedPost | null;
  loadMoreButtonLabel: string;
};

const BlogsListingClient = ({
  filterLabel,
  categories,
  posts,
  featured,
  loadMoreButtonLabel,
}: BlogsListingClientProps) => {
  const searchParams = useSearchParams();
  const category = parseBlogsCategoryFromSearchParams(
    { category: searchParams?.get("category") ?? undefined },
    categories,
  );

  const [limit, setLimit] = useState(BLOGS_INITIAL_VISIBLE);
  const previousCategoryRef = useRef(category);

  useEffect(() => {
    if (previousCategoryRef.current !== category) {
      setLimit(BLOGS_INITIAL_VISIBLE);
      previousCategoryRef.current = category;
    }
  }, [category]);

  // Spec: featured post must not also appear in the regular card grid (All only).
  const showFeatured = Boolean(featured) && category === "all";
  const gridPosts =
    showFeatured && featured?.href
      ? posts.filter((post) => post.href !== featured.href)
      : posts;
  const filteredPosts = filterBlogPosts(gridPosts, category);
  const firstRowPosts = showFeatured ? filteredPosts.slice(0, 3) : [];
  const remainingPosts = showFeatured
    ? filteredPosts.slice(3, limit)
    : filteredPosts.slice(0, limit);
  const showLoadMoreFooter =
    filteredPosts.length > 0 && limit < filteredPosts.length;
  // Featured is de-duped from the grid but still counts as a blog in the footer.
  const featuredCount = showFeatured ? 1 : 0;
  const loadMoreTotal = filteredPosts.length + featuredCount;
  const loadMoreShown =
    Math.min(limit, filteredPosts.length) + featuredCount;

  const handleLoadMore = () => {
    setLimit((current) =>
      Math.min(current + BLOGS_LOAD_MORE_STEP, filteredPosts.length),
    );
  };

  return (
    <>
      <BlogsFilterBar filterLabel={filterLabel} categories={categories} />
      {showFeatured && firstRowPosts.length > 0 ? (
        <section className="mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] md:bg-gray200 md:pt-10 pt-0 lg:pb-104 pb-16">
          <BlogsCardGrid posts={firstRowPosts} />
        </section>
      ) : null}
      {showFeatured && featured ? (
        <BlogsFeaturedSection featured={featured} />
      ) : null}

      {remainingPosts.length > 0 || showLoadMoreFooter ? (
        <section
          className={
            showFeatured
              ? "mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] md:bg-gray200 lg:py-104 py-16"
              : "mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] md:bg-gray200 md:pt-10 pt-0 lg:pb-104 pb-16"
          }
        >
          <div className="w-full flex flex-col items-center gap-16">
            {remainingPosts.length > 0 &&
              <BlogsCardGrid posts={remainingPosts} />
            }
            {showLoadMoreFooter &&
              <BlogsLoadMore
                limit={loadMoreShown}
                total={loadMoreTotal}
                buttonLabel={loadMoreButtonLabel}
                onLoadMore={handleLoadMore}
              />
            }
          </div>
        </section>
      ) : null}

      {filteredPosts.length === 0 ? (
        <section className={blogsGridSectionClassName}>
          <p className="mx-auto max-w-1440 text-center font-gill text-base font-light leading-110 text-neutral500">
            No blogs match this filter yet.
          </p>
        </section>
      ) : null}
    </>
  );
};

export default BlogsListingClient;
