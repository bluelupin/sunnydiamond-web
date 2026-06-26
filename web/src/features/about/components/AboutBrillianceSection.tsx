"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { aboutCraftingRarityFigmaSpec } from "../data/content";
import {
  craftingRarityLineSpec,
  useCraftingRarityScrollReveal,
} from "../hooks/useCraftingRarityScrollReveal";
import type { NormalizedBrillianceSection } from "@/services/about/about-page.types";

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
      className="bg-white pt-14 sm:pt-16 lg:pt-100"
    >
      <PageContainer className="flex w-full justify-center">
        <div className="flex w-full max-w-[950px] flex-col items-center text-center">
          <div
            data-reveal-mask="heading"
            className="w-full overflow-hidden pt-0 lg:mb-12 md:mb-9 mb-8"
          >
            <h2
              id="about-crafting-rarity-title"
              className="whitespace-pre-line font-larken text-40 font-light leading-110 text-darkblack sm:text-56 md:text-72 lg:text-90"
            >
              {heading}
            </h2>
          </div>

          <div data-reveal-mask="image" className="mx-auto w-full overflow-hidden">
            <div className="mx-auto h-auto w-220 sm:h-280 sm:w-280 lg:h-354 lg:w-354 2xl:w-400 2xl:h-400">
              <ResponsiveImage
                desktopSrc={image.desktopUrl}
                mobileSrc={image.mobileUrl}
                alt={image.alt}
                width={image.width ?? imageSpec.width}
                height={image.height ?? imageSpec.height}
                quality={80}
                // sizes="(max-width: 768px) 220px, 354px"
                className="object-cover"
              />
            </div>
          </div>

          <div
            data-reveal-mask="line"
            className="mt-5 overflow-hidden lg:mt-[23px]"
          >
            <div
              data-reveal-line="wrapper"
              className="flex w-full justify-center bg-white opacity-0"
              aria-hidden
            >
              <div
                className="w-px overflow-hidden opacity-100"
                style={{ height: craftingRarityLineSpec.height }}
              >
                <div
                  data-reveal-line="fill"
                  className="w-px origin-top bg-gradient-to-b from-darkMagenta to-goldAccent"
                  style={{
                    height: craftingRarityLineSpec.height,
                    transform: "scaleY(0)",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            data-reveal-mask="body"
            className="mx-auto mt-2.5 max-w-full md:max-w-[450px] lg:max-w-557 2xl:max-w-[620px] overflow-hidden"
          >
            <p className="font-gill text-base font-light leading-110 text-gray600 sm:mt-3 lg:mt-[13px] lg:text-20 2xl:text-22">
              {body}
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutBrillianceSection;
