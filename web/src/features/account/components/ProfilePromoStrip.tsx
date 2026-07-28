"use client";

import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profilePromoContent } from "../data/profileContent";
import { ProfileCard } from "./profileUi";

export function ProfilePromoStrip() {
  const { help, returns } = profilePromoContent;

  return (
    <div className="mt-10 border border-neutral300 lg:grid lg:grid-cols-2">
      <ProfileCard className="flex flex-col gap-4 border-b border-neutral300 p-4 lg:gap-6 lg:border-b-0 lg:border-r lg:p-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-larken text-xl font-light leading-110 text-darkblack">
            {help.title}
          </h3>
          <p className="font-gill text-base font-light leading-110 text-neutral500">
            {help.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <DetailTextLink href={help.callHref} className="text-sm uppercase">
            {help.callLabel}
          </DetailTextLink>
          <DetailTextLink href={help.emailHref} className="text-sm uppercase">
            {help.emailLabel}
          </DetailTextLink>
        </div>
      </ProfileCard>

      <ProfileCard className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex flex-col gap-4">
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
      </ProfileCard>
    </div>
  );
}
