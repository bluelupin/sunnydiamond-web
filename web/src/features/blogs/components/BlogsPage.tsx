import BlogsHeroSection from "./BlogsHeroSection";
import BlogsListingSection from "./BlogsListingSection";
import type { NormalizedBlogsPage } from "@/services/blogs/blogs.types";

type BlogsPageProps = {
  page: NormalizedBlogsPage;
  searchParams?: Record<string, string | string[] | undefined>;
};

const BlogsPage = ({ page, searchParams }: BlogsPageProps) => {
  return (
    <>
      <BlogsHeroSection hero={page.hero} />
      <BlogsListingSection
        filterLabel={page.filterLabel}
        categories={page.categories}
        posts={page.posts}
        featured={page.featured}
        loadMoreButtonLabel={page.loadMore.buttonLabel}
        searchParams={searchParams}
      />
    </>
  );
};

export default BlogsPage;
