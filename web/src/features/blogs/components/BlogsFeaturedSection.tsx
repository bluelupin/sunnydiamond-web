import type { BlogFeaturedPost } from "../types";
import { DetailTextLink } from "@/features/products/components/detail/shared";
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
      className="relative mx-auto lg:h-[750px] h-[700px] w-full max-w-1440 overflow-hidden bg-[#F3E6E2] px-4 md:px-8 lg:px-10 2xl:max-w-1920 2xl:px-[60px]"
    >
      {featured.backgroundSrc &&
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-80">
          <ResponsiveImage
            desktopSrc={featured.backgroundSrc}
            alt={featured.backgroundAlt || ""}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      }
      <div className="lg:h-[750px] h-[700px] relative z-10 flex flex-col items-center md:flex-row lg:items-center lg:justify-between lg:gap-8 gap-4">
        <div className="flex w-full shrink-0 flex-col md:max-w-[437px] sm:max-w-[500px] max-w-full pt-16 md:pb-12 pb-6">
          {featured.title &&
            <Reveal
              as="h2"
              id="blogs-featured-title"
              direction="up"
              className="md:mb-4 mb-3 md:text-left text-center font-larken lg:text-5xl md:text-4xl sm:text-3xl text-32 font-light leading-110 text-darkblack"
            >
              {featured.title}
            </Reveal>
          }
          <div className="mb-3 flex items-center justify-center gap-2 md:justify-start lg:gap-4">
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
              className="mb-6 md:text-left text-center font-gill lg:text-xl md:text-lg text-base font-light leading-110 text-neutral500"
            >
              {featured.excerpt}
            </Reveal>
          }
          <div className="flex items-center justify-center md:items-start md:justify-start">
            <DetailTextLink href={featured.href}>
              {featured.readNowLabel || "READ NOW"}
            </DetailTextLink>
          </div>
        </div>
        {featured.imageSrc &&
          <ScrollReveal
            delayMs={180}
            className="relative h-auto w-full max-w-[355px] flex-1 md:max-w-[746px]"
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
