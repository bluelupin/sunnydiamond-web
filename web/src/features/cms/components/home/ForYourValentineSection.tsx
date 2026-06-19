"use client";

import Link from "next/link";
import { useMemo } from "react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { homeContent } from "@/features/cms/data/content";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

interface ForYourValentineSectionProps {
  id?: string;
}

const FALLBACK_RINGS = "/images/home/valentine-rings.png";
const FALLBACK_BG_DESKTOP = "/images/home/valentine-bg-desktop.svg";
const FALLBACK_BG_MOBILE = "/images/home/valentine-bg-mobile.svg";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2";

const ForYourValentineSection = ({ id }: ForYourValentineSectionProps) => {
  const contentRef = useFadeIn(200);
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

  const secondaryCtaUrl =
    giftingData?.secondaryCta?.url ||
    giftingData?.secondaryCta?.to ||
    giftingData?.secondary?.url ||
    giftingData?.secondary?.to ||
    fallback.secondary?.to ||
    "/gift-card";
  const secondaryCtaLabel =
    giftingData?.secondaryCta?.label ||
    giftingData?.secondary?.label ||
    fallback.secondary?.label ||
    "Send a Gift Card Instead";

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
        className="relative overflow-hidden bg-[#F3E6E2] py-16 lg:h-[750px] lg:py-0"
        aria-busy="true"
        aria-label="For Your Valentine"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-4 lg:h-full lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex w-full max-w-[437px] flex-col gap-4">
            <div className="h-10 w-64 rounded bg-[#E4C7BE]/40" aria-hidden />
            <div className="h-16 w-full rounded bg-[#E4C7BE]/40" aria-hidden />
            <div className="h-14 w-40 rounded bg-[#E4C7BE]/40" aria-hidden />
          </div>
          <div className="h-[336px] w-[305px] rounded bg-[#E4C7BE]/40 lg:h-[600px] lg:w-[746px]" aria-hidden />
        </div>
      </section>
    );
  }

  const ringsDesktop = desktopImageUrl || FALLBACK_RINGS;
  const ringsMobile = mobileImageUrl || desktopImageUrl || FALLBACK_RINGS;

  return (
    <section
      id={id}
      aria-label={sectionTitle}
      className="relative overflow-hidden bg-[#F3E6E2]"
    >
      <OptimizedImage
        src={FALLBACK_BG_DESKTOP}
        alt=""
        aria-hidden
        width={1440}
        height={750}
        className="pointer-events-none absolute inset-0 hidden size-full object-cover opacity-30 lg:block"
      />
      <OptimizedImage
        src={FALLBACK_BG_MOBILE}
        alt=""
        aria-hidden
        width={360}
        height={400}
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-full max-w-[360px] opacity-30 lg:hidden"
      />

      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className="relative mx-auto w-full max-w-[1440px]"
      >
        <div className="flex flex-col items-center gap-6 px-4 py-16 lg:hidden">
          <div className="relative h-[336px] w-[305px] shrink-0">
            <OptimizedImage
              src={ringsMobile}
              alt={imageAlt}
              width={305}
              height={336}
              className="size-full object-contain"
            />
          </div>

          <h2 className="max-w-[306px] text-center font-larken text-[32px] font-light leading-[110%] text-[#0a0a0a]">
            {sectionTitle}
          </h2>

          <p className="max-w-[306px] text-center font-gill text-base font-light leading-[110%] text-[#4D4D4D]">
            {mobileDescription}
          </p>

          <div className="flex flex-col items-center gap-6">
            {primaryCtaUrl ? (
              <Link
                href={primaryCtaUrl}
                className={`inline-flex h-14 items-center justify-center bg-white px-8 font-gill text-sm font-normal uppercase leading-[110%] text-[#0a0a0a] transition-opacity hover:opacity-90 ${ctaFocusClass}`}
              >
                {primaryCtaLabel}
              </Link>
            ) : null}

            {secondaryCtaUrl ? (
              <Link
                href={secondaryCtaUrl}
                className={`inline-flex items-center justify-center border-b-[1.5px] border-[#0a0a0a] pb-1 text-center font-gill text-sm font-normal uppercase leading-[110%] text-[#0a0a0a] transition-opacity hover:opacity-70 ${ctaFocusClass}`}
              >
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="hidden lg:flex lg:h-[750px] lg:items-center lg:justify-between lg:gap-8 lg:px-10">
          <div className="flex max-w-[437px] shrink-0 flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-larken text-[48px] font-light leading-[110%] text-[#0a0a0a]">
                {sectionTitle}
              </h2>
              <p className="font-gill text-[20px] font-light leading-[110%] text-[#4D4D4D]">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {primaryCtaUrl ? (
                <Link
                  href={primaryCtaUrl}
                  className={`inline-flex h-14 items-center justify-center bg-white px-8 font-gill text-sm font-normal uppercase leading-[110%] text-[#0a0a0a] transition-opacity hover:opacity-90 ${ctaFocusClass}`}
                >
                  {primaryCtaLabel}
                </Link>
              ) : null}

              {secondaryCtaUrl ? (
                <Link
                  href={secondaryCtaUrl}
                  className={`inline-flex items-center justify-center whitespace-nowrap border-b-[1.5px] border-[#0a0a0a] pb-1 font-gill text-sm font-normal uppercase leading-[110%] text-[#0a0a0a] transition-opacity hover:opacity-70 ${ctaFocusClass}`}
                >
                  {secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="relative h-[600px] w-[746px] shrink-0">
            <OptimizedImage
              src={ringsDesktop}
              alt={imageAlt}
              width={746}
              height={600}
              className="size-full object-contain object-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForYourValentineSection;
