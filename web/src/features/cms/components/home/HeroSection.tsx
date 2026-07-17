"use client";

import { useMemo } from "react";
import Link from "next/link";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import DiamondIcon from "@/assets/Icons/Diamond";
import TrustBadgeSection from "../common/TrustBadges";
import HeroBackgroundMedia from "./HeroBackgroundMedia";
import HeroSectionOverlay from "./HeroSectionOverlay";

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
  const heroVideoUrl = useMemo(() => getCmsAssetUrl(hero?.videoUrl), [hero?.videoUrl]);

  const heroImage = hero?.image;

  const desktopImageUrl = useMemo(
    () => resolveCmsMediaUrl(heroImage?.desktopImage ?? heroImage),
    [heroImage],
  );

  const mobileImageUrl = useMemo(
    () => resolveCmsMediaUrl(heroImage?.mobileImage ?? heroImage?.desktopImage ?? heroImage),
    [heroImage],
  );

  const heroAlt = useMemo(
    () =>
      heroImage?.altText ||
      resolveCmsAltText(heroImage?.desktopImage ?? heroImage) ||
      resolveCmsAltText(heroImage?.mobileImage ?? heroImage?.desktopImage) ||
      hero?.title ||
      "",
    [hero?.title, heroImage],
  );

  const heroTitle = String(title ?? "");
  const heroTitleLines = useMemo(() => {
    if (!heroTitle) return [];

    // CMS-controlled line breaks
    if (heroTitle.includes("\n")) {
      return heroTitle.split("\n");
    }

    // Fallback for current content
    const breakAfter = "Fine jewellery designed";

    if (heroTitle.startsWith(breakAfter)) {
      return [
        breakAfter,
        heroTitle.slice(breakAfter.length).trim(),
      ];
    }

    return [heroTitle];
  }, [heroTitle]);
  return (
    <section
      id={id}
      className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <HeroBackgroundMedia
          desktopImageUrl={desktopImageUrl || ""}
          mobileImageUrl={mobileImageUrl}
          alt={heroAlt}
          isLoading={isShellLoading}
          cmsVideoUrl={heroVideoUrl}
        />
        <HeroSectionOverlay />
        <div className="container relative flex h-full items-end justify-center md:py-16 sm:py-12 py-11 md:px-6 px-4">
          <div className="flex w-full max-w-886 animate-fade-in flex-col items-center md:gap-8 gap-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-1 font-gill md:text-base text-sm font-normal leading-110 text-white">
                <DiamondIcon className="size-5 shrink-0 text-white" />
                <span>
                  {isShellLoading ? (
                    <span
                      className="inline-block h-4 w-40 animate-pulse rounded bg-white/20"
                      aria-hidden
                    />
                  ) : (
                    eyebrow
                  )}
                </span>
              </div>
              <h1 className="max-w-886 font-larken xl:text-6xl md:text-5xl sm:text-4xl text-32 font-light leading-110 text-white">
                {isShellLoading ? (
                  <span
                    className="mx-auto block h-12 w-[min(680px,90vw)] animate-pulse rounded bg-white/20"
                    aria-hidden
                  />
                ) : (
                  heroTitleLines.map((line, index) => (
                    <span
                      key={`${line}-${index}`}
                      className="block"
                    >
                      {line}
                    </span>
                  ))
                )}
              </h1>
            </div>
            {!isShellLoading && primaryCta ? (
              <Link href={primaryCta} className="bg-white relative flex items-center justify-center px-7 h-14 overflow-hidden font-gill text-sm font-normal uppercase leading-110 border-2 border-white group w-fit">
                <div className="absolute left-0 w-full h-14 transition-all duration-300 bg-white top-full group-hover:top-0"></div>
                <span className="relative transition-all duration-300 text-darkblack group-hover:text-"> {primaryCtaLabel}</span>
              </Link>
            ) : (
              <div className="h-14 w-40 animate-pulse rounded bg-white/20" />
            )}
          </div>
        </div>
      </div>
      <TrustBadgeSection />
    </section>
  );
};

export default HeroSection;
