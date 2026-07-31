import Image from "next/image";
import Link from "next/link";
import type { BlogFeaturedPost } from "../types";

type BlogsFeaturedSectionProps = {
  featured: BlogFeaturedPost;
};

const BlogsFeaturedSection = ({ featured }: BlogsFeaturedSectionProps) => {
  return (
    <section
      aria-labelledby="blogs-featured-title"
      className="relative overflow-hidden bg-[#F3E6E2]"
    >
      <div className="relative mx-auto w-full max-w-1440 overflow-hidden desktop:h-[750px]">
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-[1405px] w-full -translate-y-1/2 desktop:top-[calc(50%-59.5px)]"
          aria-hidden
        >
          <Image
            src={featured.backgroundSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-10 px-4 py-16 desktop:absolute desktop:inset-0 desktop:px-0 desktop:py-0">
          <div className="flex w-full max-w-[530px] flex-col gap-10 desktop:absolute desktop:left-10 desktop:top-1/2 desktop:-translate-y-1/2">
            <div className="flex flex-col gap-6">
              <h2
                id="blogs-featured-title"
                className="font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl"
              >
                {featured.title}
              </h2>
              <div className="flex items-center gap-4">
                <p className="font-gill text-base font-normal leading-110 text-neutral500">
                  {featured.date}
                </p>
                <span
                  className="size-1 shrink-0 rounded-full bg-neutral500"
                  aria-hidden
                />
                <p className="font-gill text-base font-normal leading-110 text-neutral500">
                  {featured.readTime}
                </p>
              </div>
              <p className="font-gill text-[20px] font-light leading-110 text-darkblack">
                {featured.excerpt}
              </p>
            </div>
            <Link
              href={featured.href}
              className="inline-flex w-fit self-start border-b border-darkblack pb-1 text-t4-regular whitespace-nowrap text-darkblack"
            >
              {featured.readNowLabel}
            </Link>
          </div>

          <div className="relative mx-auto h-[min(400px,70vw)] w-full max-w-[746px] desktop:absolute desktop:left-[617px] desktop:top-0 desktop:mx-0 desktop:h-[750px] desktop:w-[823px] desktop:max-w-none">
            <div className="absolute left-0 top-[2px] size-full overflow-hidden desktop:left-[38px] desktop:size-[746px]">
              <Image
                src={featured.imageSrc}
                alt={featured.imageAlt}
                width={746}
                height={932}
                className="absolute left-0 top-[0.03%] h-[124.96%] w-full max-w-none object-cover object-top"
                sizes="(max-width: 1440px) 100vw, 746px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsFeaturedSection;
