"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { useBespokeShareVision } from "@/features/bespoke/context/BespokeShareVisionContext";
import { bespokePageFigmaSpec } from "@/features/bespoke/data/content";
import {
  BESPOKE_SECTION_BACKGROUND_SIZES,
  BESPOKE_SECTION_IMAGE_QUALITY,
} from "@/features/bespoke/utils/bespokePageImage";
import type { NormalizedBespokeGetInTouch } from "@/services/bespoke/contact-bespoke-page.types";

type BespokeInterestedSectionProps = {
  interested: NormalizedBespokeGetInTouch;
};

const BespokeInterestedSection = ({ interested }: BespokeInterestedSectionProps) => {
  const { openShareVision, canOpenShareVision } = useBespokeShareVision();
  const hasImage = Boolean(interested.image?.desktopUrl || interested.image?.mobileUrl);
  const ctaLabel = interested.ctaLabel?.trim();
  const showJourneyCta = Boolean(ctaLabel && canOpenShareVision);
  const showLinkCta = Boolean(ctaLabel && interested.ctaHref && !showJourneyCta);

  return (
    <section
      id={interested.id}
      aria-labelledby="bespoke-interested-title"
      className="relative w-full overflow-hidden md:h-[400px] h-[219px]"
    >
      {hasImage && interested.image ? (
        <>
          <ResponsiveImage
            desktopSrc={interested.image.desktopUrl}
            mobileSrc={interested.image.mobileUrl}
            alt={interested.image.alt}
            width={1440}
            height={bespokePageFigmaSpec.interestedHeight}
            sizes={BESPOKE_SECTION_BACKGROUND_SIZES}
            quality={BESPOKE_SECTION_IMAGE_QUALITY}
            className="absolute inset-0 size-full object-cover object-center"
          />
          <div aria-hidden className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-neutral500 via-darkblack to-black"
        />
      )}
      <div className="relative flex md:h-[400px] h-[219px] flex-col items-center justify-center px-4 md:px-10">
        <Reveal direction="up" className="flex w-full max-w-[720px] mx-auto flex-col items-center gap-6 text-center md:gap-10">
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-4">
            <h2
              id="bespoke-interested-title"
              className="font-larken font-light leading-110 text-white lg:text-5xl md:text-4xl text-32"
            >
              {interested.title}
            </h2>
            {interested.description ? (
              <p
                className="font-gill text-sm font-light leading-110 text-white lg:text-xl md:text-lg sm:text-base"
              >
                {interested.description}
              </p>
            ) : null}
          </div>
          {showJourneyCta ? (
            <DetailTextLink onClick={openShareVision} light className="uppercase">
              {ctaLabel}
            </DetailTextLink>
          ) : showLinkCta ? (
            <DetailTextLink href={interested.ctaHref} light className="uppercase">
              {ctaLabel}
            </DetailTextLink>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
};

export default BespokeInterestedSection;
