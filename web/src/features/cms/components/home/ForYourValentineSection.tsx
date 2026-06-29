"use client";

import Link from "next/link";
import { useMemo } from "react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { homeContent } from "@/features/cms/data/content";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import Reveal from "@/shared/Animation/Reveal";

interface ForYourValentineSectionProps {
  id?: string;
}

const FALLBACK_RINGS = "/images/home/valentine-rings.png";
const FALLBACK_BG_DESKTOP = "/images/home/valentine-bg-desktop.svg";
const FALLBACK_BG_MOBILE = "/images/home/valentine-bg-mobile.svg";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2";

const ForYourValentineSection = ({ id }: ForYourValentineSectionProps) => {
  const { data: shoppingData, isLoading } = useHomepageShoppingBlocks();

  const giftingData =
    shoppingData?.homepage?.giftingBanner ?? shoppingData?.giftingBanner ?? null;
  const fallback = homeContent.alankara.gifting;

  const sectionTitle =
    giftingData?.title?.trim() || fallback.title || "For Your Valentine";
  const description =
    giftingData?.description?.trim() ||
    giftingData?.subtitle?.trim() ||
    fallback.description ||
    "Honoring a lifetime of connection through rare, masterfully crafted jewelry designed for the moments that matter.";
  const mobileDescription =
    giftingData?.mobileDescription?.trim() ||
    giftingData?.mobileSubtitle?.trim() ||
    fallback.mobileDescription ||
    description;

  const primaryCtaUrl =
    giftingData?.primaryCta?.url ||
    giftingData?.primaryCta?.to ||
    giftingData?.cta?.url ||
    giftingData?.cta?.to ||
    fallback.cta.to;
  const primaryCtaLabel =
    giftingData?.primaryCta?.label ||
    giftingData?.cta?.label ||
    fallback.cta.label;

  const desktopImageUrl = useMemo(
    () =>
      resolveCmsMediaUrl(
        (giftingData as { image?: { desktopImage?: unknown; data?: { attributes?: unknown } } })?.image
          ?.desktopImage ??
        giftingData?.sideImage?.data?.attributes ??
        giftingData?.sideImage ??
        (giftingData as { image?: { data?: { attributes?: unknown } } })?.image?.data?.attributes ??
        giftingData?.image,
      ),
    [giftingData],
  );

  const mobileImageUrl = useMemo(
    () =>
      resolveCmsMediaUrl(
        (giftingData as { image?: { mobileImage?: unknown; desktopImage?: unknown; data?: { attributes?: unknown } } })
          ?.image?.mobileImage ??
        (giftingData as { image?: { desktopImage?: unknown } })?.image?.desktopImage ??
        giftingData?.sideImage?.data?.attributes ??
        giftingData?.sideImage ??
        (giftingData as { image?: { data?: { attributes?: unknown } } })?.image?.data?.attributes ??
        giftingData?.image,
      ),
    [giftingData],
  );

  const imageAlt = useMemo(
    () =>
      resolveCmsAltText(
        (giftingData as { image?: { desktopImage?: unknown } })?.image?.desktopImage ??
        giftingData?.sideImage ??
        giftingData?.image,
      ) || sectionTitle,
    [giftingData, sectionTitle],
  );

  if (!isSectionActive(giftingData?.isActive)) {
    return null;
  }

  if (isLoading) {
    return (
      <section
        id={id}
        className="relative w-full overflow-hidden bg-[#F3E6E2] lg:h-[750px] lg:py-0"
        aria-busy="true"
        aria-label="For Your Valentine"
      >
        <div className="relative flex w-full flex-col items-center py-16 lg:h-full lg:flex-row lg:items-center lg:justify-between lg:px-40 lg:py-100">
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

  const ringsDesktop = desktopImageUrl || FALLBACK_RINGS;
  const ringsMobile = mobileImageUrl || desktopImageUrl || FALLBACK_RINGS;

  return (
    <section id={id} aria-label={sectionTitle} className="relative w-full overflow-hidden bg-[#F3E6E2]">
      <OptimizedImage
        src={FALLBACK_BG_DESKTOP}
        alt=""
        aria-hidden
        width={1920}
        height={750}
        className="pointer-events-none absolute inset-0 hidden size-full object-cover object-center opacity-30 md:block"
      />
      <div className="flex flex-col items-center py-12 md:flex-row md:min-h-[750px] md:py-16 lg:items-center lg:justify-between lg:gap-8 lg:px-40 md:px-8 px-4 lg:py-100">
        <div className="order-2 flex w-full max-w-full shrink-0 flex-col gap-8 md:order-1 md:max-w-[437px]">
          <div className="md:space-y-4 space-y-3">
            <Reveal as="h2" direction="up" className="md:text-left text-center font-larken lg:text-5xl md:text-4xl sm:text-3xl text-32 font-light leading-110 text-darkblack">
              {sectionTitle}
            </Reveal>
            <Reveal as="p" direction="up" className="md:text-left text-center font-gill text-xl font-light leading-110 text-[#4D4D4D]">
              {description}
            </Reveal>
          </div>
          <div className="flex md:flex-row flex-col items-center md:justify-start justify-center md:gap-8 gap-6">
            <Reveal direction="up" className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {primaryCtaUrl &&
                <Link
                  href={primaryCtaUrl}
                  className={`inline-flex h-14 items-center justify-center bg-white px-8 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 ${ctaFocusClass}`}
                >
                  {primaryCtaLabel}
                </Link>
              }
            </Reveal>
            <Reveal direction="up">
              <Link href={primaryCtaUrl} className="relative after:bg-darkMagenta after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer border-b-[1.5px] border-darkblack hover:border-darkMagenta sm:pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack hover:text-darkMagenta">
                SEND A GIFT CARD INSTEAD
              </Link>
            </Reveal>
          </div>
        </div>
        <ScrollReveal delayMs={180} className="relative order-1 m-auto h-[336px] w-full max-w-[305px] flex-1 md:order-2 md:h-[600px] md:max-w-[746px]">
          <OptimizedImage
            src={ringsDesktop}
            alt={imageAlt}
            width={746}
            height={600}
            className="size-full object-contain object-right"
          />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ForYourValentineSection;
