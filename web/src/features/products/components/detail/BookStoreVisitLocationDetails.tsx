import Image from "next/image";
import {
  type BookStoreVisitStore,
  bookStoreVisitOverlayDetailTextClassName,
} from "@/features/products/data/bookStoreVisitContent";
import { storeLocatorShowroomDirectionsClassName } from "@/features/stores/data/storeLocatorContent";
import { formatAddressWithPincode } from "@/features/stores/utils/storeLocatorFilters";
import { cn } from "@/shared/utils/cn";
import { DetailTextLink } from "./shared";

const ADDRESS_ICON = "/icons/address-icon.svg";
const PHONE_ICON = "/icons/phone-icon.svg";

type BookStoreVisitLocationDetailsProps = {
  store: BookStoreVisitStore;
  size?: "default" | "page";
  variant?: "default" | "overlay";
  directionsLabel?: string | null;
};

export function BookStoreVisitLocationDetails({
  store,
  size = "default",
  variant = "default",
  directionsLabel,
}: BookStoreVisitLocationDetailsProps) {
  const isOverlay = variant === "overlay";
  const isPage = size === "page";
  const textClassName = isOverlay
    ? bookStoreVisitOverlayDetailTextClassName
    : isPage
      ? "font-gill text-xl font-light leading-110 text-darkblack"
      : "font-gill text-base font-light leading-110 text-darkblack lg:text-xl";
  const directionsText = directionsLabel?.trim() || "GET DIRECTIONS";
  const iconClassName = isOverlay ? "size-6 shrink-0" : "mt-1.5 size-5 shrink-0 sm:mt-0 lg:size-6";
  const phoneTextClassName = isOverlay
    ? "shrink-0 whitespace-nowrap font-gill text-base font-light leading-110 text-darkblack"
    : textClassName;

  return (
    <div className={cn("flex w-full flex-col items-start", isOverlay ? "gap-6" : "gap-4")}>
      <div className={cn("flex w-full flex-col items-start", isOverlay ? "gap-4" : "contents")}>
        {store.address ? (
          <div className="flex w-full items-start gap-3">
            <Image
              src={ADDRESS_ICON}
              alt=""
              width={24}
              height={24}
              aria-hidden
              className={iconClassName}
            />
            <p className={textClassName}>{formatAddressWithPincode(store.address, store.pincode)}</p>
          </div>
        ) : null}
        {store.phone ? (
          <div className="flex items-center gap-3">
            <Image
              src={PHONE_ICON}
              alt=""
              width={24}
              height={24}
              aria-hidden
              className={isOverlay ? "size-6 shrink-0 object-contain" : "size-6 shrink-0"}
            />
            <p className={phoneTextClassName}>{store.phone}</p>
          </div>
        ) : null}
      </div>
      {store.directionsUrl ? (
        <DetailTextLink
          href={store.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={isOverlay ? storeLocatorShowroomDirectionsClassName : undefined}
        >
          {directionsText}
        </DetailTextLink>
      ) : null}
    </div>
  );
}
