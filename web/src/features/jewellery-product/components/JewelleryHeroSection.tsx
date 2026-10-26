import { getImageProps } from "next/image";
import HeroBackgroundVideo from "@/features/cms/components/home/HeroBackgroundVideo";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import { getImageSrc } from "@/shared/utils/image";
import type { NormalizedProductLandingHero } from "@/services/product-landing/product-landing-page.types";

type JewelleryHeroSectionProps = NormalizedProductLandingHero;

const JewelleryHeroSection = ({ title, image, videoUrl }: JewelleryHeroSectionProps) => {
  const imageAlt = image?.alt?.trim() || title;
  const desktopSrc = getImageSrc(image?.desktopUrl || image?.mobileUrl);
  const mobileSrc = getImageSrc(image?.mobileUrl) || desktopSrc;
  const commonImageProps = {
    alt: imageAlt,
    width: 1920,
    height: 1080,
    sizes: "100vw",
    quality: PLP_HERO_IMAGE_QUALITY,
    loading: "eager" as const,
    fetchPriority: "high" as const,
    className: "absolute inset-0 h-full w-full object-cover",
  };
  const desktop = desktopSrc
    ? getImageProps({ ...commonImageProps, src: desktopSrc }).props
    : null;
  const mobile = mobileSrc
    ? getImageProps({ ...commonImageProps, src: mobileSrc }).props
    : null;

  return (
    <section
      aria-labelledby="jewellery-listing-hero-title"
      className="relative grid h-[240px] w-full overflow-hidden md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full [&_img]:object-[62%_38%] md:[&_img]:object-[58%_42%] [&_video]:object-[62%_38%] md:[&_video]:object-[58%_42%]">
        {desktop && mobile ? (
          <picture>
            <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
            {/* One eager image lets the browser select the crop without fetching both. */}
            <img {...mobile} alt={imageAlt} />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-gray200" aria-hidden />
        )}
        {videoUrl?.trim() ? <HeroBackgroundVideo src={videoUrl.trim()} /> : null}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-darkblack/85 via-darkblack/35 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-10 md:pb-12 lg:pb-16">
        <h1
          id="jewellery-listing-hero-title"
          className="w-full text-center font-larken font-light leading-none text-white md:text-5xl sm:text-4xl text-32"
        >
          {title}
        </h1>
      </div>
    </section>
  );
};

export default JewelleryHeroSection;
