"use client";

import Link from "next/link";
import { useMemo } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveBespokeForYouSection } from "@/shared/utils/resolveBespokeForYouSection";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";

interface BespokeForYouSectionProps {
  id?: string;
}

const BespokeForYouSection = ({ id }: BespokeForYouSectionProps) => {
  const { data: editorialData, isLoading } = useHomepageEditorialBlocks();

  const sectionData = useMemo(
    () => resolveBespokeForYouSection(editorialData),
    [editorialData],
  );

  const sectionTitle = sectionData.sectionTitle?.trim() || "";
  const subtitle = sectionData.subtitle?.trim() || "";

  const primaryCtaUrl = sectionData.primaryCta?.url || sectionData.primaryCta?.to || "";
  const primaryCtaLabel = sectionData.primaryCta?.label?.trim() || "";

  const secondaryCtaUrl = sectionData.secondaryCta?.url || sectionData.secondaryCta?.to || "";
  const secondaryCtaLabel = sectionData.secondaryCta?.label?.trim() || "";

  const sectionImages = useMemo(
    () => resolveResponsiveCmsImage(sectionData.image),
    [sectionData.image],
  );

  const desktopImageUrl = sectionImages.desktopUrl;
  const mobileImageUrl = sectionImages.mobileUrl;
  const imageDesktopAlt = sectionImages.desktopAlt;
  const imageMobileAlt = sectionImages.mobileAlt;
  const imageAlt = sectionImages.alt;
  const hasSectionImage = Boolean(desktopImageUrl || mobileImageUrl);

  if (!isSectionActive(sectionData.isActive)) return null;

  if (isLoading) {
    return (
      <section
        id={id}
        className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-gray300 md:h-auto md:min-h-[804px]"
        aria-busy="true"
        aria-label="Bespoke For You"
      >
        <div className="absolute inset-x-0 bottom-16 flex w-full flex-col items-center gap-6 px-4">
          <div className="flex w-full flex-col items-center gap-3">
            <div className="h-9 w-56 rounded bg-white/20" aria-hidden />
            <div className="h-9 w-[257px] max-w-full rounded bg-white/20" aria-hidden />
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="h-14 w-[140px] rounded bg-white/20" aria-hidden />
            <div className="h-5 w-28 rounded bg-white/20" aria-hidden />
          </div>
        </div>
      </section>
    );
  }

  if (!sectionData.fromCms || !sectionTitle) {
    return null;
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle}
      className={cn(
        "relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden md:h-auto md:min-h-[804px]",
        !hasSectionImage && "bg-darkblack",
      )}
    >
      {hasSectionImage ? (
        <Reveal direction="up" className="absolute inset-0">
          <ResponsiveImage
            desktopSrc={desktopImageUrl || mobileImageUrl || ""}
            mobileSrc={mobileImageUrl || desktopImageUrl}
            alt={imageAlt}
            desktopAlt={imageDesktopAlt}
            mobileAlt={imageMobileAlt}
            width={1440}
            height={804}
            priority={false}
            sizes="100vw"
            className="size-full object-cover object-[center_22%] md:object-[center_22%]"
          />
        </Reveal>
      ) : null}

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[409px] bg-gradient-to-b from-transparent to-black md:h-[400px]"
      />

      <div className="absolute inset-x-0 bottom-16 flex w-full justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[375px] flex-col items-center gap-6 md:max-w-[1360px] md:gap-10">
          <div className="flex w-full flex-col items-center gap-3 text-center text-white md:gap-4">
            <Reveal as="h2" direction="up"
              className="shrink-0 whitespace-nowrap font-larken text-32 font-light leading-110 md:text-5xl"
            >
              {sectionTitle}
            </Reveal>
            {subtitle ? (
              <Reveal direction="up"
                className="w-[257px] shrink-0 text-center font-gill text-base font-light leading-110 md:w-auto md:max-w-none md:text-xl"
              >
                {subtitle}
              </Reveal>
            ) : null}
          </div>
          {(primaryCtaUrl && primaryCtaLabel) || (secondaryCtaUrl && secondaryCtaLabel) ? (
            <Reveal direction="up" className="flex shrink-0 flex-col items-center gap-6 md:gap-8">
              {primaryCtaUrl && primaryCtaLabel ? (
                <Link
                  href={primaryCtaUrl}
                  className="btn-border-slide inline-flex h-14 items-center justify-center border border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <span className="relative z-10">{primaryCtaLabel}</span>
                </Link>
              ) : null}
              {secondaryCtaUrl && secondaryCtaLabel ? (
                <DetailTextLink
                  href={secondaryCtaUrl}
                  light
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0"
                >
                  {secondaryCtaLabel}
                </DetailTextLink>
              ) : null}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default BespokeForYouSection;
