import Image from "next/image";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { DetailOutlineLink, DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";
import { bespokePageContent } from "@/features/bespoke/data/content";

const BespokeFeaturedStoriesSection = () => {
  const { featuredStories } = bespokePageContent;

  return (
    <>
      <section aria-labelledby="bespoke-featured-stories-title" className="relative overflow-visible">
        <div className="absolute inset-0">
          <ResponsiveImage
            desktopSrc={featuredStories.background.desktop}
            mobileSrc={featuredStories.background.mobile}
            alt={featuredStories.background.alt}
            width={1440}
            height={560}
            sizes="100vw"
            className="size-full object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 53.563%)",
            }}
          />
        </div>

        <div className="relative px-4 pb-0 pt-16 md:px-10 md:pt-24">
          <Reveal
            as="h2"
            id="bespoke-featured-stories-title"
            direction="up"
            className="mb-10 text-center font-larken text-32 font-light leading-110 text-white md:mb-14 md:text-5xl"
          >
            {featuredStories.title}
          </Reveal>

          <div className="mx-auto flex w-full max-w-1440 items-end justify-center gap-3 md:gap-4">
            {featuredStories.items.map((item, index) => (
              <Reveal
                key={item.src}
                direction="up"
                className={cn(
                  "relative shrink-0 overflow-hidden border border-white bg-white",
                  item.featured
                    ? "z-10 h-[320px] w-[220px] md:h-[420px] md:w-[280px]"
                    : "h-[260px] w-[180px] md:h-[360px] md:w-[240px]",
                  index === 0 ? "mb-8 md:mb-12" : index === 2 ? "mb-8 md:mb-12" : "mb-0",
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="280px"
                  className="object-cover object-center"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36">
        <Reveal direction="up" className="mx-auto flex w-full max-w-1440 flex-col items-center gap-8">
          <DetailOutlineLink href={featuredStories.primaryCtaHref} className="h-14 w-[284px] uppercase">
            {featuredStories.primaryCtaLabel}
          </DetailOutlineLink>
          <DetailTextLink href={featuredStories.secondaryCtaHref} className="uppercase">
            {featuredStories.secondaryCtaLabel}
          </DetailTextLink>
        </Reveal>
      </section>
    </>
  );
};

export default BespokeFeaturedStoriesSection;
