import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import fallBackImage from "@/assets/fallBackImage.png";

const JewelleryHeroSection = () => {
  return (
    <section aria-label="Handcrafted Brilliance" className="relative h-[240px] overflow-hidden bg-charcoal md:h-[320px]">
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
        <div
          className="absolute inset-0 bg-black/60 md:bg-gradient-to-b md:from-black/30 md:via-black/20 md:to-black/40"
          aria-hidden
        />
      </div>
      <div className="relative flex h-full flex-col items-center justify-end pb-10 md:justify-center md:pb-0">
        <h1 className="font-larken text-[32px] font-light leading-110 text-white md:text-[54px] md:leading-110">
          Handcrafted Brilliance
        </h1>
      </div>
    </section>
  );
};

export default JewelleryHeroSection;
