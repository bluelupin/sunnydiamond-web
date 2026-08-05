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
  "mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] md:bg-gray200 md:pt-10 pt-0 lg:pb-100 pb-16";

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
      {firstRowPosts.length > 0 &&
        <section className="mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] md:bg-gray200 md:pt-10 pt-0 lg:pb-100 pb-16">
          <BlogsCardGrid posts={firstRowPosts} />
        </section>
      }
      {featured && <BlogsFeaturedSection featured={featured} />}

      {remainingPosts.length > 0 || showLoadMoreFooter ? (
        <section className="mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] md:bg-gray200 lg:py-100 py-16">
          <div className="w-full flex flex-col items-center gap-16">
            {remainingPosts.length > 0 &&
              <BlogsCardGrid posts={remainingPosts} />
            }
            {showLoadMoreFooter &&
              <BlogsLoadMore
                limit={limit}
                total={filteredPosts.length}
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
