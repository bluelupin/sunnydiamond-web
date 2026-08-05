import { buildBlogSpeechText } from "../utils/buildBlogSpeechText";
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
  const speechText = buildBlogSpeechText(
    detail.title,
    detail.introParagraphs,
    detail.sections,
  );

  return (
    <>
      <div className="mx-auto flex w-full 2xl:max-w-1992 max-w-1440 2xl:px-[60px] lg:px-10 md:px-8 px-4 flex-col md:pt-16 md:pb-104 pt-6 pb-16">
        <BlogDetailHeader
          title={detail.title}
          author={detail.author}
          date={detail.date}
          readTime={detail.readTime}
        />
        <BlogDetailHero heroImage={detail.heroImage} />
        <div className="desktop:hidden mb-6">
          <BlogDetailSidebar
            title={detail.title}
            tableOfContents={detail.tableOfContents}
            speechText={speechText}
          />
        </div>
        <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:justify-center desktop:gap-12">
          <BlogDetailArticle
            introParagraphs={detail.introParagraphs}
            sections={detail.sections}
          />
          <div className="hidden desktop:sticky desktop:top-28 desktop:block desktop:self-start">
            <BlogDetailSidebar
              title={detail.title}
              tableOfContents={detail.tableOfContents}
              speechText={speechText}
            />
          </div>
        </div>
      </div>
      <BlogMoreToReadSection posts={relatedPosts} />
    </>
  );
};

export default BlogDetailPage;
