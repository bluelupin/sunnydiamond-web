"use client";

import Link from "next/link";
import type { StaticImageData } from "next/image";
import { useMemo } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { useHomepageOccasions } from "@/hooks/homepage/useHomepageOccasions";
import { buildOccasionCardHref } from "@/features/jewellery-product/utils/occasionListing";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import fallBackImage from "@/assets/fallBackImage.png";
import { giftingPageContent } from "../data/content";

type OccasionCardData = {
  id: string;
  title: string;
  description?: string;
  href: string;
  desktopUrl: string | StaticImageData;
  mobileUrl: string | StaticImageData;
  alt: string;
};

const DEFAULT_CTA_LABEL = "View Collection";

function OccasionCard({ card }: { card: OccasionCardData }) {
  return (
    <Link
      href={card.href}
      className="group relative block h-[400px] w-[328px] shrink-0 snap-start overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2 lg:h-[700px] md:h-[500px] md:w-full md:min-w-0 md:shrink"
    >
      <ResponsiveImage
        desktopSrc={card.desktopUrl}
        mobileSrc={card.mobileUrl}
        alt={card.alt}
        width={718}
        height={700}
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
              {card.title}
            </h3>
            {card.description ? (
              <p className="font-gill text-base font-light leading-[120%] md:text-lg lg:text-xl">
                {card.description}
              </p>
            ) : null}
          </div>
          <span className="text-link-underline inline-flex w-fit items-center justify-center border-b-[1.5px] border-white pb-1.5 font-gill text-sm font-normal uppercase tracking-[0.28px] text-white">
            {DEFAULT_CTA_LABEL}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-10 z-10 hidden max-w-[418px] flex-col-reverse items-start text-white md:flex">
        <div className="inline-flex max-h-0 w-fit flex-col items-start overflow-hidden pb-0 pt-0 opacity-0 motion-safe:transition-[max-height,padding,opacity] motion-safe:duration-500 motion-safe:ease-out group-hover:max-h-[72px] group-hover:pb-16 group-hover:opacity-100 group-focus-visible:max-h-[72px] group-focus-visible:pb-16 group-focus-visible:opacity-100">
          <div className="relative cursor-pointer border-b-[1.5px] border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
            {DEFAULT_CTA_LABEL}
          </div>
        </div>
        <div className="mb-16 flex w-full max-w-[418px] flex-col items-start gap-2 group-hover:mb-6 lg:gap-3">
          <h3 className="whitespace-nowrap font-larken text-32 font-light leading-none md:text-2xl lg:text-32">
            {card.title}
          </h3>
          {card.description ? (
            <p className="font-gill text-base font-light leading-[120%] tracking-[1%] md:text-lg lg:text-xl">
              {card.description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

const GiftingOccasionSection = () => {
  const { data: editorialData } = useHomepageEditorialBlocks();
  const { data: standaloneOccasions } = useHomepageOccasions();
  const { occasions: fallback } = giftingPageContent;

  const occasionSection = editorialData?.occasionSection ?? null;
  const sectionTitle = occasionSection?.sectionTitle?.trim() || fallback.title;
  const sectionDescription = fallback.description;

  const cmsOccasions = useMemo(() => {
    const embedded = (occasionSection?.occasions ?? []).filter((card) => card?.isActive !== false);
    const source = embedded.length > 0 ? embedded : (standaloneOccasions ?? []).filter((card) => card?.isActive !== false);

    return source.map((card, index) => {
      const { desktopUrl, mobileUrl, alt } = resolveResponsiveCmsImage(card.image);
      return {
        id: String(card.id ?? card.slug ?? card.title ?? index),
        title: card.title?.trim() || "Occasion",
        description: card.description?.trim() || card.subtitle?.trim(),
        href: buildOccasionCardHref({
          title: card.title,
          slug: card.slug,
          filterSlug: card.filterSlug,
          ctaUrl: card?.cta?.url || card?.cta?.to,
        }),
        desktopUrl: desktopUrl || fallBackImage,
        mobileUrl: mobileUrl || desktopUrl || fallBackImage,
        alt: alt || card.title || "Occasion gift",
      };
    });
  }, [occasionSection?.occasions, standaloneOccasions]);

  const cards: OccasionCardData[] =
    cmsOccasions.length > 0
      ? cmsOccasions
      : fallback.cards.map((card) => ({
          id: card.id,
          title: card.title,
          description: card.description,
          href: card.href,
          desktopUrl: card.image.desktopUrl,
          mobileUrl: card.image.mobileUrl,
          alt: card.image.alt,
        }));

  return (
    <section
      id="occasion-led-gifts"
      aria-labelledby="gifting-occasions-title"
      className="flex w-full flex-col items-center gap-8 bg-white pt-16 md:gap-10 md:pt-100"
    >
      <div className="flex max-w-[640px] flex-col items-center gap-4 px-4 text-center md:px-0">
        <Reveal
          as="h2"
          id="gifting-occasions-title"
          direction="up"
          className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl lg:whitespace-nowrap"
        >
          {sectionTitle}
        </Reveal>
        <Reveal
          as="p"
          direction="up"
          className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
        >
          {sectionDescription}
        </Reveal>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={sectionTitle}
        className="scrollbar-none relative left-1/2 flex w-screen max-w-none -translate-x-1/2 snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 scroll-pr-4 pb-2 pl-4 md:grid md:grid-cols-2 md:gap-1 md:overflow-visible md:px-0 md:pb-0 md:snap-none"
      >
        {cards.map((card) => (
          <Reveal key={card.id} direction="up" className="contents">
            <OccasionCard card={card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default GiftingOccasionSection;
