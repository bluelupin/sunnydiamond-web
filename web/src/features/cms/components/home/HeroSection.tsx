"use client";

import { useMemo } from "react";
import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import DiamondIcon from "@/assets/Icons/Diamond";
import { getImageSrc } from "@/shared/utils/image";
import TrustBadgeSection from "../common/TrustBadges";

interface HeroSectionProps {
  id?: string;
}

const HeroSection = ({ id }: HeroSectionProps) => {
  const { data: shellData, isLoading: isShellLoading } = useHomepageShell();
  const hero = shellData?.homepage?.hero || shellData?.hero;
  const eyebrow = hero?.eyebrow ?? "";
  const title = hero?.title ?? "";
  const primaryCta = hero?.primaryCta?.url ?? "";
  const primaryCtaLabel = hero?.primaryCta?.label ?? "";

  const desktopImageUrl = useMemo(
    () => resolveCmsMediaUrl(hero?.image?.desktopImage ?? hero?.image?.data?.attributes ?? hero?.image),
    [hero],
  );

  const mobileImageUrl = useMemo(
    () => resolveCmsMediaUrl(hero?.image?.mobileImage ?? hero?.image?.data?.attributes ?? hero?.image),
    [hero],
  );

  const heroAlt = useMemo(
    () =>
      hero?.image?.altText ||
      resolveCmsAltText(hero?.image?.desktopImage ?? hero?.image?.data?.attributes ?? hero?.image) ||
      resolveCmsAltText(hero?.image?.mobileImage ?? hero?.image?.data?.attributes ?? hero?.image) ||
      hero?.title ||
      "",
    [hero],
  );

  const hasHeroImage = useMemo(
    () => Boolean(desktopImageUrl || mobileImageUrl),
    [desktopImageUrl, mobileImageUrl],
  );

  return (
    <section
      id={id}
      className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={getImageSrc(desktopImageUrl || mobileImageUrl || "")}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/videos/hero-banner-video.mp4" type="video/mp4" />
          {isShellLoading ? (
            <div className="absolute inset-0 h-full w-full animate-pulse bg-gray200" />
          ) : hasHeroImage ? (
            <ResponsiveImage
              desktopSrc={desktopImageUrl || ""}
              mobileSrc={mobileImageUrl}
              alt={heroAlt}
              priority
              width={512}
              height={512}
              quality={desktopImageUrl ? 90 : 85}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 h-full w-full bg-gray200" aria-hidden="true" />
          )}
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/15 to-transparent" />
        <div className="absolute inset-0 bg-charcoal/20" />
        <div className="container relative flex h-full items-center justify-center px-4 md:px-6">
          <div className="flex w-full max-w-[742px] animate-fade-in flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 font-gill text-base font-normal uppercase tracking-[1.8%] text-white md:text-lg lg:text-xl">
              <DiamondIcon className="text-white" />
              <span className="tracking-[1.8%]">
                {isShellLoading ? (
                  <span
                    className="inline-block h-5 w-56 animate-pulse rounded bg-white/20"
                    aria-hidden
                  />
                ) : (
                  eyebrow
                )}
              </span>
            </div>
            <h1 className="mb-8 text-[32px] text-white md:mb-10 md:text-[42px] lg:text-[54px]">
              {isShellLoading ? (
                <span
                  className="mx-auto block h-12 w-[min(680px,90vw)] animate-pulse rounded bg-white/20"
                  aria-hidden
                />
              ) : (
                title
              )}
            </h1>
            {!isShellLoading && primaryCta ? (
              <Link
                href={primaryCta}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden border-[0.8px] border-white px-8 font-gill text-sm uppercase tracking-[0%] text-white transition-colors duration-500 md:h-50 md:text-base"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="relative z-10 transition-colors duration-500 group-hover:text-charcoal">
                  {primaryCtaLabel}
                </span>
              </Link>
            ) : (
              <div className="h-12 w-40 animate-pulse rounded bg-white/20" />
            )}
          </div>
        </div>
      </div>
      <TrustBadgeSection />
    </section>
  );
};

export default HeroSection;
