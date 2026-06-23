import Image from "next/image";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import AboutHandcraftedHeroMedia from "./AboutHandcraftedHeroMedia";
import AboutHandcraftedMobileGrid from "./AboutHandcraftedMobileGrid";
import VerticalScrollLine from "./VerticalScrollLine";
import {
  aboutHandcraftedAssets,
  aboutHandcraftedContent,
  aboutHandcraftedFigmaSpec,
  aboutPageImages,
} from "../data/content";

const { card: cardSpec, centerImage } = aboutHandcraftedFigmaSpec;

const HandcraftedDesktopGrid = () => (
  <>
    <Image
      src={aboutHandcraftedAssets.gridMask}
      alt=""
      width={1161}
      height={694}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />

    <div className="handcrafted-grid-mask absolute inset-0 overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <div className="about-handcrafted-photo absolute max-w-none">
        <ResponsiveImage
          desktopSrc={aboutPageImages.craftsmanship}
          alt="Diamond craftsmanship detail"
          width={centerImage.width}
          height={centerImage.height}
          quality={90}
          sizes="(max-width: 1024px) 100vw, 1160px"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>

    {aboutHandcraftedContent.cards.map((item) => (
      <article
        key={item.title}
        className="absolute z-10 flex h-[32.08%] w-[19.17%] flex-col items-center justify-center bg-chalkCard px-1"
        style={{
          left: item.position.left,
          top: item.position.top,
          gap: `${item.gap}px`,
        }}
      >
        <Image
          src={aboutHandcraftedAssets.flourish}
          alt=""
          width={cardSpec.iconWidth}
          height={cardSpec.iconHeight}
          aria-hidden
          className="h-[15px] w-4 shrink-0"
        />
        <h3 className="max-w-[79.73%] text-center font-larken text-2xl font-light leading-[110%] text-darkblack">
          {item.title}
        </h3>
      </article>
    ))}
  </>
);

const AboutHandcraftedSection = () => {
  return (
    <>
      <section
        aria-labelledby="about-handcrafted-title"
        className="overflow-x-hidden bg-white"
      >
        <PageContainer className="px-0 md:px-0">
          <div className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0">
              <AboutHandcraftedHeroMedia />
            </div>
            <div className="absolute inset-0 bg-black/30" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 top-16 flex flex-col items-center justify-center gap-4 px-5 md:top-20">
              <h2
                id="about-handcrafted-title"
                className="text-center font-larken text-[32px] font-light leading-[110%] text-white md:text-[40px] lg:text-5xl"
              >
                {aboutHandcraftedContent.title}
              </h2>
              <span className="h-px w-full max-w-[440px] bg-neutral300" aria-hidden />
            </div>
          </div>
        </PageContainer>

        {/* Mobile — Figma 692:27493: 3-2-3 tile grid */}
        <div className="relative z-10 mt-6 lg:hidden px-3">
          <AboutHandcraftedMobileGrid />
        </div>

        {/* Desktop — unchanged (Figma 692:27322) */}
        <PageContainer className="relative z-10 mt-6 hidden lg:block">
          <div className="-mx-5 overflow-hidden md:-mx-8 lg:mx-0">
            <div className="relative mx-auto w-full max-w-[1160px] aspect-[1160/693]">
              <div className="relative h-full w-full">
                <HandcraftedDesktopGrid />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
      <VerticalScrollLine className="pt-5 pb-16 md:pb-20 lg:pb-[100px]" />
    </>
  );
};

export default AboutHandcraftedSection;
