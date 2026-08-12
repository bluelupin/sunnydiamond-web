import Link from "next/link";
import type { BlogFeaturedPost } from "../types";
import Reveal from "@/shared/Animation/Reveal";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";

type BlogsFeaturedSectionProps = {
  featured: BlogFeaturedPost;
};

const BlogsFeaturedSection = ({ featured }: BlogsFeaturedSectionProps) => {
  return (
    <section
      aria-labelledby="blogs-featured-title"
      className="relative w-full overflow-hidden bg-[#F3E6E2] h-auto mx-auto w-full 2xl:max-w-1920 max-w-1440 px-0 md:px-8 lg:px-10 2xl:px-[60px]"
    >
      {featured.backgroundSrc &&
        <div aria-hidden className="pointer-events-none absolute inset-0 size-full sm:!h-[157%] sm:top-[-300px] top-12 opacity-80">
          <ResponsiveImage
            desktopSrc={featured.backgroundSrc}
            alt={featured.backgroundAlt || ""}
            width={1440}
            height={750}
            sizes="100vw"
            className="size-full object-cover object-center"
          />
        </div>
      }
      <div className="flex flex-col items-center md:flex-row lg:items-center lg:justify-between lg:gap-8 gap-4">
        <div className="flex w-full shrink-0 flex-col md:gap-10 gap-6 md:max-w-[437px] sm:max-w-[500px] max-w-full pt-12 md:pb-12 pb-6">
          <div className="lg:space-y-6 md:space-y-5 space-y-4">
            {featured.title &&
              <Reveal
                as="h2"
                direction="up"
                className="line-clamp-3 md:text-left text-center font-larken lg:text-5xl md:text-4xl sm:text-3xl text-32 font-light leading-110 text-darkblack"
              >
                {featured.title}
              </Reveal>
            }
            <div className="flex items-center justify-center gap-2 md:justify-start lg:gap-4">
              {featured.date &&
                <Reveal as="p"
                  direction="up" className="text-t4-regular text-neutral500 lg:text-base">
                  {featured.date}
                </Reveal>
              }
              {featured.readTime &&
                <Reveal direction="up" className="flex items-center justify-center gap-2 lg:justify-start lg:gap-4">
                  <span
                    className="size-1 shrink-0 rounded-full bg-neutral500"
                    aria-hidden
                  />
                  <p className="text-t4-regular text-neutral500 lg:text-base">
                    {featured.readTime}
                  </p>
                </Reveal>
              }
            </div>
            {featured.excerpt &&
              <Reveal
                as="p"
                direction="up"
                className="line-clamp-5 md:text-left text-center font-gill lg:text-xl md:text-lg text-base font-light leading-110 text-neutral500"
              >
                {featured.excerpt}
              </Reveal>
            }
          </div>
          {featured.readNowLabel &&
            <Reveal
              direction="up"
              className="flex md:items-start items-center md:justify-start justify-center"
            >
              <Link
                href={featured.href}
                className={`relative cursor-pointer border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-darkMagenta after:transition-all after:duration-300 hover:border-darkMagenta hover:text-darkMagenta hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2`}
              >
                {featured.readNowLabel}
              </Link>
            </Reveal>
          }
        </div>
        {featured.imageSrc &&
          <ScrollReveal
            delayMs={180}
            className="relative h-auto w-full max-w-[305px] flex-1 md:max-w-[746px]"
          >
            <ResponsiveImage
              desktopSrc={featured.imageSrc || ''}
              // mobileSrc={featured.mobileUrl}
              alt={featured.imageAlt}
              width={746}
              height={600}
              sizes="(max-width: 768px) 305px, 746px"
              className="size-full object-contain object-right"
            />
          </ScrollReveal>
        }
      </div>
    </section>
  );
};

export default BlogsFeaturedSection;
