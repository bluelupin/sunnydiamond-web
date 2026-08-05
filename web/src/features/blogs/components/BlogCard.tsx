import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../types";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex min-w-0 flex-1 flex-col items-start gap-4">
      <Link
        href={post.href}
        className="relative block w-full shrink-0 overflow-hidden bg-gray300 xl:h-[496px] lg:h-[400px] md:h-[320px] sm:h-[300px] h-[350px]"
      >
        {post.imageSrc ? (
          <Image
            src={post.imageSrc}
            alt={post.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </Link>
      <div className="flex w-full flex-col items-start gap-4">
        <Link
          href={post.href}
          className="w-full min-h-[calc(16px*1.1*2)] md:min-h-[calc(20px*1.1*2)]"
        >
          <h2
            className="line-clamp-2 break-words leading-110 text-darkblack  md:font-larken font-gill lg:text-xl md:text-lg text-base md:font-light font-normal"
          >
            {post.title}
          </h2>
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className="text-t4-regular text-neutral500 md:text-base md:font-normal">
            {post.date}
          </p>
          <span className="size-1 shrink-0 rounded-full bg-neutral500" aria-hidden />
          <p className="text-t4-regular text-neutral500 md:text-base md:font-normal">
            {post.readTime}
          </p>
        </div>
      </div>
    </article>
  );
}
