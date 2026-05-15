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
    <section id={id} className="py-20 md:py-28 bg-background">
      <h2
        ref={headingRef as React.RefObject<HTMLHeadingElement>}
        className="text-h2 text-center text-foreground mb-16 md:mb-20 px-4"
      >
        {forYouForever.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {forYouForever.cards.map((card, idx) => (
          <figure
            key={card.title}
            ref={cardRefs[idx] as React.RefObject<HTMLElement>}
            className="flex flex-col"
          >
            <div className="aspect-square md:aspect-auto md:h-[620px] overflow-hidden">
              <OptimizedImage
                src={imageMap[card.image]}
                alt={card.title}
                width={1280}
                height={1280}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <figcaption className="text-center px-6 py-10 md:py-14 max-w-md mx-auto">
              <h3 className="text-sm md:text-base font-sans font-medium tracking-[0.25em] text-foreground mb-4">
                {card.title}
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
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
