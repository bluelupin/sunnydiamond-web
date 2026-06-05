"use client";

import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import SectionImage from "@/assets/section6-card1.webp";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";

interface OccasionsTeaserSectionProps {
  id?: string;
}

const OccasionsTeaserSection = ({ id }: OccasionsTeaserSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const occasionSection = editorialData?.occasionSection ?? null;
  const sectionTitle = occasionSection?.sectionTitle?.trim();
  const isActive = occasionSection?.isActive === true;


  // const forYouForever = occasionSection?.bespokeForYouCards ?? null;
  const headingRef = useFadeIn(0);
  const card1Ref = useFadeIn(150);
  const card2Ref = useFadeIn(300);

  const cardRefs = [card1Ref, card2Ref];

  if (isEditorialLoading) {
    return (
      <section id={id} className="md:px-0 px-4 py-10 sm:py-12 md:py-16 lg:py-20 bg-gray200 lg:min-h-948" aria-busy="true">
        <div className="h-10 w-80 bg-gray300 rounded mx-auto mb-4 sm:mb-6 md:mb-8 lg:mb-10" aria-hidden />
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-12">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-square md:aspect-auto h-357 md:h-auto lg:h-620 overflow-hidden bg-gray300/70" aria-hidden />
              <div className="mt-4 text-center md:px-4 px-2">
                <div className="h-6 w-52 bg-gray300 rounded mx-auto mb-2" aria-hidden />
                <div className="h-5 w-72 bg-gray300 rounded mx-auto" aria-hidden />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // const cards = Array.isArray(forYouForever?.cards)
  //   ? [...forYouForever.cards]
  //     .filter((c) => c?.isActive !== false)
  //     .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
  //   : [];

  // if (!sectionTitle || cards.length === 0) return null;
  // if (!sectionTitle) return null;

  return (
    <section
      id={id}
      ref={headingRef as React.RefObject<HTMLHeadingElement>}
      className="bg-gray200 py-6 sm:py-10 md:py-16 lg:py-20">
      <div className="md:px-3 pl-3">
        <h2 className="md:mb-10 mb-8 lg:text-5xl md:text-4xl text-32 font-larken font-light tracking-[0%] leading-[100%] text-black text-center">
          {sectionTitle || "Timeless Pieces for Every Occasion (F)"}
        </h2>
        {/* Mobile: horizontal scroll | Desktop: 3-column full-width grid */}
        <div
          className="flex md:gap-4 gap-3 overflow-x-auto snap-x snap-mandatory  px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {occasionSection.occasions?.map((card: any, idx: any) => (
            <Link
              key={card.id}
              href={`/products?occasion=${card.slug}`}
              className="group relative overflow-hidden flex-shrink-0 w-[78%] snap-start md:w-auto h-auto transition-shadow duration-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ResponsiveImage
                desktopSrc={SectionImage || ""}
                alt={card.title}
                priority
                width={800}
                height={1024}
                quality={90}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-5 md:bottom-6 flex items-center justify-center">
                <span className="text-base sm:text-lg md:text-xl tracking-[0.3em] uppercase text-gray200 font-gill font-normal tracking-[1.8%] text-center leading-[100%]">
                  {card.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-12">
          {occasionSection.occasions?.map((card: any, idx: any) => {
            // const imgUrl = getCmsAssetUrl(card?.image?.data?.attributes?.url);
            const title = card?.title?.trim() ?? "";
            // const subtitle = card?.subtitle?.trim() ?? "";
            // if (!imgUrl || !cardTitle) return null;
            return (
              <figure
                key={card.id}
                // ref={cardRefs[idx] as React.RefObject<HTMLElement>}
                className="flex flex-col"
              >
                <div className="aspect-square md:aspect-auto h-357 md:h-auto lg:h-620 overflow-hidden">
                  <OptimizedImage
                  src={imgUrl}
                  alt={cardTitle}
                  width={1280}
                  height={1280}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                </div>
                <figcaption className="mt-4 text-center md:px-4 px-2">
                  <h3 className="mb-2 text-base md:text-lg lg:text-xl tracking-[1.8%] font-normal leading-[150%] text-black font-gill">
                    {title}
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl text-darkblack leading-[100%] tracking-[1%] font-light font-gill">
                  {subtitle}
                </p>
                </figcaption>
              </figure>
            )
          })}
        </div> */}
      </div>
    </section>
  );
};

export default OccasionsTeaserSection;
