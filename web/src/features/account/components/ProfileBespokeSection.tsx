"use client";

import { useState } from "react";
import {
  CartOutlineButton,
  CartPrimaryLink,
} from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import {
  deleteCustomerSavedCreationClient,
  saveCustomerCreationClient,
} from "@/services/customer/customer-saved-creations.client";
import { useToast } from "@/shared/hooks/use-toast";
import { profileTabsContent } from "../data/profileContent";
import {
  MOCK_PROFILE_BESPOKE,
  PROFILE_PREVIEW_MOCK_WHEN_EMPTY,
} from "../data/profileMockData";
import { useCustomerSavedCreations } from "../hooks/useCustomerSavedCreations";
import type { ProfileBespokeItemUi } from "../types/profileUi.types";
import { mapSavedCreationToBespokeUi } from "../utils/profileDisplayMappers";
import { ProfileBespokeCard } from "./ProfileBespokeCard";
import { useProfileBespokeToast } from "../context/ProfileBespokeToastContext";
import { ProfileEmptyState } from "./profileUi";

const content = profileTabsContent.bespoke;

function BespokeSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading saved inspirations"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="min-w-0 h-[204px] animate-pulse bg-gray300" />
      ))}
    </div>
  );
}

const ProfileBespokeSection = () => {
  const { toast } = useToast();
  const { showBespokeRemovedToast } = useProfileBespokeToast();
  const { data, isLoading, error, page, setPage, refresh } = useCustomerSavedCreations(true);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const items =
    data && data.items.length > 0
      ? data.items
          .map((item) => mapSavedCreationToBespokeUi(item))
          .filter((item): item is NonNullable<typeof item> => item != null)
      : PROFILE_PREVIEW_MOCK_WHEN_EMPTY
        ? MOCK_PROFILE_BESPOKE
        : [];

  const usingMockData =
    PROFILE_PREVIEW_MOCK_WHEN_EMPTY && (!data || data.items.length === 0);

  const displayItems = items.filter((item) => !removedIds.includes(item.id));

  const restoreItem = (id: string) => {
    setRemovedIds((current) => current.filter((itemId) => itemId !== id));
  };

  const handleRemove = (item: ProfileBespokeItemUi) => {
    if (removedIds.includes(item.id)) {
      return;
    }

    setRemovedIds((current) => [...current, item.id]);

    const undo = async () => {
      restoreItem(item.id);

      if (!usingMockData) {
        try {
          await saveCustomerCreationClient(item.creationDocumentId);
          refresh();
        } catch (undoError) {
          setRemovedIds((current) => [...current, item.id]);
          toast({
            title: content.removeErrorTitle,
            description: undoError instanceof Error ? undoError.message : "Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    showBespokeRemovedToast({ onUndo: undo });

    if (!usingMockData) {
      void deleteCustomerSavedCreationClient(item.id).catch((removeError) => {
        restoreItem(item.id);
        toast({
          title: content.removeErrorTitle,
          description: removeError instanceof Error ? removeError.message : "Please try again.",
          variant: "destructive",
        });
      });
    }
  };

  if (isLoading) {
    return <BespokeSkeleton />;
  }

  if (error) {
    return (
      <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (displayItems.length === 0) {
    return (
      <ProfileEmptyState
        title={content.emptyTitle}
        description={
          <>
            <span className="block">{content.emptyDescription}</span>
            <span className="mt-2 block">{content.emptyDescriptionSecondary}</span>
          </>
        }
        action={
          <div className="flex flex-col items-start gap-6">
            <CartPrimaryLink href={content.emptyCtaHref} className="w-full max-w-xs">
              {content.emptyCta}
            </CartPrimaryLink>
            <DetailTextLink href={content.emptyCtaHref} className="text-sm uppercase">
              {content.emptySecondaryCta}
            </DetailTextLink>
          </div>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
        {displayItems.map((item) => (
          <li key={item.id} className="min-w-0">
            <ProfileBespokeCard item={item} onRemove={handleRemove} />
          </li>
        ))}
      </ul>

      {!usingMockData && data && data.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 pt-2">
          <CartOutlineButton
            type="button"
            className="w-auto min-w-[120px]"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </CartOutlineButton>
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            Page {data.currentPage} of {data.totalPages}
          </p>
          <CartOutlineButton
            type="button"
            className="w-auto min-w-[120px]"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </CartOutlineButton>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileBespokeSection;
