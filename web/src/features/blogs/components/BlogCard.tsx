import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../types";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex min-w-0 flex-1 flex-col items-start gap-4 self-stretch">
      <Link
        href={post.href}
        className="relative block h-[360px] w-full shrink-0 overflow-hidden sm:h-[420px] md:h-[496px]"
      >
        <Image
          src={post.imageSrc}
          alt={post.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="flex w-full flex-col items-start gap-4">
        <Link
          href={post.href}
          className="w-full min-h-[calc(16px*1.1*2)] md:min-h-[calc(20px*1.1*2)]"
        >
          <h2
            className="line-clamp-2 break-words font-gill text-base font-normal leading-110 text-darkblack md:text-h4-light"
          >
            {post.title}
          </h2>
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className="text-t4-regular text-neutral500 md:text-base">
            {post.date}
          </p>
          <span className="size-1 shrink-0 rounded-full bg-neutral500" aria-hidden />
          <p className="text-t4-regular text-neutral500 md:text-base">
            {post.readTime}
          </p>
        </div>
      </div>
    </article>
  );
}
