"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import type {
  BlogCategory,
  BlogCategoryId,
  BlogFeaturedPost,
  BlogPost,
} from "../types";
import BlogsFilterBar from "./BlogsFilterBar";
import { BlogCard } from "./BlogCard";
import BlogsFeaturedSection from "./BlogsFeaturedSection";

const blogsGridSectionClassName =
  "bg-gray200 px-4 py-16 md:px-10 md:py-104";
const INITIAL_VISIBLE = 3;
const LOAD_MORE_STEP = 3;

type BlogsListingSectionProps = {
  filterLabel: string;
  categories: BlogCategory[];
  posts: BlogPost[];
  featured: BlogFeaturedPost | null;
  loadMoreButtonLabel: string;
};

function filterPosts(posts: BlogPost[], category: BlogCategoryId): BlogPost[] {
  if (category === "all") {
    return posts;
  }

  return posts.filter((post) => post.category === category);
}

const BlogsListingSection = ({
  filterLabel,
  categories,
  posts,
  featured,
  loadMoreButtonLabel,
}: BlogsListingSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryId>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE + 6);

  const filteredPosts = useMemo(
    () => filterPosts(posts, selectedCategory),
    [posts, selectedCategory],
  );

  const firstRowPosts = filteredPosts.slice(0, 3);
  const remainingPosts = filteredPosts.slice(3, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;
  const progressWidth = Math.min(
    (visibleCount / Math.max(filteredPosts.length, 1)) * 360,
    360,
  );
  const shownCount = Math.min(visibleCount, filteredPosts.length);

  const handleCategoryChange = (category: BlogCategoryId) => {
    setSelectedCategory(category);
    setVisibleCount(INITIAL_VISIBLE + 6);
  };

  return (
    <>
      <BlogsFilterBar
        filterLabel={filterLabel}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {firstRowPosts.length > 0 ? (
        <section className={blogsGridSectionClassName}>
          <div className="mx-auto flex w-full max-w-1440 flex-col gap-10 md:flex-row md:items-start md:gap-2">
            {firstRowPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      {featured ? <BlogsFeaturedSection featured={featured} /> : null}

      {remainingPosts.length > 0 ? (
        <section className={blogsGridSectionClassName}>
          <div className="mx-auto flex w-full max-w-1440 flex-col gap-10">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-2">
              {remainingPosts.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            {remainingPosts.length > 3 ? (
              <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-2">
                {remainingPosts.slice(3).map((post) => (
                  <BlogCard key={`${post.id}-row-2`} post={post} />
                ))}
              </div>
            ) : null}
          </div>

          {hasMore || filteredPosts.length > 0 ? (
            <div className="mx-auto mt-16 flex w-full max-w-[360px] flex-col items-center gap-6">
              <div className="flex w-full flex-col items-center gap-3">
                <p className="font-gill text-base font-light leading-110 text-darkblack">
                  {shownCount} out of {filteredPosts.length} Blogs
                </p>
                <div className="h-0.5 w-full overflow-hidden bg-neutral300">
                  <div
                    className="h-[3px] bg-darkblack transition-all duration-300"
                    style={{ width: `${progressWidth}px` }}
                    aria-hidden
                  />
                </div>
              </div>
              {hasMore ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
                  className={cn(
                    "flex h-14 w-full items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:border-darkblack",
                  )}
                >
                  {loadMoreButtonLabel}
                </button>
              ) : null}
            </div>
          ) : null}
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

export default BlogsListingSection;
