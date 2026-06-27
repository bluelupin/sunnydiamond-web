import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import {
  jewelleryListingHeroAssets,
  jewelleryListingHeroSpec,
} from "../data/content";

const JewelleryHeroSection = () => {
  const { title } = jewelleryListingHeroSpec;

  return (
    <section
      aria-labelledby="jewellery-listing-hero-title"
      className="grid h-[240px] w-full overflow-hidden md:h-320"
    >
      <ResponsiveImage
        desktopSrc={jewelleryListingHeroAssets.desktop}
        mobileSrc={jewelleryListingHeroAssets.mobile}
        alt={jewelleryListingHeroAssets.alt}
        width={1440}
        height={320}
        priority
        quality={90}
        sizes="100vw"
        className="col-start-1 row-start-1 size-full object-cover object-[62%_38%] md:object-[58%_42%]"
      />
      <div className="col-start-1 row-start-1 size-full bg-black/40" aria-hidden />
      <h1
        id="jewellery-listing-hero-title"
        className="col-start-1 row-start-1 z-10 flex w-full max-w-440 justify-center self-start justify-self-center whitespace-nowrap pt-[152px] text-center font-larken text-32 font-light leading-110 text-white md:pt-[203px] md:text-5xl"
      >
        {title}
      </h1>
    </section>
  );
};

export default JewelleryHeroSection;
