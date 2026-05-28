"use client";

import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useBespokeForYouCards } from "@/hooks/homepage/useBespokeForYouCards";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";

interface ForYouForeverProps {
  id?: string;
}

const ForYouForever = ({ id }: ForYouForeverProps) => {
  const { data, isLoading } = useBespokeForYouCards();
  const forYouForever = data?.bespokeForYouCards ?? null;
  const headingRef = useFadeIn(0);
  const card1Ref = useFadeIn(150);
  const card2Ref = useFadeIn(300);

  const cardRefs = [card1Ref, card2Ref];

  if (isLoading) {
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

  const sectionTitle = forYouForever?.sectionTitle?.trim();
  // const cards = Array.isArray(forYouForever?.cards)
  //   ? [...forYouForever.cards]
  //     .filter((c) => c?.isActive !== false)
  //     .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
  //   : [];

  // if (!sectionTitle || cards.length === 0) return null;
  if (!sectionTitle) return null;

  return (
    <section id={id} className="md:px-0 px-4 py-10 sm:py-12 md:py-16 lg:py-20 bg-gray200 lg:min-h-948">
      <h2
        ref={headingRef as React.RefObject<HTMLHeadingElement>}
        className="lg:text-5xl md:text-4xl text-32 text-center text-darkblack font-larken font-light tracking-[0%] leading-[100%] mb-4 sm:mb-6 md:mb-8 lg:mb-10"
      >
        {sectionTitle}
      </h2>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-12">
        {cards.map((card, idx) => {
          const imgUrl = getCmsAssetUrl(card?.image?.data?.attributes?.url);
          const cardTitle = card?.sectionTitle?.trim() ?? "";
          const subtitle = card?.subtitle?.trim() ?? "";
          if (!imgUrl || !cardTitle) return null;
          return (
          <figure
            key={card?.id ?? cardTitle}
            ref={cardRefs[idx] as React.RefObject<HTMLElement>}
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
                {cardTitle}
              </h3>
              <p className="text-base md:text-lg lg:text-xl text-darkblack leading-[100%] tracking-[1%] font-light font-gill">
                {subtitle}
              </p>
            </figcaption>
          </figure>
        )})}
      </div> */}
    </section>
  );
};

export default ForYouForever;
