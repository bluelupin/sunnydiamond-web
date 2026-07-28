"use client";

import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profilePromoContent } from "../data/profileContent";

export function ProfilePromoStrip() {
  const { help, returns } = profilePromoContent;

  return (
    <section className="bg-gray200 py-10">
      <div className="mx-auto flex max-w-1440 flex-col items-center justify-center gap-10 px-4 md:px-10 lg:flex-row lg:gap-16 lg:px-10">
        <div className="flex flex-col items-center justify-center gap-6 p-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-larken text-xl font-light leading-110 text-darkblack">
              {help.title}
            </h3>
            <p className="max-w-[284px] font-gill text-base font-light leading-110 text-neutral500">
              {help.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <DetailTextLink href={help.callHref} className="text-sm uppercase">
              {help.phoneLabel}
            </DetailTextLink>
            <DetailTextLink href={help.emailHref} className="text-sm uppercase">
              {help.emailLabel}
            </DetailTextLink>
          </div>
        </div>

        <div className="h-px w-full max-w-xs bg-neutral300 lg:hidden" aria-hidden />

        <div
          className="hidden w-px shrink-0 self-stretch bg-neutral300 lg:block"
          aria-hidden
        />

        <div className="flex w-full max-w-[316px] flex-col items-center justify-center gap-6 p-4 text-center">
          <div className="flex w-full flex-col items-center gap-4">
            <h3 className="font-larken text-xl font-light leading-110 text-darkblack">
              {returns.title}
            </h3>
            <p className="font-gill text-base font-light leading-110 text-neutral500">
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
