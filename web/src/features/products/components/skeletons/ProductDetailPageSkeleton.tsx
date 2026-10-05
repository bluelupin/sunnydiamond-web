import { cartCheckoutAsideLayout } from "@/features/cart/data/cartFlowSpec";
import { cn } from "@/shared/utils/cn";

const shimmerClass = "animate-pulse bg-gray300";

const ProductDetailPageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading product details">
    <div className="mx-auto w-full max-w-1440 px-5 pb-16 pt-6 md:px-8 lg:px-10 2xl:px-[60px] lg:pb-[60px]">
      <div className={`mb-8 hidden h-4 w-32 md:block ${shimmerClass}`} />

      <div className={cn(cartCheckoutAsideLayout.gridClassName, "md:items-start")}>
        <div className="flex min-w-0 flex-col gap-3">
          <div className={`h-500 w-full md:h-520 lg:h-680 ${shimmerClass}`} />
          <div className="hidden gap-3 md:flex">
            <div className={`h-380 flex-1 lg:h-465 ${shimmerClass}`} />
            <div className={`h-400 w-1/2 lg:h-465 ${shimmerClass}`} />
          </div>
        </div>

        <div
          className={cn(
            cartCheckoutAsideLayout.asideClassName,
            "flex min-w-0 flex-col gap-6 px-4 md:mt-8 md:px-0",
          )}
        >
          <div className="flex flex-col gap-4">
            <div className={`h-4 w-40 ${shimmerClass}`} />
            <div className={`h-8 w-3/4 max-w-md ${shimmerClass}`} />
          </div>
          <div className={`h-14 w-full max-w-xs ${shimmerClass}`} />
          <div className={`h-14 w-full ${shimmerClass}`} />
          <div className={`h-14 w-full ${shimmerClass}`} />
          <div className={`h-24 w-full ${shimmerClass}`} />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailPageSkeleton;
