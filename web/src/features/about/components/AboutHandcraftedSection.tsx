import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedAboutCraft } from "@/services/about/about-page.types";
import AboutHandcraftedHeroMedia from "./AboutHandcraftedHeroMedia";
import AboutHandcraftedTileGrid from "./AboutHandcraftedTileGrid";
import VerticalScrollLine from "./VerticalScrollLine";

type AboutHandcraftedSectionProps = NormalizedAboutCraft;

const AboutHandcraftedSection = ({
  title,
  videoUrl,
  posterUrl,
  overlayOpacity,
  cards,
}: AboutHandcraftedSectionProps) => (
  <>
    <section
      aria-labelledby="about-handcrafted-title"
      className="bg-white"
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
      <PageContainer className="mt-6 sm:px-5 px-3">
        <AboutHandcraftedTileGrid cards={cards} />
      </PageContainer>
    </section>
    <VerticalScrollLine className="!py-5" />
  </>
);

export default AboutHandcraftedSection;
