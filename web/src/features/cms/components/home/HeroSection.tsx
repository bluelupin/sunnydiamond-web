"use client";

import Link from "next/link";

import { getImageSrc } from "@/shared/utils/image";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import hero1440 from "@/assets/hero-banner-1440.webp";
interface HeroSectionProps {
  id?: string;
}

import DiamondIcon from "@/assets/Icons/Diamond";

const HeroSection = ({ id }: HeroSectionProps) => {
  const { data: shellData, isLoading: isShellLoading } = useHomepageShell();
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();

  const hero = shellData?.homepage?.hero || shellData?.hero;

  const desktopImage = hero?.image?.desktopImage || hero?.image?.data?.attributes;
  const mobileImage = hero?.image?.mobileImage;

  const desktopImageUrl = desktopImage?.url ? getImageSrc(desktopImage.url) : "";

  const mobileImageUrl = mobileImage?.url
    ? getImageSrc(mobileImage.url)
    : desktopImageUrl;

  const primaryCta = hero?.primaryCta?.url ?? "";
  const heroCtaLabel = hero?.primaryCta?.label ?? "";

  const trustSource =
    shoppingData?.trustBadges || shoppingData?.homepage?.trustBadges || [];

  const normalizedTrust = [...trustSource]
    .filter((t) => t?.isActive !== false)
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));

  const marqueeItems = [
    ...normalizedTrust.map((t) => t?.label ?? ""),
    ...normalizedTrust.map((t) => t?.label ?? ""),
  ].filter(Boolean);

  return (
    <>
      <section id={id} className="relative h-screen flex flex-col overflow-hidden">
        <div className="relative flex-1 overflow-hidden">
          {/* Background video — autoplay, muted, looped, no controls */}
          {/* <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={getImageSrc(hero1024)}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/videos/hero-banner-video.mp4" type="video/mp4" />
            <img
              src={getImageSrc(hero1024)}
              srcSet={heroSrcSet}
              sizes="100vw"
              alt="Premium diamond jewellery collection by Sunny Diamonds"
              width={1440}
              height={700}
              fetchPriority="high"
              decoding="sync"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </video> */}
          {/* Left/bottom gradient for legibility */}
          {isShellLoading ? (
            <div className="absolute inset-0 w-full h-full bg-gray200 animate-pulse" />
          ) : (
            <picture>
              {mobileImageUrl ? (
                <source media="(max-width: 767px)" srcSet={mobileImageUrl} />
              ) : null}

              {desktopImageUrl ? (
                <img
                  src={desktopImageUrl}
                  alt={hero?.image?.altText || desktopImage?.alternativeText || ""}
                  width={desktopImage?.width || 1440}
                  height={desktopImage?.height || 700}
                  fetchPriority="high"
                  decoding="sync"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : <img
                src={hero1440.src}
                alt={hero?.image?.altText || desktopImage?.alternativeText || ""}
                width={desktopImage?.width || 1440}
                height={desktopImage?.height || 700}
                fetchPriority="high"
                decoding="sync"
                className="absolute inset-0 w-full h-full object-cover"
              />}
            </picture>
          )}
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
                  ) : (
                    hero?.eyebrow
                  )}
                </span>
              </div>

              <h1 className="mb-40 lg:text-[54px] md:text-[42px] text-[32px] text-white">
                {isShellLoading ? (
                  <span
                    className="block h-12 w-[min(680px,90vw)] bg-white/20 rounded animate-pulse"
                    aria-hidden
                  />
                ) : (
                  hero?.title
                )}
              </h1>

              {!isShellLoading && primaryCta ? (
                <Link
                  href={primaryCta}
                  className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-white text-white md:text-base text-sm px-8 md:h-50 h-12 tracking-[0%] uppercase font-gill transition-colors duration-500"
                >
                  <span className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>

                  <span className="relative z-10 group-hover:text-charcoal transition-colors duration-500">
                    {heroCtaLabel}
                  </span>
                </Link>
              ) : (
                <div className="h-12 w-40 bg-white/20 rounded animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray300 text-ivory border-t border-ivory/10 overflow-hidden shrink-0">
        <div className="relative flex overflow-hidden md:h-16 h-12">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12 whitespace-nowrap">
            {isShoppingLoading ? (
              <div className="flex items-center gap-12 pr-12 whitespace-nowrap">
                <div className="h-3 w-40 bg-gray500/20 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray500/20 rounded animate-pulse" />
                <div className="h-3 w-44 bg-gray500/20 rounded animate-pulse" />
              </div>
            ) : (
              marqueeItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-12 font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
                >
                  <span className="text-gray500">{item}</span>
                  <span className="text-gray600" aria-hidden>
                    •
                  </span>
                </div>
              ))
            )}
          </div>
          <div
            aria-hidden
            className="flex shrink-0 animate-marquee items-center gap-12 pr-12 whitespace-nowrap"
          >
            {isShoppingLoading
              ? null
              : marqueeItems.map((item, idx) => (
                <div
                  key={`dup-${idx}`}
                  className="flex items-center gap-12 font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
                >
                  <span className="text-gray500">{item}</span>

                  <span className="text-gray600" aria-hidden>
                    •
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
