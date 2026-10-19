import { FeaturedCarouselSkeleton } from "@/features/cms/components/home/FeaturedProductsSection";
import { Skeleton } from "@/shared/ui/skeleton";

const GiftingProductsSkeleton = () => (
  <section aria-busy="true" aria-label="Loading perfect gift products" className="py-16 md:py-104">
    <div className="flex flex-col items-center gap-10">
      <Skeleton className="h-10 w-full max-w-sm rounded-md bg-gray200" aria-hidden />
      <FeaturedCarouselSkeleton />
    </div>
  </section>
);

export default GiftingProductsSkeleton;
