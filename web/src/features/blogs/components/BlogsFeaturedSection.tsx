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
      <div className="relative mx-auto w-full max-w-1440 overflow-hidden lg:h-[750px]">
        <div
          className="pointer-events-none absolute left-1/2 top-4 h-[684px] w-[714px] -translate-x-1/2 lg:left-0 lg:top-[calc(50%-59.5px)] lg:h-[1405px] lg:w-full lg:-translate-x-0 lg:-translate-y-1/2"
          aria-hidden
        >
          <Image
            src={featured.backgroundSrc}
            alt=""
            fill
            loading="lazy"
            fetchPriority="low"
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 py-16 lg:absolute lg:inset-0 lg:flex-row lg:items-center lg:gap-0 lg:px-10 lg:py-0">
          <div className="flex w-full max-w-[375px] flex-col items-center gap-6 lg:max-w-[530px] lg:shrink-0 lg:items-start lg:gap-10">
            <div className="flex w-full flex-col items-center gap-4 text-center lg:items-start lg:gap-6 lg:text-left">
              <h2
                id="blogs-featured-title"
                className="w-full font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl"
              >
                {featured.title}
              </h2>
              <div className="flex items-center justify-center gap-2 lg:justify-start lg:gap-4">
                <p className="text-t4-regular text-neutral500 lg:text-base">
                  {featured.date}
                </p>
                <span
                  className="size-1 shrink-0 rounded-full bg-neutral500"
                  aria-hidden
                />
                <p className="text-t4-regular text-neutral500 lg:text-base">
                  {featured.readTime}
                </p>
              </div>
              <p className="w-full font-gill text-base font-light leading-110 text-neutral500 lg:text-[20px] lg:text-darkblack">
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

          <div className="relative h-[357px] w-[324px] shrink-0 lg:ml-auto lg:h-[750px] lg:min-w-0 lg:flex-1 lg:self-stretch">
            <div className="absolute left-0 top-[2px] size-full overflow-hidden lg:left-[38px] lg:h-[746px] lg:w-[746px] lg:max-w-[calc(100%-38px)]">
              <Image
                src={featured.imageSrc}
                alt={featured.imageAlt}
                width={746}
                height={932}
                loading="lazy"
                fetchPriority="low"
                className="absolute left-0 top-[0.03%] h-[124.96%] w-full max-w-none object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 746px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsFeaturedSection;
