import Image from "next/image";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type {
  NormalizedAboutCraft,
  NormalizedCraftCard,
  NormalizedResponsiveImage,
} from "@/services/about/about-page.types";
import AboutHandcraftedHeroMedia from "./AboutHandcraftedHeroMedia";
import AboutHandcraftedMobileGrid from "./AboutHandcraftedMobileGrid";
import VerticalScrollLine from "./VerticalScrollLine";
import {
  aboutHandcraftedAssets,
  aboutHandcraftedFigmaSpec,
} from "../data/content";

const { card: cardSpec, centerImage } = aboutHandcraftedFigmaSpec;

type HandcraftedDesktopGridProps = {
  centerImage?: NormalizedResponsiveImage;
  cards: NormalizedCraftCard[];
};

const HandcraftedDesktopGrid = ({
  centerImage: centerImageData,
  cards,
}: HandcraftedDesktopGridProps) => (
  <>
    <Image
      src={aboutHandcraftedAssets.gridMask}
      alt=""
      width={1161}
      height={694}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />

    {centerImageData ? (
      <div className="handcrafted-grid-mask absolute inset-0 overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        <div className="about-handcrafted-photo absolute max-w-none">
          <ResponsiveImage
            desktopSrc={centerImageData.desktopUrl}
            mobileSrc={centerImageData.mobileUrl}
            alt={centerImageData.alt}
            width={centerImageData.width ?? centerImage.width}
            height={centerImageData.height ?? centerImage.height}
            quality={90}
            sizes="(max-width: 1024px) 100vw, 1160px"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    ) : null}

    {cards.map((item) => (
      <article
        key={`${item.layoutIndex}-${item.title}`}
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

type AboutHandcraftedSectionProps = NormalizedAboutCraft;

const AboutHandcraftedSection = ({
  title,
  videoUrl,
  posterUrl,
  overlayOpacity,
  centerImage: centerImageData,
  cards,
}: AboutHandcraftedSectionProps) => {
  const showDesktopGrid = Boolean(centerImageData) || cards.length > 0;

  return (
    <>
      <section
        aria-labelledby="about-handcrafted-title"
        className="overflow-x-hidden bg-white"
      >
        <PageContainer className="px-0 md:px-0">
          <div className="relative h-700 w-full overflow-hidden">
            <div className="absolute inset-0">
              <AboutHandcraftedHeroMedia videoUrl={videoUrl} posterUrl={posterUrl} />
            </div>
            <MediaContentOverlay solidOpacity={overlayOpacity} />
            <div className="absolute inset-x-0 bottom-0 top-16 z-10 flex flex-col items-center justify-center gap-4 px-5 md:top-20">
              <h2
                id="about-handcrafted-title"
                className="text-center font-larken text-[32px] font-light leading-[110%] text-white md:text-[40px] lg:text-5xl"
              >
                {title}
              </h2>
              <span className="h-px w-full max-w-[440px] bg-neutral300" aria-hidden />
            </div>
          </div>
        </PageContainer>

        <div className="relative z-10 mt-6 px-3 lg:hidden">
          <AboutHandcraftedMobileGrid cards={cards} />
        </div>

        {showDesktopGrid ? (
          <PageContainer className="relative z-10 mt-6 hidden lg:block">
            <div className="-mx-5 overflow-hidden md:-mx-8 lg:mx-0">
              <div className="relative mx-auto aspect-[1160/693] w-full max-w-[1160px]">
                <div className="relative h-full w-full">
                  <HandcraftedDesktopGrid
                    centerImage={centerImageData}
                    cards={cards}
                  />
                </div>
              </div>
            </div>
          </PageContainer>
        ) : null}
      </section>
      <VerticalScrollLine className="pb-16 pt-5 md:pb-20 lg:pb-[100px]" />
    </>
  );
};

export default AboutHandcraftedSection;
