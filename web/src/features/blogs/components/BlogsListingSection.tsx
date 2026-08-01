import { Suspense } from "react";
import type {
  BlogCategory,
  BlogFeaturedPost,
  BlogPost,
} from "../types";
import {
  filterBlogPosts,
  parseBlogsListingQuery,
} from "../utils/blogsListingQuery";
import BlogsCardGrid from "./BlogsCardGrid";
import BlogsFilterBar from "./BlogsFilterBar";
import BlogsFeaturedSection from "./BlogsFeaturedSection";
import BlogsLoadMore from "./BlogsLoadMore";

const blogsGridSectionClassName =
  "bg-gray200 px-4 py-16 md:px-10 md:py-104";

type BlogsListingSectionProps = {
  filterLabel: string;
  categories: BlogCategory[];
  posts: BlogPost[];
  featured: BlogFeaturedPost | null;
  loadMoreButtonLabel: string;
  searchParams?: Record<string, string | string[] | undefined>;
};

const BlogsListingSection = ({
  filterLabel,
  categories,
  posts,
  featured,
  loadMoreButtonLabel,
  searchParams,
}: BlogsListingSectionProps) => {
  const { category, limit } = parseBlogsListingQuery(searchParams, categories);
  const filteredPosts = filterBlogPosts(posts, category);
  const firstRowPosts = filteredPosts.slice(0, 3);
  const remainingPosts = filteredPosts.slice(3, limit);
  const showLoadMoreFooter =
    filteredPosts.length > 0 && limit < filteredPosts.length;

  return (
    <>
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-1440 px-4 pt-10 md:px-10 md:pt-16" />
        }
      >
        <BlogsFilterBar filterLabel={filterLabel} categories={categories} />
      </Suspense>

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
              <Suspense fallback={null}>
                <BlogsLoadMore
                  category={category}
                  limit={limit}
                  total={filteredPosts.length}
                  buttonLabel={loadMoreButtonLabel}
                />
              </Suspense>
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

export default BlogsListingSection;
