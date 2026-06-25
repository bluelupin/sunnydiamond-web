"use client";

import { type ReactNode, useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import { aboutCraftingRarityFigmaSpec } from "../data/content";
import { useCraftingRarityScrollReveal } from "../hooks/useCraftingRarityScrollReveal";
import type { NormalizedCraftingRarity } from "@/services/about/about-page.types";
import VerticalScrollLine from "./VerticalScrollLine";

const { image: imageSpec, line: lineSpec } = aboutCraftingRarityFigmaSpec;

type FigmaMaskRevealProps = {
  reveal: number;
  reducedMotion: boolean;
  className?: string;
  children: ReactNode;
};

const FigmaMaskReveal = ({
  reveal,
  reducedMotion,
  className,
  children,
}: FigmaMaskRevealProps) => {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const clampedReveal = Math.min(1, Math.max(0, reveal));
  const maskHeight = `${clampedReveal * 100}%`;

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{
        clipPath: `inset(0 0 ${(1 - clampedReveal) * 100}% 0 round 0)`,
        WebkitClipPath: `inset(0 0 ${(1 - clampedReveal) * 100}% 0 round 0)`,
        maskImage: "linear-gradient(black, black)",
        WebkitMaskImage: "linear-gradient(black, black)",
        maskSize: `100% ${maskHeight}`,
        WebkitMaskSize: `100% ${maskHeight}`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "top",
        WebkitMaskPosition: "top",
      }}
    >
      {children}
    </div>
  );
};

type AboutCraftingRaritySectionProps = NormalizedCraftingRarity;

const AboutCraftingRaritySection = ({
  heading,
  description,
  image,
}: AboutCraftingRaritySectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    headingReveal,
    imageReveal,
    lineReveal,
    lineFill,
    bodyReveal,
    reducedMotion,
  } = useCraftingRarityScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-crafting-rarity-title"
      className="bg-white pt-14 sm:pt-16 lg:pt-100"
    >
      <PageContainer className="flex w-full justify-center">
        <div className="flex w-full max-w-[950px] flex-col items-center text-center">
          <FigmaMaskReveal
            reveal={headingReveal}
            reducedMotion={reducedMotion}
            className="w-full pt-0 lg:mb-12 md:mb-9 mb-8"
          >
            <h2
              id="about-crafting-rarity-title"
              className="whitespace-pre-line font-larken text-40 font-light leading-110 text-darkblack sm:text-56 md:text-72 lg:text-90"
            >
              {heading}
            </h2>
          </FigmaMaskReveal>

          <FigmaMaskReveal
            reveal={imageReveal}
            reducedMotion={reducedMotion}
            className="mx-auto w-full"
          >
            <div className="mx-auto h-auto w-220 sm:h-280 sm:w-280 lg:h-354 lg:w-354">
              <ResponsiveImage
                desktopSrc={image.desktopUrl}
                mobileSrc={image.mobileUrl}
                alt={image.alt}
                width={image.width ?? imageSpec.width}
                height={image.height ?? imageSpec.height}
                quality={90}
                sizes="(max-width: 768px) 220px, 354px"
                className="object-cover"
              />
            </div>
          </FigmaMaskReveal>

          <FigmaMaskReveal
            reveal={lineReveal}
            reducedMotion={reducedMotion}
            className="mt-5 lg:mt-[23px]"
          >
            <VerticalScrollLine
              lineFill={lineFill}
              reducedMotion={reducedMotion}
              visible={lineReveal > 0.02 || reducedMotion}
              lineHeight={lineSpec.height}
            />
          </FigmaMaskReveal>

          <p
            className="mx-auto mt-2.5 w-full max-w-557 font-gill text-base font-light leading-110 text-gray600 sm:mt-3 lg:mt-[13px] lg:text-20"
            style={reducedMotion ? undefined : { opacity: bodyReveal }}
          >
            {description}
          </p>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutCraftingRaritySection;
