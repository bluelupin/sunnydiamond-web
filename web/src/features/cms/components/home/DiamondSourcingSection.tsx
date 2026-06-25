"use client";

import { useParallax } from "@/shared/hooks/use-parallax";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import diamondGif from "@/assets/diamond-gif.gif";
import diamondSourcingBg from "@/assets/section3-bg.webp";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { useMemo } from "react";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { isSectionActive } from "@/shared/utils/cmsSection";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
interface DiamondSourcingSectionProps {
  id?: string;
}

const DiamondSourcingSection = ({ id }: DiamondSourcingSectionProps) => {
  const bgParallax = useParallax<HTMLDivElement>(0.25);
  const diamondParallax = useParallax<HTMLDivElement>(-0.45);

  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const diamondSourcedDataSection = editorialData?.diamondSourcingSection ?? null;
  const sectionTitle = diamondSourcedDataSection?.sectionTitle?.trim();
  const desktopImageUrl = useMemo(
    () => resolveCmsMediaUrl(diamondSourcedDataSection?.image?.desktopImage ?? diamondSourcedDataSection?.image?.data?.attributes ?? diamondSourcedDataSection?.image),
    [diamondSourcedDataSection]
  );

  const mobileImageUrl = useMemo(
    () => resolveCmsMediaUrl(diamondSourcedDataSection?.image?.mobileImage ?? diamondSourcedDataSection?.image?.data?.attributes ?? diamondSourcedDataSection?.image),
    [diamondSourcedDataSection]
  );

  const imageAlt = useMemo(
    () =>
      diamondSourcedDataSection?.image?.altText ||
      resolveCmsAltText(diamondSourcedDataSection?.image?.desktopImage ?? diamondSourcedDataSection?.image?.data?.attributes ?? diamondSourcedDataSection?.image) ||
      resolveCmsAltText(diamondSourcedDataSection?.image?.mobileImage ?? diamondSourcedDataSection?.image?.data?.attributes ?? diamondSourcedDataSection?.image) ||
      diamondSourcedDataSection?.sectionTitle ||
      "",
    [diamondSourcedDataSection]
  );

  if (!isSectionActive(diamondSourcedDataSection?.isActive)) {
    return null;
  }

  return (
    <>
      {
        !isEditorialLoading ?
          <section
            id={id}
            aria-label="Internally flawless diamonds"
            className="relative h-auto overflow-hidden py-50"
          >
            <div className="absolute inset-0 -z-0 will-change-transform" ref={bgParallax}>
              <ResponsiveImage
                desktopSrc={diamondSourcingBg || ""}
                alt={imageAlt}
                width={1920}
                height={1080}
                quality={80}
                className="w-full h-full object-cover opacity-90 scale-110"
              />
              <div className="absolute inset-0 bg-background/40" aria-hidden />
            </div>
            <div className="relative container h-full py-12 md:py-16 flex flex-col items-center justify-center text-center">
              <ScrollReveal delayMs={0}>
                <ResponsiveImage
                  desktopSrc={diamondGif || ""}
                  alt={imageAlt}
                  width={64}
                  height={64}
                  quality={80}
                  className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 opacity-80 mx-auto"
                />
              </ScrollReveal>
              <ScrollReveal as="h2" delayMs={80} className="mt-6 lg:text-5xl md:text-4xl text-32 font-light text-darkblack font-larken max-w-2xl leading-tight tracking-[0%]">
                {sectionTitle}
              </ScrollReveal>
              <ScrollReveal delayMs={160} className="will-change-transform md:mt-26 mt-76 md:w-290 md:h-290 w-[243px] h-[293px]">
                <div ref={diamondParallax} className="size-full">
                  <ResponsiveImage
                    desktopSrc={desktopImageUrl || ""}
                    mobileSrc={mobileImageUrl}
                    alt={imageAlt}
                    width={1024}
                    height={1024}
                    quality={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>
          </section>
          :
          <section
            id={id}
            aria-label="Internally flawless diamonds"
            aria-busy="true"
            className="relative h-auto overflow-hidden py-50"
          >
            <div className="absolute inset-0 -z-0">
              <div className="w-full h-full bg-gray100" />
            </div>
            <div className="relative container h-full py-12 md:py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray200 rounded-full" />
              <div className="mt-6 h-10 w-[min(520px,90%)] bg-gray200 rounded" />
              <div className="mt-10 h-72 w-72 bg-gray200 rounded-full" />
            </div>
          </section>
      }
    </>
  );
};

export default DiamondSourcingSection;

