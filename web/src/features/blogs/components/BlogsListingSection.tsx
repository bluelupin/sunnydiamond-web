import { Suspense } from "react";
import type {
  BlogCategory,
  BlogFeaturedPost,
  BlogPost,
} from "../types";
import BlogsListingClient from "./BlogsListingClient";

type BlogsListingSectionProps = {
  filterLabel: string;
  categories: BlogCategory[];
  posts: BlogPost[];
  featured: BlogFeaturedPost | null;
  loadMoreButtonLabel: string;
};

const BlogsListingSection = ({
  filterLabel,
  categories,
  posts,
  featured,
  loadMoreButtonLabel,
}: BlogsListingSectionProps) => {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full 2xl:max-w-1920 max-w-1440 px-4 md:px-8 lg:px-10 2xl:px-[60px] pt-6 md:pt-10 lg:pt-16" />
      }
    >
      <BlogsListingClient
        filterLabel={filterLabel}
        categories={categories}
        posts={posts}
        featured={featured}
        loadMoreButtonLabel={loadMoreButtonLabel}
      />
    </Suspense>
  );
};

export default BlogsListingSection;
