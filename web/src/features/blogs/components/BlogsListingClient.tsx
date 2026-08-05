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
  "bg-gray200 px-4 py-16 md:px-10 md:py-104";

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

  const filteredPosts = filterBlogPosts(posts, category);
  const firstRowPosts = filteredPosts.slice(0, 3);
  const remainingPosts = filteredPosts.slice(3, limit);
  const showLoadMoreFooter =
    filteredPosts.length > 0 && limit < filteredPosts.length;

  const handleLoadMore = () => {
    setLimit((current) =>
      Math.min(current + BLOGS_LOAD_MORE_STEP, filteredPosts.length),
    );
  };

  return (
    <>
      <BlogsFilterBar filterLabel={filterLabel} categories={categories} />

      {firstRowPosts.length > 0 ? (
        <section className={blogsGridSectionClassName}>
          <BlogsCardGrid posts={firstRowPosts} />
        </section>
      ) : null}

      {featured ? <BlogsFeaturedSection featured={featured} /> : null}

      {remainingPosts.length > 0 || showLoadMoreFooter ? (
        <section className={blogsGridSectionClassName}>
          <div className="mx-auto flex w-full max-w-1440 flex-col items-center gap-16">
            {remainingPosts.length > 0 ? (
              <BlogsCardGrid posts={remainingPosts} />
            ) : null}
            {showLoadMoreFooter ? (
              <BlogsLoadMore
                limit={limit}
                total={filteredPosts.length}
                buttonLabel={loadMoreButtonLabel}
                onLoadMore={handleLoadMore}
              />
            ) : null}
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
