import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";

const ADDRESS_ICON = "/images/products/delivery-store/address-icon.svg";
const PHONE_ICON = "/images/products/delivery-store/phone-icon.svg";

type BookStoreVisitLocationDetailsProps = {
  store: BookStoreVisitStore;
  size?: "default" | "page";
};

export function BookStoreVisitLocationDetails({
  store,
  size = "default",
}: BookStoreVisitLocationDetailsProps) {
  const isPage = size === "page";
  const textClassName = isPage
    ? "font-gill text-xl font-light leading-110 text-darkblack"
    : "font-gill text-base font-light leading-110 text-darkblack lg:text-xl";
  const rowGapClassName = "gap-3";
  const stackGapClassName = "gap-4";
  const directionsClassName =
    "inline-flex w-fit border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack";

  return (
    <div className="flex flex-col gap-6">
      <div className={cn("flex flex-col", stackGapClassName)}>
        {store.address ? (
          <div className={cn("flex items-start", rowGapClassName)}>
            <Image
              src={ADDRESS_ICON}
              alt=""
              width={24}
              height={24}
              aria-hidden
              className="size-6 shrink-0"
            />
            <p className={textClassName}>
              {store.address}
            </p>
          </div>
        ) : null}
        {store.phone ? (
          <div className={cn("flex items-center", rowGapClassName)}>
            <Image
              src={PHONE_ICON}
              alt=""
              width={24}
              height={24}
              aria-hidden
              className="size-6 shrink-0"
            />
            <p className={textClassName}>
              {store.phone}
            </p>
          </div>
        ) : null}
      </div>
      {store.directionsUrl ? (
        <Link
          href={store.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={directionsClassName}
        >
          GET DIRECTIONS
        </Link>
      ) : null}
    </div>
  );
}
