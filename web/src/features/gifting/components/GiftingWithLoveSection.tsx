"use client";

import { useRef } from "react";
import CraftingRarityScrollLine from "@/features/about/components/CraftingRarityScrollLine";
import { useCraftingRarityScrollReveal } from "@/features/about/hooks/useCraftingRarityScrollReveal";
import Reveal from "@/shared/Animation/Reveal";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedGiftingIntro } from "@/services/gifting/gifting-page.types";

type GiftingWithLoveSectionProps = {
  intro: NormalizedGiftingIntro;
};

const GiftingWithLoveSection = ({ intro }: GiftingWithLoveSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCraftingRarityScrollReveal(sectionRef);

  const imageAlt = intro.background?.alt?.trim() || intro.title;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="gifting-with-love-title"
      className="bg-white pt-10 sm:pt-16 lg:min-h-[700px] lg:pt-104"
    >
      <PageContainer className="flex w-full justify-center">
        <div className="flex w-full max-w-[700px] flex-col items-center text-center lg:max-w-[950px]">
          <div
            data-reveal-mask="heading"
            className="mb-8 w-full overflow-hidden pt-0"
          >
            <Reveal
              as="h2"
              id="gifting-with-love-title"
              direction="up"
              className="whitespace-pre-line font-larken font-light leading-110 text-darkblack text-32 md:text-4xl lg:text-5xl"
            >
              {intro.title}
            </Reveal>
          </div>
          {intro.background ? (
            <div data-reveal-mask="image" className="mx-auto w-full overflow-hidden">
              <Reveal
                direction="up"
                className="mx-auto h-[300px] w-[300px] lg:h-[350px] lg:w-[350px]"
              >
                <ResponsiveImage
                  desktopSrc={intro.background.desktopUrl}
                  mobileSrc={intro.background.mobileUrl}
                  alt={imageAlt}
                  width={intro.background.width ?? 354}
                  height={intro.background.height ?? 354}
                  quality={80}
                  sizes="(max-width: 1536px) 300px, 400px"
                  className="object-contain object-center lg:object-cover"
                />
              </Reveal>
            </div>
          ) : null}
          <CraftingRarityScrollLine className="mt-5 lg:mt-[23px]" />
          {intro.description ? (
            <Reveal
              as="p"
              direction="up"
              className="mx-auto mt-2.5 max-w-full font-gill text-base font-light leading-110 text-darkblack sm:mt-3 md:max-w-[450px] lg:mt-[13px] lg:text-xl lg:max-w-[650px] 2xl:text-22"
            >
              {intro.description}
            </Reveal>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
};

export default GiftingWithLoveSection;
