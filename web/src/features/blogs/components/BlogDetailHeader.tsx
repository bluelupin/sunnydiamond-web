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
    <header className="flex flex-col items-center gap-4 text-center">
      <h1 className="font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl">
        {title}
      </h1>
      <div className="flex w-full max-w-[875px] items-center justify-between gap-4 text-left">
        <p className="font-gill text-[15px] font-normal leading-110 text-neutral500 md:text-[20px]">
          {author}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <p className="font-gill text-[13px] font-normal leading-110 text-neutral500 md:text-base">
            {date}
          </p>
          <span className="size-1 shrink-0 rounded-full bg-neutral500" aria-hidden />
          <p className="font-gill text-[13px] font-normal leading-110 text-neutral500 md:text-base">
            {readTime}
          </p>
        </div>
      </div>
    </header>
  );
};

export default BlogDetailHeader;
