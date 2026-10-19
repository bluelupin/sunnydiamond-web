import { Skeleton } from "@/shared/ui/skeleton";

const GiftingGiftCardSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading gift card section"
    className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
  >
    <Skeleton className="h-[350px] w-full rounded-none bg-gray200 lg:h-[520px]" aria-hidden />
  </section>
);

export default GiftingGiftCardSkeleton;
