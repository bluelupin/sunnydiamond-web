"use client";

import DiamondIcon from "@/assets/Icons/Diamond";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.diamondsForEveryone;

/** Figma 4860:102970 desktop / 4877:103620 mobile — profile DFE empty state */
export function ProfileDiamondsForEveryoneEmptyState() {
  return (
    <ProfileTabEmptyStateLayout>
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <DiamondIcon className="size-10 text-gold500 lg:size-16" aria-hidden />

        <div className="flex w-full flex-col gap-3 lg:gap-4">
          <h3 className="w-full font-larken text-2xl font-light leading-110 text-darkblack lg:text-[32px]">
            {content.emptyTitle}
          </h3>
          <p className="w-full font-gill text-sm font-light leading-110 text-neutral500 lg:text-base">
            {content.emptyDescriptionLine1}
            <br />
            {content.emptyDescriptionLine2}
            <span className="lg:hidden">.</span>
          </p>
        </div>

        <CartPrimaryLink
          href={content.emptyCtaHref}
          className="w-full max-w-xs shrink-0 sm:w-auto"
        >
          {content.emptyCta}
        </CartPrimaryLink>
      </div>
    </ProfileTabEmptyStateLayout>
  );
}
