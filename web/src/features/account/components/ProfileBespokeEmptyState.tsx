"use client";

import DiamondIcon from "@/assets/Icons/Diamond";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.bespoke;

/** Figma 1480:40004 desktop / 4215:62557 mobile — bespoke inspirations empty state */
export function ProfileBespokeEmptyState() {
  return (
    <ProfileTabEmptyStateLayout>
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <DiamondIcon className="size-10 text-gold500 lg:size-16" aria-hidden />

        <div className="flex w-full flex-col gap-3 lg:gap-4">
          <h3 className="w-full font-larken text-2xl font-light leading-110 text-darkblack lg:text-[32px]">
            {content.emptyTitle}
          </h3>
          <p className="w-full font-gill text-sm font-light leading-110 text-neutral500 lg:text-base">
            {content.emptyDescription}
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 lg:gap-6">
          <CartPrimaryLink
            href={content.emptyPrimaryCtaHref}
            className="hidden w-full max-w-xs shrink-0 sm:w-auto lg:inline-flex"
          >
            {content.emptyPrimaryCta}
          </CartPrimaryLink>

          <CartPrimaryLink
            href={content.emptyMobilePrimaryCtaHref}
            className="w-full max-w-xs shrink-0 sm:w-auto lg:hidden"
          >
            {content.emptyMobilePrimaryCta}
          </CartPrimaryLink>
          <DetailTextLink href={content.emptySecondaryCtaHref} className="text-sm uppercase lg:hidden">
            {content.emptySecondaryCta}
          </DetailTextLink>
        </div>
      </div>
    </ProfileTabEmptyStateLayout>
  );
}
