"use client";

import Link from "next/link";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";

interface OccasionsTeaserSectionProps {
  id?: string;
}

type OccasionCard = {
  id?: string | number;
  slug?: string;
  title?: string;
  description?: string;
  subtitle?: string;
  cta?: { label?: string; url?: string; to?: string };
  image?: {
    desktopImage?: unknown;
    mobileImage?: unknown;
  };
};

const DEFAULT_CTA_LABEL = "View Collection";

function OccasionCardItem({ card }: { card: OccasionCard }) {
  const desktopImageUrl = resolveCmsMediaUrl(card?.image?.desktopImage ?? card?.image);
  const mobileImageUrl = resolveCmsMediaUrl(card?.image?.mobileImage ?? card?.image);
  const href =
    card?.cta?.url ||
    card?.cta?.to ||
    (card?.slug ? `/products?occasion=${card.slug}` : "/products");
  const ctaLabel = card?.cta?.label?.trim() || DEFAULT_CTA_LABEL;
  const description = card?.description?.trim() || card?.subtitle?.trim();
  const hasCta = Boolean(card?.cta?.label?.trim());

  return (
    <Link
      href={href}
      className="group relative block h-[400px] w-[328px] shrink-0 snap-start overflow-hidden md:h-[700px] md:w-auto"
    >
      <ResponsiveImage
        desktopSrc={desktopImageUrl || ""}
        mobileSrc={mobileImageUrl}
        alt={card.title || ""}
        priority
        width={desktopImageUrl ? 718 : 328}
        height={desktopImageUrl ? 700 : 400}
        quality={90}
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[199px] bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.69)] to-black backdrop-blur-[5px] md:h-[342px] md:from-transparent md:via-transparent md:to-black"
      />

      <div className="absolute bottom-8 left-4 flex w-[calc(100%-32px)] max-w-[296px] flex-col gap-4 md:bottom-16 md:left-10 md:w-[418px] md:max-w-none md:gap-6">
        <div className="flex flex-col gap-2 text-white md:gap-3">
          <h3 className="font-larken text-2xl font-light leading-[110%] md:text-[32px]">
            {card.title}
          </h3>
          {description ? (
            <p className="font-gill text-base font-light leading-[110%] md:text-[20px]">
              {description}
            </p>
          ) : null}
        </div>

        <span
          className={`inline-flex w-fit items-center justify-center border-b-[1.5px] border-white pb-1.5 font-gill text-sm font-normal uppercase tracking-[0.28px] text-white ${hasCta ? "" : "md:hidden"}`}
        >
          {ctaLabel}
        </span>
      </div>
    </Link>
  );
}

const OccasionsTeaserSection = ({ id }: OccasionsTeaserSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const occasionSection = editorialData?.occasionSection ?? null;
  const sectionTitle = occasionSection?.sectionTitle?.trim();
  const isActive = occasionSection?.isActive === true;

  const headingRef = useFadeIn(0);

  if (!isActive) {
    return null;
  }

  if (isEditorialLoading) {
    return (
      <section
        id={id}
        className="flex flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 md:px-0 md:pt-[104px]"
        aria-busy="true"
        aria-label="Occasions"
      >
        <div className="h-10 w-80 rounded bg-gray200" aria-hidden />
        <div className="flex w-full gap-3 overflow-hidden md:grid md:max-w-[1440px] md:grid-cols-2 md:gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] w-[328px] shrink-0 bg-gray200 md:h-[700px] md:w-auto"
              aria-hidden
            />
          ))}
        </div>
      </section>
    );
  }

  const occasions: OccasionCard[] = Array.isArray(occasionSection?.occasions)
    ? occasionSection.occasions
    : [];

  return (
    <section
      id={id}
      ref={headingRef as React.RefObject<HTMLElement>}
      aria-label={sectionTitle || "Occasions"}
      className="flex flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 md:px-0 md:pt-[104px]"
    >
      <h2 className="max-w-[332px] text-center font-larken text-[32px] font-light leading-[110%] text-[#0a0a0a] md:max-w-none md:text-[48px] md:whitespace-nowrap">
        {sectionTitle}
      </h2>

      <div
        className="-mx-4 flex w-[calc(100%+32px)] gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:w-full md:max-w-[1440px] md:grid-cols-2 md:gap-1 md:overflow-visible md:px-0 md:pb-0"
        style={{ msOverflowStyle: "none" } as React.CSSProperties}
      >
        {occasions.map((card) => (
          <OccasionCardItem
            key={String(card.id ?? card.slug ?? card.title)}
            card={card}
          />
        ))}
      </div>
    </section>
  );
};

export default OccasionsTeaserSection;
