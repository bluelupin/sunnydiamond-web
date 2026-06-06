"use client";

import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

interface OccasionsTeaserSectionProps {
  id?: string;
}

const OccasionsTeaserSection = ({ id }: OccasionsTeaserSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const occasionSection = editorialData?.occasionSection ?? null;
  const sectionTitle = occasionSection?.sectionTitle?.trim();
  const isActive = occasionSection?.isActive === true;

  const headingRef = useFadeIn(0);
  if (!isActive) { return null; }
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
  return (
    <section
      id={id}
      ref={headingRef as React.RefObject<HTMLHeadingElement>}
      className="bg-gray200 py-6 sm:py-10 md:py-16 lg:py-20">
      <div className="md:px-3 pl-3">
        <h2 className="md:mb-10 mb-8 lg:text-5xl md:text-4xl text-32 font-larken font-light tracking-[0%] leading-[100%] text-black text-center">
          {sectionTitle}
        </h2>
        <div
          className="flex md:gap-4 gap-3 overflow-x-auto snap-x snap-mandatory  px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {occasionSection.occasions?.map((card: any, idx: any) => {
            const desktopImageUrl = resolveCmsMediaUrl(card?.image?.desktopImage ?? card?.image);
            const mobileImageUrl = resolveCmsMediaUrl(card?.image?.mobileImage ?? card?.image);

            return (
              <Link
                key={card.id}
                href={`/products?occasion=${card.slug}`}
                className="group relative overflow-hidden flex-shrink-0 w-[78%] lg:aspect-[460/620] aspect-[260/350] snap-start md:w-auto h-auto transition-shadow duration-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ResponsiveImage
                  desktopSrc={desktopImageUrl || ""}
                  mobileSrc={mobileImageUrl}
                  alt={card.title}
                  priority
                  width={desktopImageUrl ? 460 : 260}
                  height={desktopImageUrl ? 620 : 350}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OccasionsTeaserSection;
