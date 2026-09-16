"use client";

import Image from "next/image";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.wishlist;

export function ProfileWishlistEmptyState() {
  return (
    <ProfileTabEmptyStateLayout>
      <div className="relative size-16 shrink-0 overflow-clip">
        <Image
          src="https://d1gf9vo4d2b63b.cloudfront.net/cms/wishlist_empty_icon_21cb231976.svg"
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

      <CartPrimaryLink href={content.emptyPrimaryCtaHref} className="shrink-0">
        {content.emptyPrimaryCta}
      </CartPrimaryLink>
    </ProfileTabEmptyStateLayout>
  );
}
