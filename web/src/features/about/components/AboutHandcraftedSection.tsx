import Image from "next/image";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import {
  aboutHandcraftedAssets,
  aboutHandcraftedContent,
  aboutHandcraftedFigmaSpec,
  aboutPageImages,
} from "../data/content";

const { hero, card: cardSpec, centerImage } = aboutHandcraftedFigmaSpec;

/** Figma node 692:27332 — card positions within 1160.45 × 693.45 group */
const handcraftedCards = [
  {
    title: aboutHandcraftedContent.cards[0].title,
    className: "left-[20.17%] top-0",
    gapClassName: "gap-3",
  },
  {
    title: aboutHandcraftedContent.cards[1].title,
    className: "left-[40.43%] top-[34.04%]",
    gapClassName: "gap-3",
  },
  {
    title: aboutHandcraftedContent.cards[2].title,
    className: "left-[20.09%] top-[67.97%]",
    gapClassName: "gap-2.5",
  },
] as const;

const AboutHandcraftedSection = () => {
  return (
    <section aria-labelledby="about-handcrafted-title" className="bg-white">
      <PageContainer>
        <div className="relative h-420 overflow-hidden sm:h-560 lg:h-700">
          <div className="absolute inset-0">
            <ResponsiveImage
              desktopSrc={aboutPageImages.handcraftedBg}
              alt="Handcrafted diamond jewellery"
              width={hero.width}
              height={hero.height}
              quality={90}
              sizes="(max-width: 1024px) 100vw, 1360px"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-black/30" aria-hidden />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 lg:top-315 lg:translate-y-0">
            <h2
              id="about-handcrafted-title"
              className="text-center font-larken text-32 font-light leading-110 text-white md:text-40 lg:text-48"
            >
              {aboutHandcraftedContent.title}
            </h2>
            <span className="h-px w-full max-w-440 bg-neutral300" aria-hidden />
          </div>
        </div>
      </PageContainer>

      <div className="relative z-10 mt-6">
        <div className="overflow-x-auto scrollbar-none">
          <div className="relative mx-auto h-693 w-1160 min-w-1160 max-w-1160">
            <Image
              src={aboutHandcraftedAssets.gridMask}
              alt=""
              width={1161}
              height={694}
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
            />

            <div className="handcrafted-grid-mask absolute inset-0 shadow-aboutImage">
              <div className="about-handcrafted-photo absolute max-w-none">
                <ResponsiveImage
                  desktopSrc={aboutPageImages.craftsmanship}
                  alt="Diamond craftsmanship detail"
                  width={centerImage.width}
                  height={centerImage.height}
                  quality={90}
                  sizes={`${centerImage.width}px`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {handcraftedCards.map((item) => (
              <article
                key={item.title}
                className={cn(
                  "absolute z-10 flex h-[32.08%] w-[19.17%] flex-col items-center justify-center bg-chalkCard",
                  item.gapClassName,
                  item.className,
                )}
              >
                <Image
                  src={aboutHandcraftedAssets.flourish}
                  alt=""
                  width={cardSpec.iconWidth}
                  height={cardSpec.iconHeight}
                  aria-hidden
                  className="h-15 w-16 shrink-0"
                />
                <h3 className="max-w-177 text-center font-larken text-24 font-light leading-110 text-darkblack">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHandcraftedSection;
