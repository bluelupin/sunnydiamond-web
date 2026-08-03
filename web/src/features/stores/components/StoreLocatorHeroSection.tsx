"use client";

import Image from "next/image";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import type { NormalizedStoreLocatorHero } from "@/services/store-locator/store-locator-page.types";

type StoreLocatorHeroSectionProps = {
  hero?: NormalizedStoreLocatorHero | null;
};

const StoreLocatorHeroSection = ({ hero }: StoreLocatorHeroSectionProps) => {
  const title = hero?.title?.trim() || null;
  const desktopUrl = hero?.desktopImageUrl || null;
  const mobileUrl = hero?.mobileImageUrl || hero?.desktopImageUrl || null;
  const alt = hero?.imageAlt || title || "Store locator";

  if (!title && !desktopUrl && !mobileUrl) {
    return null;
  }

  return (
    <section
      aria-labelledby={title ? "store-locator-hero-title" : undefined}
      aria-label={title ? undefined : "Store locator"}
      className="relative left-1/2 grid h-[240px] w-screen max-w-none -translate-x-1/2 overflow-hidden md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full overflow-hidden">
        {mobileUrl ? (
          <Image
            src={mobileUrl}
            alt={alt}
            fill
            priority
            quality={PLP_HERO_IMAGE_QUALITY}
            sizes="100vw"
            className="object-cover object-[50%_45%] md:hidden"
          />
        ) : null}
        {desktopUrl ? (
          <Image
            src={desktopUrl}
            alt={alt}
            fill
            priority
            quality={PLP_HERO_IMAGE_QUALITY}
            sizes="100vw"
            className="hidden object-cover object-[50%_38%] md:block"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      </div>
      {title ? (
        <h1
          id="store-locator-hero-title"
          className="absolute left-1/2 top-[calc(50%+42px)] z-10 -translate-x-1/2 whitespace-nowrap text-center font-larken text-32 font-light leading-110 text-white md:static md:col-start-1 md:row-start-1 md:translate-x-0 md:self-start md:justify-self-center md:pt-[203px] md:text-5xl"
        >
          {title}
        </h1>
      ) : null}
    </section>
  );
};

export default StoreLocatorHeroSection;
