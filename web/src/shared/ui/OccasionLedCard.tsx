"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";

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
  const pathname = usePathname();

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
      className={cn(
        "group relative block shrink-0 snap-start overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2",
        pathname === "/gifting" ?
          "h-[400px] w-[328px] md:h-[500px] md:w-[351px] xl:h-[600px] xl:w-full xl:shrink" :
          "h-[400px] w-[328px] lg:h-[700px] md:h-[500px] md:w-full md:min-w-0 md:shrink",
      )}
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
          <div className={cn("flex flex-col text-white",
            pathname === "/gifting" ? "gap-2" : "md:gap-3 gap-2",
          )}>
            <h3 className={cn("font-larken font-light leading-110",
              pathname === "/gifting" ? "text-2xl" : "lg:text-32 md:text-3xl text-2xl",
            )}>
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
              {pathname === "/gifting" ? "Explore" : ctaLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className={cn("absolute bottom-0 z-10 hidden max-w-[418px] flex-col-reverse items-start text-white md:flex",
        pathname === "/gifting" ? "md:left-8 left-4" : "md:left-10 left-4",
      )}>
        {ctaLabel ? (
          <div className="inline-flex max-h-0 w-fit flex-col items-start overflow-hidden pb-0 pt-0 opacity-0 motion-safe:transition-[max-height,padding,opacity] motion-safe:duration-500 motion-safe:ease-out group-hover:max-h-[72px] group-hover:pb-16 group-hover:opacity-100 group-focus-visible:max-h-[72px] group-focus-visible:pb-16 group-focus-visible:opacity-100">
            <div className="text-tertiary-cta-underline cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-white sm:pb-1">
              {pathname === "/gifting" ? "Explore" : ctaLabel}
            </div>
          </div>
        ) : null}
        <div className={cn("mb-16 flex w-full max-w-[418px] flex-col items-start group-hover:mb-6",
          pathname === "/gifting" ? "gap-2" : "lg:gap-3 gap-2",
        )}>
          <h3 className={cn("whitespace-nowrap font-larken font-light leading-none ",
            pathname === "/gifting" ? "text-2xl" : "lg:text-32 md:text-2xl text-32",
          )}>
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
