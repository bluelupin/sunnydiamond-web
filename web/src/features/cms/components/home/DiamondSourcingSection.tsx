"use client";

import { useParallax } from "@/shared/hooks/use-parallax";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { useMemo } from "react";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import { isSectionActive } from "@/shared/utils/cmsSection";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";

interface DiamondSourcingSectionProps {
  id?: string;
}

const DiamondSourcingSection = ({ id }: DiamondSourcingSectionProps) => {
  const bgParallax = useParallax<HTMLDivElement>(0.25);
  const diamondParallax = useParallax<HTMLDivElement>(-0.45);

  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const diamondSourcedDataSection = editorialData?.diamondSourcingSection ?? null;
  const sectionTitle = diamondSourcedDataSection?.sectionTitle?.trim();
  const diamondImages = useMemo(
    () => resolveResponsiveCmsImage(diamondSourcedDataSection?.image),
    [diamondSourcedDataSection?.image],
  );
  const desktopImageUrl = diamondImages.desktopUrl;
  const mobileImageUrl = diamondImages.mobileUrl;
  const imageAlt = diamondImages.alt;
  const imageDesktopAlt = diamondImages.desktopAlt;
  const imageMobileAlt = diamondImages.mobileAlt;
  const hasDiamondImage = Boolean(desktopImageUrl || mobileImageUrl);

  const gifUrl = useMemo(
    () => resolveResponsiveCmsImage(diamondSourcedDataSection?.gifOrImage).desktopUrl,
    [diamondSourcedDataSection?.gifOrImage],
  );
  const backgroundImages = useMemo(
    () => resolveResponsiveCmsImage(diamondSourcedDataSection?.backgroundImage),
    [diamondSourcedDataSection?.backgroundImage],
  );
  const backgroundDesktopSrc =
    backgroundImages.desktopUrl || backgroundImages.mobileUrl || "";
  const backgroundMobileSrc =
    backgroundImages.mobileUrl || backgroundImages.desktopUrl || "";
  const hasBackgroundImage = Boolean(backgroundDesktopSrc || backgroundMobileSrc);

  if (!isSectionActive(diamondSourcedDataSection?.isActive)) {
    return null;
  }

  if (!isEditorialLoading && (!diamondSourcedDataSection || !sectionTitle)) {
    return null;
  }

  return (
    <>
      {
        !isEditorialLoading ?
          <section
            id={id}
            aria-label={sectionTitle || "Internally flawless diamonds"}
            className="relative h-auto overflow-hidden bg-white"
          >
            <div className="absolute inset-0 -z-0 will-change-transform" ref={bgParallax}>
              {hasBackgroundImage ? (
                <ResponsiveImage
                  desktopSrc={backgroundDesktopSrc}
                  mobileSrc={backgroundMobileSrc}
                  alt={backgroundImages.alt || ""}
                  desktopAlt={backgroundImages.desktopAlt}
                  mobileAlt={backgroundImages.mobileAlt}
                  width={1440}
                  height={700}
                  sizes="100vw"
                  className="size-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gray100" aria-hidden />
              )}
              <div className="absolute inset-0 bg-background/40" aria-hidden />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent"
              />
            </div>
            <div className="relative container h-full py-16 md:py-100 flex flex-col items-center justify-center text-center">
              {gifUrl ? (
              <Reveal direction="up">
                <ResponsiveImage
                  desktopSrc={gifUrl}
                  alt={imageAlt}
                  width={64}
                  height={64}
                  quality={75}
                  className="w-10 h-10 mx-auto"
                />
              </Reveal>
              ) : null}
              <Reveal as="h2" direction="up" className="md:mt-6 mt-4 lg:text-5xl md:text-4xl text-32 font-light text-darkblack font-larken max-w-2xl leading-tight tracking-[0%]">
                {sectionTitle}
              </Reveal>
              {hasDiamondImage ? (
                <Reveal direction="up" className="md:mt-26 mt-76 md:w-290 md:h-290 w-[243px] h-[293px]">
                  <div ref={diamondParallax} className="size-full">
                    <ResponsiveImage
                      desktopSrc={desktopImageUrl || mobileImageUrl || ""}
                      mobileSrc={mobileImageUrl}
                      alt={imageAlt}
                      desktopAlt={imageDesktopAlt}
                      mobileAlt={imageMobileAlt}
                      width={1024}
                      height={1024}
                      quality={75}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Reveal>
              ) : null}
            </div>
          </section>
          :
          <section
            id={id}
            aria-label="Internally flawless diamonds"
            aria-busy="true"
            className="relative h-auto overflow-hidden"
          >
            <div className="absolute inset-0 -z-0">
              <div className="w-full h-full bg-gray100" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent"
              />
            </div>
            <div className="relative container h-full py-16 md:py-100 flex flex-col items-center justify-center text-center">
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
