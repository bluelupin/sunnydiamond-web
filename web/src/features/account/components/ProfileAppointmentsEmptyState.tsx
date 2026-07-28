"use client";

import Image from "next/image";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.appointments;

export function ProfileAppointmentsEmptyState() {
  return (
    <ProfileTabEmptyStateLayout>
      <div className="relative size-16 shrink-0 overflow-clip">
        <Image
          src="/images/profile/wishlist-empty-icon.svg"
          alt=""
          width={64}
          height={64}
          className="size-full"
          aria-hidden
        />
      </div>

      <h3 className="w-full font-larken text-32 font-light leading-110 text-darkblack">
        {content.emptyTitle}
      </h3>

      <div className="flex w-full flex-col gap-2 font-gill text-base font-light leading-110 text-neutral500">
        <p>{content.emptyDescription}</p>
        <p>{content.emptyDescriptionSecondary}</p>
      </div>

      <CartPrimaryLink href={content.emptyCtaHref} className="shrink-0">
        {content.emptyCta}
      </CartPrimaryLink>
    </ProfileTabEmptyStateLayout>
  );
}
