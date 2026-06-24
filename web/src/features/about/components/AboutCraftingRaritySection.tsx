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
import { useCraftingRarityLoadReveal } from "../hooks/useCraftingRarityLoadReveal";
import VerticalScrollLine from "./VerticalScrollLine";

const { image: imageSpec, line: lineSpec, animation: animationSpec } =
  aboutCraftingRarityFigmaSpec;

type FigmaMaskRevealProps = {
  revealed: boolean;
  reducedMotion: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Figma heading_mask / image_mask / line_mask — 0.5px → full height (top-down wipe).
 * Content keeps layout space; clip-path matches Smart Animate mask expand.
 */
const FigmaMaskReveal = ({
  revealed,
  reducedMotion,
  className,
  children,
}: FigmaMaskRevealProps) => {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "overflow-hidden transition-[clip-path] ease-in-out motion-reduce:transition-none",
        revealed ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
        className,
      )}
      style={{ transitionDuration: `${animationSpec.stepDurationMs}ms` }}
    >
      {children}
    </div>
  );
};

const AboutCraftingRaritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { heading, image, line, body, lineFill, reducedMotion } =
    useCraftingRarityLoadReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-crafting-rarity-title"
      className="bg-white pt-14 sm:pt-16 lg:pt-100"
    >
      <PageContainer className="flex w-full justify-center">
        <div className="flex w-full max-w-[950px] flex-col items-center text-center">
          <FigmaMaskReveal
            revealed={heading}
            reducedMotion={reducedMotion}
            className="w-full pt-0 lg:mb-12 md:mb-9 mb-8"
          >
            <h2
              id="about-crafting-rarity-title"
              className="whitespace-pre-line font-larken text-40 font-light leading-110 text-darkblack sm:text-56 md:text-72 lg:text-90"
            >
              {aboutCraftingRarityContent.heading}
            </h2>
          </FigmaMaskReveal>

          <FigmaMaskReveal
            revealed={image}
            reducedMotion={reducedMotion}
            className="mx-auto w-full"
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
          </FigmaMaskReveal>

          <FigmaMaskReveal
            revealed={line}
            reducedMotion={reducedMotion}
            className="mt-5 lg:mt-[23px]"
          >
            <VerticalScrollLine
              lineFill={lineFill}
              reducedMotion={reducedMotion}
              visible={line || reducedMotion}
              lineHeight={lineSpec.height}
            />
          </FigmaMaskReveal>

          <p
            className={cn(
              "mx-auto mt-2.5 w-full max-w-557 font-gill text-base font-light leading-110 text-gray600 sm:mt-3 lg:mt-[13px] lg:text-20",
              !reducedMotion &&
              "transition-[opacity,transform] ease-in-out motion-reduce:transition-none",
              reducedMotion || body
                ? "translate-y-0 opacity-100"
                : "translate-y-0 opacity-0",
            )}
            style={
              reducedMotion
                ? undefined
                : { transitionDuration: `${animationSpec.stepDurationMs}ms` }
            }
          >
            {aboutCraftingRarityContent.description}
          </p>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutCraftingRaritySection;
