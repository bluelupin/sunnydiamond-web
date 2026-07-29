import BlogDetailArticle from "./BlogDetailArticle";
import BlogDetailHeader from "./BlogDetailHeader";
import BlogDetailHero from "./BlogDetailHero";
import BlogDetailSidebar from "./BlogDetailSidebar";
import BlogMoreToReadSection from "./BlogMoreToReadSection";
import type { BlogDetail, BlogPost } from "../types";

type BlogDetailPageProps = {
  detail: BlogDetail;
  relatedPosts: BlogPost[];
};

const BlogDetailPage = ({ detail, relatedPosts }: BlogDetailPageProps) => {
  return (
    <>
      <div className="bg-white">
        <div className="mx-auto flex w-full max-w-1440 flex-col gap-10 px-4 pt-6 md:gap-10 md:px-10 md:pt-16">
          <BlogDetailHeader
            title={detail.title}
            author={detail.author}
            date={detail.date}
            readTime={detail.readTime}
          />
          <BlogDetailHero heroImage={detail.heroImage} />
        </div>

        <div className="mx-auto w-full max-w-1440 px-4 pb-16 md:px-10 md:pb-104">
          <div className="desktop:hidden">
            <BlogDetailSidebar
              title={detail.title}
              tableOfContents={detail.tableOfContents}
            />
          </div>

          <div className="mt-10 flex flex-col gap-10 desktop:mt-16 desktop:flex-row desktop:items-start desktop:justify-center desktop:gap-12">
            <BlogDetailArticle
              introParagraphs={detail.introParagraphs}
              sections={detail.sections}
            />

            <div className="hidden desktop:block desktop:sticky desktop:top-28 desktop:self-start">
              <BlogDetailSidebar
                title={detail.title}
                tableOfContents={detail.tableOfContents}
              />
            </div>
          </div>
        </div>
      </div>

      <BlogMoreToReadSection posts={relatedPosts} />
    </>
  );
};

export default BlogDetailPage;
