"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import {
  aboutCraftingRarityContent,
  aboutCraftingRarityFigmaSpec,
  aboutPageImages,
} from "../data/content";
import { useCraftingRarityScrollReveal } from "../hooks/useCraftingRarityScrollReveal";

const { image: imageSpec, line: lineSpec } = aboutCraftingRarityFigmaSpec;

const revealEase = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

const AboutCraftingRaritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { headingActive, imageActive, lineFill, descriptionActive, reducedMotion } =
    useCraftingRarityScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-crafting-rarity-title"
      className="bg-white py-16 md:py-20 lg:py-[100px]"
    >
      <div className="container flex justify-center">
        <div className="flex w-full flex-col items-center text-center lg:min-h-[745px]">
          <div
            className={cn(
              "w-full overflow-hidden pt-[20px] mb-7",
              `transition-all ${revealEase}`,
              headingActive ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <h2
              id="about-crafting-rarity-title"
              className={cn(
                "font-larken font-light text-[40px] sm:text-[56px] md:text-[72px] lg:text-[90px] leading-[110%] text-darkblack whitespace-pre-line",
                `transition-transform ${revealEase}`,
                headingActive ? "translate-y-0" : "translate-y-6",
              )}
            >
              {aboutCraftingRarityContent.heading}
            </h2>
          </div>

          <div
            className={cn(
              "mx-auto w-full overflow-hidden mt-3 sm:mt-4 lg:mt-1",
              `transition-all ${revealEase}`,
              imageActive ? "max-h-[354px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div
              className={cn(
                "mx-auto w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[354px] lg:h-[354px]",
                `transition-transform ${revealEase}`,
                imageActive ? "translate-y-0 scale-100" : "translate-y-4 scale-[0.98]",
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

          <div
            className={cn(
              "mt-3.5 sm:mt-[18px] lg:mt-[23px] h-[79px] w-px overflow-hidden",
              imageActive ? "opacity-100" : "opacity-0",
              `transition-opacity ${revealEase}`,
            )}
            aria-hidden
          >
            <div
              className={cn(
                "w-px origin-top bg-gradient-to-b from-darkMagenta to-[#DDA957]",
                reducedMotion ? "" : "transition-transform duration-500 ease-out",
              )}
              style={{
                height: `${lineSpec.height}px`,
                transform: `scaleY(${lineFill})`,
              }}
            />
          </div>

          <p
            className={cn(
              "mt-2.5 sm:mt-3 lg:mt-[13px] w-full max-w-[523px] font-gill font-light text-base leading-[110%] text-darkblack md:text-lg lg:text-[20px]",
              `transition-all ${revealEase}`,
              descriptionActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            {aboutCraftingRarityContent.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutCraftingRaritySection;
