"use client";

import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.orders;

export function ProfileOrdersEmptyState() {
  return (
    <ProfileTabEmptyStateLayout>
      <ShoppingBagIcon className="size-16 text-gold500" />

      <h3 className="w-full font-larken text-32 font-light leading-110 text-darkblack">
        {content.emptyTitle}
      </h3>

      <div className="flex w-full flex-col gap-2 font-gill text-base font-light leading-110 text-neutral500">
        <p>{content.emptyDescriptionPrimary}</p>
        <p>{content.emptyDescriptionSecondary}</p>
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
