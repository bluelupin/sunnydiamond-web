"use client";

import { useState } from "react";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { formatDistanceKm, type StoreWithDistance } from "../utils/geo";

// Built from existing store-locator styles; awaits OneThing design review (R-X-5).

type NearbyStoresListProps = {
  results: StoreWithDistance<BookStoreVisitStore>[];
  onBook: (storeId: string) => void;
};

const textClassName = "font-gill text-base font-light leading-110 text-darkblack";

function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Indian number → wa.me digits with the 91 prefix; null when it isn't a recognisable one. */
function toWhatsAppHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `https://wa.me/91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `https://wa.me/91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `https://wa.me/${digits}`;
  return null;
}

function CallStoreAction({ store }: { store: BookStoreVisitStore }) {
  const isMobile = useIsMobile();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const phone = store.phone.trim();

  if (!phone) return null;

  if (!isMobile && revealed) {
    const whatsAppHref = toWhatsAppHref(phone);
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className={textClassName}>{phone}</p>
        {whatsAppHref ? (
          <DetailTextLink href={whatsAppHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </DetailTextLink>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <DetailTextLink onClick={() => (isMobile ? setConfirmOpen(true) : setRevealed(true))}>
        Call store
      </DetailTextLink>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          hideCloseButton
          className="max-w-[520px] gap-6 border-neutral300 bg-white p-6 sm:rounded-none"
        >
          <DialogTitle className="font-larken text-2xl font-light leading-110 text-darkblack">
            {`Call Sunny Diamonds ${store.city || store.storeName}?`}
          </DialogTitle>
          <DialogDescription className={textClassName}>{phone}</DialogDescription>
          <div className="flex flex-col gap-4 sm:flex-row">
            <DetailOutlineButton
              type="button"
              className="w-full sm:flex-1"
              onClick={() => setConfirmOpen(false)}
            >
              CANCEL
            </DetailOutlineButton>
            <DetailDarkButton
              type="button"
              className="w-full sm:flex-1"
              onClick={() => {
                setConfirmOpen(false);
                window.location.href = toTelHref(phone);
              }}
            >
              CALL
            </DetailDarkButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Placeholder rows while a PIN is being looked up. */
export const NearbyStoresSkeleton = () => (
  <div className="flex flex-col gap-4" aria-busy="true" aria-label="Finding nearby showrooms">
    {[0, 1].map((row) => (
      <div key={row} className="flex flex-col gap-3">
        <div className="h-6 w-1/2 animate-pulse bg-gray300" />
        <div className="h-4 w-full animate-pulse bg-gray300" />
        <div className="h-4 w-2/3 animate-pulse bg-gray300" />
      </div>
    ))}
  </div>
);

/** Showrooms near a PIN / location, nearest first, with booking and call actions. */
const NearbyStoresList = ({ results, onBook }: NearbyStoresListProps) => (
  <ul className="m-0 flex list-none flex-col p-0" aria-label="Nearby showrooms">
    {results.map(({ store, distanceKm }) => (
      <li
        key={store.id}
        className="flex flex-col gap-3 border-b border-neutral300 py-6 first:pt-0 last:border-b-0"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-larken text-xl font-light leading-110 text-darkblack">
            {store.storeName}
          </p>
          <p className={textClassName}>{formatDistanceKm(distanceKm)}</p>
        </div>
        <p className={textClassName}>{store.address}</p>
        {store.openingHours ? (
          <p className={`${textClassName} whitespace-pre-line`}>{store.openingHours}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <DetailTextLink onClick={() => onBook(store.id)}>Book an appointment</DetailTextLink>
          <CallStoreAction store={store} />
        </div>
      </li>
    ))}
  </ul>
);

export default NearbyStoresList;
