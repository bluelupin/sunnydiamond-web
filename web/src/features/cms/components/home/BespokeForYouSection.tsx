"use client";

import Link from "next/link";
import { useMemo } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { isSectionActive } from "@/shared/utils/cmsSection";

interface BespokeForYouSectionProps {
  id?: string;
}

const FALLBACK_BG = "/images/home/bespoke-for-you-bg.png";
const FALLBACK_SUBTITLE =
  "Designs thoughtfully crafted to bring your vision to life";

const BespokeForYouSection = ({ id }: BespokeForYouSectionProps) => {
  const contentRef = useFadeIn(200);
  const { data: editorialData, isLoading } = useHomepageEditorialBlocks();

  const sectionData = editorialData?.bespokeForYouSection ?? null;
  const sectionTitle =
    sectionData?.sectionTitle?.trim() || "Bespoke For You";
  const subtitle =
    sectionData?.subtitle?.trim() ||
    sectionData?.description?.trim() ||
    FALLBACK_SUBTITLE;
  const primaryCtaUrl =
    sectionData?.primaryCta?.url ||
    sectionData?.primaryCta?.to ||
    "/bespoke-jewellery";
  const primaryCtaLabel =
    sectionData?.primaryCta?.label?.trim() || "Craft Now";
  const secondaryCtaUrl =
    sectionData?.secondaryCta?.url ||
    sectionData?.secondaryCta?.to ||
    "/products";
  const secondaryCtaLabel =
    sectionData?.secondaryCta?.label?.trim() || "View Past Work";

  const desktopImageUrl = useMemo(
    () =>
      resolveCmsMediaUrl(
        sectionData?.image?.desktopImage ??
          sectionData?.image?.data?.attributes ??
          sectionData?.image,
      ),
    [sectionData],
  );

  const mobileImageUrl = useMemo(
    () =>
      resolveCmsMediaUrl(
        sectionData?.image?.mobileImage ??
          sectionData?.image?.data?.attributes ??
          sectionData?.image,
      ),
    [sectionData],
  );

  const imageAlt = useMemo(
    () =>
      sectionData?.image?.altText ||
      resolveCmsAltText(
        sectionData?.image?.desktopImage ??
          sectionData?.image?.data?.attributes ??
          sectionData?.image,
      ) ||
      sectionTitle,
    [sectionData, sectionTitle],
  );

  if (!isSectionActive(sectionData?.isActive)) return null;

  if (isLoading) {
    return (
      <section
        id={id}
        className="relative min-h-[856px] w-full overflow-hidden bg-gray300 md:min-h-[804px]"
        aria-busy="true"
        aria-label="Bespoke For You"
      >
        <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-6 px-4">
          <div className="h-10 w-64 rounded bg-white/20" aria-hidden />
          <div className="h-5 w-72 max-w-full rounded bg-white/20" aria-hidden />
          <div className="mt-4 h-14 w-40 rounded bg-white/20" aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle}
      className="relative min-h-[100vh] w-full overflow-hidden md:min-h-[804px]"
    >
      <div className="absolute inset-0">
        <ResponsiveImage
          desktopSrc={desktopImageUrl || FALLBACK_BG}
          mobileSrc={mobileImageUrl || desktopImageUrl || FALLBACK_BG}
          alt={imageAlt}
          width={1440}
          height={804}
          priority={false}
          className="size-full object-cover object-[center_30%] md:object-[center_22%]"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[409px] bg-gradient-to-b from-transparent to-black/80 backdrop-blur-[5px] md:h-[400px]"
      />

      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className="absolute inset-x-0 bottom-16 flex w-full flex-col items-center gap-6 px-4 md:bottom-16 md:gap-10 md:px-10"
      >
        <div className="flex w-full max-w-[1360px] flex-col items-center gap-3 text-center text-white md:gap-4">
          <h2 className="font-larken text-[32px] font-light leading-[110%] md:text-[48px] md:whitespace-nowrap">
            {sectionTitle}
          </h2>
          <p className="max-w-[257px] font-gill text-base font-light leading-[110%] md:max-w-none md:text-[20px]">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 md:gap-8">
          {primaryCtaUrl ? (
            <Link
              href={primaryCtaUrl}
              className="relative inline-flex h-14 items-center justify-center overflow-hidden bg-white px-7 font-gill text-sm font-normal uppercase leading-[110%] darkblack transition-opacity hover:opacity-90"
            >
              {primaryCtaLabel}
            </Link>
          ) : null}

          {secondaryCtaUrl ? (
            <Link
              href={secondaryCtaUrl}
              className="inline-flex items-center justify-center border-b-[1.5px] border-white pb-1 font-gill text-sm font-normal uppercase leading-[110%] text-white transition-opacity hover:opacity-70"
            >
              {secondaryCtaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default BespokeForYouSection;
