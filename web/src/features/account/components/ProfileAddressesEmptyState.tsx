"use client";

import DiamondIcon from "@/assets/Icons/Diamond";
import {
  DetailDarkButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import { ProfileTabEmptyStateLayout } from "./profileUi";

const content = profileTabsContent.addresses;

type ProfileAddressesEmptyStateProps = {
  onAddAddress: () => void;
  isSaving?: boolean;
};

/** Figma 4215:62275 desktop / 4215:62529 mobile — saved addresses empty state */
export function ProfileAddressesEmptyState({
  onAddAddress,
  isSaving = false,
}: ProfileAddressesEmptyStateProps) {
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
          <DetailDarkButton
            type="button"
            className="w-full max-w-xs sm:w-auto"
            onClick={onAddAddress}
            disabled={isSaving}
          >
            {content.emptyCta}
          </DetailDarkButton>
          <DetailTextLink href={content.emptySecondaryCtaHref} className="text-sm uppercase">
            {content.emptySecondaryCta}
          </DetailTextLink>
        </div>
      </div>
    </ProfileTabEmptyStateLayout>
  );
}
