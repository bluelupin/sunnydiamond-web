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
      className="bg-white py-10 sm:py-16 lg:py-100"
    >
      <PageContainer className="flex w-full justify-center">
        <div className="flex w-full lg:max-w-[950px] max-w-[700px] flex-col items-center text-center">
          <div
            data-reveal-mask="heading"
            className="w-full overflow-hidden pt-0 mb-8"
          >
            <Reveal as="h2" direction="up"
              id="about-crafting-rarity-title"
              className="whitespace-pre-line font-larken text-40 font-light leading-110 text-darkblack sm:text-56 md:text-7xl lg:text-90">
              {heading}
            </Reveal>
          </div>
          <div data-reveal-mask="image" className="mx-auto w-full overflow-hidden">
            <Reveal direction="up"
              className="mx-auto h-[300px] w-[300px] lg:h-354 lg:w-354 2xl:w-400 2xl:h-400">
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
          <VerticalScrollLine className="lg:mt-[23px] mt-5" />
          <Reveal as="p" direction="up" className="font-gill text-base font-light leading-110 text-gray600 sm:mt-3 lg:mt-[13px] lg:text-xl 2xl:text-22 mx-auto mt-2.5 max-w-full md:max-w-[450px] lg:max-w-557 2xl:max-w-[620px]">
            {body}
          </Reveal>
        </div>
      </PageContainer>
    </section >
  );
};

export default AboutBrillianceSection;
