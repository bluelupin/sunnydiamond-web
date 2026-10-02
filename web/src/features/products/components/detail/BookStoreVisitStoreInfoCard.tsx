import {
  type BookStoreVisitStore,
  bookStoreVisitOverlayCardTitleClassName,
  getBookStoreVisitOverlayTitle,
} from "@/features/products/data/bookStoreVisitContent";
import { cn } from "@/shared/utils/cn";
import { BookStoreVisitLocationDetails } from "./BookStoreVisitLocationDetails";

type BookStoreVisitStoreInfoCardProps = {
  store: BookStoreVisitStore;
  directionsLabel?: string | null;
  className?: string;
};

/** Chalk overlay card — Figma 4903:39794 (hero store info). */
export function BookStoreVisitStoreInfoCard({
  store,
  directionsLabel,
  className,
}: BookStoreVisitStoreInfoCardProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4 bg-gray300 p-6", className)}>
      <p className={bookStoreVisitOverlayCardTitleClassName}>
        {getBookStoreVisitOverlayTitle(store)}
      </p>
      <div className="h-px w-full shrink-0 bg-neutral300" aria-hidden />
      <BookStoreVisitLocationDetails
        store={store}
        variant="overlay"
        directionsLabel={directionsLabel}
      />
    </div>
  );
}
