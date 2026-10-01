import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedAboutCraft } from "@/services/about/about-page.types";
import AboutHandcraftedTileGrid from "./AboutHandcraftedTileGrid";
import VerticalScrollLine from "./VerticalScrollLine";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";

type AboutHandcraftedSectionProps = NormalizedAboutCraft & {
  /** Decorative line before the timeline — hidden when timeline is inactive. */
  showTimelineScrollLine?: boolean;
};

const AboutHandcraftedSection = ({
  showHero,
  showMosaic,
  title,
  videoUrl,
  image,
  overlayOpacity,
  cards,
  showTimelineScrollLine = true,
}: AboutHandcraftedSectionProps) => {
  const hasMedia = Boolean(
    image?.desktopUrl?.trim() || image?.mobileUrl?.trim() || videoUrl?.trim(),
  );

  return (
    <>
      <section
        aria-labelledby={showHero ? "about-handcrafted-title" : undefined}
        className="bg-white"
      >
        {showHero ? (
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
                <div className="flex flex-col items-center md:w-[520px] w-[186px] sm:gap-4 gap-3">
                  <Reveal
                    as="h2"
                    direction="up"
                    id="about-handcrafted-title"
                    className="w-full break-words text-center font-larken font-light leading-110 text-white text-32 md:text-5xl"
                  >
                    {title}
                  </Reveal>
                  <span className="h-px md:w-[520px] w-[186px] bg-neutral300" aria-hidden />
                </div>
              </div>
            </Reveal>
          </PageContainer>
        ) : null}
        {showMosaic ? (
          <PageContainer
            className={cn(
              "!px-3 md:!px-8 lg:!px-10 2xl:!px-[60px]",
              showHero ? "mt-6" : "mt-0",
            )}
          >
            <AboutHandcraftedTileGrid cards={cards} />
          </PageContainer>
        ) : null}
      </section>
      {showTimelineScrollLine ? (
        <VerticalScrollLine
          className="!pt-6 md:!pb-6 !pb-4"
          height={{ default: 72, md: 72, lg: 105 }}
          backgroundColor="#DECAA0"
        />
      ) : null}
    </>
  );
};

export default AboutHandcraftedSection;
