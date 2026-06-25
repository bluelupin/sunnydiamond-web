"use client";

import { useMemo } from "react";
import Link from "next/link";
import { resolveCmsAltText, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import DiamondIcon from "@/assets/Icons/Diamond";
import TrustBadgeSection from "../common/TrustBadges";
import HeroBackgroundMedia from "./HeroBackgroundMedia";

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

  const heroTitle = String(title ?? "");

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
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/15 to-transparent" />
        <div className="absolute inset-0 bg-charcoal/20" />
        <div className="container relative flex h-full items-end justify-center px-4 pb-[60px] md:px-6">
          <div className="flex w-full max-w-886 animate-fade-in flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-1 font-gill text-base font-normal leading-110 text-white">
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
              <h1 className="max-w-886 font-larken text-[32px] font-light leading-110 text-white lg:text-[60px]">
                {isShellLoading ? (
                  <span
                    className="mx-auto block h-12 w-[min(680px,90vw)] animate-pulse rounded bg-white/20"
                    aria-hidden
                  />
                ) : (
                  heroTitle.split("\n").map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))
                )}
              </h1>
            </div>
            {!isShellLoading && primaryCta ? (
              <Link
                href={primaryCta}
                className="btn-slide-up relative inline-flex h-14 items-center justify-center overflow-hidden bg-white px-7 font-gill text-sm uppercase leading-110 text-darkblack"
              >
                {primaryCtaLabel}
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
