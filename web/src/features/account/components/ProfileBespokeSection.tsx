"use client";

import Image from "next/image";
import {
  CartMetaRow,
  CartOutlineButton,
  CartPrimaryLink,
} from "@/features/cart/components/CartFlowUi";
import { useCustomerSavedCreations } from "../hooks/useCustomerSavedCreations";
import { formatAppointmentDate } from "../utils/formatAccountData";

function BespokeSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading saved inspirations">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-sm border border-neutral300 bg-gray200/60"
        />
      ))}
    </div>
  );
}

const ProfileBespokeSection = () => {
  const { data, isLoading, error, page, setPage } = useCustomerSavedCreations(true);

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

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-dashed border-neutral300 bg-gray200/60 p-6">
        <div className="space-y-2">
          <p className="font-gill text-base font-normal leading-110 text-darkblack">
            No saved inspirations yet
          </p>
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            Browse bespoke creations and save the ones that speak to you.
          </p>
        </div>
        <CartPrimaryLink href="/bespoke-jewellery" className="w-full max-w-xs">
          Explore Bespoke
        </CartPrimaryLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {data.items.map((item) => {
          const creation = item.creation;
          const title = creation?.title || "Saved creation";
          const image = creation?.coverImage ?? creation?.gallery[0] ?? null;
          const metaParts = [
            item.savedAt ? `Saved ${formatAppointmentDate(item.savedAt)}` : null,
          ].filter(Boolean) as string[];

          return (
            <li
              key={item.documentId}
              className="rounded-sm border border-neutral300 bg-gray200/40 p-5 md:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {image ? (
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-sm bg-neutral300 sm:h-24 sm:w-24">
                    <Image
                      src={image.url}
                      alt={image.alt || title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="space-y-1">
                    <p className="font-gill text-base font-normal leading-110 text-darkblack">
                      {title}
                    </p>
                    {metaParts.length > 0 ? <CartMetaRow parts={metaParts} /> : null}
                  </div>

                  {creation?.description ? (
                    <p className="line-clamp-2 font-gill text-sm font-light leading-110 text-neutral500">
                      {creation.description}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <CartPrimaryLink
                      href="/bespoke-jewellery"
                      className="w-full min-w-[160px] sm:w-auto"
                    >
                      View Bespoke
                    </CartPrimaryLink>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {data.totalPages > 1 ? (
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
