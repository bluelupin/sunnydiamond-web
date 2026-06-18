import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import fallBackImage from "@/assets/fallBackImage.png";

const JewelleryHeroSection = () => {
  return (
    <section aria-label="Handcrafted Brilliance" className="relative h-[220px] md:h-[280px] lg:h-[320px] overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <ResponsiveImage
          desktopSrc={fallBackImage}
          mobileSrc={fallBackImage}
          alt=""
          width={1440}
          height={320}
          priority
          className="opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" aria-hidden />
      </div>
      <div className="relative container h-full flex items-center justify-center">
        <h1 className="font-larken font-light text-white text-[32px] md:text-[44px] lg:text-[54px] leading-[100%] tracking-[0%] text-center">
          Handcrafted Brilliance
        </h1>
      </div>
    </section>
  );
};

export default JewelleryHeroSection;
