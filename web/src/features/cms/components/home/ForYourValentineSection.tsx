"use client";

import Link from "next/link";
import { useMemo } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import Reveal from "@/shared/Animation/Reveal";
import type { CategoryNavigationImage, GiftingBanner } from "@/types/homepage/categoryNavigation";

interface ForYourValentineSectionProps {
  id?: string;
}

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2";

function resolveGiftingCutoutMedia(giftingData: GiftingBanner | null) {
  return (giftingData?.cutoutImage ??
    giftingData?.image ??
    giftingData?.sideImage) as CategoryNavigationImage | null | undefined;
}

const ForYourValentineSection = ({ id }: ForYourValentineSectionProps) => {
  const { data: shoppingData, isLoading } = useHomepageShoppingBlocks();

  const giftingData =
    shoppingData?.homepage?.giftingBanner ?? shoppingData?.giftingBanner ?? null;

  const sectionTitle = giftingData?.title?.trim();
  const description =
    giftingData?.description?.trim() || giftingData?.subtitle?.trim() || undefined;

  const primaryCtaUrl =
    giftingData?.primaryCta?.url ||
    giftingData?.primaryCta?.to ||
    giftingData?.cta?.url ||
    giftingData?.cta?.to;
  const primaryCtaLabel =
    giftingData?.primaryCta?.label?.trim() || giftingData?.cta?.label?.trim();

  const secondaryCtaUrl =
    giftingData?.secondaryCta?.url ||
    giftingData?.secondaryCta?.to ||
    giftingData?.secondary?.url ||
    giftingData?.secondary?.to;
  const secondaryCtaLabel =
    giftingData?.secondaryCta?.label?.trim() ||
    giftingData?.secondary?.label?.trim();

  const backgroundImages = useMemo(
    () => resolveResponsiveCmsImage(giftingData?.backgroundImage as CategoryNavigationImage),
    [giftingData?.backgroundImage],
  );

  const cutoutImages = useMemo(
    () => resolveResponsiveCmsImage(resolveGiftingCutoutMedia(giftingData)),
    [giftingData],
  );

  const hasBackgroundImage = Boolean(backgroundImages.desktopUrl || backgroundImages.mobileUrl);
  const hasCutoutImage = Boolean(cutoutImages.desktopUrl || cutoutImages.mobileUrl);
  const cutoutAlt =
    cutoutImages.alt ||
    (giftingData?.cutoutImage as { altText?: string } | undefined)?.altText?.trim() ||
    sectionTitle ||
    "";

  const hasPrimaryCta = Boolean(primaryCtaUrl && primaryCtaLabel);
  const hasSecondaryCta = Boolean(secondaryCtaUrl && secondaryCtaLabel);
  const hasCtaRow = hasPrimaryCta || hasSecondaryCta;

  if (isLoading) {
    return (
      <section
        id={id}
        className="relative w-full overflow-hidden bg-[#F3E6E2] lg:h-[750px] lg:py-0"
        aria-busy="true"
        aria-label="Gifting"
      >
        <div className="relative flex w-full flex-col items-center py-16 lg:h-full lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-100">
          <div className="order-2 flex w-full max-w-[375px] flex-col items-center gap-6 px-4 lg:order-1 lg:max-w-[437px] lg:items-start lg:gap-8 lg:px-0">
            <div className="order-1 h-[336px] w-[305px] rounded bg-[#E4C7BE]/40 md:hidden" aria-hidden />
            <div className="order-2 flex w-full flex-col items-center gap-3 lg:items-start lg:gap-4">
              <div className="h-9 w-56 rounded bg-[#E4C7BE]/40" aria-hidden />
              <div className="h-9 w-[306px] max-w-full rounded bg-[#E4C7BE]/40" aria-hidden />
            </div>
            <div className="flex flex-col items-center gap-6 lg:items-start">
              <div className="h-14 w-[132px] rounded bg-[#E4C7BE]/40" aria-hidden />
            </div>
          </div>
          <div className="order-1 hidden h-[600px] w-full max-w-[746px] rounded bg-[#E4C7BE]/40 lg:order-2 md:block" aria-hidden />
        </div>
      </section>
    );
  }

  if (!giftingData || !isSectionActive(giftingData.isActive)) {
    return null;
  }

  if (!sectionTitle && !description && !hasCutoutImage && !hasCtaRow) {
    return null;
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle || "Gifting"}
      className="relative w-full overflow-hidden bg-[#F3E6E2]"
    >
      {hasBackgroundImage ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full sm:!h-[157%] sm:top-[-300px] top-12 opacity-80"
        >
          <ResponsiveImage
            desktopSrc={backgroundImages.desktopUrl || backgroundImages.mobileUrl || ""}
            mobileSrc={backgroundImages.mobileUrl}
            alt=""
            width={1440}
            height={750}
            sizes="100vw"
            className="size-full object-cover object-center"
          />
        </div>
      ) : null}
      <div className="flex flex-col items-center py-12 md:flex-row md:min-h-[750px] md:py-16 lg:items-center lg:justify-between lg:gap-8 lg:px-10 md:px-8 px-4 lg:py-100">
        <div className="order-2 flex w-full shrink-0 flex-col md:gap-10 gap-6 md:order-1 md:max-w-[437px] sm:max-w-[500px] max-w-full">
          {(sectionTitle || description) && (
            <div className="md:space-y-4 space-y-3">
              {sectionTitle ? (
                <Reveal
                  as="h2"
                  direction="up"
                  className="md:text-left text-center font-larken lg:text-5xl md:text-4xl sm:text-3xl text-32 font-light leading-110 text-darkblack"
                >
                  {sectionTitle}
                </Reveal>
              ) : null}
              {description ? (
                <Reveal
                  as="p"
                  direction="up"
                  className="md:text-left text-center font-gill lg:text-xl md:text-lg text-base font-light leading-110 text-neutral500"
                >
                  {description}
                </Reveal>
              ) : null}
            </div>
          )}
          {hasCtaRow ? (
            <Reveal
              direction="up"
              distance={40}
              amount={0.15}
              className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-start md:gap-8"
            >
              {hasPrimaryCta && primaryCtaUrl && primaryCtaLabel ? (
                <Link
                  href={primaryCtaUrl}
                  className={`inline-flex h-14 items-center justify-center bg-white px-8 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 ${ctaFocusClass}`}
                >
                  {primaryCtaLabel}
                </Link>
              ) : null}
              {hasSecondaryCta && secondaryCtaUrl && secondaryCtaLabel ? (
                <Link
                  href={secondaryCtaUrl}
                  className={`relative cursor-pointer border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-darkMagenta after:transition-all after:duration-300 hover:border-darkMagenta hover:text-darkMagenta hover:after:w-full ${ctaFocusClass}`}
                >
                  {secondaryCtaLabel}
                </Link>
              ) : null}
            </Reveal>
          ) : null}
        </div>
        {hasCutoutImage ? (
          <ScrollReveal
            delayMs={180}
            className="relative order-1 m-auto h-[336px] w-full max-w-[305px] flex-1 md:order-2 md:h-[600px] md:max-w-[746px]"
          >
            <ResponsiveImage
              desktopSrc={cutoutImages.desktopUrl || cutoutImages.mobileUrl || ""}
              mobileSrc={cutoutImages.mobileUrl}
              alt={cutoutAlt}
              width={746}
              height={600}
              sizes="(max-width: 768px) 305px, 746px"
              className="size-full object-contain object-right"
            />
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
};

export default ForYourValentineSection;
