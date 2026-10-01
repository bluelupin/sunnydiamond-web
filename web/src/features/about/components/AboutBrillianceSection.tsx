"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { aboutCraftingRarityFigmaSpec } from "../data/content";
import { useCraftingRarityScrollReveal } from "../hooks/useCraftingRarityScrollReveal";
import type { NormalizedBrillianceSection } from "@/services/about/about-page.types";
import Reveal from "@/shared/Animation/Reveal";
import VerticalScrollLine from "./VerticalScrollLine";

const { image: imageSpec } = aboutCraftingRarityFigmaSpec;

type AboutBrillianceSectionProps = NormalizedBrillianceSection;

const AboutBrillianceSection = ({
  heading,
  body,
  image,
}: AboutBrillianceSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCraftingRarityScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-crafting-rarity-title"
      className="bg-white py-16 md:py-104"
    >
      <PageContainer className="flex w-full justify-center">
        <div className="flex w-full lg:max-w-[950px] max-w-[700px] flex-col items-center text-center md:gap-6 gap-5">
          <div
            data-reveal-mask="heading"
            className="w-full overflow-hidden"
          >
            <Reveal as="h2" direction="up"
              id="about-crafting-rarity-title"
              className="whitespace-pre-line font-larken font-light leading-110 text-darkblack text-32 md:text-4xl lg:text-5xl">
              {heading}
            </Reveal>
          </div>
          {image ? (
            <div data-reveal-mask="image" className="mx-auto w-full overflow-hidden">
              <Reveal direction="up"
                className="mx-auto w-[156px] h-[156px] md:h-[265px] md:w-[265px]">
                <ResponsiveImage
                  desktopSrc={image.desktopUrl}
                  mobileSrc={image.mobileUrl}
                  alt={image.alt}
                  width={image.width ?? imageSpec.width}
                  height={image.height ?? imageSpec.height}
                  quality={80}
                  className="object-cover"
                />
              </Reveal>
            </div>
          ) : null}
          <VerticalScrollLine />
          <Reveal as="p" direction="up" className="font-gill font-light leading-110 text-darkblack lg:text-xl text-base mx-auto max-w-[770px]">
            {body}
          </Reveal>
        </div>
      </PageContainer>
    </section >
  );
};

export default AboutBrillianceSection;
