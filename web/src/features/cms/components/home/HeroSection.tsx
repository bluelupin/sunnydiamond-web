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
    [hero]
  );

  const mobileImageUrl = useMemo(
    () => resolveCmsMediaUrl(hero?.image?.mobileImage ?? hero?.image?.data?.attributes ?? hero?.image),
    [hero]
  );

  const heroAlt = useMemo(
    () =>
      hero?.image?.altText ||
      resolveCmsAltText(hero?.image?.desktopImage ?? hero?.image?.data?.attributes ?? hero?.image) ||
      resolveCmsAltText(hero?.image?.mobileImage ?? hero?.image?.data?.attributes ?? hero?.image) ||
      hero?.title ||
      "",
    [hero]
  );

  const hasHeroImage = useMemo(
    () => Boolean(desktopImageUrl || mobileImageUrl),
    [desktopImageUrl, mobileImageUrl]
  );

  return (
    <>
      <section id={id} className="relative h-screen flex flex-col overflow-hidden">
        <div className="relative flex-1 overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
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
              <div
                className="absolute inset-0 h-full w-full bg-gray200"
                aria-hidden="true"
              />
            )}
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/40 to-transparent md:hidden" />
          <div className="container relative h-full flex items-end pb-12 md:pb-20 lg:pb-24">
            <div className="md:max-w-[742px] animate-fade-in">
              <div className="mb-6 inline-flex items-center gap-2 text-white font-gill font-normal lg:text-xl md:text-lg text-base tracking-[1.8%] uppercase">
                <DiamondIcon className="text-white" />
                <span className="tracking-[1.8%]">
                  {isShellLoading ? (
                    <span
                      className="inline-block h-5 w-56 bg-white/20 rounded animate-pulse"
                      aria-hidden
                    />
                  ) : (eyebrow)}
                </span>
              </div>
              <h1 className="mb-40 lg:text-[54px] md:text-[42px] text-[32px] text-white">
                {isShellLoading ? (
                  <span
                    className="block h-12 w-[min(680px,90vw)] bg-white/20 rounded animate-pulse"
                    aria-hidden
                  />
                ) : (title)}
              </h1>
              {!isShellLoading && primaryCta ? (
                <Link
                  href={primaryCta}
                  className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-white text-white md:text-base text-sm px-8 md:h-50 h-12 tracking-[0%] uppercase font-gill transition-colors duration-500"
                >
                  <span className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
                  <span className="relative z-10 group-hover:text-charcoal transition-colors duration-500">
                    {primaryCtaLabel}
                  </span>
                </Link>
              ) : (
                <div className="h-12 w-40 bg-white/20 rounded animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </section>
      <TrustBadgeSection />
    </>
  );
};

export default HeroSection;
