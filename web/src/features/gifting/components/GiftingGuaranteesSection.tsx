import { Fragment } from "react";
import Reveal from "@/shared/Animation/Reveal";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedGiftingTrustBadge } from "@/services/gifting/gifting-page.types";

type GiftingGuaranteesSectionProps = {
  trustBadges: NormalizedGiftingTrustBadge[];
};

const hasRenderableIcon = (badge: NormalizedGiftingTrustBadge): boolean =>
  Boolean(badge.icon.desktopUrl?.trim() || badge.icon.mobileUrl?.trim());

const GiftingGuaranteesSection = ({ trustBadges }: GiftingGuaranteesSectionProps) => {
  const visibleBadges = trustBadges.filter(hasRenderableIcon);
  if (visibleBadges.length === 0) return null;

  return (
    <section aria-label="Shopping guarantees" className="bg-gray200">
      <ul className="m-0 list-none flex items-center justify-center 2xl:gap-[75px] xl:gap-16 lg:gap-12 md:gap-1 gap-6 p-0 flex md:flex-row flex-col md:py-16 py-10 px-4">
        {visibleBadges.map((badge, index) => (
          <Fragment key={badge.label}>
            {index > 0 && (
              <Reveal as="li" direction="up" aria-hidden className="md:w-auto w-full">
                <div className="md:w-[0.5px] w-full md:h-[136px] h-[0.5px] bg-gray600" />
              </Reveal>
            )}
            <Reveal
              as="li"
              direction="up"
              className={cn(
                "flex lg:w-[260px] md:w-[235px] w-full shrink-0 flex-col items-center justify-center md:gap-3 gap-2 md:p-3 p-4 text-center",
              )}
            >
              <div aria-hidden className="flex lg:size-16 size-10 items-center justify-center">
                <ResponsiveImage
                  desktopSrc={badge.icon.desktopUrl}
                  mobileSrc={badge.icon.mobileUrl}
                  alt={badge.icon.alt}
                  width={64}
                  height={64}
                  className="size-full object-contain"
                />
              </div>
              <p className="max-w-236 font-gill lg:text-xl md:text-lg text-base font-normal leading-110 text-darkblack">
                {badge.label}
              </p>
            </Reveal>
          </Fragment>
        ))}
      </ul>
    </section>
  );
};

export default GiftingGuaranteesSection;
