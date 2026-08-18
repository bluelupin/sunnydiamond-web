"use client";

import Image from "next/image";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.wishlist;

export function ProfileWishlistEmptyState() {
  return (
    <ProfileTabEmptyStateLayout>
      <div className="relative size-16 shrink-0 overflow-clip">
        <Image
          src="/images/profile/wishlist-empty-icon.svg"
          alt=""
          width={64}
          height={64}
          className="lg:size-16 size-12"
          aria-hidden
        />
      </div>

      <h3 className="w-full font-larken lg:text-32 text-2xl font-light leading-110 text-darkblack">
        {content.emptyTitle}
      </h3>

      <div className="flex w-full flex-col gap-2 font-gill text-base font-light leading-110 text-neutral500">
        <p>{content.emptyDescriptionPrimary}</p>
        <p>{content.emptyDescriptionSecondary}</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <CartPrimaryLink href={content.emptyPrimaryCtaHref} className="shrink-0">
          {content.emptyPrimaryCta}
        </CartPrimaryLink>
        <DetailTextLink href={content.emptySecondaryCtaHref} className="text-sm uppercase">
          {content.emptySecondaryCta}
        </DetailTextLink>
      </div>
    </ProfileTabEmptyStateLayout>
  );
}
