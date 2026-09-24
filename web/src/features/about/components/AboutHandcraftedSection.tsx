import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedAboutCraft } from "@/services/about/about-page.types";
import AboutHandcraftedTileGrid from "./AboutHandcraftedTileGrid";
import VerticalScrollLine from "./VerticalScrollLine";
import Reveal from "@/shared/Animation/Reveal";

type AboutHandcraftedSectionProps = NormalizedAboutCraft;

const AboutHandcraftedSection = ({
  title,
  videoUrl,
  image,
  overlayOpacity,
  cards,
}: AboutHandcraftedSectionProps) => {
  const hasMedia = Boolean(
    image?.desktopUrl?.trim() || image?.mobileUrl?.trim() || videoUrl?.trim(),
  );

  return (
    <>
      <section
        aria-labelledby="about-handcrafted-title"
        className="bg-white"
      >
        <PageContainer className="mx-auto w-full 2xl:max-w-1920 max-w-1440 !px-0 md:!px-8 lg:!px-10 2xl:!px-[60px]">
          <Reveal direction="up" className="relative h-700 w-full overflow-hidden">
            <div className="absolute inset-0">
              <HeroBackgroundMedia
                desktopImageUrl={image?.desktopUrl ?? ""}
                mobileImageUrl={image?.mobileUrl}
                desktopAlt={image?.alt ?? title}
                mobileAlt={image?.alt ?? title}
                cmsVideoUrl={videoUrl}
              />
            </div>
            <MediaContentOverlay
              solidOpacity={hasMedia ? overlayOpacity : undefined}
              gradient={hasMedia ? undefined : "bottom-strong"}
            />
            <div className="absolute inset-x-0 bottom-0 top-16 z-10 flex flex-col items-center justify-center px-5 md:top-20">
              {/* aboutHandcraftedFigmaSpec.hero.mobile — Figma 2556:36067 */}
              <div className="flex flex-col items-center max-sm:w-[186px] max-sm:gap-3 w-fit sm:max-w-[440px] sm:gap-4">
                <Reveal
                  as="h2"
                  direction="up"
                  id="about-handcrafted-title"
                  className="w-full break-words text-center font-larken text-32 font-light leading-110 text-white md:text-[40px] lg:text-5xl"
                >
                  {title}
                </Reveal>
                <span className="h-px sm:w-full w-[98px] bg-neutral300" aria-hidden />
              </div>
            </div>
          </Reveal>
        </PageContainer>
        <PageContainer className="mt-6 !px-3 md:!px-8 lg:!px-10 2xl:!px-[60px]">
          <AboutHandcraftedTileGrid cards={cards} />
        </PageContainer>
      </section>
      <VerticalScrollLine className="!py-5" />
    </>
  );
};

export default AboutHandcraftedSection;
