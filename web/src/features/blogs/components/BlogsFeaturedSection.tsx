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
          className="pointer-events-none absolute left-1/2 top-4 h-[684px] w-[714px] -translate-x-1/2 desktop:top-[calc(50%-59.5px)] desktop:h-[1405px] desktop:w-full desktop:-translate-y-1/2"
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

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-16 desktop:absolute desktop:inset-0 desktop:items-stretch desktop:gap-10 desktop:px-0 desktop:py-0">
          <div className="flex w-full max-w-[375px] flex-col items-center gap-6 desktop:absolute desktop:left-10 desktop:top-1/2 desktop:max-w-[530px] desktop:-translate-y-1/2 desktop:items-start desktop:gap-10">
            <div className="flex w-full flex-col items-center gap-4 text-center desktop:items-start desktop:gap-6 desktop:text-left">
              <h2
                id="blogs-featured-title"
                className="w-full font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl"
              >
                {featured.title}
              </h2>
              <div className="flex items-center justify-center gap-2 desktop:justify-start desktop:gap-4">
                <p className="text-t4-regular text-neutral500 desktop:text-base">
                  {featured.date}
                </p>
                <span
                  className="size-1 shrink-0 rounded-full bg-neutral500"
                  aria-hidden
                />
                <p className="text-t4-regular text-neutral500 desktop:text-base">
                  {featured.readTime}
                </p>
              </div>
              <p className="w-full font-gill text-base font-light leading-110 text-neutral500 desktop:text-[20px] desktop:text-darkblack">
                {featured.excerpt}
              </p>
            </div>
            <Link
              href={featured.href}
              className="inline-flex w-fit border-b border-darkblack pb-1 text-t4-regular whitespace-nowrap text-darkblack"
            >
              {featured.readNowLabel}
            </Link>
          </div>

          <div className="relative h-[357px] w-[324px] shrink-0 desktop:absolute desktop:left-[617px] desktop:top-0 desktop:mx-0 desktop:h-[750px] desktop:w-[823px] desktop:max-w-none">
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
