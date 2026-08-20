"use client";

import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profilePromoContent } from "../data/profileContent";

/** Figma 1480:20015 — profile promo strip mobile spacing and typography */
export function ProfilePromoStrip() {
  const { help, returns } = profilePromoContent;

  return (
    <section className="bg-gray200 px-4 py-16 lg:py-10">
      <div className="mx-auto flex max-w-1440 flex-col items-center justify-center gap-10 md:px-10 lg:flex-row lg:gap-16 lg:px-10">
        <div className="flex w-full max-w-[322px] flex-col items-center gap-6 text-center lg:max-w-[316px] lg:p-4">
          <div className="flex w-full flex-col items-center gap-4">
            <h3 className="font-larken text-xl font-light leading-110 text-darkblack">
              {help.title}
            </h3>
            <p className="w-full font-gill text-sm font-light leading-110 text-darkblack lg:max-w-[284px] lg:text-base lg:text-neutral500">
              {help.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <DetailTextLink href={help.callHref} className="text-sm normal-case">
              {help.phoneLabel}
            </DetailTextLink>
            <DetailTextLink href={help.emailHref} className="text-sm uppercase">
              {help.emailLabel}
            </DetailTextLink>
          </div>
        </div>

        <div className="h-[0.5px] w-full bg-neutral300 lg:hidden" aria-hidden />

        <div
          className="hidden w-px shrink-0 self-stretch bg-neutral300 lg:block"
          aria-hidden
        />

        <div className="flex w-full max-w-[322px] flex-col items-center gap-6 text-center lg:max-w-[316px] lg:p-4">
          <div className="flex w-full flex-col items-center gap-4">
            <h3 className="font-larken text-xl font-light leading-110 text-darkblack">
              {returns.title}
            </h3>
            <p className="w-full font-gill text-sm font-light leading-110 text-darkblack lg:text-base lg:text-neutral500">
              {returns.description}
            </p>
          </div>
          <DetailTextLink href={returns.ctaHref} className="text-sm uppercase">
            {returns.ctaLabel}
          </DetailTextLink>
        </div>
      </div>
    </section>
  );
}
