"use client";

import DiamondIcon from "@/assets/Icons/Diamond";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.orders;

type ProfileOrdersEmptyStateProps = {
  title?: string;
  descriptionPrimary?: string;
  descriptionSecondary?: string;
};

/** Figma 1480:60117 — orders empty / filter empty layout */
export function ProfileOrdersEmptyState({
  title = content.emptyTitle,
  descriptionPrimary = content.emptyDescriptionPrimary,
  descriptionSecondary = content.emptyDescriptionSecondary,
}: ProfileOrdersEmptyStateProps = {}) {
  return (
    <ProfileTabEmptyStateLayout>
      <DiamondIcon className="lg:size-16 size-12 text-gold500" aria-hidden />

      <h3 className="w-full font-larken lg:text-32 md:text-3xl text-2xl font-light leading-110 text-darkblack">
        {title}
      </h3>

      <div className="flex w-full flex-col gap-2 font-gill text-base font-light leading-110 text-neutral500">
        <p>{descriptionPrimary}</p>
        <p>{descriptionSecondary}</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <CartPrimaryLink href={content.emptyPrimaryCtaHref} className="w-full max-w-xs sm:w-auto">
          {content.emptyPrimaryCta}
        </CartPrimaryLink>
        <DetailTextLink href={content.emptySecondaryCtaHref} className="text-sm uppercase">
          {content.emptySecondaryCta}
        </DetailTextLink>
      </div>
    </ProfileTabEmptyStateLayout>
  );
}
