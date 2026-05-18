 "use client";

import OptimizedImage from "@/components/shared/OptimizedImage";
import { useFadeIn } from "@/hooks/use-fade-in";
import { homeContent } from "@/data/content";
import type { StaticImageData } from "next/image";
import bespokeImg from "@/assets/section9-card1.webp";
import diamondsImg from "@/assets/section9-card2.webp";

interface ForYouForeverProps {
  id?: string;
}

const imageMap: Record<string, string | StaticImageData> = {
  "foryou-bespoke": bespokeImg,
  "foryou-diamonds": diamondsImg,
};

const ForYouForever = ({ id }: ForYouForeverProps) => {
  const { forYouForever } = homeContent;
  const headingRef = useFadeIn(0);
  const card1Ref = useFadeIn(150);
  const card2Ref = useFadeIn(300);

  const cardRefs = [card1Ref, card2Ref];

  return (
    <section id={id} className="md:px-0 px-4 py-10 sm:py-12 md:py-16 lg:py-20 bg-gray200 lg:min-h-948">
      <h2
        ref={headingRef as React.RefObject<HTMLHeadingElement>}
        className="lg:text-5xl md:text-4xl text-32 text-center text-darkblack font-larken font-light tracking-[0%] leading-[100%] mb-4 sm:mb-6 md:mb-8 lg:mb-10"
      >
        {forYouForever.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-12">
        {forYouForever.cards.map((card, idx) => (
          <figure
            key={card.title}
            ref={cardRefs[idx] as React.RefObject<HTMLElement>}
            className="flex flex-col"
          >
            <div className="aspect-square md:aspect-auto h-357 md:h-auto lg:h-620 overflow-hidden">
              <OptimizedImage
                src={imageMap[card.image]}
                alt={card.title}
                width={1280}
                height={1280}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <figcaption className="mt-4 text-center md:px-4 px-2">
              <h3 className="mb-2 text-base md:text-lg lg:text-xl tracking-[1.8%] font-normal leading-[150%] text-black font-gill">
                {card.title}
              </h3>
              <p className="text-base md:text-lg lg:text-xl text-darkblack leading-[100%] tracking-[1%] font-light font-gill">
                {card.subtitle}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default ForYouForever;
