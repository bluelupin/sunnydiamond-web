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
    <header className="flex w-full flex-col items-center gap-6 text-center md:gap-4">
      <h1 className="w-full font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl">
        {title}
      </h1>
      <div className="flex w-full items-center justify-between gap-4 md:max-w-[875px]">
        <p className="text-t4-regular text-darkblack md:text-[20px] md:font-normal md:text-neutral500">
          {author}
        </p>
        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <p className="text-t4-regular text-neutral500 md:text-base">
            {date}
          </p>
          <span className="size-1 shrink-0 rounded-full bg-neutral500" aria-hidden />
          <p className="text-t4-regular text-neutral500 md:text-base">
            {readTime}
          </p>
        </div>
      </div>
    </header>
  );
};

export default BlogDetailHeader;
