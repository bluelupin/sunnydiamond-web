"use client";

import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";

export type OccasionLedCardProps = {
  title: string;
  description?: string;
  href: string;
  ctaLabel?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  imageAlt?: string;
  desktopImageAlt?: string;
  mobileImageAlt?: string;
  index?: number;
  sectionTitle?: string;
};

export default function OccasionLedCard({
  title,
  description,
  href,
  ctaLabel,
  desktopImageUrl,
  mobileImageUrl,
  imageAlt,
  desktopImageAlt,
  mobileImageAlt,
}: OccasionLedCardProps) {
  if (!desktopImageUrl && !mobileImageUrl) {
    return null;
  }

  if (!href?.trim()) {
    return null;
  }

  const desktopSrc = desktopImageUrl || mobileImageUrl || "";
  const mobileSrc = mobileImageUrl || desktopImageUrl || desktopSrc;
  const alt = imageAlt ?? desktopImageAlt ?? mobileImageAlt ?? "";

  return (
    <Link
      href={href}
      className="group relative block h-[400px] w-[328px] shrink-0 snap-start overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2 lg:h-[700px] md:h-[500px] md:w-full md:min-w-0 md:shrink"
    >
      <ResponsiveImage
        desktopSrc={desktopSrc}
        mobileSrc={mobileSrc}
        alt={alt}
        desktopAlt={desktopImageAlt}
        mobileAlt={mobileImageAlt}
        width={desktopImageUrl ? 718 : 328}
        height={desktopImageUrl ? 700 : 400}
        quality={75}
        className="size-full object-cover"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent md:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-[rgba(0,0,0,0.7)] from-0% to-[rgba(0,0,0,0)] to-[53.563%] md:block"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 md:hidden">
        <div className="flex max-w-[296px] flex-col gap-4">
          <div className="flex flex-col gap-2 text-white md:gap-3">
            <h3 className="font-larken text-2xl font-light leading-110 md:text-3xl lg:text-32">
              {title}
            </h3>
            {description ? (
              <p className="font-gill text-base font-light leading-[120%] tracking-[0%] md:text-lg lg:text-xl">
                {description}
              </p>
            ) : null}
          </div>
          {ctaLabel ? (
            <span className="text-tertiary-cta-underline inline-flex w-fit items-center justify-center pb-1.5 font-gill text-sm font-normal uppercase tracking-[0.28px] text-white">
              {ctaLabel} tset
            </span>
          ) : null}
        </div>
      </div>

      <div className="absolute bottom-0 left-10 z-10 hidden max-w-[418px] flex-col-reverse items-start text-white md:flex">
        {ctaLabel ? (
          <div className="inline-flex max-h-0 w-fit flex-col items-start overflow-hidden pb-0 pt-0 opacity-0 motion-safe:transition-[max-height,padding,opacity] motion-safe:duration-500 motion-safe:ease-out group-hover:max-h-[72px] group-hover:pb-16 group-hover:opacity-100 group-focus-visible:max-h-[72px] group-focus-visible:pb-16 group-focus-visible:opacity-100">
            <div className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-white sm:pb-1">
              {ctaLabel}
            </div>
          </div>
        ) : null}
        <div className="mb-16 flex w-full max-w-[418px] flex-col items-start gap-2 group-hover:mb-6 lg:gap-3">
          <h3 className="whitespace-nowrap font-larken text-32 font-light leading-none md:text-2xl lg:text-32">
            {title}
          </h3>
          {description ? (
            <p className="font-gill text-base font-light leading-[120%] tracking-[1%] md:text-lg lg:text-xl">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
