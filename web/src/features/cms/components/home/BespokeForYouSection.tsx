"use client";

import Link from "next/link";
import { useMemo } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveBespokeForYouSection } from "@/shared/utils/resolveBespokeForYouSection";
import Reveal from "@/shared/Animation/Reveal";

interface BespokeForYouSectionProps {
  id?: string;
}

const FALLBACK_BG = "/images/home/bespoke-for-you-bg.webp";
const FALLBACK_SUBTITLE =
  "Designs thoughtfully crafted to bring your vision to life";

const BespokeForYouSection = ({ id }: BespokeForYouSectionProps) => {
  const { data: editorialData, isLoading } = useHomepageEditorialBlocks();

  const sectionData = useMemo(
    () => resolveBespokeForYouSection(editorialData),
    [editorialData],
  );

  const sectionTitle = sectionData.sectionTitle?.trim() || "Bespoke For You";
  const subtitle = sectionData.subtitle?.trim() || FALLBACK_SUBTITLE;

  const primaryCtaUrl =
    sectionData.primaryCta?.url ||
    sectionData.primaryCta?.to ||
    "/bespoke-jewellery";
  const primaryCtaLabel =
    sectionData.primaryCta?.label?.trim() || "Craft Now";

  const secondaryCtaUrl =
    sectionData.secondaryCta?.url ||
    sectionData.secondaryCta?.to ||
    "/jewellery";
  const secondaryCtaLabel =
    sectionData.secondaryCta?.label?.trim() || "View Past Work";

  const desktopImageUrl = useMemo(
    () =>
      resolveCmsMediaUrl(
        sectionData.image?.desktopImage ??
        sectionData.image?.data?.attributes ??
        sectionData.image,
      ),
    [sectionData.image],
  );

  const mobileImageUrl = useMemo(
    () =>
      resolveCmsMediaUrl(
        sectionData.image?.mobileImage ??
        sectionData.image?.data?.attributes ??
        sectionData.image,
      ),
    [sectionData.image],
  );

  const imageAlt = useMemo(
    () =>
      sectionData.image?.altText ||
      resolveCmsAltText(
        sectionData.image?.desktopImage ??
        sectionData.image?.data?.attributes ??
        sectionData.image,
      ) ||
      sectionTitle,
    [sectionData.image, sectionTitle],
  );

  if (!isSectionActive(sectionData.isActive)) return null;

  if (isLoading) {
    return (
      <section
        id={id}
        className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-gray300 md:h-auto md:min-h-[804px]"
        aria-busy="true"
        aria-label="Bespoke For You"
      >
        <div className="absolute inset-x-0 bottom-16 flex w-full flex-col items-center gap-6 px-4">
          <div className="flex w-full flex-col items-center gap-3">
            <div className="h-9 w-56 rounded bg-white/20" aria-hidden />
            <div className="h-9 w-[257px] max-w-full rounded bg-white/20" aria-hidden />
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="h-14 w-[140px] rounded bg-white/20" aria-hidden />
            <div className="h-5 w-28 rounded bg-white/20" aria-hidden />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle}
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden md:h-auto md:min-h-[804px]"
    >
      <Reveal direction="up" className="absolute inset-0">
        <ResponsiveImage
          desktopSrc={desktopImageUrl || FALLBACK_BG}
          mobileSrc={mobileImageUrl || desktopImageUrl || FALLBACK_BG}
          alt={imageAlt}
          width={1440}
          height={804}
          priority={false}
          sizes="100vw"
          className="size-full object-cover object-[center_22%] md:object-[center_22%]"
        />
      </Reveal>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[409px] bg-gradient-to-b from-transparent to-black md:h-[400px]"
      />

      {/* Content — Figma 684:3301 mobile / 684:2988 desktop */}
      <div className="absolute inset-x-0 bottom-16 flex w-full justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[375px] flex-col items-center gap-6 md:max-w-[1360px] md:gap-10">
          <div className="flex w-full flex-col items-center gap-3 text-center text-white md:gap-4">
            <Reveal as="h2" direction="up"
              className="shrink-0 whitespace-nowrap font-larken text-32 font-light leading-110 md:text-5xl"
            >
              {sectionTitle}
            </Reveal>
            <Reveal direction="up"
              className="w-[257px] shrink-0 text-center font-gill text-base font-light leading-110 md:w-auto md:max-w-none md:text-xl"
            >
              {subtitle}
            </Reveal>
          </div>
          <Reveal direction="up" className="flex shrink-0 flex-col items-center gap-6 md:gap-8">
            <Link
              href={primaryCtaUrl}
              className="inline-flex h-14 items-center justify-center bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              {primaryCtaLabel}
            </Link>
            <Link href={secondaryCtaUrl} className="relative after:bg-white after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer border-b-[1.5px] border-white hover:border-white sm:pb-1 font-gill text-sm font-normal uppercase leading-110 text-white hover:text-white">
              {secondaryCtaLabel}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default BespokeForYouSection;
