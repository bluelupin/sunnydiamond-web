"use client";

import { type ReactNode, useRef } from "react";
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

const {
  image: imageSpec,
  line: lineSpec,
  animation: animationSpec,
} = aboutCraftingRarityFigmaSpec;

type MaskRevealProps = {
  reveal: number;
  maxHeight: number;
  reducedMotion: boolean;
  className?: string;
  withScale?: boolean;
  children: ReactNode;
};

/** Figma heading_mask / image_mask / line_mask — height expands from 0 */
const MaskReveal = ({
  reveal,
  maxHeight,
  reducedMotion,
  className,
  withScale = false,
  children,
}: MaskRevealProps) => {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const isFullyRevealed = reveal >= 1;
  const height = isFullyRevealed ? maxHeight : reveal * maxHeight;
  const translateY = (1 - reveal) * 20;
  const scale = withScale ? 0.98 + reveal * 0.02 : 1;

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{
        height: isFullyRevealed ? "auto" : `${height}px`,
        maxHeight: isFullyRevealed ? undefined : `${maxHeight}px`,
      }}
    >
      <div
        className="will-change-transform"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const AboutCraftingRaritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    headingReveal,
    imageReveal,
    lineReveal,
    lineFill,
    descriptionReveal,
    reducedMotion,
  } = useCraftingRarityScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} aria-labelledby="about-crafting-rarity-title" className="bg-white">
      <div style={{ height: `${animationSpec.scrollTrackVh}vh` }}>
        <div className="sticky top-0 flex min-h-screen items-center py-16 md:py-20 lg:py-100">
          <PageContainer className="flex w-full justify-center">
            <div className="flex w-full flex-col items-center text-center lg:min-h-745">
              <MaskReveal
                reveal={headingReveal}
                maxHeight={animationSpec.headingMaskHeight}
                reducedMotion={reducedMotion}
                className="w-full pt-5 lg:pt-[20px]"
              >
                <h2
                  id="about-crafting-rarity-title"
                  className="whitespace-pre-line font-larken font-light leading-110 text-darkblack lg:text-90 md:text-72 sm:text-56 text-40"
                >
                  {aboutCraftingRarityContent.heading}
                </h2>
              </MaskReveal>

              <MaskReveal
                reveal={imageReveal}
                maxHeight={animationSpec.imageMaskHeight}
                reducedMotion={reducedMotion}
                withScale
                className="mx-auto w-full sm:mt-4 lg:mt-6 md:mt-5 mt-4"
              >
                <div className="mx-auto h-auto w-220 sm:h-280 sm:w-280 lg:h-354 lg:w-354">
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
              </MaskReveal>
              <MaskReveal
                reveal={lineReveal}
                maxHeight={animationSpec.lineMaskHeight}
                reducedMotion={reducedMotion}
                className="mt-5 lg:mt-[23px]"
              >
                <VerticalScrollLine className="pt-5 pb-8 md:pb-11 lg:pb-[40px]" />
              </MaskReveal>
              <MaskReveal
                reveal={descriptionReveal}
                maxHeight={animationSpec.bodyMaskHeight}
                reducedMotion={reducedMotion}
                className="mt-2.5 w-full sm:mt-3 lg:mt-[13px]"
              >
                <p className="mx-auto w-full max-w-557 font-gill text-base font-light leading-110 text-darkblack md:text-lg lg:text-20">
                  {aboutCraftingRarityContent.description}
                </p>
              </MaskReveal>
            </div>
          </PageContainer>
        </div>
      </div>
    </section>
  );
};

export default AboutCraftingRaritySection;
