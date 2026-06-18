"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import {
  aboutCraftingRarityContent,
  aboutCraftingRarityFigmaSpec,
  aboutPageImages,
} from "../data/content";
import { useCraftingRarityScrollReveal } from "../hooks/useCraftingRarityScrollReveal";
import VerticalScrollLine from "./VerticalScrollLine";

const { image: imageSpec } = aboutCraftingRarityFigmaSpec;

const revealEase = "duration-700 ease-reveal";

const AboutCraftingRaritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { headingActive, imageActive, descriptionActive } =
    useCraftingRarityScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-crafting-rarity-title"
      className="bg-white py-16 md:py-20 lg:py-100"
    >
      <PageContainer className="flex justify-center">
        <div className="flex w-full flex-col items-center text-center lg:min-h-745">
          <div
            className={cn(
              "mb-7 w-full overflow-hidden pt-5",
              `transition-all ${revealEase}`,
              headingActive ? "max-h-260 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <h2
              id="about-crafting-rarity-title"
              className={cn(
                "whitespace-pre-line font-larken text-40 font-light leading-110 text-darkblack sm:text-56 md:text-72 lg:text-90",
                `transition-transform ${revealEase}`,
                headingActive ? "translate-y-0" : "translate-y-6",
              )}
            >
              {aboutCraftingRarityContent.heading}
            </h2>
          </div>

          <div
            className={cn(
              "mx-auto mt-3 w-full overflow-hidden sm:mt-4 lg:mt-1",
              `transition-all ${revealEase}`,
              imageActive ? "max-h-354 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div
              className={cn(
                "mx-auto h-220 w-220 sm:h-280 sm:w-280 lg:h-354 lg:w-354",
                `transition-transform ${revealEase}`,
                imageActive ? "translate-y-0 scale-100" : "translate-y-4 scale-98",
              )}
            >
              <ResponsiveImage
                desktopSrc={aboutPageImages.craftingDiamond}
                alt="Internally flawless diamond"
                width={imageSpec.width}
                height={imageSpec.height}
                quality={90}
                sizes="(max-width: 768px) 220px, 354px"
                className="object-cover"
              />
            </div>
          </div>
          <VerticalScrollLine className="pt-5" />
          <p
            className={cn(
              "mt-2.5 w-full max-w-523 font-gill text-base font-light leading-110 text-darkblack sm:mt-3 md:text-lg lg:mt-13 lg:text-20",
              `transition-all ${revealEase}`,
              descriptionActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            {aboutCraftingRarityContent.description}
          </p>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutCraftingRaritySection;
