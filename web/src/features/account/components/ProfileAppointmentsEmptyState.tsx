"use client";

import DiamondIcon from "@/assets/Icons/Diamond";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.appointments;

/** Figma 4215:62247 desktop / 4215:62517 mobile — profile appointments empty state */
export function ProfileAppointmentsEmptyState() {
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
