import Image from "next/image";
import Link from "next/link";
import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";

const ADDRESS_ICON = "/icons/address-icon.svg";
const PHONE_ICON = "/icons/phone-icon.svg";

type BookStoreVisitLocationDetailsProps = {
  store: BookStoreVisitStore;
  size?: "default" | "page";
  directionsLabel?: string | null;
};

export function BookStoreVisitLocationDetails({
  store,
  size = "default",
  directionsLabel,
}: BookStoreVisitLocationDetailsProps) {
  const isPage = size === "page";
  const textClassName = isPage
    ? "font-gill text-xl font-light leading-110 text-darkblack"
    : "font-gill text-base font-light leading-110 text-darkblack lg:text-xl";
  const directionsText = directionsLabel?.trim();

  return (
    <div className="flex flex-col gap-4">
      {store.address ? (
        <div className="flex items-start gap-3">
          <Image
            src={ADDRESS_ICON}
            alt=""
            width={24}
            height={24}
            aria-hidden
            className="mt-1.5 size-5 shrink-0 sm:mt-0 lg:size-6"
          />
          <p className={textClassName}>{store.address}</p>
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
            className="size-6 shrink-0"
          />
          <p className={textClassName}>{store.phone}</p>
        </div>
      ) : null}
      {directionsText && store.directionsUrl ? (
        <Link
          href={store.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
        >
          {directionsText}
        </Link>
      ) : null}
    </div>
  );
}
