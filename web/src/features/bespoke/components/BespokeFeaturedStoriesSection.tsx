import Image from "next/image";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import {
  bespokeFeaturedStoriesFigmaSpec,
  bespokePageContent,
} from "@/features/bespoke/data/content";

type FeaturedItem = (typeof bespokePageContent.featuredStories.items)[number];

const spec = bespokeFeaturedStoriesFigmaSpec;

type FeaturedGalleryImageProps = {
  item: FeaturedItem;
  compact?: boolean;
};

const FeaturedGalleryImage = ({ item, compact }: FeaturedGalleryImageProps) => {
  const isCenter = item.variant === "center";
  const isSideLeft = item.variant === "side-left";

  return (
    <figure
      className={cn(
        "relative shrink-0 overflow-hidden bg-white",
        isCenter
          ? compact
            ? "h-[240px] w-[280px]"
            : "h-[360px] w-[560px]"
          : compact
            ? "h-[200px] w-[260px]"
            : "h-[300px] w-[400px]",
      )}
    >
      <div
        className={cn(
          "absolute overflow-hidden",
          isCenter &&
          (compact
            ? "left-1/2 top-1/2 h-[560px] w-[370px] -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 top-1/2 h-[847px] w-[559px] -translate-x-1/2 -translate-y-1/2"),
          isSideLeft &&
          (compact
            ? "right-0 top-1/2 h-[360px] w-[260px] -translate-y-1/2"
            : "right-0 top-1/2 h-[534px] w-[400px] -translate-y-1/2"),
          !isCenter &&
          !isSideLeft &&
          (compact
            ? "left-1/2 top-1/2 h-[240px] w-[400px] -translate-x-1/2 -translate-y-1/2"
            : "left-1/2 top-1/2 h-[353px] w-[595px] -translate-x-1/2 -translate-y-1/2"),
        )}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={isCenter ? "560px" : "400px"}
          className="object-cover object-center"
        />
      </div>
    </figure>
  );
};

const FeaturedStoriesDesktop = () => {
  const { featuredStories } = bespokePageContent;

  return (
    <section
      aria-labelledby="bespoke-featured-stories-title"
      className="relative hidden h-[817px] w-full overflow-hidden bg-gray200 md:block"
    >
      <div className="absolute left-1/2 top-0 h-[559px] w-[1920px] -translate-x-1/2 overflow-hidden">
        <ResponsiveImage
          desktopSrc={featuredStories.background.desktop}
          mobileSrc={featuredStories.background.mobile}
          alt={featuredStories.background.alt}
          width={1920}
          height={2074}
          className="absolute left-1/2 top-0 h-[2074px] w-[1920px] max-w-none -translate-x-1/2 object-cover object-top"
        />
        <div aria-hidden className="absolute inset-0 bg-[#0000004D]" />

        <h2
          id="bespoke-featured-stories-title"
          className="absolute left-1/2 top-[177px] w-[326px] -translate-x-1/2 whitespace-nowrap text-center font-larken text-5xl font-light leading-110 text-white"
        >
          {featuredStories.title}
        </h2>
      </div>
      <div className="absolute left-1/2 top-[270px] z-10 flex -translate-x-1/2 items-center gap-4">
        {featuredStories.items.map((item) => (
          <FeaturedGalleryImage key={item.src} item={item} />
        ))}
      </div>
      {/* Figma CTAs — bottom 40px, max-width 1360px, gap 32px */}
      <div className="absolute bottom-10 left-1/2 z-10 flex w-[1360px] max-w-[calc(100%-80px)] -translate-x-1/2 flex-col items-center gap-8">
        <Link
          href={featuredStories.primaryCtaHref}
          className="btn-border-slide inline-flex h-14 w-[284px] items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          <span className="relative z-10">{featuredStories.primaryCtaLabel}</span>
        </Link>
        <Link
          href={featuredStories.secondaryCtaHref}
          className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          {featuredStories.secondaryCtaLabel}
        </Link>
      </div>
    </section>
  );
};

const FeaturedStoriesMobile = () => {
  const { featuredStories } = bespokePageContent;

  return (
    <section
      aria-labelledby="bespoke-featured-stories-title-mobile"
      className="bg-gray200 md:hidden"
    >
      <div className="relative h-[320px] overflow-hidden sm:h-[420px]">
        <ResponsiveImage
          desktopSrc={featuredStories.background.desktop}
          mobileSrc={featuredStories.background.mobile}
          alt={featuredStories.background.alt}
          width={1453}
          height={2074}
          sizes="100vw"
          className="absolute inset-0 size-full object-cover object-top"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor: spec.overlayHorizontal,
            backgroundImage: spec.overlayVertical,
          }}
        />
        <h2
          id="bespoke-featured-stories-title-mobile"
          className="absolute left-1/2 top-24 w-full max-w-[326px] -translate-x-1/2 text-center font-larken text-32 font-light leading-110 text-white"
        >
          {featuredStories.title}
        </h2>
      </div>

      <div className="overflow-x-auto px-4 py-6">
        <div className="mx-auto flex w-max items-center gap-3">
          {featuredStories.items.map((item) => (
            <FeaturedGalleryImage key={item.src} item={item} compact />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 px-4 pb-10">
        <Link
          href={featuredStories.primaryCtaHref}
          className="btn-border-slide inline-flex h-14 w-[284px] items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          <span className="relative z-10">{featuredStories.primaryCtaLabel}</span>
        </Link>
        <Link
          href={featuredStories.secondaryCtaHref}
          className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          {featuredStories.secondaryCtaLabel}
        </Link>
      </div>
    </section>
  );
};

const BespokeFeaturedStoriesSection = () => (
  <>
    <FeaturedStoriesDesktop />
    <FeaturedStoriesMobile />
  </>
);

export default BespokeFeaturedStoriesSection;
