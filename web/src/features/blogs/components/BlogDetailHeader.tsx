import type { BlogDetail } from "../types";

type BlogDetailHeaderProps = {
  title: BlogDetail["title"];
  author: BlogDetail["author"];
  date: BlogDetail["date"];
  readTime: BlogDetail["readTime"];
};

const BlogDetailHeader = ({
  title,
  author,
  date,
  readTime,
}: BlogDetailHeaderProps) => {
  return (
    <header className="2xl:px-[60px] lg:px-10 md:px-8 px-4 flex w-full flex-col items-center gap-6 text-center md:gap-4 md:mb-10 mb-6">
      <h1 className="w-full font-larken font-light leading-110 text-darkblack lg:text-5xl md:text-4xl sm:text-3xl text-32">
        {title}
      </h1>
      <div className="flex w-full items-center justify-between gap-4 max-w-[900px] mx-auto">
        <p className="text-sm text-darkblack md:text-xl md:font-normal md:text-neutral500">
          {author}
        </p>
        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <p className="text-sm text-neutral500 md:text-base">
            {date}
          </p>
          <span className="size-1 shrink-0 rounded-full bg-neutral500" aria-hidden />
          <p className="text-sm text-neutral500 md:text-base">
            {readTime}
          </p>
        </div>
      </div>
    </header>
  );
};

export default BlogDetailHeader;
