import { BlogCard } from "./BlogCard";
import type { BlogPost } from "../types";

type BlogMoreToReadSectionProps = {
  posts: BlogPost[];
};

const BlogMoreToReadSection = ({ posts }: BlogMoreToReadSectionProps) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="blog-more-to-read-title"
      className="bg-white w-full mx-auto 2xl:max-w-1992 max-w-1440 2xl:px-[60px] lg:px-10 md:px-8 px-4 pb-16 md:px-10 md:pb-100"
    >
      <h2
        id="blog-more-to-read-title"
        className="font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl mb-6"
      >
        More to read
      </h2>
      <div className="horizontalScrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-2 md:overflow-visible md:px-0 md:pb-0">
        {posts.map((post) => (
          <div
            key={post.id}
            className="w-[min(328px,calc(100vw-32px))] shrink-0 md:w-auto md:shrink"
          >
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogMoreToReadSection;
