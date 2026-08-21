"use client";

import { DetailTextLink } from "@/features/products/components/detail/shared";
import type { NormalizedProfileTrustBadge } from "@/services/profile/profile-page.types";
import { cn } from "@/shared/utils/cn";

type ProfilePromoStripProps = {
  trustBadges: NormalizedProfileTrustBadge[];
};

function resolveCtaClassName(href: string, index: number): string {
  if (href.startsWith("tel:")) {
    return "text-sm normal-case";
  }

  if (index === 0 && !href.startsWith("/")) {
    return "text-sm normal-case";
  }

  return "text-sm uppercase";
}

/** Figma 1480:20015 — profile promo strip mobile spacing and typography */
export function ProfilePromoStrip({ trustBadges }: ProfilePromoStripProps) {
  if (trustBadges.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray200 px-4 py-16 lg:py-10">
      <div className="mx-auto flex max-w-1440 flex-col items-center justify-center gap-10 md:px-10 lg:flex-row lg:gap-16 lg:px-10">
        {trustBadges.map((badge, index) => (
          <div key={badge.id} className="contents">
            {index > 0 ? (
              <>
                <div className="h-[0.5px] w-full bg-neutral300 lg:hidden" aria-hidden />
                <div
                  className="hidden w-px shrink-0 self-stretch bg-neutral300 lg:block"
                  aria-hidden
                />
              </>
            ) : null}

            <div className="flex w-full max-w-[322px] flex-col items-center gap-6 text-center lg:max-w-[316px] lg:p-4">
              <div className="flex w-full flex-col items-center gap-4">
                <h3 className="font-larken text-xl font-light leading-110 text-darkblack">
                  {badge.title}
                </h3>
                <p className="w-full font-gill text-sm font-light leading-110 text-darkblack lg:max-w-[284px] lg:text-base lg:text-neutral500">
                  {badge.description}
                </p>
              </div>
              {badge.callsToAction.length > 0 ? (
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-center gap-6",
                    badge.callsToAction.length === 1 && "w-full",
                  )}
                >
                  {badge.callsToAction.map((cta, ctaIndex) => (
                    <DetailTextLink
                      key={cta.id}
                      href={cta.href}
                      target={cta.openInNewTab ? "_blank" : undefined}
                      rel={cta.openInNewTab ? "noopener noreferrer" : undefined}
                      className={resolveCtaClassName(cta.href, ctaIndex)}
                    >
                      {cta.label}
                    </DetailTextLink>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
