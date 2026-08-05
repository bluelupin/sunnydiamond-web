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
        <div className="mx-auto w-full max-w-1440 px-4 pt-10 md:px-10 md:pt-16" />
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
