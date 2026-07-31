import BlogsHeroSection from "./BlogsHeroSection";
import BlogsListingSection from "./BlogsListingSection";
import type { NormalizedBlogsPage } from "@/services/blogs/blogs.types";

type BlogsPageProps = {
  page: NormalizedBlogsPage;
};

const BlogsPage = ({ page }: BlogsPageProps) => {
  return (
    <>
      <BlogsHeroSection hero={page.hero} />
      <BlogsListingSection
        filterLabel={page.filterLabel}
        categories={page.categories}
        posts={page.posts}
        featured={page.featured}
        loadMoreButtonLabel={page.loadMore.buttonLabel}
      />
    </>
  );
};

export default BlogsPage;
