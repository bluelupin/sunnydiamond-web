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
      className="relative h-[240px] w-full overflow-hidden md:h-320"
    >
      <div className="absolute inset-0">
        <ResponsiveImage
          desktopSrc={jewelleryListingHeroAssets.desktop}
          mobileSrc={jewelleryListingHeroAssets.mobile}
          alt={jewelleryListingHeroAssets.alt}
          width={1440}
          height={320}
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[62%_38%] md:object-[58%_42%]"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      </div>

      <h1
        id="jewellery-listing-hero-title"
        className="absolute left-1/2 top-[152px] z-10 w-full max-w-440 -translate-x-1/2 whitespace-nowrap text-center font-larken text-32 font-light leading-110 text-white md:top-[203px] md:text-48"
      >
        {title}
      </h1>
    </section>
  );
};

export default JewelleryHeroSection;
