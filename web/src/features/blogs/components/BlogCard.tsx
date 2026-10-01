import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../types";

type BlogCardProps = {
  post: BlogPost;
  /** Figma card spec (blogs listing, More to read); "default" keeps the original card styles. */
  variant?: "default" | "listing";
};

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const isListing = variant === "listing";
  const gapClassName = isListing ? "gap-3 md:gap-4" : "gap-4";
  const metaClassName = `text-t4-regular text-neutral500 md:text-base md:font-normal${isListing ? " md:leading-110" : ""}`;

  return (
    <article className={`flex min-w-0 flex-1 flex-col items-start ${gapClassName}`}>
      <Link
        href={post.href}
        className={`relative block w-full shrink-0 overflow-hidden bg-gray300 xl:h-[496px] lg:h-[400px] md:h-[320px] sm:h-[300px] ${isListing ? "h-[343px]" : "h-[350px]"}`}
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
      <div className={`flex w-full flex-col items-start ${gapClassName}`}>
        <Link
          href={post.href}
          className="w-full min-h-[calc(16px*1.1*2)] md:min-h-[calc(20px*1.1*2)]"
        >
          <h2
            className={`line-clamp-2 break-words leading-110 text-darkblack  md:font-larken font-gill lg:text-xl md:text-lg text-base md:font-light font-normal${isListing ? " md:leading-110 lg:leading-110" : ""}`}
          >
            {post.title}
          </h2>
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <p className={metaClassName}>
            {post.date}
          </p>
          {post.readTime ? (
            <>
              <span className="size-1 shrink-0 rounded-full bg-neutral500" aria-hidden />
              <p className={metaClassName}>
                {post.readTime}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
